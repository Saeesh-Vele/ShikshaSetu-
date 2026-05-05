# Colleges

Interactive college explorer with map-based search, filtering, and route planning.

## Exports (via index.js)

- `CollegeCard` — Individual college info card
- `CollegeExplorerMap` — Full-page map with college markers and clustering
- `MapRoute` — Route visualization between user location and a college
- `MapView` — Base map component
- `useColleges` — Hook for fetching and filtering colleges by location
- `useRouteInfo` — Hook for calculating routes to a selected college

## API Routes

- `GET /api/colleges?lat=...&lon=...&radius=...` — Returns nearby colleges

## External Dependencies

- Leaflet + React Leaflet (map rendering)
- Leaflet Routing Machine (route calculation)
