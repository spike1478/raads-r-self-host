import type { Dataset, Responses, Results } from '../data/dataset.schema';
import { exportJSON, exportCSV, exportPDF } from '../utils/export';

interface ExportButtonsProps {
  responses: Responses;
  results: Results;
  dataset: Dataset;
}

export default function ExportButtons({ responses, results, dataset }: ExportButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => exportJSON(responses, results, dataset)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Export JSON
      </button>
      <button
        onClick={() => exportCSV(responses, results, dataset)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Export CSV
      </button>
      <button
        onClick={() => exportPDF(responses, results, dataset)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Export PDF
      </button>
    </div>
  );
}
