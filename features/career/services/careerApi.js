export const submitCareerAssessment = async (formattedAnswers) => {
  const endpoint = "/api/career-prediction";
  
  const payload = {
    answers: formattedAnswers
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Analysis failed");
  }

  return data.result;
};
