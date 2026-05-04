// ─── AUTH FETCH ───────────────────────────────────────────────────────────────
// Client-side fetch wrapper that automatically attaches the Firebase ID token
// to API requests, enabling server-side user identification.
//
// Usage: import { authFetch } from "@/lib/firebase/authFetch";
//        const res = await authFetch("/api/chatbot", { method: "POST", body: ... });

import { auth } from "./firebase";

/**
 * Wraps fetch with Firebase Auth ID token injection.
 * Falls back to a normal fetch if no user is signed in.
 *
 * @param {string} url - Request URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function authFetch(url, options = {}) {
  const headers = { ...options.headers };

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // Silently proceed without token — middleware will see anonymous
  }

  return fetch(url, { ...options, headers });
}
