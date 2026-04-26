import { generateGroqCompletion } from "../llmClient";

export const runChatbotPipeline = async (userMessage) => {
  const systemPrompt = "You are an expert career advisor helping Indian students choose streams and careers.";
  
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  return generateGroqCompletion(messages);
};
