Okay, here is a consolidated documentation guide for configuring Tailwind CSS v4 in your monorepo project, incorporating the lessons learned and best practices based on the official v4 documentation and our troubleshooting.

---

## Tailwind CSS v4 Configuration Guide for Language Player Monorepo

**Version:** 1.0
**Date:** 2024-XX-XX (Update as needed)

### 1. Introduction

This document outlines the standard configuration for Tailwind CSS v4 within this monorepo (`language-player-monorepo`). Tailwind v4 introduces significant changes from v3, primarily adopting a **CSS-first configuration** approach. This guide serves as a reference to ensure consistency and avoid common pitfalls encountered during the upgrade or setup process.

Key principles of the v4 setup in this project:

*   **CSS-First Theme:** Shared theme tokens (colors, spacing variables, fonts, etc.) are defined directly in CSS using the `@theme` directive.
*   **Simplified Imports:** Tailwind's core styles are included via a standard CSS `@import "tailwindcss";`.
*   **Centralized Shared Styles:** The `@repo/ui` package contains the primary Tailwind configuration (`theme.css`, `globals.css`) shared across applications.
*   **Minimal App Configs:** Application-level `tailwind.config.ts` files are minimal, focusing only on content scanning and app-specific plugins.
*   **CSS Variables:** The theme is exposed as CSS variables, enabling easier use in custom CSS and JavaScript.
*   **`@utility` Directive:** Used for defining custom, variant-aware utility classes or component base styles.
*   **`@custom-variant`:** Used for defining custom variants or modifying existing ones (like `dark`).

### 2. Project Structure Overview

The relevant files are primarily located in:

*   **`packages/ui/src/`**: Contains the shared Tailwind setup.
    *   `globals.css`: Main entry point imported by apps. Handles Tailwind import, custom variants, and imports `theme.css`.
    *   `theme.css`: Defines the shared `@theme` (variables, keyframes) and `@layer base` styles (including dark mode overrides).
*   **`apps/user-app/` & `apps/admin-panel/`**: Individual Next.js applications.
    *   `tailwind.config.ts`: App-specific config (content paths, plugins).
    *   `postcss.config.mjs`: **Required in this project** for PostCSS integration.
    *   `app/globals.css`: Imports the shared UI CSS and contains app-specific global overrides.
    *   `app/layout.tsx`: Imports the app's `globals.css`.

### 3. Detailed File Configurations

#### 3.1. `packages/ui/src/theme.css`

*   **Purpose:** Defines the core shared theme variables and base HTML element styles.
*   **Key Contents:**
    *   **`@theme { ... }`**:
        *   **MUST** contain *only* CSS custom property definitions (e.g., `--background: ...;`, `--radius: ...;`) and `@keyframes` definitions.
        *   **DO NOT** place CSS selectors (like `html.dark`, `body`, etc.) inside `@theme`.
    *   **`@layer base { ... }`**:
        *   Define default styles for base HTML elements (e.g., `body`, `h1`, etc.) using standard CSS properties and `var(--variable-name)`.
        *   **Avoid `@apply`** in `@layer base` for setting simple defaults like background or text color; use direct CSS properties with variables (e.g., `background-color: var(--background);`).
        *   Define dark mode variable overrides using the appropriate selector (e.g., `html.dark { --background: ...; }`) **within** `@layer base`.
        *   Optionally set a default `border-color` for all elements (`*, ::before, ::after { border-color: var(--border); }`) if you want to mimic v3's behavior instead of v4's `currentColor` default. Explicitly adding `border-border` in HTML is often preferred.

*   **Example Snippet:**
    ```css
    /* packages/ui/src/theme.css */
    @theme {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --border: 240 5.9% 90%;
      --radius: 0.5rem;
      /* ... other variables */
      @keyframes --accordion-down { /* ... */ }
    }

    @layer base {
      body {
        background-color: var(--background);
        color: var(--foreground);
        /* ... other base body styles */
      }
      *, ::before, ::after {
        border-color: var(--border); /* Optional: Set default border color */
      }
      html.dark {
        --background: 240 10% 3.9%;
        --foreground: 0 0% 98%;
        --border: 240 3.7% 15.9%;
        /* ... other dark mode variables */
      }
    }
    ```

