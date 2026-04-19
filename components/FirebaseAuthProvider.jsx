// components/FirebaseAuthProvider.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "../lib/auth";
import { logout } from "../lib/auth";

const FirebaseAuthContext = createContext({
  isLoaded: false,
  user: null,
  userId: null,
});

export function FirebaseAuthProvider({ children }) {
  const [state, setState] = useState({
    isLoaded: false,
    user: null,
    userId: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((clerkUser, fbUser) => {
      setState({
        isLoaded: true,
        user: clerkUser,
        userId: fbUser ? fbUser.uid : null,
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseAuthContext.Provider value={state}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

// These hooks match Clerk's API
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

export function SignOutButton({ children }) {
  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div onClick={handleSignOut} style={{ cursor: 'pointer' }}>
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
