import Groq from "groq-sdk";
import { AI_CONFIG } from "@/config/ai.config";

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const generateGroqCompletion = async (
  messages,
  model = AI_CONFIG.groq.models.versatile,
  temperature = AI_CONFIG.groq.defaults.temperature
) => {
  const client = getGroqClient();
  try {
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature,
    });
    return completion.choices[0]?.message?.content || "No response";
  } catch (error) {
    console.error("LLM Generation Error:", error);
    throw error;
  }
};
