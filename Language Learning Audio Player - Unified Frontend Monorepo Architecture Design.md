**Language Learning Audio Player - Unified Frontend Monorepo Architecture Design**

**Version:** 4.1 (TanStack Query & Zustand Update - Complete)
**Date:** 2023-10-27 (Final Revision)

**Table of Contents**

1.  [Introduction](#1-introduction)
    *   [1.1 Purpose](#11-purpose)
    *   [1.2 Monorepo Rationale](#12-monorepo-rationale)
    *   [1.3 Goals](#13-goals)
    *   [1.4 Tech Stack](#14-tech-stack)
    *   [1.5 Scope](#15-scope)
2.  [Core Architectural Principles](#2-core-architectural-principles)
3.  [Architecture Overview](#3-architecture-overview)
    *   [3.1 Monorepo Structure (`apps/`, `packages/`)](#31-monorepo-structure-apps-packages)
    *   [3.2 Key Components & Locations](#32-key-components--locations)
    *   [3.3 Data Flow Overview](#33-data-flow-overview)
4.  [Monorepo Directory Structure](#4-monorepo-directory-structure)
5.  [Shared Packages Design (`packages/`)](#5-shared-packages-design-packages)
    *   [5.1 `packages/api-client`](#51-packagesapi-client)
    *   [5.2 `packages/types`](#52-packagestypes)
    *   [5.3 `packages/ui`](#53-packagesui)
    *   [5.4 `packages/utils`](#54-packagesutils)
    *   [5.5 `packages/auth` (Optional Shared Auth Logic)](#55-packagesauth-optional-shared-auth-logic)
    *   [5.6 `packages/query-client` (Optional Shared Query Config)](#56-packagesquery-client-optional-shared-query-config)
6.  [Application-Specific Design (`apps/`)](#6-application-specific-design-apps)
    *   [6.1 User Application (`apps/user-app`)](#61-user-application-appsuser-app)
        *   [6.1.1 Purpose & Scope](#611-purpose--scope)
        *   [6.1.2 Key Features & Components](#612-key-features--components)
        *   [6.1.3 Authentication Flow](#613-authentication-flow)
        *   [6.1.4 Audio Player Implementation (Zustand Store)](#614-audio-player-implementation-zustand-store)
        *   [6.1.5 Client Data Fetching (TanStack Query)](#615-client-data-fetching-tanstack-query)
    *   [6.2 Admin Panel Application (`apps/admin-panel`)](#62-admin-panel-application-appsadmin-panel)
        *   [6.2.1 Purpose & Scope](#621-purpose--scope)
        *   [6.2.2 Key Features & Components](#622-key-features--components)
        *   [6.2.3 Authentication & Authorization Flow](#623-authentication--authorization-flow)
        *   [6.2.4 Data Management Implementation (TanStack Query)](#624-data-management-implementation-tanstack-query)
7.  [Key Workflows (Cross-App Examples)](#7-key-workflows-cross-app-examples)
    *   [7.1 User Login (User App)](#71-user-login-user-app)
    *   [7.2 Loading/Playing Audio (User App - Zustand)](#72-loadingplaying-audio-user-app---zustand)
    *   [7.3 Creating Bookmark (User App)](#73-creating-bookmark-user-app)
    *   [7.4 Admin Viewing/Filtering Tracks (Admin Panel - TanStack Query)](#74-admin-viewingfiltering-tracks-admin-panel---tanstack-query)
    *   [7.5 Admin Editing Track Metadata (Admin Panel)](#75-admin-editing-track-metadata-admin-panel)
    *   [7.6 Admin Uploading New Track (Admin Panel)](#76-admin-uploading-new-track-admin-panel)
8.  [Non-Functional Considerations](#8-non-functional-considerations)
    *   [8.1 Security (Shared & Specific)](#81-security-shared--specific)
    *   [8.2 Performance (Shared & Specific)](#82-performance-shared--specific)
    *   [8.3 Error Handling & Loading States](#83-error-handling--loading-states)
    *   [8.4 Accessibility](#84-accessibility)
    *   [8.5 Testing Strategy (Monorepo)](#85-testing-strategy-monorepo)
9.  [Monorepo Tooling & Build Process](#9-monorepo-tooling--build-process)
10. [Future Considerations](#10-future-considerations)

---

## 1. Introduction

### 1.1 Purpose

This document provides a unified architectural design for the **entire frontend system** of the Language Learning Audio Player, encompassing both the **User Application** and the **Admin Panel**. It adopts a **Monorepo** strategy to manage these two distinct Next.js applications while facilitating code sharing and details the use of **TanStack Query V5** for data fetching/caching and **Zustand** for complex client state.

### 1.2 Monorepo Rationale

Using a monorepo offers several advantages for this project:

*   **Code Sharing:** Easily share common logic (API client), types (API DTOs), UI components (base elements), and utilities between the User App and Admin Panel, reducing duplication and ensuring consistency.
*   **Atomic Changes:** Make changes across shared packages and the applications that consume them in a single commit or pull request, improving coordination.
*   **Simplified Dependency Management:** Manage dependencies across the entire project using tools like `pnpm workspaces`, `yarn workspaces`, or higher-level solutions like Turborepo/Nx.
*   **Consistent Tooling:** Easier to enforce consistent linting rules, testing configurations, TypeScript settings, and build processes across both applications.
*   **Improved Refactoring:** Refactoring shared code is simpler as changes can be immediately tested against all consuming applications within the same repository.

### 1.3 Goals

*   Deliver two distinct, high-quality frontend applications (a user-facing app optimized for learning and media consumption, and an efficient admin panel for management) from a single, well-structured codebase.
*   Maximize code reuse for common functionalities like API interaction, type definitions, and potentially foundational UI elements, managed through internal monorepo packages.
*   Implement secure and separate authentication and authorization flows appropriate for regular users and administrators.
*   Ensure excellent performance through modern frontend practices like server components, optimized data fetching (Next.js server caching, TanStack Query client caching), and efficient audio handling.
*   Maintain a high degree of code quality, testability, and maintainability across the entire monorepo structure.
*   Leverage modern frontend technologies effectively: Next.js App Router, React 19+, TanStack Query V5, Zustand, TypeScript, and Tailwind CSS.

### 1.4 Tech Stack

*   **Monorepo Management:** `pnpm` workspaces (or `yarn`, `npm`, Turborepo, Nx)
*   **Applications:** 2 x Next.js 15.x (App Router) instances (`apps/user-app`, `apps/admin-panel`)
*   **UI Library:** React 19+
*   **Styling:** Tailwind CSS 4.x
*   **Language:** TypeScript
*   **Client Data Fetching & Caching:** **TanStack Query V5 (`@tanstack/react-query`)**
*   **Global Client State Management:** **Zustand** (for complex state like the user app's player), React Context (for simpler global state like Auth status view). React 19 Hooks (`useActionState`, `useOptimistic`, `use`) for action/form/local state.
*   **Form Handling:** React Hook Form or React 19 Action features.
*   **API Client:** Native `fetch` wrapper (`packages/api-client`).

### 1.5 Scope

This document covers the architecture of the frontend monorepo, including:

*   Overall monorepo structure (`apps/`, `packages/`).
*   Design of shared internal packages (`api-client`, `types`, `ui`, `utils`, etc.).
*   Specific architecture of the User Application (`apps/user-app`), including its hybrid audio player using Zustand.
*   Specific architecture of the Admin Panel Application (`apps/admin-panel`), including its data management approach using TanStack Query.
*   Interaction patterns between applications and shared packages.
*   Authentication and authorization flows for both user roles.
*   Data flow, state management (specifying TanStack Query and Zustand), styling, and testing strategies within the monorepo context.
*   It assumes interaction with the previously defined Go backend API.

## 2. Core Architectural Principles

*(These principles apply across the monorepo)*

1.  **Routing vs. Logic Separation:** Within *each* application (`user-app`, `admin-panel`), the `app` directory is used *strictly* for defining routes, layouts, loading/error states, and Route Handlers. All reusable application logic (components, hooks, actions, stores, contexts, utilities, services, types) resides in dedicated folders at that application's root (e.g., `apps/user-app/_components`) OR in shared `packages/*` directories.
2.  **Shared Packages:** Common, reusable code is extracted into internal `packages/*` (e.g., `api-client`, `types`, `ui`) to be consumed by applications, promoting DRY and consistency.
3.  **Server Components First:** Default to Next.js Server Components in both apps for rendering static content, fetching initial data, and minimizing client-side JavaScript bundles.
4.  **Client Components for Interactivity:** Explicitly use the `'use client'` directive for components requiring browser APIs (Web Audio, `localStorage`), React hooks with state/effects (`useState`, `useEffect`), event listeners, or access to client-side state management (Context, Zustand, TanStack Query Client).
5.  **Server Actions for Mutations:** Utilize Next.js Server Actions (`'use server'`, defined within each app's `_actions` folder) as the primary, secure mechanism for handling data mutations (form submissions, button clicks that modify data) initiated from Client Components.
6.  **Secure Authentication via Middleware & Cookies:** Each application (`user-app`, `admin-panel`) employs its *own* Next.js Middleware (`middleware.ts`) for route protection. Authentication state is managed via secure, `httpOnly` session cookies, set and verified by dedicated Route Handlers (`app/api/auth/session/route.ts`) within each app. Admin middleware includes additional authorization checks (role/permission).
7.  **Optimized Data Fetching & Caching:** Leverage Next.js server-side caching capabilities (via extended `fetch`) within Server Components and Server Actions. Utilize **TanStack Query V5** within Client Components for robust client-side data fetching, caching, background synchronization, automatic refetching, and managing server state.
8.  **Hybrid Audio Playback (User App):** The user application implements a hybrid audio strategy combining the Web Audio API for fine-grained control and effects with the native HTML `<audio>` element (via `createMediaElementSource`) for efficient streaming of large files.
9.  **Pragmatic State Management:** Use **Zustand** for complex, global, client-side state management where multiple components need to react to shared state changes (e.g., the audio player in the User App). Use React Context for simpler, relatively static global data (e.g., providing the client-side view of authentication status). Employ React 19 hooks (`useActionState`, `useOptimistic`, `use`) for managing state related to Server Actions, forms, and local component logic.
10. **Utility-First Styling:** Apply styling primarily through **Tailwind CSS** utility classes. Shared UI components (`packages/ui`) should be built with Tailwind, allowing for consistent theming across applications (potentially extending a base Tailwind config).
11. **Type Safety:** Enforce **TypeScript** throughout the monorepo. Shared types are defined in `packages/types`. Each app and package has its own `tsconfig.json`, likely extending a base configuration (`tsconfig.base.json`).
12. **Centralized API Abstraction:** All direct communication with the Go backend API is funneled through the shared **`packages/api-client`**, providing a consistent interface and facilitating easier changes to base URL, headers, or error handling.

## 3. Architecture Overview

### 3.1 Monorepo Structure (`apps/`, `packages/`)

The project codebase is organized using a standard monorepo layout:

*   **`apps/`:** Contains the deployable Next.js applications. Each subdirectory represents a separate application with its own `package.json`, configuration, and `app` directory for routing.
    *   `apps/user-app`: The user-facing frontend.
    *   `apps/admin-panel`: The administrative interface.
*   **`packages/`:** Contains shared, internal libraries or modules used by the applications in `apps/`. These are not typically published independently but are linked together by the monorepo tooling (e.g., `pnpm workspaces`).
    *   `packages/api-client`: Shared API communication layer.
    *   `packages/types`: Shared TypeScript definitions.
    *   `packages/ui`: Shared base UI components.
    *   `packages/utils`: Shared utility functions.
    *   `packages/auth` (Optional): Shared session/crypto logic.
    *   `packages/query-client` (Optional): Shared TanStack Query client config.

This structure promotes code reuse while maintaining clear boundaries between the different applications.

### 3.2 Key Components & Locations

*   **Routing Files (`layout.tsx`, `page.tsx`, etc.):** Located within `apps/user-app/app/` and `apps/admin-panel/app/` respectively.
*   **Middleware:** Separate files at `apps/user-app/middleware.ts` and `apps/admin-panel/middleware.ts`.
*   **Server Actions:** Defined within `apps/user-app/_actions/` and `apps/admin-panel/_actions/`.
*   **App-Specific UI Components:** Reside in `apps/user-app/_components/` and `apps/admin-panel/_components/`.
*   **Shared UI Components:** Located in `packages/ui/src/`.
*   **Global State (Zustand Stores):** Typically defined within the relevant app, e.g., `apps/user-app/_stores/playerStore.ts`.
*   **Global State (React Context):** Defined within the relevant app, e.g., `apps/user-app/_context/AuthContext.tsx`.
*   **Custom Hooks (including TanStack Query wrappers):** Defined within `apps/user-app/_hooks/` and `apps/admin-panel/_hooks/`.
*   **Core Shared Logic/Types:** Reside in `packages/api-client/src/`, `packages/types/src/`, `packages/utils/src/`.
*   **App-Specific Route Handlers:** Located within `apps/user-app/app/api/` and `apps/admin-panel/app/api/`.
*   **TanStack Query Client Setup:** Initialized either in a shared `packages/query-client` and provided via a shared provider, or configured independently within each app's root layout (`apps/*/app/layout.tsx`) using `QueryClientProvider`.

### 3.3 Data Flow Overview

*   **Initial Page Load (Server Component):**
    1.  Request hits Next.js server for a specific app (`user-app` or `admin-panel`).
    2.  The app's `middleware.ts` runs (checks auth/role).
    3.  Matching Server Component (`app/**/page.tsx` or `layout.tsx`) executes within the app.
    4.  Component `await`s data fetching function (likely from the app's `_services/*`, which uses the shared `packages/api-client`).
    5.  Next.js renders HTML on the server with fetched data, potentially including dehydrated state for TanStack Query if using server-side query prefetching.
    6.  HTML is sent to the client, along with JavaScript bundles for Client Components.
*   **Client-Side Navigation:** (Standard Next.js App Router flow) Prefetching, rendering Server Components server-side as needed.
*   **Client-Side Data Fetching (Client Component with TanStack Query):**
    1.  Client Component (in `apps/*/_components/`) mounts.
    2.  `useQuery` hook (from `@tanstack/react-query`, potentially wrapped in `apps/*/_hooks/`) is called.
    3.  TanStack Query provides cached data if available and fresh.
    4.  If needed, `useQuery` calls its `queryFn`, which likely invokes a function from `apps/*/_services/*` that uses the shared `packages/api-client` to call the Go backend.
    5.  Component displays loading/error states based on `useQuery` return values (`isLoading`, `isError`, etc.).
    6.  Data is fetched, cached by TanStack Query, and the component re-renders.
*   **Data Mutation (Server Action):**
    1.  Client Component (in `apps/*/_components/`) invokes a Server Action (from `apps/*/_actions/`).
    2.  Client UI updates optimistically (`useOptimistic`) or shows pending state (`useActionState`, `useFormStatus`). TanStack Query's `useMutation` can also be used to wrap the action call for integrated state management.
    3.  Server Action executes on the server.
    4.  Action calls the Go backend API via the shared `packages/api-client`.
    5.  Action receives response.
    6.  Action optionally calls `revalidatePath` or `revalidateTag` for Next.js cache invalidation. If using `useMutation`, the client can trigger TanStack Query cache invalidation via `queryClient.invalidateQueries()`.
    7.  Action returns result/error state.
    8.  Client UI updates based on the final action state and potentially automatic data refetching triggered by TanStack Query cache invalidation.

## 4. Monorepo Directory Structure

```
language-player-monorepo/
├── apps/
│   ├── user-app/               # User-facing Next.js Application
│   │   ├── _actions/           # User-specific Server Actions
│   │   │   ├── authActions.ts
│   │   │   ├── collectionActions.ts
│   │   │   └── userActivityActions.ts
│   │   ├── _components/        # User App UI Components
│   │   │   ├── auth/
│   │   │   ├── player/
│   │   │   ├── track/
│   │   │   ├── collection/
│   │   │   ├── ui/             # App-specific UI wrappers or complex components
│   │   │   └── layout/
│   │   ├── _context/           # User App React Context Providers
│   │   │   └── AuthContext.tsx
│   │   ├── _hooks/             # User App Custom Hooks (incl. TanStack Query wrappers)
│   │   │   ├── useAuth.ts
│   │   │   ├── usePlayerStore.ts # Hook for Zustand store
│   │   │   └── useTrackProgressQuery.ts # Example query hook
│   │   ├── _lib/               # User App specific utils (if any)
│   │   ├── _services/          # User App data fetching functions
│   │   │   ├── authService.ts
│   │   │   ├── trackService.ts
│   │   │   ├── collectionService.ts
│   │   │   └── userService.ts
│   │   ├── _stores/            # User App Zustand Stores
│   │   │   └── playerStore.ts
│   │   ├── app/                # USER APP ROUTING ONLY
│   │   │   ├── (auth)/
│   │   │   │   └── login/page.tsx # Imports _components/auth/LoginForm
│   │   │   │   └── register/page.tsx # Imports _components/auth/RegisterForm
│   │   │   ├── (main)/
│   │   │   │   ├── layout.tsx      # Imports _components/layout/*
│   │   │   │   ├── tracks/ (page.tsx, [trackId]/page.tsx) # Import _components/track/*
│   │   │   │   ├── collections/ (page.tsx, [collectionId]/page.tsx) # Import _components/collection/*
│   │   │   │   ├── bookmarks/page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   └── page.tsx        # Dashboard
│   │   │   ├── api/auth/session/route.ts # USER session handler
│   │   │   ├── layout.tsx          # Root layout (html, body, QueryClientProvider, Context/Store Providers)
│   │   │   ├── global-error.tsx
│   │   │   └── loading.tsx
│   │   ├── middleware.ts           # USER auth middleware
│   │   ├── public/
│   │   ├── .env.local
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.ts      # Extends root/shared config
│   │   └── tsconfig.json           # Extends root tsconfig.base.json
│   │
│   └── admin-panel/            # Admin Panel Next.js Application
│       ├── _actions/           # Admin-specific Server Actions
│       │   ├── adminAuthActions.ts
│       │   ├── adminUserActions.ts
│       │   ├── adminTrackActions.ts
│       │   └── adminCollectionActions.ts
│       ├── _components/        # Admin Panel UI Components
│       │   ├── admin/          # DataTable, ResourceForm, DashboardWidget etc.
│       │   ├── ui/             # App-specific UI wrappers
│       │   └── layout/         # Admin Sidebar, Header etc.
│       ├── _context/           # (Likely minimal)
│       ├── _hooks/             # Admin Custom Hooks (incl. TanStack Query wrappers)
│       │   └── useAdminUsersQuery.ts # Example
│       ├── _lib/               # App-specific utils (if any)
│       ├── _services/          # Admin data fetching functions
│       │   ├── adminAuthService.ts
│       │   ├── adminUserService.ts
│       │   ├── adminTrackService.ts
│       │   └── adminCollectionService.ts
│       ├── _stores/            # (Likely none)
│       ├── app/                # ADMIN PANEL ROUTING ONLY
│       │   ├── login/page.tsx
│       │   ├── (admin)/        # Protected admin routes group
│       │   │   ├── layout.tsx
│       │   │   ├── users/ (page.tsx, [userId]/page.tsx?)
│       │   │   ├── tracks/ (page.tsx, [trackId]/page.tsx?)
│       │   │   ├── collections/ (page.tsx, [collectionId]/page.tsx?)
│       │   │   └── page.tsx      # Admin Dashboard
│       │   ├── api/auth/session/route.ts # ADMIN session handler
│       │   ├── layout.tsx          # Root layout (html, body, QueryClientProvider)
│       │   ├── global-error.tsx
│       │   └── loading.tsx
│       ├── middleware.ts           # ADMIN auth middleware (checks role)
│       ├── public/
│       ├── .env.local
│       ├── next.config.mjs
│       ├── tailwind.config.ts      # Extends root/shared config
│       └── tsconfig.json           # Extends root tsconfig.base.json
│
├── packages/                   # Shared Internal Packages
│   ├── api-client/             # Shared Fetch Wrapper for Go API
│   │   ├── src/index.ts
│   │   └── package.json
│   ├── types/                  # Shared TypeScript Definitions
│   │   ├── src/index.ts       # Exports API DTO types
│   │   └── package.json
│   ├── ui/                     # Shared React UI Components (Tailwind based)
│   │   ├── src/Button.tsx     # Example component
│   │   ├── src/globals.css    # Base Tailwind layer directives?
│   │   └── package.json
│   ├── utils/                  # Shared Utility Functions
│   │   ├── src/formatters.ts  # Example util
│   │   └── package.json
│   ├── auth/                   # (Optional) Shared Auth Logic
│   │   ├── src/session.ts
│   │   └── package.json
│   ├── query-client/           # (Optional) Shared TanStack Query client config/provider
│   │   ├── src/index.ts       # Exports queryClient, QueryProvider wrapper
│   │   └── package.json
│   └── tsconfig/               # Shared base TypeScript config for packages
│       └── base.json
├── .gitignore
├── package.json                # Root package.json (monorepo scripts, devDependencies like typescript, eslint, prettier)
├── pnpm-workspace.yaml         # (If using pnpm) Defines workspaces 'apps/*' and 'packages/*'
├── tsconfig.base.json          # Base TypeScript config extended by apps and packages
└── tailwind.config.js          # Base Tailwind config (optional, apps can have their own or extend this)
```

## 5. Shared Packages Design (`packages/`)

### 5.1 `packages/api-client`

*   **Purpose:** Provide a consistent, reusable function or class for making requests to the Go backend API.
*   **Implementation:**
    *   Exports a primary function (e.g., `apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T>`).
    *   Reads `NEXT_PUBLIC_API_BASE_URL` from the environment (must be set in *each app's* `.env.local`).
    *   Handles prepending the base URL to the endpoint.
    *   Sets default headers like `Accept: application/json`. Sets `Content-Type: application/json` for relevant methods (POST, PUT, PATCH).
    *   Uses native `fetch`.
    *   Checks `response.ok`. If not ok, attempts to parse JSON error response from backend (matching `ErrorResponseDTO` from `packages/types`), otherwise throws a generic HTTP error.
    *   Parses successful JSON response.
    *   **Does not** manage authentication tokens; callers (services, actions) must add the `Authorization` header when required.
*   **`package.json`:** Minimal dependencies, possibly includes type definitions from `packages/types`.

### 5.2 `packages/types`

*   **Purpose:** Centralize TypeScript definitions that correspond to the Go backend's API DTOs and potentially any shared simple domain concepts used across frontends.
*   **Implementation:**
    *   Contains interface/type definitions (e.g., `AudioTrackDTO`, `UserDTO`, `LoginRequestDTO`, `AuthResponseDTO`, `PaginatedResponseDTO`, `ErrorResponseDTO`).
    *   These types ensure consistency when making API calls and handling responses in both frontend apps.
    *   Could be manually maintained or generated from the Go backend's OpenAPI specification using tools like `openapi-typescript`.
*   **`package.json`:** Typically only has `devDependencies` like `typescript`.

### 5.3 `packages/ui`

*   **Purpose:** House fundamental, reusable UI components styled with Tailwind, ensuring visual consistency.
*   **Implementation:**
    *   Exports primitive components: `Button`, `Input`, `Card`, `Modal`, `Spinner`, `Checkbox`, `Select`, etc.
    *   Components are built using React and Tailwind utility classes.
    *   Designed to be flexible and composable.
    *   Can include both Server and Client Components (`'use client'`). Client components are necessary for anything with event handlers or internal state.
    *   May include a `globals.css` file with `@tailwind` directives and base CSS variable definitions if needed, which consuming apps would import into their own global CSS.
*   **`package.json`:** Dependencies include `react`, `tailwindcss`, potentially `clsx`/`tailwind-merge`.

### 5.4 `packages/utils`

*   **Purpose:** Store generic helper functions reusable across both applications.
*   **Implementation:** Exports pure functions for tasks like:
    *   Date/time formatting (e.g., `formatDuration(ms: number)`).
    *   String manipulation (e.g., `truncateText(text: string, length: number)`).
    *   Number formatting.
    *   Debounce/throttle functions.
*   **`package.json`:** Minimal dependencies.

### 5.5 `packages/auth` (Optional Shared Auth Logic)

*   **Purpose:** Consolidate logic related to session management if it's sufficiently complex and identical between apps (e.g., encryption/decryption algorithms).
*   **Implementation:** Could export functions like `encryptSessionData`, `decryptAndValidateSession`, possibly using `iron-session`. It would *not* handle the HTTP request/response or cookie setting itself, as that's tied to Route Handlers within each app. Could also contain shared JWT verification logic if needed outside the main auth flow.
*   **Usage:** Imported by `middleware.ts` and `app/api/auth/session/route.ts` in both apps. *Consider if the complexity warrants a separate package vs. slightly duplicated logic in each app's `_lib/auth.ts`.*

### 5.6 `packages/query-client` (Optional Shared Query Config)

*   **Purpose:** Ensure both applications use the same TanStack Query `QueryClient` instance or default configuration, promoting consistent caching behavior.
*   **Implementation:**
    *   Exports a singleton `queryClient` instance (`new QueryClient({ defaultOptions: { ... } })`). Default options might include standard `staleTime`, `gcTime` (cache time), retry logic.
    *   Optionally exports a `QueryProvider` component that wraps `QueryClientProvider` from `@tanstack/react-query` with the shared `queryClient`.
*   **Usage:** Each app's root layout (`apps/*/app/layout.tsx`) imports and uses the `QueryProvider` (or the `queryClient` directly with the library provider) to make the client available to all Client Components within that app.

## 6. Application-Specific Design (`apps/`)

### 6.1 User Application (`apps/user-app`)

*   **6.1.1 Purpose & Scope:** Primary interface for language learners focusing on audio discovery, playback, and interaction.
*   **6.1.2 Key Features & Components:**
    *   **Authentication:** Email/Password & Google login forms (`_components/auth`), profile page (`app/(main)/profile/page.tsx`). Uses shared `api-client`, `types`, `authActions`. Client state via `_context/AuthContext.tsx`.
    *   **Audio Discovery:** Track/Collection lists (`app/(main)/tracks/page.tsx`, `app/(main)/collections/page.tsx`), search functionality. Uses Server Components + `_services/trackService.ts`, `_services/collectionService.ts`. Client-side filtering might use TanStack Query via hooks in `_hooks`. UI in `_components/track`, `_components/collection`.
    *   **Audio Player:** The central interactive element. Uses `_stores/playerStore.ts` (Zustand) for complex state/logic, `_components/player` for UI. Implements hybrid playback.
    *   **User Activity:** Playback progress recording (via `userActivityActions.recordProgressAction`), bookmark creation/listing/deletion (via `userActivityActions`, `/bookmarks/page.tsx`, `_components/player`, `_components/track`). Client data often managed by TanStack Query (`_hooks/useUserProgressQuery`, `_hooks/useBookmarksQuery`).
*   **6.1.3 Authentication Flow:** User interacts with `_components/auth/LoginForm` -> Triggers `_actions/authActions.loginAction` -> Action calls Go API via shared `apiClient` -> Action calls `app/api/auth/session/route.ts` (POST) -> Route Handler (potentially using shared `packages/auth` logic) sets secure `httpOnly` cookie -> Action returns result -> Client (`AuthContext` might refresh state via `GET /api/auth/session`) -> `middleware.ts` allows access based on cookie. Google flow is similar, starting with client redirect, ending with `googleCallbackAction`.
*   **6.1.4 Audio Player Implementation (Zustand Store):**
    *   `_stores/playerStore.ts`: Defines the Zustand store state (`currentTrackDetails`, `playbackState`, `isStreamingMode`, `currentTime`, `duration`, `bufferedTime`, `volume`, `isLoading`, `error`, references to `AudioContext`, `GainNode`, current source node). Defines actions (`loadAndPlayTrack`, `play`, `pause`, `seek`, `setVolume`, internal methods for switching modes, handling audio events).
    *   `loadAndPlayTrack` action: Fetches details using `trackService`, determines mode (WAAPI vs. streaming) based on duration threshold (from `_lib/constants.ts`), performs necessary setup (fetch buffer/decode or set `<audio src>`), connects source node, updates state.
    *   `_components/player/PlayerUI.tsx`: Client component, subscribes to the `playerStore` using `usePlayerStore()`. Renders controls based on store state. Includes the hidden `<audio>` element whose `ref` is potentially managed by or passed to the store actions. Dispatches actions to the store on user interaction.
    *   Root Layout (`apps/user-app/app/layout.tsx`): Implicitly provides the Zustand store (no provider needed).
*   **6.1.5 Client Data Fetching (TanStack Query):**
    *   Used for data that benefits from client-side caching, background updates, or complex state management beyond initial server load. Examples: fetching user progress for the *currently playing* track, fetching bookmarks *for the current track* when displayed, potentially user profile data if frequently accessed/updated client-side.
    *   Custom hooks (`_hooks/useTrackProgressQuery`, `_hooks/useBookmarksQuery`) encapsulate `useQuery` calls, defining query keys (e.g., `['progress', userId, trackId]`) and using fetcher functions from `_services`.
    *   Components use these hooks for data and state (`isLoading`, `isError`).

### 6.2 Admin Panel Application (`apps/admin-panel`)

*   **6.2.1 Purpose & Scope:** Internal tool for administrators managing users, content, etc. Functionality over aesthetics (though consistency via `packages/ui` is good).
*   **6.2.2 Key Features & Components:**
    *   **Authentication/Authorization:** Simple login form (`app/login/page.tsx`). **Critical:** `middleware.ts` must verify admin role after authentication. Session management via `app/api/auth/session/route.ts`.
    *   **Data Management:** CRUD interfaces for Users, Tracks, Collections. Typically implemented using data tables (`_components/admin/DataTable` - possibly using `tanstack/react-table`) and forms (`_components/admin/ResourceForm` - possibly using `react-hook-form`), located in `apps/admin-panel/_components/`.
    *   **Content Upload:** Workflow for uploading audio files and creating associated metadata (likely involves `_components/admin/UploadForm` and `ResourceForm`).
    *   **State:** Minimal global state. **TanStack Query** heavily used for managing server state (lists, individual resource data for editing). Local state (`useState`) for form inputs, table filters/sorting. Server Action state via `useActionState`, `useFormStatus`.
*   **6.2.3 Authentication & Authorization Flow:** Admin interacts with Login Form -> `adminAuthActions.loginAction` -> Go API (potentially separate admin login endpoint) -> Session Route Handler sets *admin* session cookie (must contain role/permission indicator) -> `middleware.ts` verifies session cookie AND admin role on subsequent requests to protected `/admin/*` routes.
*   **6.2.4 Data Management Implementation (TanStack Query):**
    *   List pages (`/users`, `/tracks`) use Server Components for initial structure and potentially initial data load.
    *   `DataTable` component (`'use client'`) fetches list data using `useQuery` (via custom hook like `_hooks/useAdminUsersQuery(filters, pagination)`). Handles client-side interactions (sorting, filtering, page changes) by updating query parameters passed to `useQuery`, which automatically refetches.
    *   Edit pages/forms (`/tracks/[trackId]`) use `useQuery` (via `_hooks/useAdminTrackQuery(trackId)`) to fetch the specific resource data.
    *   Create/Update/Delete forms/buttons trigger Server Actions. These actions perform mutations via `apiClient`. The calling component can use `useMutation` to wrap the action call, manage pending/error states, and invalidate relevant TanStack Query caches on success using `queryClient.invalidateQueries({ queryKey: ['admin', 'tracks'] })` or similar.

## 7. Key Workflows (Cross-App Examples)

*   **7.1 User Login (User App):** `apps/user-app/_components/auth/LoginForm` -> `apps/user-app/_actions/authActions.loginAction` -> `packages/api-client` -> Go API -> `apps/user-app/app/api/auth/session/route.ts` -> Cookie Set.
*   **7.2 Loading/Playing Audio (User App - Zustand):** `apps/user-app/_components/player/PlayerUI` Interaction -> `apps/user-app/_stores/playerStore.loadAndPlayTrack` -> `apps/user-app/_services/trackService.getTrackDetails` -> `packages/api-client` -> Go API -> Store updates state -> `PlayerUI` re-renders.
*   **7.3 Creating Bookmark (User App):** `apps/user-app/_components/player/PlayerUI` Interaction -> `apps/user-app/_actions/userActivityActions.createBookmarkAction` -> `packages/api-client` -> Go API -> Action calls `revalidateTag('bookmarks')` -> Client TanStack Query cache for bookmarks (`useBookmarksQuery`) might be invalidated or refetch automatically.
*   **7.4 Admin Viewing/Filtering Tracks (Admin Panel - TanStack Query):** Navigate to `apps/admin-panel/app/(admin)/tracks/page.tsx` -> Server Component renders layout -> `apps/admin-panel/_components/admin/DataTable` (`'use client'`) mounts -> `apps/admin-panel/_hooks/useAdminTracksQuery` (wraps `useQuery`) called -> Hook calls `apps/admin-panel/_services/adminTrackService.listTracks` -> Service uses `packages/api-client` -> Go API -> Data returned, cached by TanStack Query, table renders -> Admin applies filter -> Filter state changes -> `useAdminTracksQuery` hook re-runs with new filter param -> TanStack Query refetches -> Table updates.
*   **7.5 Admin Editing Track Metadata (Admin Panel):** `apps/admin-panel/_components/admin/ResourceForm` (`'use client'`) -> Form submission triggers `apps/admin-panel/_actions/adminTrackActions.updateTrackAction` -> Action calls Go API via `packages/api-client` -> Action calls `revalidateTag('admin-tracks')` -> Client uses `useMutation`'s `onSuccess` to call `queryClient.invalidateQueries({ queryKey: ['admin', 'tracks'] })` -> TanStack Query refetches list data, potentially specific track data -> UI updates.
*   **7.6 Admin Uploading New Track (Admin Panel):** `apps/admin-panel/_components/admin/UploadForm` -> `requestUploadAction` -> Go API -> Client uploads to Storage -> `apps/admin-panel/_components/admin/ResourceForm` -> `createTrackMetadataAction` -> Go API -> `revalidateTag('admin-tracks')` / `queryClient.invalidateQueries`.

## 8. Non-Functional Considerations

### 8.1 Security (Shared & Specific)

*   **Shared:** Input validation (DTOs, Server Actions), prevention of XSS (React defaults, careful with specific rendering), secure secret management (env vars per app). Dependency scanning.
*   **User App:** Standard user session security (secure `httpOnly` cookies), protection against CSRF (Server Actions help, verify), standard OAuth 2.0 implementation security (state parameter, PKCE if applicable, ID token validation).
*   **Admin Panel:** **Stricter Access Control.** Middleware *must* enforce admin role/permissions based on session data. Backend API endpoints callable only by admins *must* re-verify permissions. Consider network-level restrictions (IP whitelisting, VPN) for admin access. Protect against brute-force login attempts. Implement audit logging for sensitive admin actions.

### 8.2 Performance (Shared & Specific)

*   **Shared:** Utilize Server Components, Next.js caching (`fetch`), code splitting, image/font optimization. Use shared `packages/ui` efficiently.
*   **User App:** Optimize audio player start time and streaming (hybrid approach, CDN). Minimize bundle size for initial load. Efficient state updates (Zustand). Optimize TanStack Query usage (sensible `staleTime`/`gcTime`).
*   **Admin Panel:** Optimize rendering large datasets (virtualization in tables if needed). Ensure efficient TanStack Query fetching/caching for admin data views. Optimize form submission speed.

### 8.3 Error Handling & Loading States

*   **Shared:** Use Next.js `error.tsx`/`global-error.tsx` for rendering errors. Shared `packages/httputil` or similar for consistent API error responses. Shared `packages/ui` for loading indicators (spinners, skeletons).
*   **Client Components:** Leverage TanStack Query's `isLoading`, `isFetching`, `isError`, `error` states for data fetching. Use `useActionState`, `useFormStatus` for Server Action feedback. Provide clear user feedback for all operations (toasts, inline messages).
*   **Logging:** Implement structured logging in both apps, potentially using a shared logging configuration or utility, ensuring request IDs are tracked.

### 8.4 Accessibility (a11y)

*   Ensure semantic HTML is used in both apps and shared components.
*   Focus management, keyboard navigation must be robust, especially for the User App's player and the Admin Panel's forms/tables.
*   Use ARIA attributes appropriately.
*   Maintain sufficient color contrast.
*   Utilize accessibility linting tools.

### 8.5 Testing Strategy (Monorepo)

*   **Unit Tests (Jest/Vitest + RTL):**
    *   Test shared packages (`api-client`, `utils`, `ui`, `auth`, `query-client`) independently within their respective `packages/*` directories.
    *   Test app-specific components, hooks, stores (`Zustand`), contexts, and actions within `apps/user-app` and `apps/admin-panel`. Mock imports from `packages/*` or other app modules as needed. Mock TanStack Query client/hooks for components that use them.
*   **Integration Tests (RTL):**
    *   Test interactions *within* each application. For components using TanStack Query, wrap them in a test `QueryClientProvider`. Mock Server Actions or the `apiClient` directly for components triggering mutations or fetches. Test Zustand store interactions.
*   **End-to-End Tests (Cypress/Playwright):**
    *   Maintain separate E2E test suites for `user-app` and `admin-panel`.
    *   Run tests against a deployed or locally running version of the *entire system* (both frontend apps + backend API + dependencies).
    *   Focus on critical user flows (login, playback, bookmarking for user app; login, CRUD operations for admin panel).
*   **Tooling:** Configure testing frameworks (Jest/Vitest, RTL, Cypress/Playwright) at the monorepo root or within each app, ensuring they can resolve dependencies correctly. Monorepo tools (Turborepo/Nx) can help run tests efficiently across packages/apps.

## 9. Monorepo Tooling & Build Process

*   **Tool Choice:** Select and configure a tool like `pnpm workspaces`, `yarn workspaces`, `npm workspaces`, Turborepo, or Nx. `pnpm` is often favored for efficient disk usage. Turborepo/Nx add build caching and task orchestration capabilities.
*   **Dependency Management:** Use the chosen tool's commands to add/remove/update dependencies for specific apps or packages (`pnpm add <dep> --filter <app-or-package-name>`).
*   **Root `package.json` Scripts:** Define scripts for common tasks:
    *   `dev`: `turbo dev` or `pnpm -r --parallel dev` to run dev servers for both apps.
    *   `build`: `turbo build` or `pnpm -r build` to build both apps for production.
    *   `lint`: Run ESLint/Prettier across the codebase.
    *   `test`: Run unit/integration tests across the codebase.
    *   `typecheck`: Run `tsc --noEmit` across the codebase.
*   **Build/Deployment:** CI/CD pipelines need to:
    *   Install dependencies using the monorepo tool (`pnpm install`).
    *   Build the specific application being deployed (e.g., `turbo build --filter=user-app`). Tooling helps ensure shared dependencies are built correctly.
    *   Deploy the built output for that specific application (`apps/user-app/.next` or `apps/admin-panel/.next`) to its target environment (e.g., Cloud Run). Trigger deployments based on changes in the relevant app directory or its dependent packages.

## 10. Future Considerations

*   **(Shared):** Develop a more comprehensive shared Design System (`packages/ui`). Enhance shared utilities. Formalize internal package versioning.
*   **(User App):** Implement offline support (PWA), transcription display/sync, real-time features, advanced audio effects.
*   **(Admin Panel):** Add role/permission management UI, analytics dashboard, audit trails, content moderation tools, bulk actions.
*   **(Monorepo):** Optimize build times and CI/CD pipelines further using advanced Turborepo/Nx features if adopted.