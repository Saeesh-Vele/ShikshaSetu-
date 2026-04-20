// app/onboarding/components/SelectField.jsx
"use client";

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  error = null,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        htmlFor={id}
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "oklch(0.72 0.04 275)",
          letterSpacing: "0.015em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "oklch(0.637 0.237 275)", marginLeft: 3 }}>*</span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: "100%",
            padding: "0.625rem 2.2rem 0.625rem 0.875rem",
            borderRadius: "0.625rem",
            border: error
              ? "1.5px solid oklch(0.60 0.25 30 / 0.6)"
              : "1.5px solid oklch(0.22 0.03 275)",
            background: "oklch(0.10 0.015 275)",
            color: value ? "var(--foreground)" : "oklch(0.48 0.03 275)",
            fontSize: "0.875rem",
            outline: "none",
            appearance: "none",
            cursor: "pointer",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
          onFocus={e => {
            e.target.style.borderColor = "oklch(0.637 0.237 275 / 0.7)";
            e.target.style.boxShadow = "0 0 0 3px oklch(0.637 0.237 275 / 0.12)";
          }}
          onBlur={e => {
            e.target.style.borderColor = error
              ? "oklch(0.60 0.25 30 / 0.6)"
              : "oklch(0.22 0.03 275)";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="" disabled style={{ color: "oklch(0.48 0.03 275)", background: "oklch(0.10 0.015 275)" }}>
            {placeholder}
          </option>
          {options.map(({ value: v, label: l }) => (
            <option key={v} value={v} style={{ background: "oklch(0.10 0.015 275)", color: "var(--foreground)" }}>
              {l}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "oklch(0.48 0.03 275)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && (
        <p style={{ fontSize: "0.75rem", color: "oklch(0.75 0.18 30)", marginTop: 2 }}>
          {error}
        </p>
      )}
    </div>
  );
}
