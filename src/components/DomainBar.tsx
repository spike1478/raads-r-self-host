interface DomainBarProps {
  label: string;
  score: number;
  maxScore: number;
  cutoff: number;
  aboveCutoff: boolean;
  domainKey: string;
}

const domainColours: Record<string, { bar: string; bg: string; text: string }> = {
  social: {
    bar: 'bg-vibe-purple',
    bg: 'bg-vibe-purple/20',
    text: 'text-vibe-purple',
  },
  interests: {
    bar: 'bg-vibe-pink',
    bg: 'bg-vibe-pink/20',
    text: 'text-vibe-pink',
  },
  language: {
    bar: 'bg-vibe-cyan',
    bg: 'bg-vibe-cyan/20',
    text: 'text-vibe-cyan',
  },
  sensory: {
    bar: 'bg-vibe-green',
    bg: 'bg-vibe-green/20',
    text: 'text-vibe-green',
  },
};

export default function DomainBar({
  label,
  score,
  maxScore,
  cutoff,
  aboveCutoff,
  domainKey,
}: DomainBarProps) {
  const colours = domainColours[domainKey] ?? domainColours.social;
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const thresholdPercent = maxScore > 0 ? (cutoff / maxScore) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold text-sm ${colours.text}`}>{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-light dark:text-text-dark">
            {score}/{maxScore}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              aboveCutoff
                ? 'bg-vibe-orange/20 text-vibe-orange'
                : 'bg-gray-200 dark:bg-gray-700 text-muted-light dark:text-muted-dark'
            }`}
          >
            {aboveCutoff ? 'Above clinical threshold' : 'Below clinical threshold'}
          </span>
        </div>
      </div>

      <div className={`relative h-4 rounded-full ${colours.bg} overflow-hidden`}>
        {/* Filled bar */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${colours.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />

        {/* Threshold marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-text-light dark:bg-text-dark opacity-60"
          style={{ left: `${thresholdPercent}%` }}
          title={`Threshold: ${cutoff}`}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-light dark:text-muted-dark">0</span>
        <span className="text-xs text-muted-light dark:text-muted-dark">{maxScore}</span>
      </div>
    </div>
  );
}
