// lib/firestore.js
// All Firestore operations for the "users" collection.
// Document ID === firebase auth uid.

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "users";

function isOfflineError(err) {
  return (
    err?.code === "unavailable" ||
    err?.message?.includes("offline") ||
    err?.message?.includes("client is offline")
  );
}

/**
 * Create a new user profile document.
 * Should only be called once after onboarding.
 */
export async function createUserProfile(uid, data) {
  try {
    const ref = doc(db, COLLECTION, uid);
    await setDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    if (isOfflineError(err)) {
      throw new Error(
        "Cannot connect to the database. Please check your internet connection and ensure Firestore is enabled in your Firebase project."
      );
    }
    throw err;
  }
}

/**
 * Fetch a user profile document.
 * Returns the data object or null if not found.
 */
export async function getUserProfile(uid) {
  try {
    const ref = doc(db, COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    if (isOfflineError(err)) {
      console.warn("Firestore offline – getUserProfile returning null.");
      return null;
    }
    throw err;
  }
}

/**
 * Merge-update a user profile document.
 * Only the provided fields are overwritten.
 */
export async function updateUserProfile(uid, data) {
  try {
    const ref = doc(db, COLLECTION, uid);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    if (isOfflineError(err)) {
      throw new Error(
        "Cannot connect to the database. Please check your internet connection."
      );
    }
    throw err;
  }
}

/**
 * Returns true if the user has a profile document in Firestore.
 * Falls back to false (treats as new user) if Firestore is offline.
 */
export async function userProfileExists(uid) {
  try {
    const ref = doc(db, COLLECTION, uid);
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (err) {
    if (isOfflineError(err)) {
      console.warn("Firestore offline – userProfileExists returning false.");
      return false; // Treat as new user; onboarding will handle gracefully
    }
    throw err;
  }
}
