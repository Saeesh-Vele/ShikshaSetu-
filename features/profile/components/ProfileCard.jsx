// app/dashboard/profile/components/ProfileCard.jsx
"use client";

export default function ProfileCard({ icon: Icon, title, children }) {
  return (
    <div
      style={{
        background: "oklch(0.10 0.015 275)",
        border: "1px solid oklch(0.20 0.025 275)",
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.3)";
        e.currentTarget.style.boxShadow = "0 0 0 1px oklch(0.637 0.237 275 / 0.08), 0 8px 24px oklch(0 0 0 / 0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "oklch(0.20 0.025 275)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          padding: "0.875rem 1.25rem",
          borderBottom: "1px solid oklch(0.18 0.02 275)",
          background: "oklch(0.08 0.012 275 / 0.5)",
        }}
      >
        {Icon && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "oklch(0.637 0.237 275 / 0.12)",
              border: "1px solid oklch(0.637 0.237 275 / 0.22)",
              flexShrink: 0,
            }}
          >
            <Icon size={14} color="oklch(0.637 0.237 275)" />
          </div>
        )}
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--foreground)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Card body */}
      <div style={{ padding: "1.25rem" }}>
        {children}
      </div>
    </div>
  );
}
