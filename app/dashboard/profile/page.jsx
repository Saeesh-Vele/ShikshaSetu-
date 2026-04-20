// app/dashboard/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useProfile } from "@/components/FirebaseAuthProvider";
import { getUserProfile, updateUserProfile } from "@/lib/firestore";
import ProfileCard from "./components/ProfileCard";
import EditableField from "./components/EditableField";
import {
  User, Phone, MapPin, BookOpen, Percent,
  School, GraduationCap, Pencil, Save, X,
  CheckCircle2, AlertCircle,
} from "lucide-react";

const C = {
  primary:  "oklch(0.637 0.237 275)",
  mid:      "oklch(0.65 0.25 290)",
  border:   "oklch(0.20 0.025 275)",
  muted:    "oklch(0.56 0.04 275)",
  mutedLo:  "oklch(0.42 0.03 275)",
};

const GENDER_OPTIONS = [
  { value: "male",       label: "Male" },
  { value: "female",     label: "Female" },
  { value: "nonbinary",  label: "Non-binary" },
  { value: "prefer_not", label: "Prefer not to say" },
];

const QUAL_OPTIONS = [
  { value: "10th",     label: "10th" },
  { value: "12th",     label: "12th" },
  { value: "graduate", label: "Graduate" },
];

const GENDER_LABEL = {
  male: "Male", female: "Female",
  nonbinary: "Non-binary", prefer_not: "Prefer not to say",
};

