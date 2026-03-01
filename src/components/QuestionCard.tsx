import type { Response } from '../data/dataset.schema';

interface QuestionCardProps {
  item: { id: number; text: string };
  questionNumber: number;
  totalQuestions: number;
  selectedResponse: Response | undefined;
  onAnswer: (itemId: number, value: Response) => void;
}

const responseOptions: { label: string; value: Response }[] = [
  { label: 'True now and when I was young', value: 0 },
  { label: 'True only now', value: 1 },
  { label: 'True only when I was younger than 16', value: 2 },
  { label: 'Never true', value: 3 },
];

export default function QuestionCard({
  item,
  questionNumber,
  totalQuestions,
  selectedResponse,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto animate-slide-in-right">
      <fieldset>
        <legend className="mb-8">
          <span className="block text-sm font-semibold text-muted-light dark:text-muted-dark mb-2">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="block text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark leading-snug">
            {item.text}
          </span>
        </legend>

        <div className="flex flex-col gap-3">
          {responseOptions.map((option) => {
            const isSelected = selectedResponse === option.value;
            return (
              <label
                key={option.value}
                className={`relative flex items-center w-full px-5 py-4 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-clinical-blue/10 dark:bg-clinical-blue/20 ring-2 ring-clinical-blue shadow-md'
                    : 'bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${item.id}`}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onAnswer(item.id, option.value)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                    isSelected
                      ? 'border-clinical-blue bg-clinical-blue'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                <span
                  className={`text-base font-medium ${
                    isSelected
                      ? 'text-clinical-blue dark:text-clinical-blue'
                      : 'text-text-light dark:text-text-dark'
                  }`}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

      </fieldset>
    </div>
  );
}