#### 3.2. `packages/ui/src/globals.css`

*   **Purpose:** The main shared CSS entry point imported by applications. Orchestrates the inclusion of Tailwind core, custom variants, and the theme definition.
*   **Key Contents:**
    *   **`@import "tailwindcss";`**: **MUST** be the very first line. Includes Tailwind's base, components, and utilities layers.
    *   **`@custom-variant dark (&:where(.dark, .dark *));`**: Defines the `dark:` variant to work with the `dark` class on ancestor elements (required for `darkMode: "class"` strategy). Place this *after* the main Tailwind import.
    *   **`@import "./theme.css";`**: Imports the variables and base styles defined in `theme.css`.
    *   **Optional `@utility`**: Define custom, variant-aware utility classes or component base styles here if they are shared across applications.
    *   **Optional `@layer components`/`@layer utilities`**: Use sparingly for standard CSS rules that don't need variant processing, or for third-party overrides. Avoid defining variant-aware "utilities" here – use `@utility` instead.

*   **Example Snippet:**
    ```css
    /* packages/ui/src/globals.css */
    @import "tailwindcss"; /* MUST BE FIRST */

    @custom-variant dark (&:where(.dark, .dark *));

    @import "./theme.css";

    /* Optional: Define shared custom utilities */
    /* @utility fancy-border { ... } */
    ```

#### 3.3. `apps/*/tailwind.config.ts` (User App & Admin Panel)

*   **Purpose:** Configures Tailwind specifically for each application.
*   **Key Contents:**
    *   **`content`**: Array of glob patterns specifying **all** files containing Tailwind classes *within this app* AND *within the shared UI package*. Crucial for class detection.
    *   **`darkMode: "class"`**: Enables class-based dark mode switching.
    *   **`plugins: [...]`**: Array of any Tailwind plugins required *specifically by this app*.
    *   **NO `theme` or `theme.extend` block.**

*   **Example Snippet:**
    ```ts
    // apps/user-app/tailwind.config.ts
    import type { Config } from "tailwindcss";
    const config: Pick<Config, "content" | "darkMode" | "plugins"> = {
      darkMode: "class",
      content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./_components/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Path to shared UI
      ],
      plugins: [ require('@tailwindcss/typography') ], // App-specific plugins
    };
    export default config;
    ```

#### 3.4. `apps/*/postcss.config.mjs` (User App & Admin Panel)

*   **Purpose:** Integrates Tailwind v4 into the PostCSS build process used by Next.js.
*   **Requirement:** Although often handled implicitly by Next.js, this project setup requires this file for styles to be processed correctly.
*   **Key Contents:** Minimal configuration enabling the Tailwind PostCSS plugin.

*   **Example Snippet:**
    ```mjs
    // apps/user-app/postcss.config.mjs (and admin-panel)
    export default {
      plugins: {
        "@tailwindcss/postcss": {},
      },
    };
    ```

#### 3.5. `apps/*/app/globals.css` (User App & Admin Panel)

*   **Purpose:** Application-specific global styles and overrides.
*   **Key Contents:**
    *   **`@import "@repo/ui/src/globals.css";`**: **MUST** be the very first line. Imports the shared setup (Tailwind core, theme variables, base styles, dark mode).
    *   **App-Specific CSS:** Any standard CSS rules needed globally *only* for this application should follow the `@import`. These rules can use the CSS variables defined in the shared theme (e.g., `background: var(--background)`).

*   **Example Snippet:**
    ```css
    /* apps/user-app/app/globals.css */
    @import "@repo/ui/src/globals.css"; /* MUST BE FIRST */

    /* App-specific overrides or global styles */
    .user-app-specific-widget {
      border-color: var(--primary);
    }
    ::-webkit-scrollbar { /* ... */ }
    ```

#### 3.6. `apps/*/app/layout.tsx` (User App & Admin Panel)

*   **Purpose:** Root layout for the application.
*   **Requirement:** Must import the application's `globals.css` file (e.g., `import '@/app/globals.css';`). Ensure dark mode class toggling logic is implemented here if needed (adding/removing `dark` class on `<html>`).

