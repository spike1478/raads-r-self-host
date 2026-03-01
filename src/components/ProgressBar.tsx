interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={`${current} of ${total} questions answered`}>
      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-clinical-blue transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
