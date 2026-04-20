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
  return mapFirebaseUser(userCredential.user);
}

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(userCredential.user);
}

export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(userCredential.user);
}

export async function logout() {
  return signOut(auth);
}

export function getCurrentUser() {
  return mapFirebaseUser(auth.currentUser);
}

export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user), user);
  });
}
