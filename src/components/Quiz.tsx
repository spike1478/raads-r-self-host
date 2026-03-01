import { useEffect } from 'react';
import type { Item, Response, Responses } from '../data/dataset.schema';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

interface QuizProps {
  items: Item[];
  currentQuestion: number;
  responses: Responses;
  totalQuestions: number;
  currentItem: Item;
  onAnswer: (itemId: number, value: Response) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onHome: () => void;
  allAnswered: boolean;
}

export default function Quiz({
  currentQuestion,
  responses,
  totalQuestions,
  currentItem,
  onAnswer,
  onNext,
  onPrev,
  onFinish,
  onHome,
  allAnswered,
}: QuizProps) {
  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && currentQuestion === 0) {
        onHome();
      } else if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        onPrev();
      } else if (e.key === 'ArrowRight' && responses[currentItem.id] !== undefined && currentQuestion < totalQuestions - 1) {
        onNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentItem.id, responses, totalQuestions, onNext, onPrev, onHome]);

  const answeredCount = Object.keys(responses).length;
  const hasAnswered = responses[currentItem.id] !== undefined;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="mb-8">
        <ProgressBar current={answeredCount} total={totalQuestions} />
      </div>

      <QuestionCard
        item={currentItem}
        questionNumber={currentQuestion + 1}
        totalQuestions={totalQuestions}
        selectedResponse={responses[currentItem.id]}
        onAnswer={onAnswer}
      />

      <div className="flex items-center justify-between mt-10 max-w-lg mx-auto">
        <button
          onClick={currentQuestion === 0 ? onHome : onPrev}
          className="px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
        >
          Back
        </button>

        {allAnswered && isLastQuestion ? (
          <button
            onClick={onFinish}
            className="px-8 py-3 text-base font-bold text-white rounded-lg bg-clinical-blue hover:bg-clinical-blue/90 active:scale-95 transition-all duration-200 shadow-md"
          >
            View Results
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!hasAnswered || isLastQuestion}
            className="px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 disabled:opacity-30 text-white bg-clinical-blue hover:bg-clinical-blue/90 active:scale-95 disabled:bg-clinical-blue/40"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
