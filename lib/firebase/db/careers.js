// lib/firebase/db/careers.js
// ─── CAREER-DOMAIN FIRESTORE OPERATIONS ──────────────────────────────────────
// Reserved for career-specific Firestore operations such as saving career paths,
// bookmarking colleges, or persisting user career preferences.
//
// Currently, career data is served from static JSON files in features/career/data/
// and AI results are persisted via services/db/firestoreService.js (quiz_results
// subcollection). This file will grow as the platform adds user-facing career
// persistence features.

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "career_preferences";

/**
 * Saves a user's bookmarked career path.
 * TODO: Wire to a "Save Career" button in the ResultDashboard component.
 * @param {string} userId - Firebase auth UID
 * @param {string} careerField - The career field name to bookmark
 * @param {object} details - Additional career details (subjects, careers, etc.)
 */
export async function saveCareerBookmark(userId, careerField, details = {}) {
  const ref = doc(db, "users", userId, COLLECTION, careerField);
  await setDoc(ref, {
    careerField,
    ...details,
    savedAt: serverTimestamp(),
  });
}
