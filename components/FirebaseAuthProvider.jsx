// components/FirebaseAuthProvider.jsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "../lib/auth";
import { logout } from "../lib/auth";
import { getUserProfile } from "../lib/firestore";

const FirebaseAuthContext = createContext({
  isLoaded: false,
  user: null,
  userId: null,
  firestoreProfile: null,
  profileLoaded: false,
  refreshProfile: async () => {},
});

export function FirebaseAuthProvider({ children }) {
  const [state, setState] = useState({
    isLoaded: false,
    user: null,
    userId: null,
    firestoreProfile: null,
    profileLoaded: false,
  });

  const refreshProfile = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const profile = await getUserProfile(uid);
      setState((prev) => ({ ...prev, firestoreProfile: profile, profileLoaded: true }));
    } catch {
      setState((prev) => ({ ...prev, firestoreProfile: null, profileLoaded: true }));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (mappedUser, fbUser) => {
      const uid = fbUser ? fbUser.uid : null;

      setState({
        isLoaded: true,
        user: mappedUser,
        userId: uid,
        firestoreProfile: null,
        profileLoaded: false,
      });

      if (uid) {
        try {
          const profile = await getUserProfile(uid);
          setState((prev) => ({
            ...prev,
            firestoreProfile: profile,
            profileLoaded: true,
          }));
        } catch {
          setState((prev) => ({ ...prev, profileLoaded: true }));
        }
      } else {
        setState((prev) => ({ ...prev, profileLoaded: true }));
      }
    });
    return () => unsubscribe();
  }, []);

  const contextValue = {
    ...state,
    refreshProfile: () => refreshProfile(state.userId),
  };

  return (
    <FirebaseAuthContext.Provider value={contextValue}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useUser() {
  const context = useContext(FirebaseAuthContext);
  return {
    isLoaded: context.isLoaded,
    isSignedIn: !!context.user,
    user: context.user,
  };
}

export function useAuth() {
  const context = useContext(FirebaseAuthContext);
  return {
    isLoaded: context.isLoaded,
    isSignedIn: !!context.userId,
    userId: context.userId,
  };
}

export function useProfile() {
  const context = useContext(FirebaseAuthContext);
  return {
    profile: context.firestoreProfile,
    profileLoaded: context.profileLoaded,
    refreshProfile: context.refreshProfile,
  };
}

// ── Render helpers ─────────────────────────────────────────────────────────

export function SignOutButton({ children }) {
  const handleSignOut = async () => {
    await logout();
  };
  return (
    <div onClick={handleSignOut} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}

export function SignedIn({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}

export function SignedOut({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}
