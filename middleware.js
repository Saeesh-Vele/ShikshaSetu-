// ─── NEXT.JS EDGE MIDDLEWARE ──────────────────────────────────────────────────
// Lightweight route guard. Checks for a session cookie shaped like a JWT.
// Full token verification happens server-side in API routes via
// server/middleware/apiMiddleware.js — this is just a presence check.

import { NextResponse } from "next/server";

const AUTH_COOKIE = "__session";

export function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  // Basic JWT shape: three non-empty dot-separated segments
  const isValid = token && token.split(".").length === 3;

  if (!isValid) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run on protected routes — everything else is public by default.
export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
