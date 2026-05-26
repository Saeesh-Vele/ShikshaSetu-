"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser, useProfile, SignOutButton } from '@/components/providers/FirebaseAuthProvider';
import { isLoggingOut } from '@/lib/firebase/auth';
import { Button } from "@/components/ui/button"
import { isEnabled } from "@/config/features"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  GraduationCap,
  LogOut,
  BookOpen,
  TrendingUp,
  Library,
  DollarSign,
  Menu,
  X,
  LayoutDashboard,
  User,
  Settings,
} from "lucide-react"

export default function DashboardLayout({ children }) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { profile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      if (isLoggingOut) {
        // purely logout flow
        router.push("/");
      } else {
        // protected route guard
        router.push("/sign-in");
      }
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <GraduationCap className="absolute inset-0 m-auto h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground tracking-wide">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Prefer onboarded name from Firestore; fall back to Firebase auth display name
  const displayName = profile?.name || user?.fullName || user?.firstName || "Student";
  const displayEmail = profile?.email || user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const navItems = [
    { href: "/dashboard",                  label: "Overview",        icon: LayoutDashboard },
    { href: "/dashboard/subject-advisor",  label: "Subject Advisor", icon: BookOpen,       featureFlag: "ENABLE_SUBJECT_ADVISOR" },
    { href: "/dashboard/college-explorer", label: "College Explorer",icon: GraduationCap,  featureFlag: "ENABLE_COLLEGE_EXPLORER" },
    { href: "/dashboard/career-outcomes",  label: "Career Outcomes", icon: TrendingUp,     featureFlag: "ENABLE_CAREER_PREDICTION" },
    { href: "/dashboard/resources",        label: "Resources",       icon: Library },
    { href: "/dashboard/scholarships",     label: "Scholarships",    icon: DollarSign },
  ].filter((item) => !item.featureFlag || isEnabled(item.featureFlag));

  const NavItem = ({ href, label, icon: Icon, onClick }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} onClick={onClick}>
        <span
          className={[
            "sidebar-nav-item group flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-[13px] font-medium transition-all duration-200 ease-out",
            "relative",
            isActive
              ? "sidebar-nav-active text-foreground"
              : "text-[oklch(0.55_0.01_275)] hover:text-[oklch(0.85_0.01_275)] hover:bg-white/[0.03]",
          ].join(" ")}
        >
          {/* Active indicator — thin left accent bar */}
          <span
            className="absolute left-0 top-[6px] bottom-[6px] w-[2px] rounded-full transition-all duration-300 ease-out"
            style={{
              background: isActive ? "oklch(0.70 0.20 275)" : "transparent",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scaleY(1)" : "scaleY(0.3)",
            }}
          />
          <span
            className={[
              "flex items-center justify-center h-7 w-7 rounded-md shrink-0 transition-all duration-200",
              isActive
                ? "bg-[oklch(0.637_0.237_275_/_0.15)] text-[oklch(0.75_0.20_275)]"
                : "text-[oklch(0.45_0.01_275)] group-hover:text-[oklch(0.70_0.15_275)] group-hover:bg-white/[0.04]",
            ].join(" ")}
          >
            <Icon className="h-[15px] w-[15px]" />
          </span>
          <span className="flex-1">{label}</span>
        </span>
      </Link>
    );
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-[260px] h-screen shrink-0 sidebar-container"
      >
        {/* Ambient decorative glow */}
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.637 0.237 275 / 0.06) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Logo */}
        <div className="h-[72px] flex items-center px-5 relative">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(145deg, oklch(0.20 0.06 275), oklch(0.14 0.04 275))",
                border: "1px solid oklch(0.30 0.08 275 / 0.5)",
              }}
            >
              <GraduationCap className="h-[17px] w-[17px]" style={{ color: "oklch(0.75 0.20 275)" }} />
            </div>
            <span className="font-semibold text-[15px] text-foreground tracking-[-0.01em] group-hover:text-[oklch(0.80_0.15_275)] transition-colors duration-200">
              ShikshaSetu
            </span>
          </Link>
        </div>

        {/* Subtle divider */}
        <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, oklch(0.25 0.03 275 / 0.6), transparent)" }} />

        {/* Nav */}
        <div className="flex-1 overflow-y-auto pt-5 pb-4 px-3">
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        {/* Subtle divider */}
        <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, oklch(0.25 0.03 275 / 0.6), transparent)" }} />

        {/* User footer */}
        <div className="p-4">
          <div
            className="rounded-xl p-3 mb-2"
            style={{
              background: "oklch(0.10 0.02 275 / 0.6)",
              border: "1px solid oklch(0.20 0.03 275 / 0.4)",
            }}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback
                  className="text-xs font-semibold"
                  style={{
                    background: "oklch(0.18 0.04 275)",
                    color: "oklch(0.70 0.18 275)",
                    border: "1px solid oklch(0.28 0.06 275 / 0.5)",
                  }}
                >
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate text-foreground leading-tight">{displayName}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: "oklch(0.50 0.01 275)" }}>{displayEmail}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-1">
            <Link href="/dashboard/profile" className="flex-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-200"
                style={{ color: "oklch(0.55 0.01 275)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'oklch(1 0 0 / 0.04)'; e.currentTarget.style.color = 'oklch(0.80 0.01 275)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'oklch(0.55 0.01 275)'; }}
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </button>
            </Link>
            <SignOutButton>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-200"
                style={{ color: "oklch(0.45 0.01 275)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'oklch(0.60 0.20 30 / 0.1)'; e.currentTarget.style.color = 'oklch(0.65 0.20 30)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'oklch(0.45 0.01 275)'; }}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col h-screen max-w-full overflow-y-auto overflow-x-hidden">

        {/* Mobile header */}
        <header
          className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur)",
            WebkitBackdropFilter: "var(--glass-blur)",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, oklch(0.20 0.06 275), oklch(0.14 0.04 275))",
                border: "1px solid oklch(0.30 0.08 275 / 0.5)",
              }}
            >
              <GraduationCap className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.20 275)" }} />
            </div>
            <span className="font-semibold text-base text-foreground">ShikshaSetu</span>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 flex flex-col sidebar-container"
          >
            <div className="pt-16 pb-4 h-full flex flex-col px-4 overflow-y-auto">
              <nav className="space-y-0.5 flex-1 mt-4">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>

              <div className="mx-1 h-px my-3" style={{ background: "linear-gradient(90deg, transparent, oklch(0.25 0.03 275 / 0.6), transparent)" }} />

              <div className="mt-auto pt-2">
                <div
                  className="rounded-xl p-3 mb-3"
                  style={{
                    background: "oklch(0.10 0.02 275 / 0.6)",
                    border: "1px solid oklch(0.20 0.03 275 / 0.4)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className="font-semibold"
                        style={{
                          background: "oklch(0.18 0.04 275)",
                          color: "oklch(0.70 0.18 275)",
                          border: "1px solid oklch(0.28 0.06 275 / 0.5)",
                        }}
                      >
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "oklch(0.50 0.01 275)" }}>{displayEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/profile" className="flex-1" onClick={() => setSidebarOpen(false)}>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200"
                      style={{ color: "oklch(0.60 0.01 275)", border: "1px solid oklch(0.20 0.03 275 / 0.5)" }}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                  </Link>
                  <SignOutButton>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200"
                      style={{ color: "oklch(0.45 0.01 275)" }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
