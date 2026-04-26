export const geocodeAddressQuery = async (query) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  
  if (!res.ok) {
    throw new Error(`Geocoding API responded with status: ${res.status}`);
  }
  
  return res.json();
};
