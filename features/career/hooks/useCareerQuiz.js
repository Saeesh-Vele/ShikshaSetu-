import { useState } from "react";
import { submitCareerAssessment } from "../services/careerApi";
import { predefinedQuestions } from "../data/careerQuestions";

export const activeQuestions = predefinedQuestions.map((q) => ({
  id: `q_${q.id}`,
  question: q.question,
  trait: "general",
  type: q.type,
  options: q.options.map((opt, idx) => ({
    value: `opt_${q.id}_${idx}`,
    label: opt,
  })),
}));

export function useCareerQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const currentQuestion = activeQuestions[currentStep];
  const isMultiSelect = currentQuestion?.type === "multi";

  const handleOptionSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiToggle = (questionId, optionValue) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(optionValue)) {
        return { ...prev, [questionId]: current.filter((v) => v !== optionValue) };
      } else {
        return { ...prev, [questionId]: [...current, optionValue] };
      }
    });
  };

  const submitToAI = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formattedAnswers = activeQuestions.map((q) => {
        const selectedValues = answers[q.id];
        let selectedTexts = [];
        
        if (Array.isArray(selectedValues)) {
          selectedTexts = selectedValues.map(
            (val) => q.options.find((opt) => opt.value === val)?.label || val
          );
        } else if (selectedValues) {
          const label = q.options.find((opt) => opt.value === selectedValues)?.label;
          selectedTexts = label ? [label] : [selectedValues];
        }
        
        return { question: q.question, selected: selectedTexts };
      });

      const predictionResult = await submitCareerAssessment(formattedAnswers);
      setResult(predictionResult);
    } catch (err) {
      console.error("Career analysis error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextStep = () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitToAI();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return {
    quizStarted,
    setQuizStarted,
    currentStep,
    answers,
    isAnalyzing,
    result,
    error,
    currentQuestion,
    isMultiSelect,
    handleOptionSelect,
    handleMultiToggle,
    nextStep,
    prevStep,
    submitToAI,
    resetQuiz,
  };
}
