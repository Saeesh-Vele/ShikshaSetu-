export const fetchRouteData = async (homeLon, homeLat, targetLon, targetLat) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${homeLon},${homeLat};${targetLon},${targetLat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch route');
  }
  return res.json();
};
