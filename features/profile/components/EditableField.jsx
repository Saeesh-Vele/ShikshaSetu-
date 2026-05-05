// app/dashboard/profile/components/EditableField.jsx
"use client";

export default function EditableField({
  label,
  value,
  editValue,
  onEditChange,
  isEditing,
  type = "text",
  placeholder = "",
  disabled = false,
  options = null, // if provided, renders a select
}) {
  const displayValue = value || (
    <span style={{ color: "oklch(0.40 0.02 275)", fontStyle: "italic", fontSize: "0.8rem" }}>
      Not set
    </span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "oklch(0.48 0.03 275)",
        }}
      >
        {label}
      </span>

      {isEditing && !disabled ? (
        options ? (
          <select
            value={editValue}
            onChange={onEditChange}
            style={{
              padding: "0.5rem 2rem 0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1.5px solid oklch(0.22 0.03 275)",
              background: "oklch(0.10 0.015 275)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              width: "100%",
            }}
            onFocus={e => {
              e.target.style.borderColor = "oklch(0.637 0.237 275 / 0.7)";
              e.target.style.boxShadow = "0 0 0 3px oklch(0.637 0.237 275 / 0.12)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "oklch(0.22 0.03 275)";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="">Select…</option>
            {options.map(({ value: v, label: l }) => (
              <option key={v} value={v} style={{ background: "oklch(0.10 0.015 275)" }}>
                {l}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={onEditChange}
            placeholder={placeholder}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1.5px solid oklch(0.22 0.03 275)",
              background: "oklch(0.10 0.015 275)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              outline: "none",
              width: "100%",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            }}
            onFocus={e => {
              e.target.style.borderColor = "oklch(0.637 0.237 275 / 0.7)";
              e.target.style.boxShadow = "0 0 0 3px oklch(0.637 0.237 275 / 0.12)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "oklch(0.22 0.03 275)";
              e.target.style.boxShadow = "none";
            }}
          />
        )
      ) : (
        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "var(--foreground)",
            lineHeight: 1.4,
          }}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
}
