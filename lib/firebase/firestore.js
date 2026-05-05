// lib/firebase/firestore.js
// ─── COMPATIBILITY ALIAS ──────────────────────────────────────────────────────
// This file re-exports from lib/firebase/db/ so existing imports continue to
// work. New code should import directly from the domain-specific files:
//   import { getUserProfile } from "@/lib/firebase/db/users";
//   import { ... } from "@/lib/firebase/db/careers";

export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  userProfileExists,
} from "./db/index";
