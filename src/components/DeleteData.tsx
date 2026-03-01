import { useState } from 'react';

interface DeleteDataProps {
  onDelete: () => void;
}

export default function DeleteData({ onDelete }: DeleteDataProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 animate-scale-in">
        <span className="text-sm text-red-500 font-medium">
          Are you sure? This will remove all saved data.
        </span>
        <button
          onClick={() => {
            onDelete();
            setConfirming(false);
          }}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      Delete My Data
    </button>
  );
}
