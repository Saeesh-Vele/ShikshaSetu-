import { NextResponse } from "next/server";

// Helper for exponential backoff retry
async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If 503 Service Unavailable or 429 Too Many Requests, we should retry
      if (response.status === 503 || response.status === 429) {
        throw new Error(`API busy (Status: ${response.status})`);
      }
      
      if (!response.ok) {
        // Other errors (400, 401, etc.) we don't retry
        throw new Error(`API Error (Status: ${response.status})`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying...`);
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s...
        const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  
  throw lastError;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    const prompt = `
    You are a career counseling assistant. 
    Guide students and parents with structured advice about:
    - College structure
    - Career opportunities after a course
    - Options after 10th/12th

    User: ${message}
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    // Call Gemini with 3 retries built-in
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }, 3);

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply });
    
  } catch (err) {
    console.error("Chatbot API Error:", err);
    // Generic fallback for user experience
    return NextResponse.json({ 
      reply: "I am experiencing unusually high demand right now. Let's try again in a moment!" 
    }, { status: 500 }); // Even though it's an error, we can return the text or status 503
  }
}