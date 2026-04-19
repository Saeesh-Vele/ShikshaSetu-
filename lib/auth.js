// lib/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export function mapFirebaseUserToClerk(fbUser) {
  if (!fbUser) return null;
  return {
    id: fbUser.uid,
    firstName: fbUser.displayName?.split(" ")[0] || "",
    fullName: fbUser.displayName || "",
    primaryEmailAddress: { emailAddress: fbUser.email },
    emailAddresses: [{ emailAddress: fbUser.email }],
    phoneNumber: fbUser.phoneNumber || "",
    email: fbUser.email,
  };
}

export async function signup(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  return mapFirebaseUserToClerk(userCredential.user);
}

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUserToClerk(userCredential.user);
}

export async function logout() {
  return signOut(auth);
}

export function getCurrentUser() {
  return mapFirebaseUserToClerk(auth.currentUser);
}

export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUserToClerk(user), user);
  });
}
