"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  GraduationCap, Search, MapPin, Heart, Star,
  SlidersHorizontal, Navigation, Layers, X,
  BookOpen, Trophy, Building2, Sparkles,
} from "lucide-react";
import { calculateHaversineDistance } from '@/features/colleges/utils/distanceCalculator';
import HomeLocationPanel from '@/features/onboarding/components/HomeLocationPanel';
import CollegeCard from '@/features/colleges/components/CollegeCard';
import { useColleges } from '@/features/colleges/hooks/useColleges';

const CollegeExplorerMap = dynamic(
  () => import('@/features/colleges/components/CollegeExplorerMap'),
  { ssr: false }
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const glass = {
  background: "oklch(0.10 0.015 275 / 0.85)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid oklch(0.22 0.030 275)",
};

const glassStrong = {
  background: "oklch(0.12 0.018 275 / 0.90)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid oklch(0.637 0.237 275 / 0.20)",
  boxShadow: "0 8px 32px oklch(0 0 0 / 0.40)",
};

// ─── Stats ───────────────────────────────────────────────────────────────────
const HERO_STATS = [
  { icon: Building2,    value: "1,200+", label: "Colleges"   },
  { icon: BookOpen,     value: "50+",    label: "Programs"   },
  { icon: Trophy,       value: "95%",    label: "Placements" },
  { icon: GraduationCap,value: "Free",   label: "Access"     },
];

export default function CollegeExplorerPage() {
  const [location, setLocation]               = useState(null);
  const [searchQuery, setSearchQuery]         = useState("");
  const [distanceFilter, setDistanceFilter]   = useState(10);
  const [panToCollege, setPanToCollege]       = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [homeLocation, setHomeLocation]       = useState(null);
  const [showFilters, setShowFilters]         = useState(false);

  const searchInputRef = useRef(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const {
    rawColleges,
    filteredColleges,
    selectedColleges,
    favoriteColleges,
    toggleSelectCollege,
    toggleFavorite,
  } = useColleges(location, homeLocation, distanceFilter, searchQuery);

  // Autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) { setAutocompleteResults([]); return; }
    setAutocompleteResults(
      rawColleges.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    );
  }, [searchQuery, rawColleges]);



  const handleSelectSuggestion = (college) => {
    setSearchQuery(college.name);
    setPanToCollege([college.lat, college.lon]);
    setAutocompleteResults([]);
    searchInputRef.current?.blur();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.637 0.237 275 / 0.10) 0%, transparent 60%)",
      }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.06) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* ── Hero Header ── */}
      <div className="relative px-4 pt-8 pb-6">
        {/* Section badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{
            background: "oklch(0.637 0.237 275 / 0.10)",
            border: "1px solid oklch(0.637 0.237 275 / 0.28)",
            color: "oklch(0.78 0.18 275)",
          }}>
            <Sparkles className="h-3 w-3" />
            College Explorer
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 tracking-tight" style={{
          background: "linear-gradient(135deg, oklch(0.96 0.005 275) 0%, oklch(0.78 0.18 275) 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Discover Nearby Colleges
        </h1>
        <p className="text-center text-muted-foreground max-w-xl mx-auto text-sm md:text-base mb-6">
          Explore institutions near you on an interactive map — search, filter by distance, save favourites and compare colleges side by side.
        </p>

        {/* Hero stats row */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {HERO_STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2.5 px-4 py-2 rounded-xl" style={glass}>
              <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.22), oklch(0.65 0.25 290 / 0.22))",
                border: "1px solid oklch(0.637 0.237 275 / 0.28)",
              }}>
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{
                  background: "linear-gradient(135deg, oklch(0.90 0.08 275), oklch(0.78 0.20 275))",
                  WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{value}</div>
                <div className="text-xs text-muted-foreground leading-none">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Home Location Panel */}
        <div className="max-w-3xl mx-auto mb-5">
          <HomeLocationPanel onLocationSaved={setHomeLocation} />
        </div>

        {/* Search + Filter row */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-stretch gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              id="college-search-input"
              type="text"
              placeholder="Search colleges by name..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200"
              style={{
                ...glass,
                boxShadow: "none",
                "--tw-ring-color": "oklch(0.637 0.237 275 / 0.30)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.50)";
                e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.637 0.237 275 / 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.22 0.030 275)";
                e.currentTarget.style.boxShadow = "none";
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && autocompleteResults[0])
                  handleSelectSuggestion(autocompleteResults[0]);
              }}
            />

            {/* Autocomplete dropdown */}
            {autocompleteResults.length > 0 && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden" style={{
                background: "oklch(0.10 0.018 275 / 0.96)",
                backdropFilter: "blur(24px)",
                border: "1px solid oklch(0.637 0.237 275 / 0.20)",
                boxShadow: "0 16px 48px oklch(0 0 0 / 0.55)",
              }}>
                {autocompleteResults.map((c, i) => (
                  <div
                    key={c.id}
                    className="px-4 py-3 cursor-pointer text-sm transition-colors duration-150 flex items-center gap-3"
                    style={{
                      borderBottom: i < autocompleteResults.length - 1 ? "1px solid oklch(0.20 0.025 275)" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.637 0.237 275 / 0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => handleSelectSuggestion(c)}
                  >
                    <div className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0" style={{
                      background: "oklch(0.637 0.237 275 / 0.15)",
                    }}>
                      <GraduationCap className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate">{c.name}</p>
                      {c.address && <p className="text-xs text-muted-foreground truncate">{c.address}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Distance filter */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl shrink-0" style={glass}>
            <MapPin className="h-4 w-4 text-primary" />
            <label htmlFor="distance" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Radius
            </label>
            <input
              id="distance"
              type="number"
              min={1}
              max={100}
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              className="w-14 px-2 py-1 rounded-lg text-sm font-semibold text-center text-foreground focus:outline-none"
              style={{
                background: "oklch(0.637 0.237 275 / 0.12)",
                border: "1px solid oklch(0.637 0.237 275 / 0.28)",
              }}
            />
            <span className="text-sm text-muted-foreground">km</span>
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="px-4 pb-4 flex-1">
        {/* Map wrapper */}
        <div className="relative overflow-hidden rounded-2xl" style={{
          border: "1px solid oklch(0.637 0.237 275 / 0.22)",
          boxShadow: "0 8px 40px oklch(0 0 0 / 0.50), 0 0 30px oklch(0.637 0.237 275 / 0.08)",
          height: "65vh",
          minHeight: "420px",
        }}>
          {/* shimmer top */}
          <div className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none" style={{
            background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.45), transparent)",
          }} />

          {/* Map overlay stats badge */}
          {location && (
            <div className="absolute top-3 left-3 z-20 px-3 py-2 rounded-xl flex items-center gap-2" style={{
              background: "oklch(0.08 0.015 275 / 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid oklch(0.637 0.237 275 / 0.25)",
            }}>
              <Navigation className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">
                {filteredColleges.length} college{filteredColleges.length !== 1 ? "s" : ""} found
              </span>
            </div>
          )}

          {location ? (
            <CollegeExplorerMap
              key={JSON.stringify(panToCollege)}
              userLocation={location}
              colleges={filteredColleges}
              onSelectCollege={toggleSelectCollege}
              selectedColleges={selectedColleges}
              panTo={panToCollege}
              onToggleFavorite={toggleFavorite}
              homeLocation={homeLocation}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4" style={{
              background: "oklch(0.07 0.012 275)",
            }}>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.20), oklch(0.65 0.25 290 / 0.20))",
                  border: "1px solid oklch(0.637 0.237 275 / 0.30)",
                }}>
                  <Navigation className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{
                  background: "oklch(0.637 0.237 275 / 0.30)",
                }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-1">Detecting your location…</p>
                <p className="text-xs text-muted-foreground">Please allow location access</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Panel: Favourites & Selected ── */}
      <div className="px-4 pb-8 flex flex-col gap-6" style={{ borderTop: "1px solid oklch(0.18 0.025 275)" }}>

        {/* Favourites */}
        {favoriteColleges.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, oklch(0.80 0.22 80 / 0.20), oklch(0.75 0.20 60 / 0.20))",
                border: "1px solid oklch(0.80 0.22 80 / 0.30)",
              }}>
                <Star className="h-4 w-4 fill-current" style={{ color: "oklch(0.82 0.20 80)" }} />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Favourites
                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{
                  background: "oklch(0.80 0.22 80 / 0.12)",
                  border: "1px solid oklch(0.80 0.22 80 / 0.25)",
                  color: "oklch(0.82 0.20 80)",
                }}>
                  {favoriteColleges.length}
                </span>
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-2" style={{ scrollbarWidth: "thin" }}>
              {favoriteColleges.map((college) => {
                const homeDistance = homeLocation?.lat != null
                  ? calculateHaversineDistance(homeLocation.lat, homeLocation.lon, college.lat, college.lon)
                  : undefined;
                return (
                  <CollegeCard key={college.id} college={{ ...college, homeDistance }} onToggleFavorite={toggleFavorite} />
                );
              })}
            </div>
          </div>
        )}

        {/* Selected for comparison */}
        {selectedColleges.length > 0 && (
          <div className={favoriteColleges.length > 0 ? "" : "pt-6"}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.20), oklch(0.65 0.25 290 / 0.20))",
                border: "1px solid oklch(0.637 0.237 275 / 0.30)",
              }}>
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Selected for Comparison
                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{
                  background: "oklch(0.637 0.237 275 / 0.12)",
                  border: "1px solid oklch(0.637 0.237 275 / 0.28)",
                  color: "oklch(0.78 0.18 275)",
                }}>
                  {selectedColleges.length}
                </span>
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-2" style={{ scrollbarWidth: "thin" }}>
              {selectedColleges.map((college) => {
                const homeDistance = homeLocation?.lat != null
                  ? calculateHaversineDistance(homeLocation.lat, homeLocation.lon, college.lat, college.lon)
                  : undefined;
                return (
                  <CollegeCard key={college.id} college={{ ...college, homeDistance }} onToggleFavorite={toggleFavorite} />
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {favoriteColleges.length === 0 && selectedColleges.length === 0 && (
          <div className="pt-8 flex flex-col items-center justify-center gap-3 py-10">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{
              background: "oklch(0.637 0.237 275 / 0.10)",
              border: "1px solid oklch(0.637 0.237 275 / 0.20)",
            }}>
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Click colleges on the map to select them for comparison, or star them to add to favourites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}