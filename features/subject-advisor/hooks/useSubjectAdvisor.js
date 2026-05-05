// features/subject-advisor/hooks/useSubjectAdvisor.js
// Client-side hook that orchestrates the subject advisor flow:
// class selection → question loading → quiz → AI evaluation → results.

import { useState, useCallback } from "react";
import { fetchQuestions, submitEvaluation } from "../services/subjectAdvisorApi";

const STAGES = {
  CLASS_SELECTION: "class_selection",
  LOADING_QUESTIONS: "loading_questions",
  AI_TEST: "ai_test",
  RESULTS: "results",
};

/**
 * Encapsulates all state and side-effects for the subject advisor flow.
 * @returns {{ stage, classLevel, questions, result, loadError, isSubmitting, error, handleClassSelect, handleTestComplete, handleReset, STAGES }}
 */
export function useSubjectAdvisor() {
  const [stage, setStage] = useState(STAGES.CLASS_SELECTION);
  const [classLevel, setClassLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const handleClassSelect = useCallback(async (selectedClass) => {
    setClassLevel(selectedClass);
    setStage(STAGES.LOADING_QUESTIONS);
    setLoadError(null);

    try {
      const data = await fetchQuestions(selectedClass);
      setQuestions(data.questions);
      setStage(STAGES.AI_TEST);
    } catch (err) {
      console.error("Question fetch error:", err);
      setLoadError(err.message || "Failed to load questions");
      setStage(STAGES.CLASS_SELECTION);
    }
  }, []);

  const handleTestComplete = useCallback((aiResult) => {
    setResult(aiResult);
    setStage(STAGES.RESULTS);
  }, []);

  const handleReset = useCallback(() => {
    setStage(STAGES.CLASS_SELECTION);
    setClassLevel(null);
    setQuestions([]);
    setResult(null);
    setLoadError(null);
  }, []);

  return {
    stage,
    classLevel,
    questions,
    result,
    loadError,
    handleClassSelect,
    handleTestComplete,
    handleReset,
    STAGES,
  };
}
