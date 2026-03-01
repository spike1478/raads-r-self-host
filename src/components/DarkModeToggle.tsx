interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-card-light dark:bg-card-dark shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 text-2xl"
    >
      {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
    </button>
  );
}
