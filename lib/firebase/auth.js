// lib/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

// ── Session cookie helpers ──────────────────────────────────────────────────
// The Edge middleware (middleware.js) checks for a "__session" cookie that
// looks like a JWT. We populate it with the Firebase ID token so protected
// routes (/dashboard, /onboarding) pass the middleware guard.

const SESSION_COOKIE = "__session";

async function syncSessionCookie(user) {
  if (user) {
    try {
      const token = await user.getIdToken();
      document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${60 * 60}; SameSite=Lax`;
    } catch {
      // If token fetch fails, clear the cookie
      document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    }
  } else {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  }
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export function mapFirebaseUser(fbUser) {
  if (!fbUser) return null;
  return {
    id: fbUser.uid,
    uid: fbUser.uid,
    firstName: fbUser.displayName?.split(" ")[0] || "",
    fullName: fbUser.displayName || "",
    primaryEmailAddress: { emailAddress: fbUser.email },
    emailAddresses: [{ emailAddress: fbUser.email }],
    phoneNumber: fbUser.phoneNumber || "",
    email: fbUser.email,
    photoURL: fbUser.photoURL || null,
  };
}

// Keep legacy alias so existing consumers don't break
export const mapFirebaseUserToClerk = mapFirebaseUser;

export async function signup(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  await syncSessionCookie(userCredential.user);
  return mapFirebaseUser(userCredential.user);
}

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await syncSessionCookie(userCredential.user);
  return mapFirebaseUser(userCredential.user);
}

export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  await syncSessionCookie(userCredential.user);
  return mapFirebaseUser(userCredential.user);
}

export let isLoggingOut = false;

export async function logout() {
  isLoggingOut = true;
  clearSessionCookie();
  try {
    return await signOut(auth);
  } finally {
    // Keep it true slightly longer to allow redirects to finalize
    setTimeout(() => { isLoggingOut = false; }, 2000);
  }
}

export function getCurrentUser() {
  return mapFirebaseUser(auth.currentUser);
}

export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, async (user) => {
    // Keep the session cookie in sync whenever auth state changes
    await syncSessionCookie(user);
    callback(mapFirebaseUser(user), user);
  });
}
