import { useState, useEffect } from "react";
import { geocodeAddressQuery } from "../services/geocodingApi";

export function useHomeLocation(onLocationSaved) {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(""); // idle | saving | saved | error
  const [statusType, setStatusType] = useState("idle"); // idle | loading | success | error
  const [hasSavedLocation, setHasSavedLocation] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("homeLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.address) setAddress(parsed.address);
        setHasSavedLocation(true);
        if (onLocationSaved) onLocationSaved(parsed);
      } catch (err) {
        console.error("Error parsing saved home location", err);
      }
    }
  }, [onLocationSaved]);

  const showStatus = (msg, type, duration = 4000) => {
    setStatus(msg);
    setStatusType(type);
    if (duration > 0) setTimeout(() => { setStatus(""); setStatusType("idle"); }, duration);
  };

  const geocodeAddress = async (query) => {
    showStatus("Geocoding address...", "loading", 0);
    try {
      const data = await geocodeAddressQuery(query);
      if (data && data.length > 0) {
        const locationData = {
          address: data[0].display_name || query,
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        if (onLocationSaved) onLocationSaved(locationData);
        setAddress(locationData.address);
        setHasSavedLocation(true);
        showStatus("Home location saved!", "success");
      } else {
        const locationData = { address: query, lat: null, lon: null };
        localStorage.setItem("homeLocation", JSON.stringify(locationData));
        if (onLocationSaved) onLocationSaved(locationData);
        setHasSavedLocation(true);
        showStatus("Address saved (coordinates unavailable - try a different format or nearby city)", "error", 5000);
      }
    } catch (err) {
      console.error("Geocoding fetch error:", err);
      const locationData = { address: query, lat: null, lon: null };
      localStorage.setItem("homeLocation", JSON.stringify(locationData));
      if (onLocationSaved) onLocationSaved(locationData);
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
        if (onLocationSaved) onLocationSaved(locationData);
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
    if (onLocationSaved) onLocationSaved(null);
    showStatus("Home location cleared", "success", 2000);
  };

  return {
    address,
    setAddress,
    status,
    statusType,
    hasSavedLocation,
    handleSaveLocation,
    handleUseCurrentLocation,
    handleClearLocation,
  };
}