const QUAL_LABEL = {
  "10th": "10th", "12th": "12th", graduate: "Graduate",
};

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { refreshProfile } = useProfile();

  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null); // { type: "success" | "error", msg }
  const [draft,     setDraft]     = useState({});

  // ── Load profile ──
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) { router.replace("/sign-in"); return; }

    getUserProfile(userId)
      .then(p => {
        setProfile(p);
        setDraft(p || {});
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [isLoaded, userId, router]);

  // ── Toast auto-dismiss ──
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleEditToggle = () => {
    setDraft(profile || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile || {});
    setIsEditing(false);
  };

  const set = (field) => (e) =>
    setDraft(d => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name:                 draft.name || "",
        phone:                draft.phone || "",
        gender:               draft.gender || "",
        location:             draft.location || "",
        highestQualification: draft.highestQualification || "",
        collegeName:          draft.collegeName || "",
        tenthPercentage:      draft.tenthPercentage ? parseFloat(draft.tenthPercentage) : null,
        twelfthPercentage:    draft.twelfthPercentage ? parseFloat(draft.twelfthPercentage) : null,
        graduationField:      draft.graduationField || null,
      };
      await updateUserProfile(userId, payload);
      const updated = { ...profile, ...payload };
      setProfile(updated);
      setDraft(updated);
      await refreshProfile();
      setIsEditing(false);
      setToast({ type: "success", msg: "Profile updated successfully!" });
    } catch {
      setToast({ type: "error", msg: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ──
  if (!isLoaded || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "60vh" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "2px solid oklch(0.22 0.03 275)",
          borderTopColor: C.primary,
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const displayName  = profile?.name  || user?.fullName  || "Student";
  const displayEmail = profile?.email || user?.email     || "";
  const show10th     = ["10th","12th","graduate"].includes(profile?.highestQualification);
  const show12th     = ["12th","graduate"].includes(profile?.highestQualification);
  const showGrad     = profile?.highestQualification === "graduate";
  const dShow10th    = ["10th","12th","graduate"].includes(draft?.highestQualification);
  const dShow12th    = ["12th","graduate"].includes(draft?.highestQualification);
  const dShowGrad    = draft?.highestQualification === "graduate";

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 100,
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            fontSize: "0.875rem", fontWeight: 500,
            animation: "slideInRight 0.25s ease",
            boxShadow: "0 8px 24px oklch(0 0 0 / 0.35)",
            ...(toast.type === "success"
              ? { background: "oklch(0.25 0.06 145)", border: "1px solid oklch(0.50 0.15 145 / 0.5)",
                  color: "oklch(0.82 0.15 145)" }
              : { background: "oklch(0.25 0.06 30)", border: "1px solid oklch(0.60 0.25 30 / 0.5)",
                  color: "oklch(0.80 0.18 30)" }),
          }}
        >
          {toast.type === "success"
            ? <CheckCircle2 size={15} />
            : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em",
          color: "var(--foreground)", marginBottom: "0.25rem" }}>
          My Profile
        </h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>
          View and manage your personal and academic information.
        </p>
      </div>

      {/* ── Hero section ── */}
      <div
        style={{
          background: "linear-gradient(135deg, oklch(0.10 0.015 275) 0%, oklch(0.08 0.012 275) 100%)",
          border: "1px solid oklch(0.20 0.025 275)",
          borderRadius: "1.25rem",
          padding: "1.75rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow accent */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200, borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(ellipse, oklch(0.637 0.237 275 / 0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", fontWeight: 800, color: "white",
              boxShadow: `0 0 20px oklch(0.637 0.237 275 / 0.35)`,
              border: "2.5px solid oklch(0.637 0.237 275 / 0.3)",
            }}>
              {getInitials(displayName)}
            </div>
            <div>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)",
                letterSpacing: "-0.02em", marginBottom: 2 }}>
                {displayName}
              </p>
              <p style={{ fontSize: "0.82rem", color: C.muted }}>{displayEmail}</p>
              {profile?.highestQualification && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6,
                  padding: "3px 10px", borderRadius: 99,
                  background: "oklch(0.637 0.237 275 / 0.10)",
                  border: "1px solid oklch(0.637 0.237 275 / 0.22)",
                }}>
                  <GraduationCap size={10} color={C.primary} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, color: C.primary }}>
                    {QUAL_LABEL[profile.highestQualification] || profile.highestQualification}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Edit / Save / Cancel buttons */}
          <div style={{ display: "flex", gap: "0.625rem" }}>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.5rem 1rem", borderRadius: "0.625rem",
                    border: `1px solid ${C.border}`, background: "transparent",
                    color: C.muted, fontSize: "0.8rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.4)"; e.currentTarget.style.color = "var(--foreground)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  id="save-profile-btn"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.5rem 1.1rem", borderRadius: "0.625rem",
                    background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                    border: "none", color: "white", fontSize: "0.8rem", fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                    boxShadow: `0 3px 12px oklch(0.637 0.237 275 / 0.35)`,
                    transition: "filter 0.14s ease",
                  }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = "brightness(1.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                >
                  {saving ? (
                    <span style={{ width: 13, height: 13, borderRadius: "50%",
                      border: "2px solid white", borderTopColor: "transparent",
                      display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  ) : (
                    <Save size={13} />
                  )}
                  {saving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <button
                id="edit-profile-btn"
                onClick={handleEditToggle}
                style={{
                  display: "flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.5rem 1.1rem", borderRadius: "0.625rem",
                  border: `1px solid ${C.border}`,
                  background: "oklch(0.12 0.015 275 / 0.7)",
                  color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.45)";
                  e.currentTarget.style.background = "oklch(0.637 0.237 275 / 0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = "oklch(0.12 0.015 275 / 0.7)";
                }}
              >
                <Pencil size={13} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Info cards grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        className="profile-grid">

        {/* Personal Info Card */}
        <ProfileCard icon={User} title="Personal Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <EditableField
              label="Full Name"
              value={profile?.name}
              editValue={draft.name || ""}
              onEditChange={set("name")}
              isEditing={isEditing}
              placeholder="Your full name"
            />
            <EditableField
              label="Phone Number"
              value={profile?.phone}
              editValue={draft.phone || ""}
              onEditChange={set("phone")}
              isEditing={isEditing}
              type="tel"
              placeholder="+91 98765 43210"
            />
            <EditableField
              label="Gender"
              value={GENDER_LABEL[profile?.gender] || profile?.gender}
              editValue={draft.gender || ""}
              onEditChange={set("gender")}
              isEditing={isEditing}
              options={GENDER_OPTIONS}
            />
            <EditableField
              label="Location"
              value={profile?.location}
              editValue={draft.location || ""}
              onEditChange={set("location")}
              isEditing={isEditing}
              placeholder="City, State"
            />
          </div>
        </ProfileCard>

        {/* Education Info Card */}
        <ProfileCard icon={BookOpen} title="Education Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <EditableField
              label="Highest Qualification"
              value={QUAL_LABEL[profile?.highestQualification] || profile?.highestQualification}
              editValue={draft.highestQualification || ""}
              onEditChange={set("highestQualification")}
              isEditing={isEditing}
              options={QUAL_OPTIONS}
            />

            {(isEditing ? dShow10th : show10th) && (
              <EditableField
                label="10th Percentage (%)"
                value={profile?.tenthPercentage != null ? `${profile.tenthPercentage}%` : null}
                editValue={draft.tenthPercentage || ""}
                onEditChange={set("tenthPercentage")}
                isEditing={isEditing}
                type="number"
                placeholder="e.g. 87.5"
              />
            )}

            {(isEditing ? dShow12th : show12th) && (
              <EditableField
                label="12th Percentage (%)"
                value={profile?.twelfthPercentage != null ? `${profile.twelfthPercentage}%` : null}
                editValue={draft.twelfthPercentage || ""}
                onEditChange={set("twelfthPercentage")}
                isEditing={isEditing}
                type="number"
                placeholder="e.g. 82.0"
              />
            )}

            {(isEditing ? dShowGrad : showGrad) && profile?.graduationField && (
              <EditableField
                label="Graduation Field"
                value={profile?.graduationField}
                editValue={draft.graduationField || ""}
                onEditChange={set("graduationField")}
                isEditing={isEditing}
                placeholder="e.g. B.Tech Computer Science"
              />
            )}

            <EditableField
              label="College / School Name"
              value={profile?.collegeName}
              editValue={draft.collegeName || ""}
              onEditChange={set("collegeName")}
              isEditing={isEditing}
              placeholder="Your institution"
            />
          </div>
        </ProfileCard>
      </div>

      {/* ── Account info strip ── */}
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.875rem",
          border: "1px solid oklch(0.18 0.02 275)",
          background: "oklch(0.08 0.012 275 / 0.4)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={14} color="oklch(0.70 0.15 145)" />
          <span style={{ fontSize: "0.8rem", color: C.muted }}>
            Account email: <strong style={{ color: "var(--foreground)" }}>{displayEmail}</strong>
          </span>
        </div>
        {profile?.createdAt && (
          <span style={{ fontSize: "0.75rem", color: C.mutedLo }}>
            Member since{" "}
            {new Date(profile.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
              month: "long", year: "numeric",
            })}
          </span>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
