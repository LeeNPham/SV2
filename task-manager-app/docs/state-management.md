# State management for task-manager-app

This guide explains how to manage state and side effects in **task-manager-app** by combining what **FrontendOriginal** does with how **FrontendReference** organizes stores and services.

---

## 1. Goals

| Goal | Approach |
| ---- | -------- |
| Match **FrontendOriginal** UX and data (todos, categories, users, auth) | Port routes and components; keep Firestore collections and field names compatible unless you intentionally migrate data. |
| Align with **FrontendReference** architecture | Put all Firebase and domain logic in `src/lib/stores/` as **stores + handlers**, not scattered in components. |
| Keep components thin | Components subscribe to stores, call handlers, and render; they avoid raw `collection()` / `getDoc()` except for rare one-offs. |

---

## 2. Core pattern (from FrontendReference)

### 2.1 One file per domain: store + handlers

**FrontendReference** consistently uses:

1. A **`writable`** holding UI state: loading flags, lists, a “current” entity, etc.
2. A plain object **`somethingHandlers`** with **async** methods that talk to Firebase (or `fetch`), then **`set`** / **`update`** the store.

Example shape (conceptual):

```js
import { writable } from 'svelte/store';

export const todoStore = writable({
  isLoading: true,
  todos: [],
  currentTodo: null
});

export const todoHandlers = {
  getTodos: async () => { /* getDocs → todoStore.set(...) */ },
  createTodo: async (data) => { /* addDoc */ },
  // ...
};
```

**FrontendOriginal** already follows this for `todoStore`, `categoryStore`, `authStore`, and `userStore`. **task-manager-app** should keep that same split and expand handlers where logic currently lives in **+layout** or components.

### 2.2 Derived stores for computed flags

**FrontendReference** uses `derived` for read-only projections, e.g. `isLoggedIn` from `authStore`:

```js
import { derived } from 'svelte/store';

export const isLoggedIn = derived(authStore, ($auth) => !!$auth.currentUser);
```

Use this for booleans and small derivations so components do not reimplement the same checks.

### 2.3 Cross-store coordination

When one action must update multiple stores (e.g. auth initializes profile data), **FrontendReference** imports another store and calls `update` on it inside a handler (see `authStore` / `userStore` in the reference app).

Rules of thumb:

- Prefer **handlers** calling other handlers or updating multiple stores in one place over duplicating logic in layouts.
- Keep **Firebase Auth** user object and **Firestore** profile document roles clear: e.g. `authStore.currentUser` for the Auth user, and either nested `data` or `userStore.currentUser` for the Firestore profile—**FrontendOriginal** mixes this in layout; pick one convention and document it in code comments.

### 2.4 Persistent client state (optional)

**FrontendReference** includes `persistentStore.ts` (`persistentWritable`) for localStorage-backed state and cross-tab sync via `BroadcastChannel`. Use this in **task-manager-app** only when you need preferences, draft form state, or UI toggles to survive reloads—not for authoritative Firestore data.

---

## 3. Mapping FrontendOriginal → stores

| Domain | Original store | Handlers responsibility | Notes |
| ------ | -------------- | ------------------------ | ----- |
| Auth | `authStore` | signup, login, OAuth, password reset, profile/email updates | Original keeps Firebase Auth user in the store; session is driven by `onAuthStateChanged` in **+layout.svelte**. |
| Profile / users | `userStore` | CRUD, `getUser`, technicians helpers | Move **user document bootstrap** from layout into `authHandlers` or a dedicated `userHandlers.initializeFromAuthUser` if you want parity with Reference’s `initializeUser`. |
| Todos | `todoStore` | list, get one, create, update, delete | Fix any bugs (e.g. invalid `updateDoc` usage) when porting. |
| Categories | `categoryStore` | same CRUD pattern as todos | Keep collection name `categories` unless you migrate. |

Anything that **FrontendOriginal** does in `+layout.svelte` with `onAuthStateChanged`, `getDoc`, and `setDoc` should eventually live in **stores** as named functions so **+layout** only subscribes and calls one or two initialization entry points.

---

## 4. Auth and session flow

**FrontendOriginal** pattern (to preserve or refactor):

1. `onAuthStateChanged` runs in the root layout `onMount`.
2. If no user and route is not public → redirect home.
3. If user → load or create Firestore `users/{uid}` document, then `authStore.update` with `currentUser`, `data`, `isLoading: false`, and `goto('/home')`.

**Recommended direction for task-manager-app:**

1. Keep **`authStore`** as the single place for “session + optional Firestore profile snapshot.”
2. Extract the layout’s `onAuthStateChanged` callback into **`authHandlers.subscribeToAuthState`** (or initialize in `+layout` by importing a single `authHandlers.initClientAuth()` that registers the listener). The implementation detail matters less than **one module** owning the listener.
3. Use **`isLoading`** on `authStore` so routes can show a spinner until the first auth event fires.

---

## 5. Component usage

- **`$store` syntax** in Svelte for subscriptions to writables and derived stores.
- Call **`todoHandlers.getTodos()`** (etc.) from `onMount`, reactive statements, or event handlers—not from module top-level in components that run on the server, unless you guard for **browser-only** Firebase (Original uses `hooks.client` / client-only Firebase module patterns; follow the same in SvelteKit).

For **SvelteKit**, ensure Firebase client code runs only in the browser (`onMount`, `browser` check from `$app/environment`, or dynamic import).

---

## 6. File layout in task-manager-app

Suggested structure under `src/lib/`:

```text
lib/
  firebase/
    firebase.client.js    # app init, auth, db (and storage if needed)
  stores/
    authStore.js
    userStore.js
    todoStore.js
    categoryStore.js
    # optional: persistentStore.ts if you copy from Reference
```

Name new stores **`nounStore` + `nounHandlers`** to stay consistent with **FrontendReference**.

---

## 7. Checklist when porting a feature

1. Identify the Firestore collection and fields in **FrontendOriginal**.
2. If logic lives in a **.svelte** file, move it to the appropriate **handlers** object.
3. Extend the **writable** shape only with fields the UI needs (avoid mirroring entire documents if unused).
4. Add **`isLoading` / error** handling where Reference does (set `isLoading: false` on both success and failure paths when applicable).
5. Add **`derived`** stores only when multiple components need the same computed value.
6. Test auth-gated routes and first-time user document creation in the browser.

---

## 8. What not to copy blindly from FrontendReference

**FrontendReference** is a large marketplace app: many stores (cart, marketplace, Stripe, admin) are irrelevant to the task manager. Copy **patterns**, not file count. **storeTemplate.js** in Reference is example/watchlist code: use it as a structural reference, not as a dependency.

---

## 9. Summary

- **Stores** hold client state; **handlers** perform async work and update stores.
- **Derived** stores encapsulate simple computed state.
- **Auth** should be centralized: listener + Firestore user bootstrap live in one module, not duplicated across routes.
- **task-manager-app** recreates **FrontendOriginal** behavior while adopting **FrontendReference**’s **store + handlers** discipline under `src/lib/stores/`.
