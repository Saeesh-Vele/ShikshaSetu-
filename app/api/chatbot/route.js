import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor helping Indian students choose streams and careers.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "No response";

    return Response.json({ reply });

  } catch (error) {
    console.error("Chatbot API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch response" }),
      { status: 500 }
    );
  }
}