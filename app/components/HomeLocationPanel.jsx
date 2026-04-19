"use client";

import React, { useState, useEffect } from "react";

export default function HomeLocationPanel({ onLocationSaved }) {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(""); // idle | saving | saved | error
  const [statusType, setStatusType] = useState("idle"); // idle | loading | success | error
  const [hasSavedLocation, setHasSavedLocation] = useState(false);

  // Load persisted home location on mount
  useEffect(() => {
    const saved = localStorage.getItem("homeLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.address) setAddress(parsed.address);
        setHasSavedLocation(true);
        onLocationSaved(parsed);
      } catch (err) {
        console.error("Error parsing saved home location", err);
      }
    }
  }, []);

  const showStatus = (msg, type, duration = 4000) => {
    setStatus(msg);
    setStatusType(type);
    if (duration > 0) setTimeout(() => { setStatus(""); setStatusType("idle"); }, duration);
  };

  const geocodeAddress = async (query) => {
    showStatus("Geocoding address...", "loading", 0);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      
      if (!res.ok) throw new Error(`Geocoding API responded with status: ${res.status}`);
      
      const data = await res.json();
      if (data && data.length > 0) {
        const locationData = {
          address: data[0].display_name || query, // Store the resolved address if available
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        onLocationSaved(locationData);
        setAddress(locationData.address); // Update input field with rich address
        setHasSavedLocation(true);
        showStatus("Home location saved!", "success");
      } else {
        const locationData = { address: query, lat: null, lon: null };
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        onLocationSaved(locationData);
        setHasSavedLocation(true);
        showStatus("Address saved (coordinates unavailable - try a different format or nearby city)", "error", 5000);
      }
    } catch (err) {
      console.error("Geocoding fetch error:", err);
      const locationData = { address: query, lat: null, lon: null };
      localStorage.setItem("homeLocation", JSON.stringify(locationData));
      onLocationSaved(locationData);
      setHasSavedLocation(true);
      showStatus("Connection error (coordinates unavailable)", "error", 5000);
    }
  };

  const handleSaveLocation = () => {
    if (!address.trim()) {
      showStatus("Please enter a valid location.", "error", 3000);
      return;
    }
    if (address.trim().toLowerCase() === "current location") {
      handleUseCurrentLocation();
      return;
    }
    geocodeAddress(address);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showStatus("Geolocation not supported", "error", 3000);
      return;
    }
    showStatus("Getting location...", "loading", 0);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          address: "Current Location",
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setAddress("Current Location");
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        onLocationSaved(locationData);
        setHasSavedLocation(true);
        showStatus("Location saved!", "success");
      },
      () => {
        showStatus("Location permission denied", "error");
      }
    );
  };

  const handleClearLocation = () => {
    localStorage.removeItem("homeLocation");
    setAddress("");
    setHasSavedLocation(false);
    onLocationSaved(null);
    showStatus("Home location cleared", "success", 2000);
  };

  const statusColor = {
    idle: "text-gray-400",
    loading: "text-indigo-400",
    success: "text-emerald-400",
    error: "text-red-400",
  };

  return (
    <div
      id="home-location-panel"
      className="relative overflow-hidden rounded-2xl border border-white/10 p-5"
      style={{
        background: "linear-gradient(135deg, rgba(30,30,50,0.85) 0%, rgba(15,15,30,0.95) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Decorative gradient orb */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            🏠
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide">
              Home Location
            </h3>
            <p className="text-gray-400 text-xs">
              Set your home to see travel distances
            </p>
          </div>
          {hasSavedLocation && (
            <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Saved
            </span>
          )}
        </div>

        {/* Input row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              id="home-address-input"
              type="text"
              placeholder="Enter your home address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveLocation()}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>

          <button
            id="save-home-btn"
            onClick={handleSaveLocation}
            disabled={statusType === "loading"}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}
          >
            Save Home
          </button>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <button
            id="use-current-location-btn"
            onClick={handleUseCurrentLocation}
            disabled={statusType === "loading"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-gray-300 transition-all duration-200 hover:text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
            </svg>
            Use Current Location
          </button>

          {hasSavedLocation && (
            <button
              id="clear-home-btn"
              onClick={handleClearLocation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400/80 transition-all duration-200 hover:text-red-400 hover:bg-red-500/10"
            >
              ✕ Clear
            </button>
          )}

          {status && (
            <span className={`text-xs font-medium ml-auto ${statusColor[statusType]} transition-opacity duration-300`}>
              {statusType === "loading" && (
                <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-1.5 align-middle" />
              )}
              {status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
