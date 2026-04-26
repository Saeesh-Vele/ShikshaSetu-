import Groq from "groq-sdk";

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const generateGroqCompletion = async (messages, model = "llama-3.3-70b-versatile", temperature = 0.7) => {
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
