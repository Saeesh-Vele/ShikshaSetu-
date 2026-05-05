# features/

Each subdirectory is a self-contained feature module with a standard structure: `components/`, `hooks/`, `services/`, and `data/` subfolders. Features contain **only client-side code** — server-side logic belongs in the root `services/` directory.

Inter-feature imports should go through each feature's `index.js` barrel export, never via direct deep imports into another feature's internals. This keeps coupling explicit and refactoring safe.
