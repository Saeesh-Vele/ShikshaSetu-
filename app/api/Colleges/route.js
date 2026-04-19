import { defaultColleges } from "../../dashboard/college-explorer/CollegeDataset";

// Helper function to handle fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const radius = searchParams.get("radius") || 10000; // default: 10km

    let nearbyColleges = [];

    // Fetch from Overpass API only if location is provided
    if (lat && lon) {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="college"](around:${radius},${lat},${lon});
          way["amenity"="college"](around:${radius},${lat},${lon});
          relation["amenity"="college"](around:${radius},${lat},${lon});
        );
        out center;
      `;

      try {
        const res = await fetchWithTimeout("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: overpassQuery,
          timeout: 10000, // 10 seconds timeout
        });

        const textResponse = await res.text();

        // Check if response is actually OK and contains JSON
        if (!res.ok) {
          throw new Error(`Overpass API returned status: ${res.status} - ${textResponse.slice(0, 100)}`);
        }

        // Safe JSON parsing
        try {
          const data = JSON.parse(textResponse);
          
          if (data && data.elements) {
            nearbyColleges = data.elements.map((el) => ({
              id: `osm-${el.id}`,
              name: el.tags?.name || "Unknown College",
              lat: el.lat || el.center?.lat,
              lon: el.lon || el.center?.lon,
              address: el.tags?.["addr:full"] || el.tags?.["addr:street"] || "Address not available",
              programs: el.tags?.programs || "Not specified",
              eligibility: el.tags?.eligibility || "Not specified",
              cut_off: el.tags?.cut_off || "Not specified",
              medium: el.tags?.medium || "Not specified",
              facilities: el.tags?.facilities || "Not specified",
              isDefault: false,
              isDynamic: true,
            }));
          }
        } catch (parseError) {
          console.error("Overpass API returned non-JSON response:", textResponse.slice(0, 200));
        }

      } catch (err) {
        console.error("Error fetching nearby colleges:", err.message || err);
        // We do not throw here to ensure default dataset colleges are always returned
      }
    }

    // Always include default dataset colleges
    const datasetColleges = defaultColleges.map((c) => ({
      ...c,
      isDefault: true,
      isDynamic: false,
    }));

    // Merge both (avoid duplicates by name)
    const combinedColleges = [
      ...datasetColleges,
      ...nearbyColleges.filter(
        (c) => !datasetColleges.some((d) => d.name.toLowerCase() === c.name.toLowerCase())
      ),
    ];

    return new Response(JSON.stringify(combinedColleges), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" 
      },
    });
  } catch (err) {
    console.error("API Error in /api/Colleges:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}