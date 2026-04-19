// app/dashboard/profile/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useAuth, useUser, SignOutButton } from "@/components/FirebaseAuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input"; // if you use a textarea component, or replace with Input
import { Alert } from "@/components/ui/alert"; // optional - if present in your components
import {
  GraduationCap,
  Brain,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  MessageCircle,
  ArrowRight,
  Target,
  Clock,
  School,
  Briefcase,
  AlertCircle,
  CheckCircle,
  User,
  LogOut,
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  Building2,
  BookOpen,
  Star,
  ChevronRight,
} from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function ProfilePage() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState(null)

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
    currentClass: "",
    stream: "",
    interests: [],
    college: "",
  });

  // initialize from Clerk basic data, then fetch DB profile
  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.fullName || user.firstName || "",
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "",
        phone: user.phoneNumber || "",
      }));
    }

    if (userId) {
      fetchProfile(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId, user]);

  function getInitials(name) {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  }

  async function fetchProfile(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/profile/${id}`);
      if (res.ok) {
        const data = await res.json();
        // map interests array to a comma-separated string for UI or keep array
        setForm((prev) => ({
          ...prev,
          ...data,
          interests: Array.isArray(data.interests) ? data.interests : data.interests?.split?.(",") || [],
        }));
      } else if (res.status === 404) {
        // no profile yet — keep Clerk defaults
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("fetchProfile error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if interests, allow comma-separated
    if (name === "interests") {
      setForm((f) => ({ ...f, [name]: value.split(",").map(s => s.trim()).filter(Boolean) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

    const handleLogout = () => {
    localStorage.removeItem("profileData")
    // SignOutButton will handle Clerk signout; we still navigate home
    router.push("/")
  }

  async function handleSave() {
    if (!userId) {
      setError("User not found. Please sign in.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        location: form.location,
        currentClass: form.currentClass,
        stream: form.stream,
        interests: Array.isArray(form.interests) ? form.interests : (form.interests ? form.interests.split(",") : []),
        college: form.college,
      };

      const res = await fetch(`${API_BASE}/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to save profile");
      }
      // success
      const updated = await res.json();
      // update local state
      setForm((f) => ({ ...f, ...updated, interests: Array.isArray(updated.interests) ? updated.interests : f.interests }));
      // optionally show a success message or route
      // router.push("/dashboard"); // do not redirect by default
    } catch (err) {
      console.error("save error:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

    // Name & email to show in navbar/avatar
  const displayName =
    user?.firstName ||
    `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() ||
    user?.fullName ||
    "Student"

  const displayEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    userProfile?.email ||
    ""


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">ShikshaSetu</span>
            </Link>

            <div className="flex items-center space-x-4">

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                </div>
                {/* Profile Link added here */}
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="ml-2">Profile</Button>
                </Link>
              </div>

              <SignOutButton>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </nav>
    
    <div className="max-w-4xl mx-auto py-8">
      
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {!isLoaded || loading ? (
            <div>Loading...</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <Label>Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>

              <div>
                <Label>Email</Label>
                <Input name="email" value={form.email} onChange={handleChange} />
              </div>

              <div>
                <Label>Phone</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <div>
                <Label>Gender</Label>
                <Input name="gender" value={form.gender} onChange={handleChange} />
              </div>

              <div>
                <Label>Location</Label>
                <Input name="location" value={form.location} onChange={handleChange} />
              </div>

              <div>
                <Label>Current Class (e.g., 10th/12th)</Label>
                <Input name="currentClass" value={form.currentClass} onChange={handleChange} />
              </div>

              <div>
                <Label>Stream (science / commerce / arts / vocational)</Label>
                <Input name="stream" value={form.stream} onChange={handleChange} />
              </div>

              <div>
                <Label>Interests (comma separated)</Label>
                <Input name="interests" value={Array.isArray(form.interests) ? form.interests.join(", ") : (form.interests || "")} onChange={handleChange} />
              </div>

              <div>
                <Label>College (name)</Label>
                <Input name="college" value={form.college} onChange={handleChange} />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
