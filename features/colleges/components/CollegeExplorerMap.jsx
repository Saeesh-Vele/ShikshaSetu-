"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { calculateHaversineDistance } from '@/features/colleges/utils/distanceCalculator';
import { useRouteInfo } from '../hooks/useRouteInfo';

/* ─────────────────────────── SVG Marker Icons ─────────────────────────── */
const createCollegeIcon = (isSelected = false) => {
  const color = isSelected ? "#8b5cf6" : "#6366f1";
  const glow = isSelected ? "filter: drop-shadow(0 0 6px rgba(139,92,246,0.6));" : "";
  const size = isSelected ? 42 : 34;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 42 42" style="${glow}">
      <defs>
        <linearGradient id="cg_${isSelected}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${isSelected ? '#a78bfa' : '#818cf8'}"/>
        </linearGradient>
      </defs>
      <circle cx="21" cy="21" r="16" fill="url(#cg_${isSelected})" stroke="white" stroke-width="3"/>
      <text x="21" y="26" text-anchor="middle" fill="white" font-size="14">🎓</text>
    </svg>
  `;
  return new L.DivIcon({
    html: svg,
    className: "custom-college-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2],
  });
};

const createHomeIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" style="filter: drop-shadow(0 0 8px rgba(16,185,129,0.5));">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#34d399"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="url(#hg)" stroke="white" stroke-width="3"/>
      <text x="20" y="25" text-anchor="middle" fill="white" font-size="14">🏠</text>
    </svg>
  `;
  return new L.DivIcon({
    html: svg,
    className: "custom-home-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -20],
  });
};

const createUserIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" style="filter: drop-shadow(0 0 6px rgba(59,130,246,0.5));">
      <defs>
        <linearGradient id="ug" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#60a5fa"/>
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="12" fill="url(#ug)" stroke="white" stroke-width="3"/>
      <circle cx="18" cy="18" r="4" fill="white"/>
    </svg>
  `;
  return new L.DivIcon({
    html: svg,
    className: "custom-user-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -18],
  });
};

/* ─────────────────────────── Map Panner ─────────────────────────── */
function MapPanner({ position, zoom = 14 }) {
  const map = useMap();
  React.useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, zoom, map]);
  return null;
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function CollegeExplorerMap({
  userLocation,
  colleges = [],
  onSelectCollege = () => {},
  selectedColleges = [],
  panTo = null,
  onToggleFavorite = null,
  homeLocation = null,
}) {
  if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
    return null;
  }

  const validColleges = useMemo(() => {
    return Array.isArray(colleges)
      ? colleges
          .map((c) => ({ ...c, lat: Number(c?.lat), lon: Number(c?.lon) }))
          .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon))
      : [];
  }, [colleges]);

  const isSelected = (college) => selectedColleges.some((s) => s.id === college.id);

  // Resolve home coordinates
  const homeCoords = homeLocation?.lat != null && homeLocation?.lon != null
    ? [homeLocation.lat, homeLocation.lon]
    : null;

  // First selected college for route drawing
  const targetCollege = selectedColleges.length > 0 ? selectedColleges[0] : null;
  const targetCoords = targetCollege?.lat != null && targetCollege?.lon != null
    ? [Number(targetCollege.lat), Number(targetCollege.lon)]
    : null;

  const homeLat = homeCoords?.[0];
  const homeLon = homeCoords?.[1];
  const targetLat = targetCoords?.[0];
  const targetLon = targetCoords?.[1];

  const routeInfo = useRouteInfo(homeLat, homeLon, targetLat, targetLon);

  // Route path between home and selected college
  const routePath = routeInfo?.path || null;

  // Distance for the route info card
  const routeDistance = routeInfo?.distance ?? null;
  const routeDuration = routeInfo?.duration ?? null;

  // Dark-themed tile layer
  const tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const tileAttribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>';

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation}
        zoom={12}
        scrollWheelZoom
        style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
      >
        <TileLayer attribution={tileAttribution} url={tileUrl} />

        {/* User's current location */}
        <Marker position={userLocation} icon={createUserIcon()}>
          <Popup>
            <div style={{ fontFamily: "system-ui", padding: "4px" }}>
              <strong style={{ color: "#3b82f6" }}>📍 You are here</strong>
            </div>
          </Popup>
        </Marker>

        {/* Home location marker */}
        {homeCoords && (
          <Marker position={homeCoords} icon={createHomeIcon()}>
            <Popup>
              <div style={{ fontFamily: "system-ui", padding: "4px" }}>
                <strong style={{ color: "#10b981" }}>🏠 Home</strong>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                  {homeLocation.address || "Saved Location"}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route polyline */}
        {routePath && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: "#818cf8",
              weight: 4,
              opacity: 0.8,
              dashArray: "12 8",
              lineCap: "round",
            }}
          />
        )}

        {panTo && <MapPanner position={panTo} zoom={14} />}

        {/* College markers */}
        <MarkerClusterGroup>
          {validColleges.map((college) => {
            const selected = isSelected(college);
            const icon = createCollegeIcon(selected);
            const homeDist = homeCoords
              ? calculateHaversineDistance(homeCoords[0], homeCoords[1], college.lat, college.lon)
              : null;

            return (
              <Marker
                key={String(college.id)}
                position={[college.lat, college.lon]}
                icon={icon}
              >
                <Popup>
                  <div
                    style={{
                      fontFamily: "system-ui",
                      padding: "6px",
                      minWidth: "220px",
                      maxWidth: "280px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#6366f1",
                        lineHeight: 1.3,
                      }}
                    >
                      {college.name}
                    </h3>

                    {college.address && (
                      <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>
                        📍 {college.address}
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px 8px",
                        fontSize: "11px",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      <div>🎓 {college.eligibility || "—"}</div>
                      <div>📖 {college.cut_off || "—"}</div>
                      <div>🗣 {college.medium || "—"}</div>
                      <div>💡 {(college.programs || "").split(",")[0] || "—"}</div>
                    </div>

                    {college.facilities && (
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px" }}>
                        🛠 {college.facilities.split(",").slice(0, 3).join(", ")}
                        {college.facilities.split(",").length > 3 ? "…" : ""}
                      </div>
                    )}

                    {typeof college.distance === "number" && (
                      <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "2px" }}>
                        📍 {college.distance.toFixed(2)} km from you
                      </div>
                    )}

                    {homeDist != null && (
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#6366f1",
                          marginBottom: "8px",
                          padding: "4px 8px",
                          background: "rgba(99,102,241,0.08)",
                          borderRadius: "6px",
                          display: "inline-block",
                        }}
                      >
                        🏠 {homeDist.toFixed(1)} km from Home (Aerial)
                      </div>
                    )}

                    {college.homeDistance !== undefined && homeDist == null && (
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}>
                        🏠 Distance unavailable
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCollege(college);
                        }}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          background: selected
                            ? "linear-gradient(135deg, #ef4444, #f87171)"
                            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        }}
                      >
                        {selected ? "Deselect" : "Select"}
                      </button>

                      {typeof onToggleFavorite === "function" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(college);
                          }}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            background: college.favorite
                              ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                              : "linear-gradient(135deg, #9ca3af, #d1d5db)",
                          }}
                        >
                          {college.favorite ? "★ Fav" : "☆ Fav"}
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Floating route info card */}
      {routePath && targetCollege && (
        <div
          className="absolute bottom-4 left-4 z-[1000] p-4 rounded-2xl max-w-xs"
          style={{
            background: "linear-gradient(135deg, rgba(20,20,40,0.92) 0%, rgba(10,10,25,0.96) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🗺️</span>
            <span className="text-white font-semibold text-sm">Route Info</span>
          </div>
          <div className="text-gray-400 text-xs mb-1 truncate" style={{ maxWidth: "200px" }}>
            🏠 Home → {targetCollege.name}
          </div>
          <div
            className="text-sm font-bold mt-1"
            style={{
              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📍 Dist: {routeDistance != null ? `${routeDistance.toFixed(1)} km` : "Unavailable"}
          </div>
          {routeDuration != null && (
             <div className="text-xs text-gray-400 mt-1">
               ⏱️ Est. Time: {routeDuration > 60 ? `${Math.floor(routeDuration / 60)}h ${Math.round(routeDuration % 60)}m` : `${Math.round(routeDuration)} mins`}
             </div>
          )}
        </div>
      )}
    </div>
  );
}
