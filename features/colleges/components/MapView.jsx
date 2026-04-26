"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapRoute from "./MapRoute";

/* Custom marker icon */
const createCustomIcon = (color = "blue", isSelected = false) => {
  const stroke = isSelected ? 'stroke="#FFD54F" stroke-width="4"' : 'stroke="white" stroke-width="3"';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="12" fill="${color}" ${stroke} />
      <circle cx="18" cy="18" r="5" fill="white" />
    </svg>
  `;
  return new L.DivIcon({
    html: svg,
    className: "custom-div-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

/* Pans the map to a given position when panTo changes (does NOT open popups) */
function MapPanner({ position, zoom = 14 }) {
  const map = useMap();
  React.useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, zoom, map]);
  return null;
}

export default function MapView({
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

  const validColleges = Array.isArray(colleges)
    ? colleges
        .map((c) => ({ ...c, lat: Number(c?.lat), lon: Number(c?.lon) }))
        .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon))
    : [];

  const isSelected = (college) => selectedColleges.some((s) => s.id === college.id);

  return (
    <MapContainer
      center={userLocation}
      zoom={12}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <Marker position={userLocation} icon={createCustomIcon("green")}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Conditionally render MapRoute for path visualization */}
      {homeLocation &&
        homeLocation.lat != null &&
        homeLocation.lon != null &&
        selectedColleges.length > 0 &&
        selectedColleges[0].lat != null &&
        selectedColleges[0].lon != null && (
          <MapRoute
            homeCoords={[homeLocation.lat, homeLocation.lon]}
            collegeCoords={[selectedColleges[0].lat, selectedColleges[0].lon]}
          />
        )}

      {panTo && <MapPanner position={panTo} zoom={14} />}

      <MarkerClusterGroup>
        {validColleges.map((college) => {
          const selected = isSelected(college);
          const color = college.isDefault ? "blue" : "red";
          const icon = createCustomIcon(color, selected);

          return (
            <Marker key={String(college.id)} position={[college.lat, college.lon]} icon={icon}>
              {/* SINGLE Popup per marker */}
              <Popup className="shadow-lg rounded-lg bg-white border border-gray-200 p-3 w-64 max-w-sm text-sm">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-blue-700 truncate">{college.name}</h3>
                  {college.address && (
                    <div className="text-xs text-gray-600 truncate">📍 {college.address}</div>
                  )}

                  <div className="grid grid-cols-2 gap-x-2 text-xs text-gray-700">
                    <div>🎓 {college.eligibility || "—"}</div>
                    <div>📖 {college.cut_off || "—"}</div>
                    <div>🗣 {college.medium || "—"}</div>
                    <div>💡 {(college.programs || "").split(",")[0] || "—"}</div>
                  </div>

                  {college.facilities && (
                    <div className="text-xs text-gray-500 truncate">
                      🛠 {college.facilities.split(",").slice(0, 2).join(", ")}
                      {college.facilities.split(",").length > 2 ? "…" : ""}
                    </div>
                  )}

                  {typeof college.distance === "number" && (
                    <div className="text-xs text-gray-500">
                      📍 {college.distance.toFixed(2)} km
                    </div>
                  )}

                  {college.homeDistance !== undefined && (
                    <div className="text-xs text-blue-600 font-medium">
                      {typeof college.homeDistance === "number"
                        ? `🏠 Distance from Home: ${college.homeDistance.toFixed(1)} km`
                        : "🏠 Distance from Home: Distance unavailable"}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCollege(college);
                      }}
                      className={`py-1 px-3 rounded-md text-xs font-semibold ${
                        selected ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
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
                        className="py-1 px-2 rounded-md text-xs font-semibold bg-yellow-400 text-white hover:bg-yellow-500"
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
  );
}