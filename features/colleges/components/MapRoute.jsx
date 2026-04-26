"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export default function MapRoute({ homeCoords, collegeCoords }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !homeCoords || !collegeCoords) return;

    const [homeLat, homeLon] = homeCoords;
    const [collegeLat, collegeLon] = collegeCoords;

    if (!homeLat || !homeLon || !collegeLat || !collegeLon) return;

    // Clean up any existing control before adding a new one
    try {
      if (map._routingControl) {
        map.removeControl(map._routingControl);
      }
    } catch (e) {
      console.warn("Previous routing cleanup skipped", e);
    }

    // Create the leaflet-routing-machine control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(homeLat, homeLon),
        L.latLng(collegeLat, collegeLon)
      ],
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 6, opacity: 0.7 }]
      },
      show: false,          // hide instructions panel
      addWaypoints: false,  // no dragging
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true, // Auto fit map bounds to route if possible
      createMarker: () => null // Hide extra markers since MapView already renders them
    }).addTo(map);

    map._routingControl = routingControl;

    // Cleanup on unmount or when coords change
    return () => {
      try {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      } catch (error) {
        console.warn("Routing cleanup skipped:", error);
      }
    };
  }, [map, homeCoords, collegeCoords]);

  return null;
}
