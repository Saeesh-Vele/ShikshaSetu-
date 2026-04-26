import { useState, useEffect } from "react";
import { fetchColleges } from "../services/collegeApi";
import { calculateHaversineDistance } from "../utils/distanceCalculator";

export function useColleges(location, homeLocation, distanceFilter, searchQuery) {
  const [colleges, setColleges] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [favoriteColleges, setFavoriteColleges] = useState([]);

  useEffect(() => {
    if (!location) return;
    const [lat, lon] = location;
    fetchColleges(lat, lon)
      .then(setColleges)
      .catch(console.error);
  }, [location]);

  const toggleSelectCollege = (c) =>
    setSelectedColleges((p) =>
      p.find((x) => x.id === c.id) ? p.filter((x) => x.id !== c.id) : [...p, c]
    );

  const toggleFavorite = (college) => {
    setFavoriteColleges((p) =>
      p.some((c) => c.id === college.id) ? p.filter((c) => c.id !== college.id) : [...p, college]
    );
    setColleges((p) =>
      p.map((c) => (c.id === college.id ? { ...c, favorite: !c.favorite } : c))
    );
  };

  // Filter colleges
  let filteredColleges = colleges
    .map((c) => ({
      ...c,
      distance: location ? calculateHaversineDistance(location[0], location[1], c.lat, c.lon) : null,
      homeDistance: homeLocation?.lat != null
        ? calculateHaversineDistance(homeLocation.lat, homeLocation.lon, c.lat, c.lon)
        : undefined,
    }))
    .filter((c) => !c.distance || c.distance <= distanceFilter);

  // If there's a search query and a college matches, ensure it's in the filtered list
  if (searchQuery) {
    const found = colleges.find((c) => c.name === searchQuery);
    if (found && !filteredColleges.some((c) => c.id === found.id)) {
      filteredColleges.push({
        ...found,
        distance: location ? calculateHaversineDistance(location[0], location[1], found.lat, found.lon) : null,
        homeDistance: homeLocation?.lat != null
          ? calculateHaversineDistance(homeLocation.lat, homeLocation.lon, found.lat, found.lon)
          : undefined,
      });
    }
  }

  return {
    rawColleges: colleges,
    filteredColleges,
    selectedColleges,
    favoriteColleges,
    toggleSelectCollege,
    toggleFavorite,
  };
}
