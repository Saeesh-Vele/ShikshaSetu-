// ─── FIRESTORE PERSISTENCE SERVICE ────────────────────────────────────────────
// Server-side Firestore operations for persisting AI results, quiz history,
// and user interaction data. Uses the client-side Firebase SDK (same db instance).
//
// Collections:
//   users/{uid}                     — User profiles (existing)
//   users/{uid}/quiz_results/{id}   — Quiz/assessment results
//   users/{uid}/chat_history/{id}   — Chatbot conversations
//   users/{uid}/ai_responses/{id}   — Cached AI responses

import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { logger } from "@/utils/logger";

const TAG = "db:firestore";

// ─── HELPER ─────────────────────────────────────────────────────────────────

function isOfflineError(err) {
  return (
    err?.code === "unavailable" ||
    err?.message?.includes("offline") ||
    err?.message?.includes("client is offline")
  );
}

/**
 * Safely execute a Firestore operation, returning null on offline errors
 * instead of crashing the pipeline.
 */
async function safeDbOp(operation, fallback = null) {
  try {
    return await operation();
  } catch (err) {
    if (isOfflineError(err)) {
      logger.warn(TAG, "Firestore offline — operation skipped");
      return fallback;
    }
    logger.error(TAG, "Firestore error", err.message);
    return fallback;
  }
}

// ─── QUIZ RESULTS ───────────────────────────────────────────────────────────

/**
 * Saves a quiz/assessment result for a user.
 * @param {string} userId - Firebase auth UID
 * @param {string} quizType - "evaluate" | "career-prediction" | "career-guidance"
 * @param {object} result - The AI analysis result
 * @param {object} metadata - Additional context (classLevel, answers count, etc.)
 */
export async function saveQuizResult(userId, quizType, result, metadata = {}) {
  if (!userId) return null;

  return safeDbOp(async () => {
    const colRef = collection(db, "users", userId, "quiz_results");
    const docRef = await addDoc(colRef, {
      quizType,
      result,
      metadata,
      createdAt: serverTimestamp(),
    });
    logger.info(TAG, `Saved ${quizType} result`, { userId, docId: docRef.id });
    return docRef.id;
  });
}

/**
 * Retrieves the most recent quiz results for a user.
 * @param {string} userId
 * @param {string} quizType - Optional filter by quiz type
 * @param {number} maxResults - Max number of results to return
 */
export async function getQuizResults(userId, quizType = null, maxResults = 10) {
  if (!userId) return [];

  return safeDbOp(async () => {
    const colRef = collection(db, "users", userId, "quiz_results");
    let q;
    if (quizType) {
      q = query(colRef, where("quizType", "==", quizType), orderBy("createdAt", "desc"), limit(maxResults));
    } else {
      q = query(colRef, orderBy("createdAt", "desc"), limit(maxResults));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}

// ─── CHAT HISTORY ───────────────────────────────────────────────────────────

/**
 * Saves a chatbot exchange (user message + bot reply).
 */
export async function saveChatMessage(userId, userMessage, botReply) {
  if (!userId) return null;

  return safeDbOp(async () => {
    const colRef = collection(db, "users", userId, "chat_history");
    const docRef = await addDoc(colRef, {
      userMessage,
      botReply,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  });
}

/**
 * Retrieves recent chat history for a user.
 */
export async function getChatHistory(userId, maxMessages = 20) {
  if (!userId) return [];

  return safeDbOp(async () => {
    const colRef = collection(db, "users", userId, "chat_history");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(maxMessages));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse();
  }, []);
}

// ─── AI RESPONSE CACHE (Firestore-backed) ───────────────────────────────────

/**
 * Stores an AI response with a hash key for cache lookups.
 */
export async function cacheAiResponse(cacheKey, response, ttlHours = 24) {
  return safeDbOp(async () => {
    const ref = doc(db, "ai_cache", cacheKey);
    await setDoc(ref, {
      response,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + ttlHours * 60 * 60 * 1000),
    });
    logger.debug(TAG, "Cached AI response", { cacheKey });
  });
}

/**
 * Retrieves a cached AI response if it exists and hasn't expired.
 */
export async function getCachedAiResponse(cacheKey) {
  return safeDbOp(async () => {
    const ref = doc(db, "ai_cache", cacheKey);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    // Check expiration
    if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
      logger.debug(TAG, "Cache expired", { cacheKey });
      return null;
    }

    logger.debug(TAG, "Cache hit", { cacheKey });
    return data.response;
  });
}
