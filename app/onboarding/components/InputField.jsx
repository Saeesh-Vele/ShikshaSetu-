// app/onboarding/components/InputField.jsx
"use client";

export default function InputField({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
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
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{
          width: "100%",
          padding: "0.625rem 0.875rem",
          borderRadius: "0.625rem",
          border: error
            ? "1.5px solid oklch(0.60 0.25 30 / 0.6)"
            : "1.5px solid oklch(0.22 0.03 275)",
          background: disabled
            ? "oklch(0.09 0.012 275 / 0.6)"
            : "oklch(0.10 0.015 275)",
          color: disabled ? "oklch(0.50 0.03 275)" : "var(--foreground)",
          fontSize: "0.875rem",
          outline: "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={e => {
          if (!disabled) {
            e.target.style.borderColor = "oklch(0.637 0.237 275 / 0.7)";
            e.target.style.boxShadow = "0 0 0 3px oklch(0.637 0.237 275 / 0.12)";
          }
        }}
        onBlur={e => {
          e.target.style.borderColor = error
            ? "oklch(0.60 0.25 30 / 0.6)"
            : "oklch(0.22 0.03 275)";
          e.target.style.boxShadow = "none";
        }}
      />
      {error && (
        <p style={{ fontSize: "0.75rem", color: "oklch(0.75 0.18 30)", marginTop: 2 }}>
          {error}
        </p>
      )}
    </div>
  );
}
