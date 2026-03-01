interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in-up">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-text-light dark:text-text-dark">
        RAADS-R Questionnaire
      </h1>

      <p className="text-base sm:text-lg italic text-muted-light dark:text-muted-dark mb-8">
        Ritvo Autism Asperger Diagnostic Scale &mdash; Revised
      </p>

      <div className="max-w-lg space-y-4 text-sm sm:text-base text-muted-light dark:text-muted-dark leading-relaxed mb-10 text-left">
        <p>
          The RAADS-R is a self-report screening questionnaire designed to help identify
          autism spectrum traits in adults. It consists of 80 statements about your
          experiences across four areas: social relatedness, circumscribed interests,
          language, and sensory motor patterns.
        </p>
        <p>
          This questionnaire is not a diagnostic tool. Results should be discussed with
          a qualified healthcare professional who can provide a comprehensive assessment.
        </p>
        <p className="text-xs text-muted-light/70 dark:text-muted-dark/70">
          Your responses are stored locally in your browser and never leave your device.
          You can delete all data at any time.
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-4 text-lg font-bold text-white rounded-lg bg-clinical-blue hover:bg-clinical-blue/90 active:scale-95 transition-all duration-200 shadow-md"
      >
        Begin Questionnaire
      </button>

      <p className="mt-10 text-xs text-muted-light/60 dark:text-muted-dark/60 max-w-lg leading-relaxed">
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
