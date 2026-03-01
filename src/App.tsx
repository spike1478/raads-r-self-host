import dataset from './data/dataset.json';
import type { Dataset } from './data/dataset.schema';
import { useQuizState } from './hooks/useQuizState';
import { useDarkMode } from './hooks/useDarkMode';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Results from './components/Results';
import PrintView from './components/PrintView';
import DarkModeToggle from './components/DarkModeToggle';
import PrivacyBanner from './components/PrivacyBanner';

const typedDataset = dataset as unknown as Dataset;

function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const quiz = useQuizState(typedDataset);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark transition-colors duration-300">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-clinical-blue focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <DarkModeToggle isDark={isDark} onToggle={toggleDark} />

      <main id="main-content">
        {quiz.screen === 'landing' && (
          <Landing onStart={quiz.startQuiz} />
        )}

        {quiz.screen === 'quiz' && quiz.currentItem && (
          <Quiz
            items={typedDataset.items}
            currentQuestion={quiz.currentQuestion}
            responses={quiz.responses}
            totalQuestions={quiz.totalQuestions}
            currentItem={quiz.currentItem}
            onAnswer={quiz.answer}
            onNext={quiz.nextQuestion}
            onPrev={quiz.prevQuestion}
            onFinish={quiz.finishQuiz}
            onHome={() => quiz.goToScreen('landing')}
            allAnswered={quiz.allAnswered}
          />
        )}

        {quiz.screen === 'results' && quiz.results && (
          <Results
            results={quiz.results}
            responses={quiz.responses}
            dataset={typedDataset}
            onRetake={quiz.retake}
            onDelete={quiz.deleteAllData}
            onPrint={() => quiz.goToScreen('print')}
          />
        )}

        {quiz.screen === 'print' && quiz.results && (
          <PrintView
            results={quiz.results}
            responses={quiz.responses}
            dataset={typedDataset}
            onBack={() => quiz.goToScreen('results')}
          />
        )}
      </main>

      {quiz.consentGiven === null && quiz.screen !== 'landing' && (
        <PrivacyBanner
          onAccept={() => quiz.giveConsent(true)}
          onDecline={() => quiz.giveConsent(false)}
        />
      )}
    </div>
  );
}

export default App;
