import { generateGroqCompletion } from "../llmClient";

export const runChatbotPipeline = async (userMessage, personalizationContext = null) => {
  let systemPrompt = "You are an expert career advisor helping Indian students choose streams and careers.";

  // Inject personalization context if available
  if (personalizationContext) {
    systemPrompt += `\n\n${personalizationContext}`;
  }

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  return generateGroqCompletion(messages);
};
