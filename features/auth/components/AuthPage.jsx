"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login, signup, loginWithGoogle } from "@/lib/firebase/auth";
import { userProfileExists } from "@/lib/firebase/firestore";
import "@/app/auth.css";

// ═══════════════════════════════════════════════════════════════════════════════
// AuthPage — Sliding-panel login / signup with ShikshaSetu branding
// ═══════════════════════════════════════════════════════════════════════════════
export default function AuthPage({ initialPanel = "signin" }) {
  const router = useRouter();
  const canvasRef = useRef(null);

  // Panel state
  const [isSignUp, setIsSignUp] = useState(initialPanel === "signup");

  // ── Sign-in state ──
  const [siEmail, setSiEmail] = useState("");
  const [siPwd, setSiPwd] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  // ── Sign-up state ──
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPwd, setSuPwd] = useState("");
  const [suLoading, setSuLoading] = useState(false);

  // ── Google auth ──
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Smart redirect ──
  const smartRedirect = useCallback(
    async (uid, fallback = "/dashboard") => {
      try {
        const exists = await userProfileExists(uid);
        router.push(exists ? "/dashboard" : "/onboarding");
      } catch {
        router.push(fallback);
      }
    },
    [router]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // AUTH HANDLERS — logic is 100% unchanged from original pages
  // ══════════════════════════════════════════════════════════════════════════

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiLoading(true);
    try {
      const user = await login(siEmail, siPwd);
      showToast("Welcome back! Redirecting…", "success");
      await smartRedirect(user.uid);
    } catch (err) {
      showToast(
        err.message || "Invalid email or password. Please try again.",
        "error"
      );
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!suName.trim()) {
      showToast("Please enter your full name.", "error");
      return;
    }
    if (suPwd.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setSuLoading(true);
    try {
      await signup(suEmail, suPwd, suName);
      showToast("Account created! Redirecting…", "success");
      router.push("/onboarding");
    } catch (err) {
      showToast(err.message || "Failed to sign up. Please try again.", "error");
    } finally {
      setSuLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      showToast("Signed in with Google! Redirecting…", "success");
      await smartRedirect(user.uid, "/onboarding");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        showToast(
          err.message || "Google sign-in failed. Please try again.",
          "error"
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!siEmail.trim()) {
      showToast("Enter your email above first.", "error");
      return;
    }
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { auth: firebaseAuth } = await import("@/lib/firebase/firebase");
      await sendPasswordResetEmail(firebaseAuth, siEmail);
      showToast("Password reset email sent! Check your inbox.", "success");
    } catch (err) {
      showToast(err.message || "Could not send reset email.", "error");
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // STARFIELD CANVAS ANIMATION
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 0.85 + 0.18,
        a: Math.random() * 0.45 + 0.1,
        speed: Math.random() * 0.00011 + 0.000035,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.00008,
      });
    }

    function draw(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;
      stars.forEach((s) => {
        s.x = (s.x + s.drift + 1) % 1;
        const alpha =
          s.a * (0.55 + 0.45 * Math.sin(ts * s.speed * 1000 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,240,${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // GOOGLE SVG (shared by both forms)
  // ══════════════════════════════════════════════════════════════════════════
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="auth-page">
      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="bg-canvas" />

      {/* Ambient glow blobs */}
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="glow-blob glow-blob-3" />

      {/* Back to landing */}
      <a href="/" className="back-link">
        <svg viewBox="0 0 14 14">
          <path
            d="M9 2L4 7l5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        ShikshaSetu
      </a>

      {/* Toast notification */}
      <div
        className={`toast ${toast ? `toast-${toast.type} show` : ""}`}
      >
        {toast?.msg}
      </div>

      {/* ═══ Auth Card ═══ */}
      <div
        className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}
        id="auth-container"
      >
        {/* ─── Sign In Form ─── */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn} autoComplete="off">
            <h1>Welcome Back</h1>
            <p className="form-sub">
              Continue your journey with ShikshaSetu
            </p>

            {/* Google SSO */}
            <div className="social-container">
              <button
                type="button"
                className="social"
                onClick={handleGoogle}
                disabled={googleLoading}
                title="Continue with Google"
                aria-label="Sign in with Google"
              >
                <GoogleIcon />
              </button>
            </div>

            <div className="or-divider">
              <span>or sign in with email</span>
            </div>

            <div className="input-group">
              <input
                type="email"
                id="si-email"
                placeholder=" "
                required
                value={siEmail}
                onChange={(e) => setSiEmail(e.target.value)}
              />
              <label htmlFor="si-email">Email address</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                id="si-pwd"
                placeholder=" "
                required
                value={siPwd}
                onChange={(e) => setSiPwd(e.target.value)}
              />
              <label htmlFor="si-pwd">Password</label>
            </div>

            <button
              type="button"
              className="forgot-pass"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={siLoading || googleLoading}
            >
              {siLoading ? "Please wait…" : "Sign In"}
            </button>

            {/* Mobile toggle (hidden on desktop, overlay handles it) */}
            <div className="mobile-toggle">
              New to ShikshaSetu?
              <button type="button" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* ─── Sign Up Form ─── */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp} autoComplete="off">
            <h1>Create Your Account</h1>
            <p className="form-sub">
              Start your career journey with ShikshaSetu
            </p>

            {/* Google SSO */}
            <div className="social-container">
              <button
                type="button"
                className="social"
                onClick={handleGoogle}
                disabled={googleLoading}
                title="Continue with Google"
                aria-label="Sign up with Google"
              >
                <GoogleIcon />
              </button>
            </div>

            <div className="or-divider">
              <span>or create with email</span>
            </div>

            <div className="input-group">
              <input
                type="text"
                id="su-name"
                placeholder=" "
                required
                value={suName}
                onChange={(e) => setSuName(e.target.value)}
              />
              <label htmlFor="su-name">Full name</label>
            </div>
            <div className="input-group">
              <input
                type="email"
                id="su-email"
                placeholder=" "
                required
                value={suEmail}
                onChange={(e) => setSuEmail(e.target.value)}
              />
              <label htmlFor="su-email">Email address</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                id="su-pwd"
                placeholder=" "
                required
                minLength={6}
                value={suPwd}
                onChange={(e) => setSuPwd(e.target.value)}
              />
              <label htmlFor="su-pwd">Password (min 6 chars)</label>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={suLoading || googleLoading}
            >
              {suLoading ? "Please wait…" : "Sign Up"}
            </button>

            {/* Mobile toggle */}
            <div className="mobile-toggle">
              Already a member?
              <button type="button" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* ═══ Sliding Overlay Panel ═══ */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Decorative waves */}
            <svg
              className="overlay-waves"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 160 Q100 120 200 145 Q300 170 400 135 Q500 100 600 125 Q700 150 800 110"
                stroke="rgba(124,58,237,0.35)"
                strokeWidth="1"
              />
              <path
                d="M0 175 Q110 140 220 160 Q340 180 460 148 Q580 116 700 140 Q760 153 800 130"
                stroke="rgba(168,85,247,0.25)"
                strokeWidth="0.8"
              />
              <path
                d="M0 190 Q120 160 250 175 Q380 190 500 162 Q620 134 750 158 Q780 165 800 152"
                stroke="rgba(139,92,246,0.18)"
                strokeWidth="0.6"
              />
            </svg>

            {/* Right panel: "New to ShikshaSetu?" → Sign Up CTA */}
            <div className="overlay-panel overlay-right">
              <div className="brand">ShikshaSetu</div>
              <h1>
                New to
                <br />
                <em>ShikshaSetu?</em>
              </h1>
              <p>
                Discover your ideal career path with AI-powered guidance
              </p>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            {/* Left panel: "Already a member?" → Sign In CTA */}
            <div className="overlay-panel overlay-left">
              <div className="brand">ShikshaSetu</div>
              <h1>
                Already a<br />
                <em>member?</em>
              </h1>
              <p>
                Continue exploring your personalized career insights
              </p>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer tagline */}
      <div className="auth-footer">
        Your Smart Career Companion · Empowering students to make better
        career choices
      </div>
    </div>
  );
}
