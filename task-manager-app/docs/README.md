# Task Manager App — documentation

Reference material for rebuilding the **FrontendOriginal** task-manager experience inside **task-manager-app**, using the **stores + handlers** architecture from **FrontendReference**.

| Document | Purpose |
| -------- | ------- |
| [State management](./state-management.md) | Patterns for Svelte stores, Firebase, auth, and how to structure `src/lib/stores/` |

## Source projects (repo root)

- **FrontendOriginal** — the app to recreate (routes, UI, Firestore shape, auth flow in `+layout.svelte`).
- **FrontendReference** — the pattern to follow: each domain exports a `writable` store and a `*Handlers` object with async methods; optional `derived` stores; occasional cross-store updates.

When in doubt, mirror **FrontendReference** file structure and naming, and port **FrontendOriginal** behavior into that shape.
