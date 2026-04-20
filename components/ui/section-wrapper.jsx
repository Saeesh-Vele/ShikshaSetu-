import React from "react";

export function SectionWrapper({ children, className = "" }) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`} style={{ background: "var(--background)" }}>
      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.637 0.237 275 / 0.10) 0%, transparent 60%)",
        zIndex: 0
      }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.06) 0%, transparent 70%)",
        filter: "blur(60px)",
        zIndex: 0
      }} />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ badgeText, badgeIcon: BadgeIcon, title, description }) {
  return (
    <div className="relative px-4 pt-8 pb-6">
      {/* Section badge */}
      {badgeText && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{
            background: "oklch(0.637 0.237 275 / 0.10)",
            border: "1px solid oklch(0.637 0.237 275 / 0.28)",
            color: "oklch(0.78 0.18 275)",
          }}>
            {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
            {badgeText}
          </div>
        </div>
      )}

      {title && (
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 tracking-tight" style={{
          background: "linear-gradient(135deg, oklch(0.96 0.005 275) 0%, oklch(0.78 0.18 275) 100%)",
          WebkitBackgroundClip: "text", 
          backgroundClip: "text", 
          WebkitTextFillColor: "transparent",
        }}>
          {title}
        </h1>
      )}
      
      {description && (
        <p className="text-center text-muted-foreground max-w-xl mx-auto text-sm md:text-base mb-6">
          {description}
        </p>
      )}
    </div>
  );
}
