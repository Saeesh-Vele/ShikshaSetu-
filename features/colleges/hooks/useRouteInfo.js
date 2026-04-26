import { useState, useEffect } from "react";
import { fetchRouteData } from "../services/routeApi";
import { calculateHaversineDistance } from "../utils/distanceCalculator";

export function useRouteInfo(homeLat, homeLon, targetLat, targetLon) {
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    if (homeLat != null && homeLon != null && targetLat != null && targetLon != null) {
      let isMounted = true;
      const fetchRoute = async () => {
        try {
          const data = await fetchRouteData(homeLon, homeLat, targetLon, targetLat);
          if (isMounted && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            // GeoJSON coordinates are [lon, lat], Leaflet expects [lat, lon]
            const coordinates = route.geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteInfo({ path: coordinates, distance: route.distance / 1000, duration: route.duration / 60 });
          } else if (isMounted) {
            setRouteInfo({ path: [[homeLat, homeLon], [targetLat, targetLon]], distance: calculateHaversineDistance(homeLat, homeLon, targetLat, targetLon) });
          }
        } catch (e) {
          if (isMounted) {
             setRouteInfo({ path: [[homeLat, homeLon], [targetLat, targetLon]], distance: calculateHaversineDistance(homeLat, homeLon, targetLat, targetLon) });
          }
        }
      };

      const timeoutId = setTimeout(fetchRoute, 400); // debounce to limit API calls
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    } else {
      setRouteInfo(null);
    }
  }, [homeLat, homeLon, targetLat, targetLon]);

  return routeInfo;
}
