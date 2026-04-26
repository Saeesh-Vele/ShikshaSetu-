export const fetchColleges = async (lat, lon, radius = 10000) => {
  const response = await fetch(`/api/Colleges?lat=${lat}&lon=${lon}&radius=${radius}`);
  if (!response.ok) {
    throw new Error('Failed to fetch colleges');
  }
  return response.json();
};
