// lib/firebase/db/index.js
// Barrel export for all domain-specific Firestore operations.
// Import from here for convenience, or from the specific domain file for clarity.

export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  userProfileExists,
} from "./users";

// Career-domain exports will be added here as careers.js grows.
// export { ... } from "./careers";
