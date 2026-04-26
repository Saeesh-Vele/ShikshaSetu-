export async function safeFetch(url, options, timeoutMs = 10000) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return res;
  } catch (err) {
    console.error("safeFetch failed:", err.message || err);
    return null;
  }
}

export function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
    } catch {
      // continue
    }
  }

  return null;
}
