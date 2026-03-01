import { useState } from 'react';

export default function HowScoringWorks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full rounded-xl bg-card-light dark:bg-card-dark shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-text-light dark:text-text-dark">
          How Scoring Works
        </span>
        <svg
          className={`w-5 h-5 text-muted-light dark:text-muted-dark transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3 text-sm text-muted-light dark:text-muted-dark leading-relaxed animate-fade-in-up">
          <p>
            Each of the 80 items has four response options reflecting when a statement
            has been true for you.
          </p>
          <p>
            Items are scored on a 0-3 scale. For most items (symptom items), responses
            indicating the trait has always been present score highest (3). For normative
            items (those describing typical social behaviours), the scoring is reversed.
          </p>
          <p>
            Scores are grouped into four subscales: Social Relatedness (39 items, max 117,
            threshold &gt;30), Circumscribed Interests (14 items, max 42, threshold &gt;14),
            Language (7 items, max 21, threshold &gt;3), and Sensory Motor (20 items,
            max 60, threshold &gt;15).
          </p>
          <p>
            The total score ranges from 0 to 240, with a clinical significance threshold of 65.
          </p>
        </div>
      )}
    </div>
  );
}
