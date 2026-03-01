import type { Dataset, Responses, Results } from '../data/dataset.schema';
import { scoreItem } from '../engine/scoring';

interface PrintViewProps {
  results: Results;
  responses: Responses;
  dataset: Dataset;
  onBack: () => void;
}

export default function PrintView({ results, responses, dataset, onBack }: PrintViewProps) {
  const responseLabels = dataset.meta.responseOptions;

  const responseRows = dataset.items.map((item) => {
    const responseIndex = responses[item.id] ?? 0;
    const score = scoreItem(responseIndex, item.isNormative);
    const domainLabel =
      dataset.meta.domains.find((d) => d.key === item.domain)?.label ?? item.domain;
    return {
      id: item.id,
      text: item.text,
      domain: domainLabel,
      response: responseLabels[responseIndex],
      score,
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 bg-white text-black print:p-4">
      {/* Print/Back buttons (hidden when printing) */}
      <div className="flex gap-3 mb-8 no-print">
        <button
          onClick={() => window.print()}
          className="px-5 py-2 text-sm font-medium rounded-lg bg-clinical-blue text-white hover:bg-clinical-blue/90 transition-colors"
        >
          Print
        </button>
        <button
          onClick={onBack}
          className="px-5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-6">RAADS-R &mdash; Results</h1>

      {/* Summary table */}
      <h2 className="text-xl font-bold mb-3">Summary</h2>
      <table className="w-full mb-8 border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2 pr-4">Subscale</th>
            <th className="text-right py-2 px-2">Result</th>
            <th className="text-right py-2 px-2">Max</th>
            <th className="text-right py-2 px-2">Threshold</th>
            <th className="text-right py-2 pl-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 font-semibold">
            <td className="py-2 pr-4">Overall</td>
            <td className="text-right py-2 px-2">{results.total}</td>
            <td className="text-right py-2 px-2">{results.totalMax}</td>
            <td className="text-right py-2 px-2">{results.totalCutoff}</td>
            <td className="text-right py-2 pl-2">
              {results.aboveTotalCutoff ? 'Above threshold' : 'Below threshold'}
            </td>
          </tr>
          {results.domains.map((domain) => (
            <tr key={domain.key} className="border-b border-gray-200">
              <td className="py-2 pr-4">{domain.label}</td>
              <td className="text-right py-2 px-2">{domain.score}</td>
              <td className="text-right py-2 px-2">{domain.maxScore}</td>
              <td className="text-right py-2 px-2">{domain.cutoff}</td>
              <td className="text-right py-2 pl-2">
                {domain.aboveCutoff ? 'Above threshold' : 'Below threshold'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Full response table */}
      <h2 className="text-xl font-bold mb-3">Full Responses</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2 pr-2 w-12">#</th>
            <th className="text-left py-2 pr-4">Question</th>
            <th className="text-left py-2 px-2">Subscale</th>
            <th className="text-left py-2 px-2">Response</th>
            <th className="text-right py-2 pl-2 w-16">Points</th>
          </tr>
        </thead>
        <tbody>
          {responseRows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="py-1.5 pr-2 text-gray-500">{row.id}</td>
              <td className="py-1.5 pr-4">{row.text}</td>
              <td className="py-1.5 px-2 text-gray-600">{row.domain}</td>
              <td className="py-1.5 px-2">{row.response}</td>
              <td className="py-1.5 pl-2 text-right">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
