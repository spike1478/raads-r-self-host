import type { Dataset, Responses, Results as ResultsType } from '../data/dataset.schema';
import DomainBar from './DomainBar';
import HowScoringWorks from './HowScoringWorks';
import ExportButtons from './ExportButtons';
import DeleteData from './DeleteData';

interface ResultsProps {
  results: ResultsType;
  responses: Responses;
  dataset: Dataset;
  onRetake: () => void;
  onDelete: () => void;
  onPrint: () => void;
}

export default function Results({
  results,
  responses,
  dataset,
  onRetake,
  onDelete,
  onPrint,
}: ResultsProps) {
  const totalPercentage =
    results.totalMax > 0 ? (results.total / results.totalMax) * 100 : 0;
  const thresholdPercent =
    results.totalMax > 0 ? (results.totalCutoff / results.totalMax) * 100 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-text-light dark:text-text-dark">
          RAADS-R Results
        </h1>
        <p className="text-sm italic text-muted-light dark:text-muted-dark">
          Ritvo Autism Asperger Diagnostic Scale &mdash; Revised
        </p>
      </div>

      {/* Total score */}
      <div
        className="w-full rounded-2xl bg-card-light dark:bg-card-dark shadow-md p-6 animate-fade-in-up"
        style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}
      >
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-muted-light dark:text-muted-dark mb-1">
              Total Score
            </p>
            <p className="text-5xl font-extrabold text-text-light dark:text-text-dark">
              {results.total}
              <span className="text-xl font-normal text-muted-light dark:text-muted-dark">
                /{results.totalMax}
              </span>
            </p>
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
              results.aboveTotalCutoff
                ? 'bg-vibe-orange/20 text-vibe-orange'
                : 'bg-gray-200 dark:bg-gray-700 text-muted-light dark:text-muted-dark'
            }`}
          >
            {results.aboveTotalCutoff ? 'Above threshold' : 'Below threshold'}
          </span>
        </div>

        <div className="relative h-5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full progress-gradient transition-all duration-1000 ease-out"
            style={{ width: `${totalPercentage}%` }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-text-light dark:bg-text-dark opacity-60"
            style={{ left: `${thresholdPercent}%` }}
            title={`Threshold: ${results.totalCutoff}`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-light dark:text-muted-dark">0</span>
          <span className="text-xs text-muted-light dark:text-muted-dark">
            {results.totalMax}
          </span>
        </div>
      </div>

      {/* Interpretation */}
      <div
        className="w-full rounded-2xl bg-card-light dark:bg-card-dark shadow-md p-6 animate-fade-in-up"
        style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
      >
        <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">
          Interpretation
        </h2>
        <div className="space-y-2 text-sm text-muted-light dark:text-muted-dark leading-relaxed">
          <p>
            The RAADS-R measures traits associated with autism spectrum across four subscales.
          </p>
          <p>
            A total score of 65 or above suggests the presence of clinically significant
            autistic traits. However, this result alone is not sufficient for a diagnosis.
          </p>
          <p>
            Individual subscale scores above their respective thresholds indicate more
            prominent patterns in that area.
          </p>
          <p>
            If your results are of concern, please consult a qualified healthcare
            professional for a comprehensive assessment.
          </p>
        </div>
      </div>

      {/* Domain bars */}
      <div
        className="w-full rounded-2xl bg-card-light dark:bg-card-dark shadow-md p-6 space-y-6 animate-fade-in-up"
        style={{ animationDelay: '450ms', animationFillMode: 'backwards' }}
      >
        <h2 className="text-lg font-bold text-text-light dark:text-text-dark">
          Subscale Scores
        </h2>
        {results.domains.map((domain) => (
          <DomainBar
            key={domain.key}
            label={domain.label}
            score={domain.score}
            maxScore={domain.maxScore}
            cutoff={domain.cutoff}
            aboveCutoff={domain.aboveCutoff}
            domainKey={domain.key}
          />
        ))}
      </div>

      {/* How scoring works */}
      <div
        className="w-full animate-fade-in-up"
        style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
      >
        <HowScoringWorks />
      </div>

      {/* Action buttons */}
      <div
        className="w-full flex flex-wrap items-center justify-center gap-3 animate-fade-in-up"
        style={{ animationDelay: '750ms', animationFillMode: 'backwards' }}
      >
        <ExportButtons responses={responses} results={results} dataset={dataset} />

        <button
          onClick={onPrint}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Print View
        </button>

        <DeleteData onDelete={onDelete} />

        <button
          onClick={onRetake}
          className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-clinical-blue hover:bg-clinical-blue/90 active:scale-95 transition-all duration-200"
        >
          Retake
        </button>
      </div>

      {/* Citation */}
      <p className="text-xs text-muted-light/60 dark:text-muted-dark/60 max-w-lg text-center leading-relaxed">
        Based on Ritvo, R.A., Ritvo, E.R., Guthrie, D. et al. (2011).
        The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R).{' '}
        <em>Journal of Autism and Developmental Disorders</em>, 41(8), 1076–1085.
        Published under{' '}
        <a
          href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3134766/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-muted-light dark:hover:text-muted-dark"
        >
          CC BY-NC
        </a>.
      </p>
    </div>
  );
}