### 4. Key Differences from v3 (Summary)

| Feature                 | Tailwind v3                                        | Tailwind v4                                                                 | Notes                                                                   |
| :---------------------- | :------------------------------------------------- | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **Core Import**         | `@tailwind base; @tailwind components; ...`        | `@import "tailwindcss";`                                                     | Single import line.                                                     |
| **Configuration File**  | `tailwind.config.js` (JS Object)                   | Primarily CSS (`@theme`, `@utility`, etc.). JS config optional via `@config`. | CSS-first approach. Theme defined via CSS variables.                    |
| **Theme Definition**    | `theme: { colors: ..., spacing: ... }` in JS config | `--color-red-500: ...; --spacing-4: 1rem;` inside `@theme` in CSS.         | Theme defined using CSS custom properties.                              |
| **Dark Mode**           | `darkMode: 'class'` in JS config                   | `darkMode: 'class'` in JS config + `@custom-variant dark (...)` in CSS.     | Requires CSS definition for the `dark:` variant selector.               |
| **Custom Utilities**    | `@layer utilities { .custom-util { ... } }`        | `@utility custom-util { ... }`                                              | `@utility` ensures variant support and correct layer placement.       |
| **Component Base**      | `@layer components { .btn { @apply ... } }`        | `@utility btn { @apply ... }` or direct CSS with `var()`.                   | Use `@utility` for variant-aware component bases.                       |
| **PostCSS Plugin Pkg**  | `tailwindcss`                                      | `@tailwindcss/postcss`                                                      | Plugin extracted to a separate package.                                 |
| **Other PostCSS Tools** | Often needed `postcss-import`, `autoprefixer`      | Built-in import handling & prefixing (via Lightning CSS).                   | Simpler PostCSS config.                                                 |
| **`theme()` function**  | `theme('colors.red.500')`                          | `var(--color-red-500)` or `theme('--color-red-500')` (for media queries)    | Prefer CSS `var()`. `theme()` syntax changed for variable names.      |
| **Default Border**      | `gray-200` (configurable)                          | `currentColor`                                                              | Explicitly add `border-border` or override base layer if needed.        |
| **Default Ring Color**  | `blue-500` (configurable)                          | `currentColor` (via `--default-ring-color`, which defaults to currentColor) | Explicitly add `ring-blue-500` or configure `--default-ring-color`.     |
| **Default Ring Width**  | `3px` (for `ring` class)                           | `1px` (via `--default-ring-width`)                                        | Use `ring-3` for old behavior or configure `--default-ring-width`.      |
| **Hover on Mobile**     | Applied on tap                                     | Only applies if device supports hover (`@media (hover: hover)`)             | Override `@custom-variant hover` for old behavior if absolutely needed. |
| **Deprecated Utils**    | `bg-opacity-*`, `flex-shrink-*`, etc.              | Removed                                                                     | Use modern alternatives (`bg-black/50`, `shrink-*`, etc.).              |

### 5. Troubleshooting

*   **Styles Not Applying:**
    *   **Clear Caches:** Delete `.next`, `.turbo`, `node_modules` folders, run `pnpm install`, restart dev server.
    *   **Verify `content` Paths:** Ensure `tailwind.config.ts` in the specific app correctly points to all `.tsx`, `.jsx`, `.ts`, `.js` files using Tailwind classes, **including the path to `packages/ui/src`**.
    *   **Check CSS Imports:** Ensure `@import "tailwindcss";` is the absolute first line in `packages/ui/src/globals.css`. Ensure the app's `globals.css` imports `@repo/ui/src/globals.css` first. Ensure the app's `layout.tsx` imports the app's `globals.css`.
    *   **Verify `postcss.config.mjs`:** Confirm this file exists in each app's root and contains the correct minimal configuration.
    *   **Browser DevTools:** Inspect elements. Are the Tailwind classes present? Are the CSS variables defined in `:root` / `html.dark`? Are expected styles being overridden?
*   **Build Errors:**
    *   **`@theme` Syntax:** Ensure only CSS variables (`--name: value;`) and `@keyframes` are inside `@theme`. No selectors.
    *   **Plugin Issues:** Ensure plugins listed in `tailwind.config.ts` are installed.

---