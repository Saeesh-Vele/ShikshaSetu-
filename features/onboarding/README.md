# Onboarding

Multi-step onboarding flow that collects user profile information after first sign-up.

## Exports (via index.js)

- `HomeLocationPanel` — Location selector with map integration
- `useHomeLocation` — Hook for geolocation and address resolution

## API Routes

None — profile creation uses `lib/firebase/db/users.js` directly.

## External Dependencies

- Firebase Firestore (profile persistence)
- Leaflet (location picker map)
