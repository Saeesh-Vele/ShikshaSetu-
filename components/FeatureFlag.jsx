"use client";

// ─── FEATURE FLAG GUARD COMPONENT ─────────────────────────────────────────────
// Conditionally renders children based on a feature flag from config/features.js.
//
// Usage:
//   import FeatureFlag from "@/components/FeatureFlag";
//   <FeatureFlag name="ENABLE_CHATBOT" fallback={<p>Coming soon</p>}>
//     <ChatWidget />
//   </FeatureFlag>
//
// Unknown flag names fail OPEN (render children) with a dev-mode warning.

import { featureFlags, isEnabled } from "@/config/features";

/**
 * @param {object} props
 * @param {string} props.name - Feature flag key from config/features.js
 * @param {React.ReactNode} props.children - Content to render when flag is enabled
 * @param {React.ReactNode} [props.fallback] - Optional fallback when flag is disabled
 */
export default function FeatureFlag({ name, children, fallback = null }) {
  // Unknown flags fail open — render children, warn in dev
  if (!(name in featureFlags)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[FeatureFlag] Unknown flag "${name}" — rendering children by default. ` +
        `Add it to FLAG_DEFAULTS in config/features.js to silence this warning.`
      );
    }
    return children;
  }

  if (!isEnabled(name)) {
    return fallback;
  }

  return children;
}
