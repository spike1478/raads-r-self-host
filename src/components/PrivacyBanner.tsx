interface PrivacyBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function PrivacyBanner({ onAccept, onDecline }: PrivacyBannerProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-t border-muted-light/20 dark:border-muted-dark/20 animate-fade-in-up">
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">
          This questionnaire stores your responses locally in your browser so you can
          resume if interrupted. No data is transmitted externally. Cloudflare Pages
          provides basic page view analytics only (no personal data).
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-clinical-blue hover:bg-clinical-blue/90 active:scale-95 transition-all duration-200"
          >
            Save Progress
          </button>
          <button
            onClick={onDecline}
            className="px-4 py-2 text-sm font-semibold text-muted-light dark:text-muted-dark rounded-lg border border-muted-light/30 dark:border-muted-dark/30 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
