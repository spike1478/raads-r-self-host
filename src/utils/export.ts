import type { Dataset, Responses, Results } from '../data/dataset.schema';
import { scoreItem } from '../engine/scoring';

interface ExportData {
  quiz: string;
  completedAt: string;
  results: Results;
  responses: Array<{
    id: number;
    text: string;
    domain: string;
    response: string;
    responseIndex: number;
    score: number;
  }>;
}

function buildExportData(
  responses: Responses,
  results: Results,
  dataset: Dataset,
): ExportData {
  const responseLabels = dataset.meta.responseOptions;

  const responseRows = dataset.items.map((item) => {
    const responseIndex = responses[item.id] ?? 0;
    const score = scoreItem(responseIndex, item.isNormative);
    return {
      id: item.id,
      text: item.text,
      domain: dataset.meta.domains.find((d) => d.key === item.domain)?.label ?? item.domain,
      response: responseLabels[responseIndex],
      responseIndex,
      score,
    };
  });

  return {
    quiz: 'RAADS-R',
    completedAt: new Date().toISOString(),
    results,
    responses: responseRows,
  };
}

export function exportJSON(responses: Responses, results: Results, dataset: Dataset) {
  const data = buildExportData(responses, results, dataset);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'raads-r-results.json');
}

export function exportCSV(responses: Responses, results: Results, dataset: Dataset) {
  const data = buildExportData(responses, results, dataset);

  const headers = ['Item', 'Text', 'Domain', 'Response', 'Response Index', 'Score'];
  const rows = data.responses.map((r) => [
    r.id,
    `"${r.text.replace(/"/g, '""')}"`,
    r.domain,
    r.response,
    r.responseIndex,
    r.score,
  ]);

  // Summary rows
  rows.push([]);
  rows.push(['Summary']);
  rows.push(['Total', data.results.total, '', 'Max', data.results.totalMax, `Threshold: ${data.results.totalCutoff}`]);
  for (const domain of data.results.domains) {
    rows.push([domain.label, domain.score, '', 'Max', domain.maxScore, `Threshold: ${domain.cutoff}`]);
  }

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'raads-r-results.csv');
}

export function exportPDF(responses: Responses, results: Results, dataset: Dataset) {
  const data = buildExportData(responses, results, dataset);
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalStatus = results.aboveTotalCutoff ? 'Above threshold' : 'Below threshold';

  const subscaleRows = results.domains
    .map(
      (d) =>
        `<tr>
          <td>${d.label}</td>
          <td>${d.score}</td>
          <td>${d.maxScore}</td>
          <td>${d.cutoff}</td>
          <td>${d.aboveCutoff ? 'Above' : 'Below'}</td>
        </tr>`,
    )
    .join('');

  const responseRows = data.responses
    .map(
      (r) =>
        `<tr>
          <td>${r.id}</td>
          <td>${r.text}</td>
          <td>${r.domain}</td>
          <td>${r.response}</td>
          <td>${r.score}</td>
        </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RAADS-R Results</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #1a1a1a; padding: 20mm; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .date { color: #666; margin-bottom: 24px; font-size: 12px; }
    h2 { font-size: 15px; margin: 20px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    .summary-table { max-width: 500px; }
    .summary-table td:first-child { font-weight: 600; width: 140px; }
    .responses-table td:nth-child(1) { width: 40px; text-align: center; }
    .responses-table td:nth-child(5) { width: 50px; text-align: center; }
    .footer { margin-top: 24px; font-size: 10px; color: #888; font-style: italic; border-top: 1px solid #ccc; padding-top: 8px; }
    @media print {
      body { padding: 0; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>RAADS-R Results</h1>
  <div class="date">${date}</div>

  <h2>Summary</h2>
  <table class="summary-table">
    <tr><td>Total Score</td><td>${results.total} / ${results.totalMax}</td></tr>
    <tr><td>Threshold</td><td>${results.totalCutoff}</td></tr>
    <tr><td>Status</td><td>${totalStatus}</td></tr>
  </table>

  <h2>Subscale Scores</h2>
  <table>
    <thead>
      <tr><th>Subscale</th><th>Score</th><th>Max</th><th>Threshold</th><th>Status</th></tr>
    </thead>
    <tbody>${subscaleRows}</tbody>
  </table>

  <h2>All Responses</h2>
  <table class="responses-table">
    <thead>
      <tr><th>#</th><th>Question</th><th>Subscale</th><th>Response</th><th>Points</th></tr>
    </thead>
    <tbody>${responseRows}</tbody>
  </table>

  <div class="footer">This is a self-report screening tool, not a diagnostic instrument.</div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.addEventListener('load', () => {
    printWindow.print();
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
