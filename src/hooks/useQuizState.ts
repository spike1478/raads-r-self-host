import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Response, Responses, Results } from '../data/dataset.schema';
import type { Dataset } from '../data/dataset.schema';
import { computeResults } from '../engine/scoring';

export type QuizScreen = 'landing' | 'quiz' | 'results' | 'print';

interface QuizState {
  screen: QuizScreen;
  currentQuestion: number;
  responses: Responses;
  consentGiven: boolean | null;
}

const STORAGE_KEY = 'vibe-check-state';

function loadState(): Partial<QuizState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state: QuizState) {
  if (!state.consentGiven) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useQuizState(dataset: Dataset) {
  const saved = useMemo(() => loadState(), []);
  const canPersist = saved?.consentGiven === true;

  const [screen, setScreen] = useState<QuizScreen>(
    canPersist && saved?.screen ? saved.screen : 'landing',
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    canPersist && saved?.currentQuestion ? saved.currentQuestion : 0,
  );
  const [responses, setResponses] = useState<Responses>(
    canPersist && saved?.responses ? saved.responses : {},
  );
  const [consentGiven, setConsentGiven] = useState<boolean | null>(
    saved?.consentGiven ?? null,
  );

  // Refs to avoid stale closures in callbacks
  const screenRef = useRef(screen);
  const questionRef = useRef(currentQuestion);
  const responsesRef = useRef(responses);
  const consentRef = useRef(consentGiven);

  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { questionRef.current = currentQuestion; }, [currentQuestion]);
  useEffect(() => { responsesRef.current = responses; }, [responses]);
  useEffect(() => { consentRef.current = consentGiven; }, [consentGiven]);

  const totalQuestions = dataset.items.length;

  const persistCurrent = useCallback(() => {
    saveState({
      screen: screenRef.current,
      currentQuestion: questionRef.current,
      responses: responsesRef.current,
      consentGiven: consentRef.current,
    });
  }, []);

  const answer = useCallback(
    (itemId: number, value: Response) => {
      setResponses((prev) => {
        const next = { ...prev, [itemId]: value };
        responsesRef.current = next;
        saveState({
          screen: screenRef.current,
          currentQuestion: questionRef.current,
          responses: next,
          consentGiven: consentRef.current,
        });
        return next;
      });
    },
    [],
  );

  const nextQuestion = useCallback(() => {
    setCurrentQuestion((prev) => {
      if (prev >= totalQuestions - 1) return prev;
      const next = prev + 1;
      questionRef.current = next;
      persistCurrent();
      return next;
    });
  }, [totalQuestions, persistCurrent]);

  const prevQuestion = useCallback(() => {
    setCurrentQuestion((prev) => {
      if (prev <= 0) return prev;
      const next = prev - 1;
      questionRef.current = next;
      persistCurrent();
      return next;
    });
  }, [persistCurrent]);

  const goToQuestion = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalQuestions - 1));
      setCurrentQuestion(clamped);
      questionRef.current = clamped;
      persistCurrent();
    },
    [totalQuestions, persistCurrent],
  );

  const goToScreen = useCallback(
    (s: QuizScreen) => {
      setScreen(s);
      screenRef.current = s;
      persistCurrent();
    },
    [persistCurrent],
  );

  const startQuiz = useCallback(() => goToScreen('quiz'), [goToScreen]);

  const finishQuiz = useCallback(() => goToScreen('results'), [goToScreen]);

  const retake = useCallback(() => {
    setResponses({});
    setCurrentQuestion(0);
    setScreen('landing');
    responsesRef.current = {};
    questionRef.current = 0;
    screenRef.current = 'landing';
    if (consentRef.current) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
  }, []);

  const deleteAllData = useCallback(() => {
    setResponses({});
    setCurrentQuestion(0);
    setScreen('landing');
    setConsentGiven(null);
    responsesRef.current = {};
    questionRef.current = 0;
    screenRef.current = 'landing';
    consentRef.current = null;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const giveConsent = useCallback(
    (consent: boolean) => {
      setConsentGiven(consent);
      consentRef.current = consent;
      if (consent) {
        saveState({
          screen: screenRef.current,
          currentQuestion: questionRef.current,
          responses: responsesRef.current,
          consentGiven: consent,
        });
      }
    },
    [],
  );

  const results: Results | null = useMemo(() => {
    const answered = Object.keys(responses).length;
    if (answered < totalQuestions) return null;
    return computeResults(responses, dataset);
  }, [responses, totalQuestions, dataset]);

  const answeredCount = Object.keys(responses).length;
  const allAnswered = answeredCount >= totalQuestions;
  const currentItem = dataset.items[currentQuestion] || null;

  const currentDomain = currentItem
    ? dataset.meta.domains.find((d) => d.key === currentItem.domain)
    : null;

  return {
    screen,
    currentQuestion,
    currentItem,
    currentDomain,
    responses,
    results,
    totalQuestions,
    answeredCount,
    allAnswered,
    consentGiven,
    answer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    startQuiz,
    finishQuiz,
    retake,
    deleteAllData,
    giveConsent,
    goToScreen,
  };
}
