import { NextResponse } from "next/server";

// Helper for exponential backoff retry to handle Gemini 503 errors
async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 503 || response.status === 429) {
        throw new Error(`API busy (Status: ${response.status})`);
      }
      if (!response.ok) {
        throw new Error(`API Error (Status: ${response.status})`);
      }
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying...`);
      if (attempt < maxRetries - 1) {
        const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  throw lastError;
}

export async function POST(request) {
  try {
    const { answers } = await request.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid request. Answers are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured in .env.local");
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Build a detailed prompt from quiz answers
    const formattedAnswers = Object.entries(answers)
      .map(([questionId, answer]) => {
        const answerText = Array.isArray(answer) ? answer.join(", ") : answer;
        return `Question "${questionId}": ${answerText}`;
      })
      .join("\n");

    const prompt = `You are an expert career counselor with 20 years of experience guiding students. You have deep knowledge of career paths, academic disciplines, personality traits, and workforce trends.

A student has taken a career guidance assessment. Based on their answers below, provide a comprehensive career analysis.

STUDENT RESPONSES:
${formattedAnswers}

Analyze the student's responses carefully and provide your expert counselor assessment in the following EXACT JSON format (return ONLY valid JSON, no markdown, no code fences):

{
  "careerField": "The single best-suited career field (e.g., Engineering & Technology, Medicine & Healthcare, Design & Creative Arts, Business & Management, Law & Public Policy, Science & Research, Education & Social Impact, Arts & Humanities)",
  "recommendedSubjects": ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"],
  "suggestedCareers": ["Career 1", "Career 2", "Career 3", "Career 4", "Career 5"],
  "personalityStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "counselorInsight": "A detailed 3-4 sentence professional explanation of why this career field is the best match for the student, written in second person (you/your). Reference specific answers they gave and explain how their personality traits, interests, and thinking style align with the recommended path. End with an encouraging and motivational note.",
  "confidenceScore": 85
}

IMPORTANT:
- The confidenceScore should be between 60-98 based on how clearly the answers point to one direction
- recommendedSubjects should include both 11th/12th grade subjects AND college-level subjects
- suggestedCareers should include both entry-level and advanced career options
- personalityStrengths should reflect what you genuinely see in their answers
- counselorInsight should feel like advice from a real counselor, warm yet professional
- Return ONLY valid JSON, nothing else`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let geminiResponse;
    try {
      geminiResponse = await fetchWithRetry(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }, 3); // 3 retries
    } catch (apiErr) {
      console.error("Gemini API continually failed:", apiErr);
      // Fallback response so the app doesn't crash completely
      return NextResponse.json({
        result: {
          careerField: "General Guidance",
          recommendedSubjects: ["English", "Mathematics", "Science", "Social Studies"],
          suggestedCareers: ["Business Analyst", "Educator", "Administrator", "Developer"],
          personalityStrengths: ["Adaptable", "Curious", "Resilient"],
          counselorInsight: "Our AI systems are currently experiencing unusually high demand. Based on standard profiles, building a strong foundation in core subjects keeps the most doors open. We recommend retaking this assessment later for a fully personalized breakdown.",
          confidenceScore: 60
        }
      });
    }

    const geminiData = await geminiResponse.json();

    // Extract the text response from Gemini
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Empty response from Gemini:", JSON.stringify(geminiData));
      return NextResponse.json(
        { error: "AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // Parse the JSON response from Gemini
    let analysisResult;
    try {
      // Remove any markdown code fences if present
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
      return NextResponse.json(
        { error: "AI response was malformed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result: analysisResult });
  } catch (error) {
    console.error("Career guidance API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
