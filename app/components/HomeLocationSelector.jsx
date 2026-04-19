"use client";

import React, { useState, useEffect } from "react";

export default function HomeLocationSelector({ onLocationSaved }) {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("homeLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.address) setAddress(parsed.address);
        onLocationSaved(parsed);
      } catch (err) {
        console.error("Error parsing saved home location", err);
      }
    }
  }, []);

  const geocodeAddress = async (query) => {
    setIsLoading(true);
    setStatus("Saving...");
    try {
      // Best lightweight approximation using Nominatim Search API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const locationData = {
          address: query,
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        onLocationSaved(locationData);
        setStatus("Home location saved!");
      } else {
        // Fallback: save only address
        const locationData = { address: query, lat: null, lon: null };
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        onLocationSaved(locationData);
        setStatus("Address saved (coordinates unavailable)");
      }
    } catch (err) {
      const locationData = { address: query, lat: null, lon: null };
      localStorage.setItem("homeLocation", JSON.stringify(locationData));
      onLocationSaved(locationData);
      setStatus("Address saved (offline)");
    }
    setIsLoading(false);
    setTimeout(() => setStatus(""), 4000);
  };

  const handleSaveLocation = () => {
    if (!address.trim()) {
      setStatus("Please enter a valid location.");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    geocodeAddress(address);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    setIsLoading(true);
    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          address: "Current Location",
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setAddress("Current Location");
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        onLocationSaved(locationData);
        setStatus("Location saved!");
        setIsLoading(false);
        setTimeout(() => setStatus(""), 3000);
      },
      () => {
        setStatus("Unable to retrieve your location. Permission denied?");
        setIsLoading(false);
        setTimeout(() => setStatus(""), 3000);
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Enter Home Address / Location" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSaveLocation()}
        />
        <button 
          onClick={handleSaveLocation}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          Save
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <span className="text-gray-400 font-medium">OR</span>
        <button 
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 transition whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
        >
          <span>📍</span> Use Current Location
        </button>
      </div>
      {status && (
        <span className="text-sm font-medium text-blue-600 ml-2 animate-pulse min-w-[120px]">
          {status}
        </span>
      )}
    </div>
  );
}
