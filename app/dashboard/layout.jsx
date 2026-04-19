"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser, SignOutButton } from "@/components/FirebaseAuthProvider";
import { Button } from "@/components/ui/button"
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
  ChevronRight,
} from "lucide-react"

export default function DashboardLayout({ children }) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  const handleLogout = () => {
    localStorage.removeItem("profileData");
    router.push("/");
  };

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

  const displayName = user?.fullName || user?.firstName || "Student";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const navItems = [
    { href: "/dashboard",                  label: "Overview",        icon: LayoutDashboard },
    { href: "/dashboard/subject-advisor",  label: "Subject Advisor", icon: BookOpen },
    { href: "/dashboard/college-explorer", label: "College Explorer",icon: GraduationCap },
    { href: "/dashboard/career-outcomes",  label: "Career Outcomes", icon: TrendingUp },
    { href: "/dashboard/resources",        label: "Resources",       icon: Library },
    { href: "/dashboard/scholarships",     label: "Scholarships",    icon: DollarSign },
  ];

  const NavItem = ({ href, label, icon: Icon, onClick }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} onClick={onClick}>
        <span
          className={[
            "group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)]",
            "text-sm font-medium transition-all duration-[var(--duration-fast)]",
            "relative overflow-hidden",
            isActive
              ? [
                  "text-primary-foreground",
                  "shadow-[var(--shadow-glow-sm)]",
                ].join(" ")
              : [
                  "text-muted-foreground",
                  "hover:text-foreground hover:bg-[var(--primary-subtle)]",
                ].join(" "),
          ].join(" ")}
          style={
            isActive
              ? { background: "var(--gradient-primary)" }
              : {}
          }
        >
          {/* Active indicator pill on left edge */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-white/60" />
          )}
          <Icon
            className={[
              "h-4 w-4 shrink-0 transition-transform duration-[var(--duration-fast)]",
              isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110",
            ].join(" ")}
          />
          <span className="flex-1">{label}</span>
          {isActive && (
            <ChevronRight className="h-3 w-3 opacity-60" />
          )}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-64 sticky top-0 h-screen"
        style={{
          background: "var(--gradient-sidebar)",
          borderRight: "1px solid var(--sidebar-border)",
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-5"
          style={{ borderBottom: "1px solid var(--sidebar-border)" }}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-[var(--radius-lg)] flex items-center justify-center shadow-[var(--shadow-glow-sm)]"
              style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))", boxShadow: "0 0 14px oklch(0.637 0.237 275 / 0.40)" }}
            >
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors duration-[var(--duration-fast)]">
              ShikshaSetu
            </span>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-[var(--tracking-wider)] text-muted-foreground/50">
            Navigation
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        {/* User footer */}
        <div
          className="p-4"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <div className="flex items-center gap-3 mb-3 px-1">
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/30">
              <AvatarFallback
                className="text-xs font-semibold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))" }}
              >
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Link href="/dashboard/profile" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Profile
              </Button>
            </Link>
            <SignOutButton>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">

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
              className="h-7 w-7 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))" }}
            >
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-base text-foreground">ShikshaSetu</span>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 flex flex-col"
            style={{
              background: "var(--gradient-sidebar)",
              borderRight: "1px solid var(--sidebar-border)",
            }}
          >
            <div className="pt-16 pb-4 h-full flex flex-col px-4 overflow-y-auto">
              <p className="px-3 mt-4 mb-2 text-xs font-semibold uppercase tracking-[var(--tracking-wider)] text-muted-foreground/50">
                Navigation
              </p>
              <nav className="space-y-0.5 flex-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>

              <div className="mt-auto border-t pt-4" style={{ borderColor: "var(--sidebar-border)" }}>
                <div className="flex items-center gap-3 mb-4 px-1">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                    <AvatarFallback
                      className="font-semibold text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))" }}
                    >
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/profile" className="flex-1" onClick={() => setSidebarOpen(false)}>
                    <Button variant="outline" className="w-full">Profile</Button>
                  </Link>
                  <SignOutButton>
                    <Button variant="ghost" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
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
