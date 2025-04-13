# language-player-monorepo 代码库

*通过 combine_code.py 自动生成*

## 目录

- [.cursor/rules/enforce-tailwind-v4-eslint-v9-flat-config.mdc](#-cursor-rules-enforce-tailwind-v4-eslint-v9-flat-config-mdc)
- [apps/admin-panel/.env.local](#apps-admin-panel--env-local)
- [apps/admin-panel/_actions/adminAuthActions.ts](#apps-admin-panel-_actions-adminAuthActions-ts)
- [apps/admin-panel/_actions/adminCollectionActions.ts](#apps-admin-panel-_actions-adminCollectionActions-ts)
- [apps/admin-panel/_actions/adminTrackActions.ts](#apps-admin-panel-_actions-adminTrackActions-ts)
- [apps/admin-panel/_actions/adminUserActions.ts](#apps-admin-panel-_actions-adminUserActions-ts)
- [apps/admin-panel/_components/admin/DataTable.tsx](#apps-admin-panel-_components-admin-DataTable-tsx)
- [apps/admin-panel/_components/admin/ResourceActions.tsx](#apps-admin-panel-_components-admin-ResourceActions-tsx)
- [apps/admin-panel/_components/admin/ResourceForm.tsx](#apps-admin-panel-_components-admin-ResourceForm-tsx)
- [apps/admin-panel/_components/auth/AdminLoginForm.tsx](#apps-admin-panel-_components-auth-AdminLoginForm-tsx)
- [apps/admin-panel/_components/layout/AdminHeader.tsx](#apps-admin-panel-_components-layout-AdminHeader-tsx)
- [apps/admin-panel/_components/layout/AdminSidebar.tsx](#apps-admin-panel-_components-layout-AdminSidebar-tsx)
- [apps/admin-panel/_hooks/useAdminCollections.ts](#apps-admin-panel-_hooks-useAdminCollections-ts)
- [apps/admin-panel/_hooks/useAdminTracks.ts](#apps-admin-panel-_hooks-useAdminTracks-ts)
- [apps/admin-panel/_hooks/useAdminUsers.ts](#apps-admin-panel-_hooks-useAdminUsers-ts)
- [apps/admin-panel/_services/adminCollectionService.ts](#apps-admin-panel-_services-adminCollectionService-ts)
- [apps/admin-panel/_services/adminTrackService.ts](#apps-admin-panel-_services-adminTrackService-ts)
- [apps/admin-panel/_services/adminUserService.ts](#apps-admin-panel-_services-adminUserService-ts)
- [apps/admin-panel/app/(admin)/collections/page.tsx](#apps-admin-panel-app-(admin)-collections-page-tsx)
- [apps/admin-panel/app/(admin)/layout.tsx](#apps-admin-panel-app-(admin)-layout-tsx)
- [apps/admin-panel/app/(admin)/page.tsx](#apps-admin-panel-app-(admin)-page-tsx)
- [apps/admin-panel/app/(admin)/tracks/[trackId]/edit/page.tsx](#apps-admin-panel-app-(admin)-tracks-[trackId]-edit-page-tsx)
- [apps/admin-panel/app/(admin)/tracks/new/page.tsx](#apps-admin-panel-app-(admin)-tracks-new-page-tsx)
- [apps/admin-panel/app/(admin)/tracks/page.tsx](#apps-admin-panel-app-(admin)-tracks-page-tsx)
- [apps/admin-panel/app/(admin)/users/page.tsx](#apps-admin-panel-app-(admin)-users-page-tsx)
- [apps/admin-panel/app/api/auth/session/route.ts](#apps-admin-panel-app-api-auth-session-route-ts)
- [apps/admin-panel/app/globals.css](#apps-admin-panel-app-globals-css)
- [apps/admin-panel/app/layout.tsx](#apps-admin-panel-app-layout-tsx)
- [apps/admin-panel/app/login/page.tsx](#apps-admin-panel-app-login-page-tsx)
- [apps/admin-panel/app/page.tsx](#apps-admin-panel-app-page-tsx)
- [apps/admin-panel/eslint.config.mjs](#apps-admin-panel-eslint-config-mjs)
- [apps/admin-panel/middleware.ts](#apps-admin-panel-middleware-ts)
- [apps/admin-panel/next.config.ts](#apps-admin-panel-next-config-ts)
- [apps/admin-panel/package.json](#apps-admin-panel-package-json)
- [apps/admin-panel/postcss.config.mjs](#apps-admin-panel-postcss-config-mjs)
- [apps/admin-panel/tailwind.config.ts](#apps-admin-panel-tailwind-config-ts)
- [apps/admin-panel/tsconfig.json](#apps-admin-panel-tsconfig-json)
- [apps/user-app/.env.local](#apps-user-app--env-local)
- [apps/user-app/_actions/authActions.ts](#apps-user-app-_actions-authActions-ts)
- [apps/user-app/_actions/collectionActions.ts](#apps-user-app-_actions-collectionActions-ts)
- [apps/user-app/_actions/uploadActions.ts](#apps-user-app-_actions-uploadActions-ts)
- [apps/user-app/_actions/userActivityActions.ts](#apps-user-app-_actions-userActivityActions-ts)
- [apps/user-app/_components/activity/BookmarkList.tsx](#apps-user-app-_components-activity-BookmarkList-tsx)
- [apps/user-app/_components/auth/GoogleSignInButton.tsx](#apps-user-app-_components-auth-GoogleSignInButton-tsx)
- [apps/user-app/_components/auth/LoginForm.tsx](#apps-user-app-_components-auth-LoginForm-tsx)
- [apps/user-app/_components/auth/RegisterForm.tsx](#apps-user-app-_components-auth-RegisterForm-tsx)
- [apps/user-app/_components/collection/CollectionCard.tsx](#apps-user-app-_components-collection-CollectionCard-tsx)
- [apps/user-app/_components/collection/CollectionForm.tsx](#apps-user-app-_components-collection-CollectionForm-tsx)
- [apps/user-app/_components/collection/CollectionList.tsx](#apps-user-app-_components-collection-CollectionList-tsx)
- [apps/user-app/_components/collection/CollectionTrackList.tsx](#apps-user-app-_components-collection-CollectionTrackList-tsx)
- [apps/user-app/_components/collection/CollectionTrackSelector.tsx](#apps-user-app-_components-collection-CollectionTrackSelector-tsx)
- [apps/user-app/_components/layout/Footer.tsx](#apps-user-app-_components-layout-Footer-tsx)
- [apps/user-app/_components/layout/Navbar.tsx](#apps-user-app-_components-layout-Navbar-tsx)
- [apps/user-app/_components/player/AddBookmarkButton.tsx](#apps-user-app-_components-player-AddBookmarkButton-tsx)
- [apps/user-app/_components/player/PlayerUI.tsx](#apps-user-app-_components-player-PlayerUI-tsx)
- [apps/user-app/_components/track/PlayTrackButton.tsx](#apps-user-app-_components-track-PlayTrackButton-tsx)
- [apps/user-app/_components/track/TrackActivityClient.tsx](#apps-user-app-_components-track-TrackActivityClient-tsx)
- [apps/user-app/_components/track/TrackCard.tsx](#apps-user-app-_components-track-TrackCard-tsx)
- [apps/user-app/_components/track/TrackList.tsx](#apps-user-app-_components-track-TrackList-tsx)
- [apps/user-app/_components/ui/PaginationControls.tsx](#apps-user-app-_components-ui-PaginationControls-tsx)
- [apps/user-app/_context/AuthContext.tsx](#apps-user-app-_context-AuthContext-tsx)
- [apps/user-app/_hooks/useAuth.ts](#apps-user-app-_hooks-useAuth-ts)
- [apps/user-app/_hooks/useBookmarks.ts](#apps-user-app-_hooks-useBookmarks-ts)
- [apps/user-app/_lib/constants.ts](#apps-user-app-_lib-constants-ts)
- [apps/user-app/_services/collectionService.ts](#apps-user-app-_services-collectionService-ts)
- [apps/user-app/_services/trackService.ts](#apps-user-app-_services-trackService-ts)
- [apps/user-app/_services/userService.ts](#apps-user-app-_services-userService-ts)
- [apps/user-app/_stores/playerStore.ts](#apps-user-app-_stores-playerStore-ts)
- [apps/user-app/app/(auth)/login/page.tsx](#apps-user-app-app-(auth)-login-page-tsx)
- [apps/user-app/app/(auth)/register/page.tsx](#apps-user-app-app-(auth)-register-page-tsx)
- [apps/user-app/app/(main)/bookmarks/page.tsx](#apps-user-app-app-(main)-bookmarks-page-tsx)
- [apps/user-app/app/(main)/collections/[collectionId]/edit/page.tsx](#apps-user-app-app-(main)-collections-[collectionId]-edit-page-tsx)
- [apps/user-app/app/(main)/collections/[collectionId]/page.tsx](#apps-user-app-app-(main)-collections-[collectionId]-page-tsx)
- [apps/user-app/app/(main)/collections/new/page.tsx](#apps-user-app-app-(main)-collections-new-page-tsx)
- [apps/user-app/app/(main)/collections/page.tsx](#apps-user-app-app-(main)-collections-page-tsx)
- [apps/user-app/app/(main)/layout.tsx](#apps-user-app-app-(main)-layout-tsx)
- [apps/user-app/app/(main)/page.tsx](#apps-user-app-app-(main)-page-tsx)
- [apps/user-app/app/(main)/profile/page.tsx](#apps-user-app-app-(main)-profile-page-tsx)
- [apps/user-app/app/(main)/tracks/[trackId]/page.tsx](#apps-user-app-app-(main)-tracks-[trackId]-page-tsx)
- [apps/user-app/app/(main)/tracks/page.tsx](#apps-user-app-app-(main)-tracks-page-tsx)
- [apps/user-app/app/(main)/upload/page.tsx](#apps-user-app-app-(main)-upload-page-tsx)
- [apps/user-app/app/api/auth/session/route.ts](#apps-user-app-app-api-auth-session-route-ts)
- [apps/user-app/app/globals.css](#apps-user-app-app-globals-css)
- [apps/user-app/app/layout.tsx](#apps-user-app-app-layout-tsx)
- [apps/user-app/app/page.tsx](#apps-user-app-app-page-tsx)
- [apps/user-app/eslint.config.mjs](#apps-user-app-eslint-config-mjs)
- [apps/user-app/middleware.ts](#apps-user-app-middleware-ts)
- [apps/user-app/next.config.ts](#apps-user-app-next-config-ts)
- [apps/user-app/package.json](#apps-user-app-package-json)
- [apps/user-app/postcss.config.mjs](#apps-user-app-postcss-config-mjs)
- [apps/user-app/tailwind.config.ts](#apps-user-app-tailwind-config-ts)
- [apps/user-app/tsconfig.json](#apps-user-app-tsconfig-json)
- [combine_code.py](#combine_code-py)
- [package.json](#package-json)
- [packages/api-client/package.json](#packages-api-client-package-json)
- [packages/api-client/src/index.ts](#packages-api-client-src-index-ts)
- [packages/api-client/tsconfig.json](#packages-api-client-tsconfig-json)
- [packages/auth/package.json](#packages-auth-package-json)
- [packages/auth/src/index.ts](#packages-auth-src-index-ts)
- [packages/auth/src/session.ts](#packages-auth-src-session-ts)
- [packages/auth/tsconfig.json](#packages-auth-tsconfig-json)
- [packages/eslint-config/index.mjs](#packages-eslint-config-index-mjs)
- [packages/eslint-config/package.json](#packages-eslint-config-package-json)
- [packages/query-client/package.json](#packages-query-client-package-json)
- [packages/query-client/src/index.tsx](#packages-query-client-src-index-tsx)
- [packages/query-client/tsconfig.json](#packages-query-client-tsconfig-json)
- [packages/tsconfig/base.json](#packages-tsconfig-base-json)
- [packages/tsconfig/package.json](#packages-tsconfig-package-json)
- [packages/types/package.json](#packages-types-package-json)
- [packages/types/src/index.ts](#packages-types-src-index-ts)
- [packages/types/tsconfig.json](#packages-types-tsconfig-json)
- [packages/ui/package.json](#packages-ui-package-json)
- [packages/ui/src/AlertDialog.tsx](#packages-ui-src-AlertDialog-tsx)
- [packages/ui/src/Badge.tsx](#packages-ui-src-Badge-tsx)
- [packages/ui/src/Button.tsx](#packages-ui-src-Button-tsx)
- [packages/ui/src/Card.tsx](#packages-ui-src-Card-tsx)
- [packages/ui/src/Checkbox.tsx](#packages-ui-src-Checkbox-tsx)
- [packages/ui/src/ErrorMessage.tsx](#packages-ui-src-ErrorMessage-tsx)
- [packages/ui/src/Input.tsx](#packages-ui-src-Input-tsx)
- [packages/ui/src/Label.tsx](#packages-ui-src-Label-tsx)
- [packages/ui/src/Link.tsx](#packages-ui-src-Link-tsx)
- [packages/ui/src/Progress.tsx](#packages-ui-src-Progress-tsx)
- [packages/ui/src/Select.tsx](#packages-ui-src-Select-tsx)
- [packages/ui/src/Spinner.tsx](#packages-ui-src-Spinner-tsx)
- [packages/ui/src/Textarea.tsx](#packages-ui-src-Textarea-tsx)
- [packages/ui/src/Tooltip.tsx](#packages-ui-src-Tooltip-tsx)
- [packages/ui/src/globals.css](#packages-ui-src-globals-css)
- [packages/ui/src/index.ts](#packages-ui-src-index-ts)
- [packages/ui/src/theme.css](#packages-ui-src-theme-css)
- [packages/ui/tsconfig.json](#packages-ui-tsconfig-json)
- [packages/utils/package.json](#packages-utils-package-json)
- [packages/utils/src/index.ts](#packages-utils-src-index-ts)
- [packages/utils/tsconfig.json](#packages-utils-tsconfig-json)
- [pnpm-workspace.yaml](#pnpm-workspace-yaml)

---

## `.cursor/rules/enforce-tailwind-v4-eslint-v9-flat-config.mdc`

```
---
description: 
globs: 
alwaysApply: true
---
---
description:
globs:
alwaysApply: true
---
# cursor_rule: enforce_project_tailwind_v4_eslint_v9_flat_config
rule: Enforce Project-Specific Tailwind v4 & ESLint v9 Flat Config Conventions
description: |
  Ensures frontend configuration files adhere to project standards for Tailwind CSS v4 and ESLint v9 Flat Config.
  References:
  - Tailwind CSS v4 Configuration Guide for Language Player Monorepo.md
  - updated_eslint_config_mjs.md
  - https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/

trigger: edit
when:
  language: [javascript, typescript, css, mjs]
  file_patterns:
    - "**/tailwind.config.{js,ts}"
    # - "**/postcss.config.mjs" # Removed: Project guide confirms this file IS needed.
    - "**/*globals.css"
    - "**/eslint.config.mjs"
    - "**/packages/eslint-config/index.mjs"
    - "**/packages/ui/src/theme.css"
    - "**/packages/ui/src/globals.css"

then:
  # ==========================
  # Tailwind v4 Checks
  # Based on: Tailwind CSS v4 Configuration Guide for Language Player Monorepo.md
  # ==========================
  - group: Tailwind CSS v4 Conventions

  - pattern: "@import\\s+\"tailwindcss\";"
    condition: # Check if it's NOT the first non-comment line
      not_match_line: 1 # Approximate check, assumes minimal comments before it
    message: |
      [Tailwind v4] `@import "tailwindcss";` MUST be the very first rule in `packages/ui/src/globals.css`.
    file_patterns: ["**/packages/ui/src/globals.css"]

  - pattern: "@tailwind\\s+(base|components|utilities);"
    message: |
      [Tailwind v4] Found legacy `@tailwind` directives. Replace `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;` with a single `@import "tailwindcss";` at the very top of `packages/ui/src/globals.css`.
    file_patterns: ["**/*globals.css"]

  - pattern: "@theme\\s*\\{[^}]*\\s+(body|html\\.dark|\\*|::before|::after)\\s*\\{" # Match CSS selectors inside @theme
    message: |
      [Tailwind v4] Found CSS selectors (like `body`, `html.dark`) inside the `@theme` block in `theme.css`. The `@theme` block should ONLY contain CSS custom property definitions (e.g., `--background: ...;`) and `@keyframes` definitions. Move CSS rules targeting elements to the `@layer base` block. (See project guide: `packages/ui/src/theme.css`)
    file_patterns: ["**/packages/ui/src/theme.css"]

  - pattern: ":root\\s*\\{[^}]*--[a-zA-Z\\-]+:" # Match CSS variable definitions outside @theme
    condition: # Only trigger if NOT inside an @theme block
      not_pattern: "@theme\\s*\\{[^}]*:root\\s*\\{[^}]*--[a-zA-Z\\-]+:[^}]*\\}"
    message: |
      [Tailwind v4] Found CSS variable definitions (like --background) potentially outside an `@theme` block in `globals.css` or `theme.css`. In Tailwind v4, custom theme values and CSS variables should be defined within `@theme { ... }` in `packages/ui/src/theme.css`. (See project guide)
    file_patterns: ["**/*globals.css", "**/packages/ui/src/theme.css"]

  - pattern: "\\s+theme:\\s*\\{\\s*(?!\\s*\\})\\s*[a-zA-Z]+:" # Match non-empty 'theme: {'
    condition: # Ignore if it only contains darkMode or plugins (or is empty)
      not_pattern: "theme:\\s*\\{\\s*(darkMode:|plugins:|\s*)\\s*\\}"
    message: |
      [Tailwind v4] Found theme customizations (colors, fonts, spacing, etc.) in `tailwind.config.ts`. In this project's v4 setup, these should be defined using CSS variables within `@theme` in `packages/ui/src/theme.css`. Keep only `content`, `darkMode`, and `plugins` in the application's `tailwind.config.ts`. (See project guide)
    file_patterns: ["**/tailwind.config.{js,ts}"]

  - pattern: "theme:\\s*\\{\\s*extend:\\s*\\{" # Match any 'theme.extend: {'
    message: |
      [Tailwind v4] Found `theme.extend` in `tailwind.config.ts`. In this project's v4 setup, extensions should generally be defined using CSS variables within `@theme` in `packages/ui/src/theme.css`. `theme.extend` is typically unnecessary unless required by a specific plugin (like keyframes/animations for `tailwindcss-animate`, though even those can go in `@theme`). Review if this block is needed. (See project guide)
    file_patterns: ["**/tailwind.config.{js,ts}"]

  # ====================================
  # ESLint v9 Flat Config Checks
  # Based on: updated_eslint_config_mjs.md & ESLint Docs/Blog
  # ====================================
  - group: ESLint v9 Flat Config Conventions

  - pattern: "FlatCompat"
    message: |
      [ESLint v9] Found `FlatCompat`. ESLint v9+ uses Flat Config natively. Refactor shared ESLint configs (`@repo/eslint-config`) to export a flat config array directly wrapped in `defineConfig`. App configs (`eslint.config.mjs`) should import this config and use `extends: [sharedConfig]` within `defineConfig` instead of using `FlatCompat`.
    file_patterns: ["**/eslint.config.mjs", "**/packages/eslint-config/index.mjs"]

  - pattern: "require\\(['\"]@repo/eslint-config"
    message: |
      [ESLint v9] Found `require('@repo/eslint-config')`. Use ESM `import eslintConfigRepo from '@repo/eslint-config';` in your `eslint.config.mjs` files. Ensure `@repo/eslint-config/index.mjs` uses `export default defineConfig([...])`.
    file_patterns: ["**/eslint.config.mjs"]

  - pattern: "\\.\\.\\.([a-zA-Z]+Config|[a-zA-Z]+)" # Match spreading of an imported config variable like ...eslintConfigRepo or ...reactConfig
    condition: # Allow spreading inside the array passed to defineConfig in the SHARED config, e.g. for tseslint
      not_pattern: "export\\s+default\\s+defineConfig\\(\\[\\s*\\.\\.\\."
      file_patterns: ["**/packages/eslint-config/index.mjs"]
    message: |
      [ESLint v9] Found direct spreading of an imported config array (`...eslintConfigRepo`) in an app's `eslint.config.mjs`. While technically possible, prefer using the `extends` property within `defineConfig` for better clarity and consistency: `defineConfig([{ extends: [eslintConfigRepo] }, { /* app overrides */ }])`. (See ESLint Blog & project guide `updated_eslint_config_mjs.md`)
    file_patterns: ["**/eslint.config.mjs"]

  - pattern: "module\\.exports\\s*="
    message: |
      [ESLint v9] Found `module.exports` in shared ESLint config (`@repo/eslint-config/index.mjs`). Flat configs must use ESM. Use `import { defineConfig } from 'eslint/config'; export default defineConfig([...]);`.
    file_patterns: ["**/packages/eslint-config/index.mjs"]

  - pattern: "export\\s+default\\s+\\[" # Matches exporting a raw array
    message: |
      [ESLint v9] Found config array exported directly (`export default [...]`). Wrap the configuration array with `defineConfig` from `eslint/config` (or `@eslint/config-helpers` for older ESLint versions) for type safety and access to features like `extends`: `import { defineConfig } from 'eslint/config'; export default defineConfig([...]);`. (See ESLint Blog & project guide `updated_eslint_config_mjs.md`)
    file_patterns: ["**/eslint.config.mjs", "**/packages/eslint-config/index.mjs"]
```

---

## `apps/admin-panel/.env.local`

```
# apps/admin-panel/.env.local
# Ensure this URL points to your Go backend API, including the /api/v1 prefix
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Unique session configuration for the admin panel
ADMIN_SESSION_NAME=admin_panel_auth_session
# Generate a strong, unique secret (at least 32 characters) - DO NOT USE THIS EXAMPLE
ADMIN_SESSION_SECRET=replace-with-your-very-strong-admin-secret-key-32-chars-or-more

# Optional: URL of this admin panel app itself, useful for fetch calls in server actions to API routes
# Ensure this is correct for your deployment environment (e.g., https://admin.yourapp.com)
NEXT_PUBLIC_ADMIN_APP_URL=http://localhost:3001```

---

## `apps/admin-panel/_actions/adminAuthActions.ts`

```typescript
// apps/admin-panel/_actions/adminAuthActions.ts
'use server'; // Mark this module as Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import apiClient, { APIError } from '@repo/api-client';
import type { LoginRequestDTO, UserResponseDTO } from '@repo/types'; // Using shared Login DTO
import { getAdminSessionOptions, SessionData } from '@repo/auth'; // Use admin options
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers'; // Import cookies

// Define return type for useActionState
interface AdminAuthResult {
    success: boolean;
    message?: string;
}

// Define the expected structure of the SUCCESSFUL response from the Go backend's ADMIN login endpoint
interface GoAdminLoginSuccessResponse {
    // Assuming admin login returns user details similar to regular login,
    // plus potentially specific admin flags/roles if not derived from session.
    accessToken: string; // We don't use this directly, but backend sends it
    refreshToken: string; // We don't use this directly
    user: UserResponseDTO; // Contains user ID and *must* contain isAdmin: true
}

// REFACTORED: Helper to set the admin session cookie directly using iron-session
async function setAdminSessionCookie(userId: string, isAdminConfirmed: boolean): Promise<boolean> {
    if (!isAdminConfirmed) {
        console.warn("Admin Auth Action: Attempted to set session for non-admin user.");
        return false;
    }
    try {
        const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
        session.userId = userId;
        session.isAdmin = true; // Explicitly set admin flag
        await session.save();
        console.log("Admin Auth Action: Admin session saved directly for userId:", userId);
        return true;
    } catch (error) {
        console.error("Admin Auth Action: Error saving admin session directly:", error);
        return false;
    }
}

// REFACTORED: Helper to clear the admin session cookie directly
async function clearAdminSessionCookie(): Promise<boolean> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
        session.destroy();
        console.log("Admin Auth Action: Admin session destroyed directly.");
        return true;
    } catch (error) {
        console.error("Admin Auth Action: Error destroying admin session directly:", error);
        return false;
    }
}

// REFACTORED: Login Action to use direct session management
export async function adminLoginAction(previousState: AdminAuthResult | null, formData: FormData): Promise<AdminAuthResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };

        // 1. Call the Go backend's ADMIN login endpoint
        // NOTE: Update '/admin/auth/login' if your backend uses a different path
        const adminAuthResponse = await apiClient<GoAdminLoginSuccessResponse>('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        // 2. Verify backend confirmed admin status
        const user = adminAuthResponse?.user;
        // --- CRITICAL CHECK ---
        if (!user?.id || user?.isAdmin !== true) {
             console.error(`Admin login error: Backend response missing userId or isAdmin=true flag for email: ${email}`);
             return { success: false, message: 'Login failed: User not found or is not an administrator.' };
        }
        // --- END CHECK ---

        // 3. Set the admin session cookie DIRECTLY
        const sessionSet = await setAdminSessionCookie(user.id, true); // Pass admin confirmation
         if (!sessionSet) {
             console.error(`Admin login error: Failed to set session cookie for userId: ${user.id}`);
             return { success: false, message: 'Login failed: Could not save session state.' };
         }

        // 4. Revalidate and prepare success state
        revalidatePath('/', 'layout'); // Revalidate admin layout/dashboard
        console.log(`Admin user ${user.id} logged in successfully.`);
        // Redirect will be handled by the component's useEffect based on the success state
        return { success: true };

    } catch (error) {
        console.error("Admin Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: 'Invalid email or password.' };
            if (error.status === 403) return { success: false, message: 'Access denied. Ensure user has admin privileges.' };
            return { success: false, message: `Login failed: ${error.message}` };
        }
        return { success: false, message: `An unexpected error occurred during login: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

// REFACTORED: Logout Action to use direct session management
export async function adminLogoutAction() {
    // Clear the session cookie directly
    await clearAdminSessionCookie();

    // Revalidate paths relevant after logout and redirect to admin login
    revalidatePath('/', 'layout'); // Revalidate the whole admin layout
    redirect('/login'); // Redirect to admin login page
}```

---

## `apps/admin-panel/_actions/adminCollectionActions.ts`

```typescript
// apps/admin-panel/_actions/adminCollectionActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
} from '@repo/types';
import { getAdminSessionOptions, SessionData } from '@repo/auth'; // Use admin options
import { getIronSession } from 'iron-session';

// --- Helper to verify admin status ---
async function verifyAdmin(): Promise<boolean> {
    try {
       const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
       return session.userId != null && session.userId !== "" && session.isAdmin === true;
    } catch { return false; }
}
// --- End Helper ---

// --- Action Result Types ---
export interface AdminActionResult { success: boolean; message?: string; }
export interface AdminCollectionResult extends AdminActionResult { collection?: AudioCollectionResponseDTO; }

// --- Action: Create Collection ---
// Note: Admin might have different validation or default settings than user creation
export async function createCollectionAction(requestData: CreateCollectionRequestDTO): Promise<AdminCollectionResult> {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }

    // Basic server-side validation
    if (!requestData.title || !requestData.type) {
        return { success: false, message: "Title and type are required." };
    }
    if (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST") {
        return { success: false, message: "Invalid collection type." };
    }
    // TODO: Add validation for initialTrackIds format here if needed

    try {
        // Assuming a dedicated admin endpoint `/admin/audio/collections`
        const createdCollection = await apiClient<AudioCollectionResponseDTO>(`/admin/audio/collections`, {
            method: 'POST',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-collections'); // Invalidate the general collection list cache for admins

        console.log(`Admin created collection ${createdCollection.id}`);
        return { success: true, collection: createdCollection, message: "Collection created successfully." };

    } catch (error) {
        console.error(`Admin error creating collection:`, error);
        if (error instanceof APIError) {
            // Handle specific backend errors if applicable
            if (error.status === 400 && error.message?.includes('track IDs do not exist')) {
                 return { success: false, message: 'One or more initial tracks could not be found.' };
            }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to create collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred while creating the collection.' };
    }
}

// --- Action: Update Collection Metadata ---
export async function updateCollectionMetadataAction(collectionId: string, requestData: UpdateCollectionRequestDTO): Promise<AdminActionResult> {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // Allow updating title/description to empty string, but ensure at least one field is attempted to be updated
    if (requestData.title === undefined && requestData.description === undefined) {
         return { success: false, message: "No update data provided (title or description required)."};
    }

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}` for metadata update
        // Backend likely returns 204 No Content or the updated resource
        await apiClient<void | AudioCollectionResponseDTO>(`/admin/audio/collections/${collectionId}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-collections'); // Invalidate list view
        revalidateTag(`admin-collection-${collectionId}`); // Invalidate detail view/cache
        revalidatePath(`/collections/${collectionId}/edit`); // Invalidate edit page path
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path


        console.log(`Admin updated collection metadata ${collectionId}`);
        return { success: true, message: "Collection updated successfully." };

    } catch (error) {
        console.error(`Admin error updating collection metadata ${collectionId}:`, error);
        if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Update Collection Tracks ---
export async function updateCollectionTracksAction(collectionId: string, requestData: UpdateCollectionTracksRequestDTO): Promise<AdminActionResult> {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // TODO: Add validation for UUIDs in requestData.orderedTrackIds if needed

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}/tracks`
        // Backend likely returns 204 No Content
        await apiClient<void>(`/admin/audio/collections/${collectionId}/tracks`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag(`admin-collection-${collectionId}`); // Invalidate detail view/cache
        // List view might not need invalidation unless it shows track count directly

        console.log(`Admin updated collection tracks for ${collectionId}`);
        return { success: true, message: "Collection tracks updated successfully." };

    } catch (error) {
        console.error(`Admin error updating collection tracks ${collectionId}:`, error);
        if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection or one/more tracks not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update tracks: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// --- Action: Delete Collection ---
export async function deleteCollectionAction(collectionId: string): Promise<AdminActionResult> {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) { return { success: false, message: "Permission denied." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

    try {
        // Assuming endpoint `/admin/audio/collections/{collectionId}`
        // Backend returns 204 No Content
        await apiClient<void>(`/admin/audio/collections/${collectionId}`, { method: 'DELETE' });

        revalidateTag('admin-collections'); // Invalidate list view
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path (it will 404 now)

        console.log(`Admin deleted collection ${collectionId}`);
        return { success: true, message: "Collection deleted successfully." };

    } catch (error) {
        console.error(`Admin error deleting collection ${collectionId}:`, error);
        if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to delete collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}```

---

## `apps/admin-panel/_actions/adminTrackActions.ts`

```typescript
// apps/admin-panel/_actions/adminTrackActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioTrackResponseDTO,
    CompleteUploadRequestDTO, // Reused for update? Define UpdateTrackDTO if needed
    RequestUploadRequestDTO,
    RequestUploadResponseDTO
} from '@repo/types';
import { getAdminSessionOptions, SessionData } from '@repo/auth';
import { getIronSession } from 'iron-session';

// --- Helper to verify admin status ---
async function verifyAdmin(): Promise<boolean> {
    try {
       const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
       return session.userId != null && session.userId !== "" && session.isAdmin === true;
    } catch { return false; }
}
// --- End Helper ---

// --- Action Result Types ---
export interface AdminActionResult { success: boolean; message?: string; }
export interface AdminTrackResult extends AdminActionResult { track?: AudioTrackResponseDTO; }
export interface AdminRequestUploadResult extends AdminActionResult { uploadUrl?: string; objectKey?: string; }


// --- Action: Request Upload URL (Admin) ---
// This might be needed if admins upload directly through the panel
export async function requestAdminUploadAction(filename: string, contentType: string): Promise<AdminRequestUploadResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!filename || !contentType) { return { success: false, message: "Filename and content type are required." }; }

    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        // Assuming a separate admin endpoint or the same one with admin auth checks
        const response = await apiClient<RequestUploadResponseDTO>(`/admin/uploads/audio/request`, { // Use admin endpoint
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        return { success: true, uploadUrl: response.uploadUrl, objectKey: response.objectKey };
    } catch (error) {
        console.error(`Admin error requesting upload URL for ${filename}:`, error);
        if (error instanceof APIError) {
            return { success: false, message: `Failed to request upload URL: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Create Track Metadata (Admin) ---
// Action called after successful admin upload to create metadata
export async function createTrackMetadataAction(requestData: CompleteUploadRequestDTO): Promise<AdminTrackResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     // Basic validation
     if (!requestData.objectKey || !requestData.title || !requestData.languageCode || requestData.durationMs <= 0) {
          return { success: false, message: "Object Key, Title, Language Code, and Duration are required." };
     }

     try {
        // Assumes a dedicated admin endpoint: `/admin/audio/tracks`
        const createdTrack = await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks`, {
             method: 'POST',
             body: JSON.stringify(requestData),
        });

         revalidateTag('admin-tracks'); // Invalidate track list cache

         console.log(`Admin created track ${createdTrack.id}`);
         return { success: true, track: createdTrack, message: "Track created successfully." };

     } catch (error) {
         console.error(`Admin error creating track metadata for key ${requestData.objectKey}:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) { return { success: false, message: "Conflict: Object key may already be used for a track." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            return { success: false, message: `Failed to create track: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
     }
}

// --- Action: Update Track Metadata (Admin) ---
// Takes FormData as input from the form
export async function updateTrackAction(trackId: string, formData: FormData): Promise<AdminActionResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

    // Extract and validate data from FormData
    const title = formData.get('title') as string;
    const languageCode = formData.get('languageCode') as string;
    if (!title || !languageCode) { return { success: false, message: "Title and Language Code are required."}; }

    // Construct the DTO for the API call (Partial, only send editable fields)
     const requestData: Partial<CompleteUploadRequestDTO> = {
         title,
         description: formData.get('description') as string,
         languageCode,
         level: (formData.get('level') as string) || undefined,
         isPublic: formData.get('isPublic') === 'on',
         tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
         coverImageUrl: (formData.get('coverImageUrl') as string) || undefined,
         // Exclude non-editable: objectKey, durationMs (assuming duration isn't editable here)
     };
      // Ensure empty optional strings are treated as undefined/null for backend
     if (requestData.level === "") requestData.level = undefined;
     if (requestData.coverImageUrl === "") requestData.coverImageUrl = undefined;

     try {
         // Assumes admin update endpoint PUT /admin/audio/tracks/{trackId}
         await apiClient<AudioTrackResponseDTO>(`/admin/audio/tracks/${trackId}`, {
             method: 'PUT',
             body: JSON.stringify(requestData),
         });

         revalidateTag('admin-tracks'); // Invalidate list
         revalidateTag(`admin-track-${trackId}`); // Invalidate detail
         revalidatePath(`/tracks/${trackId}/edit`); // Invalidate edit page path
         revalidatePath(`/tracks/${trackId}`); // Invalidate detail view path (if exists)

         console.log(`Admin updated track ${trackId}`);
         return { success: true, message: "Track updated successfully." };

     } catch (error) {
         console.error(`Admin error updating track ${trackId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Track not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied." }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}

// --- Action: Delete Track (Admin) ---
 export async function deleteTrackAction(trackId: string): Promise<AdminActionResult> {
     const isAdmin = await verifyAdmin();
     if (!isAdmin) { return { success: false, message: "Permission denied." }; }
     if (!trackId) { return { success: false, message: "Track ID is required." }; }

     try {
         // Assumes admin delete endpoint DELETE /admin/audio/tracks/{trackId}
         // Backend should handle deleting the file from storage (MinIO) as well
         await apiClient<void>(`/admin/audio/tracks/${trackId}`, { method: 'DELETE' });

         revalidateTag('admin-tracks'); // Invalidate list
         revalidatePath(`/tracks/${trackId}`); // Invalidate detail path
         revalidatePath(`/tracks/${trackId}/edit`); // Invalidate edit path

         console.log(`Admin deleted track ${trackId}`);
         return { success: true, message: "Track deleted successfully." };

     } catch (error) {
         console.error(`Admin error deleting track ${trackId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Track not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
            // Handle potential 409 conflict if track is part of collection? Backend needs to decide policy.
            return { success: false, message: `Failed to delete track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
 }```

---

## `apps/admin-panel/_actions/adminUserActions.ts`

```typescript
// apps/admin-panel/_actions/adminUserActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
// MODIFIED: Ensure AdminUpdateUserRequestDTO is imported
import type { UserResponseDTO, AdminUpdateUserRequestDTO } from '@repo/types';
import { getAdminSessionOptions, SessionData } from '@repo/auth';
import { getIronSession } from 'iron-session';

// --- Helper to verify admin status ---
export async function verifyAdmin(): Promise<boolean> {
    try {
       const session = await getIronSession<SessionData>(cookies(), getAdminSessionOptions());
       return session.userId != null && session.userId !== "" && session.isAdmin === true;
    } catch { return false; }
}
// --- End Helper ---

// --- Action Result Types ---
export interface AdminActionResult { success: boolean; message?: string; }
export interface AdminUserResult extends AdminActionResult { user?: UserResponseDTO;}

// --- Action: Update User ---
export async function updateUserAction(userId: string, formData: FormData): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
    if (!userId) { return { success: false, message: "User ID is required." }; }

    // Extract data from FormData
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const isAdminStr = formData.get('isAdmin') as string | null; // Checkbox might be null if unchecked

    // Construct the request DTO - Include only fields that have values
    // Use Partial because not all fields might be sent
    const requestData: Partial<AdminUpdateUserRequestDTO> = {};
    if (name !== null) requestData.name = name; // Allow empty string if intended
    if (email) requestData.email = email; // Careful with email updates
    // Handle boolean checkbox: "on" means true, absence means false
    if (isAdminStr !== null) { // Check if the checkbox was present in the form data
        requestData.isAdmin = isAdminStr === 'on';
    } else {
        // If the checkbox is missing from the FormData (e.g., unchecked and not submitted),
        // explicitly set it to false in the request if the backend expects a boolean.
        // Adjust this logic based on how your form submits unchecked checkboxes and backend expectations.
        requestData.isAdmin = false;
    }

    if (Object.keys(requestData).length === 0) {
        return { success: false, message: "No fields provided for update." };
    }

    try {
        // Assuming a PUT /admin/users/{userId} endpoint exists
        await apiClient<UserResponseDTO>(`/admin/users/${userId}`, { // Update endpoint if needed
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        revalidateTag('admin-users');
        revalidateTag(`admin-user-${userId}`);
        revalidatePath(`/users/${userId}/edit`);

        console.log(`Admin updated user ${userId}`);
        return { success: true, message: "User updated successfully." };

    } catch (error) {
        console.error(`Admin error updating user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             if (error.status === 409) { return { success: false, message: `Conflict: ${error.message}` }; }
            return { success: false, message: `Failed to update user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Delete User ---
export async function deleteUserAction(userId: string): Promise<AdminActionResult> {
    if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }
    if (!userId) { return { success: false, message: "User ID is required." }; }

    try {
         await apiClient<void>(`/admin/users/${userId}`, { method: 'DELETE' });
         revalidateTag('admin-users');
         revalidatePath(`/users/${userId}/edit`);
         revalidatePath(`/users`); // Invalidate user list page

        console.log(`Admin deleted user ${userId}`);
        return { success: true, message: "User deleted successfully." };

    } catch (error) {
         console.error(`Admin error deleting user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "User not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied by backend." }; }
             if (error.status === 409) { return { success: false, message: `Cannot delete user: ${error.message}` }; }
            return { success: false, message: `Failed to delete user: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Create User (Admin) ---
// Adjust DTO based on backend requirements
interface AdminCreateUserRequestDTO {
    email: string;
    name: string;
    isAdmin?: boolean;
    // initialPassword?: string;
}

export async function createUserAction(formData: FormData): Promise<AdminUserResult> {
     if (!await verifyAdmin()) { return { success: false, message: "Permission denied." }; }

     const email = formData.get('email') as string;
     const name = formData.get('name') as string;
     const isAdminStr = formData.get('isAdmin') as string | null;

     if (!email || !name) { return { success: false, message: "Email and Name are required." }; }

     const requestData: AdminCreateUserRequestDTO = {
         email,
         name,
         isAdmin: isAdminStr === 'on',
     };

     try {
         const newUser = await apiClient<UserResponseDTO>(`/admin/users`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

         revalidateTag('admin-users');

         console.log(`Admin created new user ${newUser.id}`);
         return { success: true, user: newUser, message: "User created successfully." };

     } catch (error) {
         console.error(`Admin error creating user:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) { return { success: false, message: `Conflict: ${error.message}` }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
             return { success: false, message: `Failed to create user: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}```

---

## `apps/admin-panel/_components/admin/DataTable.tsx`

```tsx
// apps/admin-panel/_components/admin/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Keep for potential client-side filtering needs
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Button, Input, Spinner } from '@repo/ui'; // Use Spinner from shared UI
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@repo/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]; // Data for the current page
  totalItems: number; // Total count for pagination
  isLoading?: boolean; // Loading state from TanStack Query
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting?: SortingState; // Server-side sorting state
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>; // Setter for server-side sorting
  // Optional: Add props for server-side filtering if implemented
  // filterParams?: Record<string, string | undefined>;
  // setFilterParams?: (params: Record<string, string | undefined>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  isLoading = false,
  pagination,
  setPagination,
  sorting = [],
  setSorting,
  // Add filter props if needed
}: DataTableProps<TData, TValue>) {

  // Remove client-side filter state if using server-side filtering
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [globalFilter, setGlobalFilter] = useState('');

  const pageCount = useMemo(() => {
      return pagination.pageSize > 0 ? Math.ceil(totalItems / pagination.pageSize) : 0;
  }, [totalItems, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
      sorting,
      // Remove client-side filter state if not used
      // columnFilters,
      // globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting, // Hook up server-side sorting handler
    // Remove client-side filter handlers if not used
    // onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(), // Keep if client-side filtering is sometimes useful
    manualPagination: true, // Required for server-side pagination
    manualSorting: !!setSorting, // Enable manual sorting only if handler provided
    manualFiltering: true, // Set to true if using server-side filtering
    debugTable: process.env.NODE_ENV === 'development',
  });

  return (
    <div className="space-y-4">
      {/* Example: Global Filter Input (Client-side - remove if not using) */}
       {/* <div className="flex items-center py-4">
         <Input
           placeholder="Filter all columns..."
           value={globalFilter ?? ''}
           onChange={(event) => setGlobalFilter(event.target.value)}
           className="max-w-sm"
         />
         {isLoading && <Spinner size="sm" className="ml-2 text-slate-400" />}
       </div> */}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                     style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                            "flex items-center gap-1",
                            header.column.getCanSort() && !!setSorting ? 'cursor-pointer select-none' : ''
                        )}
                        onClick={setSorting ? header.column.getToggleSortingHandler() : undefined}
                        title={header.column.getCanSort() && !!setSorting ? `Sort by ${header.column.id}` : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && !!setSorting && (
                          <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                             {{ asc: ' ▲', desc: ' ▼'}[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-3 w-3 inline-block" />}
                          </span>
                         )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700 relative">
            {isLoading && (
                 // Loading overlay
                 <tr className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
                     <td colSpan={columns.length}><Spinner size="lg" /></td>
                 </tr>
             )}
             {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() ? "selected" : undefined} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              !isLoading && ( // Only show "No results" if not loading
                 <tr>
                    <td colSpan={columns.length} className="h-24 text-center text-slate-500 dark:text-slate-400">
                    No results found.
                    </td>
                 </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
         <div className="text-sm text-muted-foreground dark:text-slate-400">
             {/* Show skeleton loading for counts while loading */}
             {isLoading ? 'Loading count...' : `
                Showing ${table.getRowModel().rows.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0}-
                ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalItems)} of
                ${totalItems} row(s).`}
         </div>
         <div className="flex items-center space-x-1 sm:space-x-2">
             <span className="text-sm mr-2 hidden md:inline">
                  {/* Show skeleton loading for page count */}
                 Page {isLoading ? '...' : table.getState().pagination.pageIndex + 1} of {isLoading ? '...' : table.getPageCount()}
             </span>
            <Button
              variant="outline" size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
              aria-label="Go to first page"
              className="h-8 w-8"
            >
               <ChevronsLeft className="h-4 w-4"/>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              aria-label="Go to previous page"
              className="h-8 px-2"
            >
                <ChevronLeft className="h-4 w-4"/> <span className="hidden sm:inline">Prev</span>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              aria-label="Go to next page"
              className="h-8 px-2"
            >
                 <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4"/>
            </Button>
             <Button
              variant="outline" size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
              aria-label="Go to last page"
               className="h-8 w-8"
            >
                 <ChevronsRight className="h-4 w-4"/>
             </Button>
        </div>
      </div>
    </div>
  );
}```

---

## `apps/admin-panel/_components/admin/ResourceActions.tsx`

```tsx
// apps/admin-panel/_components/admin/ResourceActions.tsx
'use client';

import React, { useState, useTransition, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { Pencil, Trash2, Loader } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@repo/ui"; // Assuming AlertDialog components are exported from @repo/ui

interface ResourceActionsProps {
    resourceId: string;
    editPath?: string; // Path for the edit page, e.g., /users/[id]/edit
    deleteAction?: (id: string) => Promise<{ success: boolean; message?: string }>; // Server action for delete
    resourceName?: string; // e.g., "user", "track" for confirmation message
    onDeleteSuccess?: () => void; // Optional callback after successful delete
    onDeleteError?: (message?: string) => void; // Optional callback on delete error
}

export function ResourceActions({
    resourceId,
    editPath,
    deleteAction,
    resourceName = 'item',
    onDeleteSuccess,
    onDeleteError,
}: ResourceActionsProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    // Using AlertDialog, no need for separate showConfirmDialog state

    const handleDeleteConfirm = () => {
        if (!deleteAction || isDeleting) return;

        startDeleteTransition(async () => {
            const result = await deleteAction(resourceId);
            // Dialog closes automatically on action click if not prevented
            if (result.success) {
                console.log(`${resourceName} ${resourceId} deleted successfully.`);
                // TODO: Replace alert with a toast notification library
                alert(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} deleted successfully.`);
                if (onDeleteSuccess) onDeleteSuccess();
            } else {
                console.error(`Failed to delete ${resourceName} ${resourceId}:`, result.message);
                 // TODO: Replace alert with a toast notification library
                alert(`Error deleting ${resourceName}: ${result.message || 'Unknown error'}`);
                 if (onDeleteError) onDeleteError(result.message);
            }
        });
    };

    return (
        <div className="space-x-1 flex items-center justify-end">
             {/* Edit Button */}
            {editPath && (
                <Button variant="ghost" size="icon" asChild title={`Edit ${resourceName}`}>
                    <Link href={editPath}>
                        <Pencil className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                    </Link>
                </Button>
            )}

            {/* Delete Button */}
            {deleteAction && (
                 <AlertDialog>
                     <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title={`Delete ${resourceName}`} disabled={isDeleting}>
                              {isDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-red-600 hover:text-red-700"/>}
                          </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                         <AlertDialogHeader>
                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                         <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the {resourceName}.
                         </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                         <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                             {isDeleting ? "Deleting..." : "Yes, delete"}
                         </AlertDialogAction>
                         </AlertDialogFooter>
                     </AlertDialogContent>
                 </AlertDialog>
            )}
        </div>
    );
}```

---

## `apps/admin-panel/_components/admin/ResourceForm.tsx`

```tsx
// apps/admin-panel/_components/admin/ResourceForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues, Path, FieldError, Controller } from 'react-hook-form'; // Import Controller
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Input, Textarea, Select, Checkbox, Label } from '@repo/ui';
import { cn } from '@repo/utils';
import { Loader } from 'lucide-react';

export interface FieldSchema<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'number' | 'checkbox' | 'select' | 'password';
    required?: string | boolean;
    options?: { value: string | number | boolean; label: string }[]; // Options for select (value can be boolean)
    placeholder?: string;
    defaultValue?: any;
    // Add RHF validation options directly
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number | string; message: string }; // Can be number or string date
    max?: { value: number | string; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string | Promise<boolean | string>; // Custom validation
    disabled?: boolean; // Allow disabling specific fields
}

interface ResourceFormProps<T extends FieldValues> {
    schema: FieldSchema<T>[];
    initialData?: T | null;
    // Action now takes FormData, not the typed object
    action: (prevState: any, formData: FormData) => Promise<any>;
    onSuccess?: (data: any) => void;
    onError?: (message?: string) => void;
    submitButtonText?: string;
}

function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[100px]">
             {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
            {pending ? 'Saving...' : text}
        </Button>
    );
}

export function ResourceForm<T extends FieldValues>({
    schema,
    initialData,
    action,
    onSuccess,
    onError,
    submitButtonText = 'Save Changes',
}: ResourceFormProps<T>) {
    const { register, handleSubmit, reset, formState: { errors, isDirty }, control } = useForm<T>({ // Add control
         // defaultValues need careful initialization, especially for checkboxes
         defaultValues: initialData || schema.reduce((acc, field) => {
             acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
             return acc;
         }, {} as any),
    });

    // Action state remains the same
    const [state, formAction, isPending] = useActionState(action, null);

    // Effect to reset form - should correctly reset checkboxes now
     useEffect(() => {
         reset(initialData || schema.reduce((acc, field) => {
             acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
             return acc;
         }, {} as any));
     }, [initialData, schema, reset]);

    // Handle action result state (remains the same)
    useEffect(() => {
        if (state?.success === true) {
            console.log("Form Action Successful:", state);
            if (onSuccess) onSuccess(state);
        } else if (state?.success === false && state?.message) {
             console.error("Form Action Server Error:", state.message);
             if (onError) onError(state.message);
        }
    }, [state, onSuccess, onError]);

    // RHF validation happens client-side before the action is called.
    // We don't need a separate client-side submit handler unless we
    // want to do complex pre-processing *before* creating FormData.
    // The <form action={formAction}> will handle creating FormData
    // and passing it to the server action.

    // Helper to get register options (remains the same)
    const getRegisterOptions = (field: FieldSchema<T>) => {
         const options: any = {};
         if (field.required) options.required = typeof field.required === 'string' ? field.required : 'This field is required';
         if (field.minLength) options.minLength = field.minLength;
         if (field.maxLength) options.maxLength = field.maxLength;
         if (field.min) options.min = field.min;
         if (field.max) options.max = field.max;
         if (field.pattern) options.pattern = field.pattern;
         if (field.type === 'number') options.valueAsNumber = true;
         if (field.validate) options.validate = field.validate;
         return options;
     };

    return (
        // Use the formAction directly. handleSubmit is NOT needed here
        // as the browser handles FormData creation for Server Actions.
        // RHF is primarily for client-side validation feedback in this case.
        <form action={formAction} className="space-y-4">
            {schema.map((field) => {
                const fieldError = errors[field.name] as FieldError | undefined;
                return (
                    <div key={field.name as string}>
                        <Label htmlFor={field.name as string} className={cn(fieldError && "text-red-600")}>
                            {field.label}{field.required ? '*' : ''}
                        </Label>
                        <div className="mt-1">
                            {field.type === 'textarea' ? (
                                <Textarea
                                    id={field.name as string}
                                    // Use RHF register for validation binding only
                                    {...register(field.name, getRegisterOptions(field))}
                                    placeholder={field.placeholder}
                                    className={cn(fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                    defaultValue={initialData?.[field.name] ?? field.defaultValue ?? ''} // Set default value for server action
                                    disabled={field.disabled || isPending} // Disable field if needed or pending
                                />
                            ) : field.type === 'checkbox' ? (
                                // IMPORTANT: Checkboxes need careful handling with FormData
                                // We need a hidden input to submit 'off' if unchecked.
                                // Or, handle boolean conversion in the Server Action based on presence.
                                // Using Controller provides better integration.
                                <Controller
                                    name={field.name}
                                    control={control}
                                    rules={getRegisterOptions(field)}
                                    render={({ field: controllerField }) => (
                                        <div className="flex items-center h-10">
                                             {/* Hidden input might not be needed with Controller */}
                                             <Checkbox
                                                 id={field.name as string}
                                                 checked={controllerField.value}
                                                 onCheckedChange={controllerField.onChange}
                                                 onBlur={controllerField.onBlur}
                                                 name={controllerField.name} // Ensure name is passed
                                                 ref={controllerField.ref}
                                                 className={cn(fieldError ? 'border-red-500 focus:ring-red-500' : '')}
                                                 aria-invalid={fieldError ? "true" : "false"}
                                                 disabled={field.disabled || isPending}
                                             />
                                         </div>
                                    )}
                                />
                            ) : field.type === 'select' ? (
                                <Select
                                    id={field.name as string}
                                    {...register(field.name, getRegisterOptions(field))}
                                    className={cn("mt-1 block w-full", fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                     defaultValue={initialData?.[field.name] ?? field.defaultValue ?? ''}
                                     disabled={field.disabled || isPending}
                                >
                                    {field.placeholder && <option value="">{field.placeholder}</option>}
                                    {field.options?.map(opt => (
                                        <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option> // Ensure value is string for select
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    id={field.name as string}
                                    type={field.type}
                                    {...register(field.name, getRegisterOptions(field))}
                                    placeholder={field.placeholder}
                                    className={cn(fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                     defaultValue={initialData?.[field.name] ?? field.defaultValue ?? ''}
                                     disabled={field.disabled || isPending}
                                />
                            )}
                        </div>
                         {fieldError && (
                            <p className="text-red-600 text-xs mt-1" role="alert">{fieldError.message}</p>
                        )}
                    </div>
                );
            })}

            {state && !state.success && state.message && (
                 <p className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded" role="alert">
                     {state.message}
                 </p>
             )}

            <div className="pt-4">
                <SubmitButton text={submitButtonText} />
            </div>
        </form>
    );
}```

---

## `apps/admin-panel/_components/auth/AdminLoginForm.tsx`

```tsx
// apps/admin-panel/_components/auth/AdminLoginForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react'; // Updated import for React 19+
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/_actions/adminAuthActions'; // Adjust import alias
import { Button, Input, Label } from '@repo/ui'; // Use shared UI
import { Loader } from 'lucide-react'; // Loading icon
import { cn } from '@repo/utils'; // Utility for class names

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
      {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
      {pending ? 'Logging in...' : 'Admin Login'}
    </Button>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  // Use useActionState for form state management
  const [state, formAction, isPending] = useActionState(adminLoginAction, null);

  // Redirect on successful login
  useEffect(() => {
    if (state?.success) {
      console.log("Admin login successful, redirecting to dashboard...");
      router.push('/'); // Redirect to admin root/dashboard
      // No need to manually refresh, layout should update automatically
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="admin@example.com"
          // Highlight field if error message relates to email (simple check)
          className={cn(state && !state.success && state.message?.toLowerCase().includes('email') ? 'border-red-500' : '')}
          aria-invalid={state && !state.success && state.message?.toLowerCase().includes('email') ? "true" : "false"}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="********"
          // Highlight field if error message relates to password (simple check)
          className={cn(state && !state.success && state.message?.toLowerCase().includes('password') ? 'border-red-500' : '')}
          aria-invalid={state && !state.success && state.message?.toLowerCase().includes('password') ? "true" : "false"}
        />
      </div>

      {/* Display general form error message */}
      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200" role="alert">
            {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}```

---

## `apps/admin-panel/_components/layout/AdminHeader.tsx`

```tsx
// apps/admin-panel/_components/layout/AdminHeader.tsx
'use client'; // Needs logout action trigger

import Link from 'next/link';
import { adminLogoutAction } from '@/_actions/adminAuthActions'; // Adjust alias
import { Button } from '@repo/ui';
import { LogOut, UserCog } from 'lucide-react'; // Or admin-specific icon

export function AdminHeader() {

  // No need to call action directly from onClick, use form action
  // const handleLogout = async () => { await adminLogoutAction(); };

  return (
    <header className="bg-slate-800 text-slate-100 p-3 shadow-md sticky top-0 z-40"> {/* Darker admin theme */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold flex items-center hover:text-white transition-colors">
           <UserCog className="h-5 w-5 mr-2"/> Admin Panel
        </Link>
        {/* Use a form for logout to work without JS */}
        <form action={adminLogoutAction}>
            <Button variant="ghost" size="sm" type="submit" className="text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1">
                <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
        </form>
      </div>
    </header>
  );
}```

---

## `apps/admin-panel/_components/layout/AdminSidebar.tsx`

```tsx
// apps/admin-panel/_components/layout/AdminSidebar.tsx
'use client'; // Needed for using usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Music, ListMusic, LayoutDashboard, Settings } from 'lucide-react'; // Changed BarChart2 to LayoutDashboard
import { cn } from '@repo/utils'; // Assuming a cn utility exists in shared utils

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Audio Tracks', href: '/tracks', icon: Music },
  { name: 'Collections', href: '/collections', icon: ListMusic },
  // { name: 'Settings', href: '/settings', icon: Settings }, // Example future item
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full pt-16"> {/* Adjusted width, pt matches header height (adjust header height if needed) */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
            // More robust check for active link, handling nested routes
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                >
                    <item.icon
                    className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'
                    )}
                    aria-hidden="true"
                    />
                    {item.name}
                </Link>
            );
        })}
      </nav>
    </aside>
  );
}```

---

## `apps/admin-panel/_hooks/useAdminCollections.ts`

```typescript
// apps/admin-panel/_hooks/useAdminCollections.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listAllCollections, type AdminListCollectionsParams } from '@/_services/adminCollectionService'; // Adjust path
import type { PaginatedResponseDTO, AudioCollectionResponseDTO } from '@repo/types';

// Query key factory for admin collections
export const adminCollectionsQueryKeys = {
  all: ['admin', 'collections'] as const,
  // Ensure params object is stringified or uses a stable reference for caching if needed,
  // but TanStack Query handles object keys well.
  list: (params: AdminListCollectionsParams) => [...adminCollectionsQueryKeys.all, params] as const,
  detail: (collectionId: string) => [...adminCollectionsQueryKeys.all, 'detail', collectionId] as const,
};

/**
 * Custom hook to fetch a paginated list of audio collections for the admin panel.
 * Handles fetching based on pagination, sorting, and filtering parameters.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns TanStack Query result object for the collection list.
 */
export const useAdminCollections = (params: AdminListCollectionsParams) => {
  const queryKey = adminCollectionsQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<AudioCollectionResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: () => listAllCollections(params), // Call the ADMIN service function
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
    // Consider adding gcTime if needed
  });
}

// Optional: Hook for fetching single collection details
export const useAdminCollection = (collectionId: string | undefined) => {
    const queryKey = adminCollectionsQueryKeys.detail(collectionId ?? '');

    return useQuery<AudioCollectionResponseDTO, Error>({
        queryKey: queryKey,
        queryFn: () => {
            if (!collectionId) throw new Error("Collection ID is required");
            // Assuming getAdminCollectionDetails exists in the service
            // return getAdminCollectionDetails(collectionId);
            // Placeholder: Implement getAdminCollectionDetails in service
            return Promise.reject(new Error("getAdminCollectionDetails not implemented"));
        },
        enabled: !!collectionId, // Only fetch if ID is valid
        staleTime: 5 * 60 * 1000,
    });
}```

---

## `apps/admin-panel/_hooks/useAdminTracks.ts`

```typescript
// apps/admin-panel/_hooks/useAdminTracks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listAllTracks, getAdminTrackDetails, type AdminListTrackQueryParams } from '@/_services/adminTrackService'; // Adjust path
import type { PaginatedResponseDTO, AudioTrackResponseDTO, AudioTrackDetailsResponseDTO } from '@repo/types';

// Query key factory for admin tracks
export const adminTracksQueryKeys = {
  all: ['admin', 'tracks'] as const, // Base key for all admin track queries
  list: (params: AdminListTrackQueryParams) => [...adminTracksQueryKeys.all, params] as const,
  detail: (trackId: string) => [...adminTracksQueryKeys.all, 'detail', trackId] as const,
};

/**
 * Custom hook to fetch a paginated list of audio tracks for the admin panel.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns TanStack Query result object for the track list.
 */
export const useAdminTracks = (params: AdminListTrackQueryParams) => {
  const queryKey = adminTracksQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<AudioTrackResponseDTO>, Error>({
    queryKey: queryKey,
    // The query function calls the admin-specific service function
    queryFn: () => listAllTracks(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });
}

/**
 * Custom hook to fetch details for a single audio track for the admin panel.
 * @param trackId - The ID of the track to fetch.
 * @returns TanStack Query result object for the track details.
 */
export const useAdminTrack = (trackId: string | undefined) => {
    const queryKey = adminTracksQueryKeys.detail(trackId ?? ''); // Use empty string if undefined for key stability

    return useQuery<AudioTrackDetailsResponseDTO, Error>({
        queryKey: queryKey,
        queryFn: () => {
             if (!trackId) {
                 // This shouldn't be called if enabled is false, but acts as a safeguard
                 throw new Error("Track ID is required to fetch details.");
             }
             return getAdminTrackDetails(trackId); // Use the service function
         },
        enabled: !!trackId, // Only enable the query if trackId is truthy
        staleTime: 10 * 60 * 1000, // Cache details longer? Example: 10 minutes
    });
}```

---

## `apps/admin-panel/_hooks/useAdminUsers.ts`

```typescript
// apps/admin-panel/_hooks/useAdminUsers.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listUsers, getUserDetails, type AdminListUsersParams } from '@/_services/adminUserService'; // Adjust path
import type { PaginatedResponseDTO, UserResponseDTO } from '@repo/types';

// Query key factory
export const adminUsersQueryKeys = {
  all: ['admin', 'users'] as const,
  list: (params: AdminListUsersParams) => [...adminUsersQueryKeys.all, params] as const,
  detail: (userId: string) => [...adminUsersQueryKeys.all, 'detail', userId] as const,
};

/**
 * Hook to fetch a paginated list of users for the admin panel.
 */
export const useAdminUsers = (params: AdminListUsersParams) => {
  const queryKey = adminUsersQueryKeys.list(params);

  return useQuery<PaginatedResponseDTO<UserResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: () => listUsers(params), // Pass params to service function
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });
}

/**
 * Hook to fetch details for a single user for the admin panel.
 */
export const useAdminUser = (userId: string | undefined) => {
    const queryKey = adminUsersQueryKeys.detail(userId ?? '');

    return useQuery<UserResponseDTO, Error>({
        queryKey: queryKey,
        queryFn: () => {
             if (!userId) throw new Error("User ID is required");
             return getUserDetails(userId);
         },
        enabled: !!userId, // Only fetch if ID is valid
        staleTime: 10 * 60 * 1000, // Cache details longer
    });
}```

---

## `apps/admin-panel/_services/adminCollectionService.ts`

```typescript
// apps/admin-panel/_services/adminCollectionService.ts
import apiClient, { APIError } from '@repo/api-client'; // Correct path assuming monorepo setup
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    AudioTrackResponseDTO, // Assuming admin detail might include tracks
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
} from '@repo/types'; // Use shared types
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params if admin filtering differs
// Match this with backend query capabilities for admin endpoint
export interface AdminListCollectionsParams {
    q?: string; // Search term (e.g., title, description)
    ownerId?: string; // Filter by specific owner UUID
    type?: 'COURSE' | 'PLAYLIST'; // Filter by type
    limit?: number;
    offset?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'ownerId' | 'type'; // Example sort fields
    sortDir?: 'asc' | 'desc';
}

const ADMIN_COLLECTIONS_ENDPOINT = '/admin/audio/collections'; // Base endpoint for admin collection operations

// --- Fetch Functions ---

/**
 * Fetches a paginated list of ALL audio collections (requires admin privileges).
 */
export async function listAllCollections(params?: AdminListCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${ADMIN_COLLECTIONS_ENDPOINT}${queryString}`;
    console.log(`ADMIN SERVICE: Fetching collections from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error listing collections:`, error);
        throw error; // Re-throw APIError or other errors
    }
}

/**
 * Fetches details for a specific audio collection (requires admin privileges).
 * Assumes the admin endpoint returns the collection DTO.
 */
export async function getAdminCollectionDetails(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) {
        throw new Error("ADMIN SERVICE: Collection ID cannot be empty");
    }
    const endpoint = `${ADMIN_COLLECTIONS_ENDPOINT}/${collectionId}`;
    console.log(`ADMIN SERVICE: Fetching collection details from: ${endpoint}`);
    try {
        // Assuming this endpoint returns the collection, potentially with tracks populated
        const response = await apiClient<AudioCollectionResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error fetching collection details for ${collectionId}:`, error);
        throw error; // Re-throw APIError or other errors
    }
}

// Note: Create/Update/Delete operations are typically handled directly in Server Actions
// using the apiClient. Defining service functions for them is optional but can help centralize API calls.
// Example (optional):
// export async function createAdminCollection(data: CreateCollectionRequestDTO): Promise<AudioCollectionResponseDTO> {
//     const endpoint = ADMIN_COLLECTIONS_ENDPOINT;
//     try {
//         const response = await apiClient<AudioCollectionResponseDTO>(endpoint, { method: 'POST', body: data });
//         return response;
//     } catch (error) {
//         console.error(`ADMIN SERVICE: Error creating collection:`, error);
//         throw error;
//     }
// }```

---

## `apps/admin-panel/_services/adminTrackService.ts`

```typescript
// apps/admin-panel/_services/adminTrackService.ts
import apiClient from '@repo/api-client'; // Correct path
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO,
    PaginatedResponseDTO,
    CompleteUploadRequestDTO, // Used for create/update DTO structure
    ListTrackQueryParams, // Reuse if admin filters are the same
    RequestUploadRequestDTO,
    RequestUploadResponseDTO
} from '@repo/types'; // Use shared types
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params type if admin filtering differs significantly from user
export type AdminListTrackQueryParams = ListTrackQueryParams; // Alias for now

const ADMIN_TRACKS_ENDPOINT = '/admin/audio/tracks'; // Base endpoint for admin track operations
const ADMIN_UPLOAD_ENDPOINT = '/admin/uploads/audio'; // Base endpoint for admin upload operations

// --- Fetch Functions ---

/**
 * Fetches a paginated list of ALL audio tracks (requires admin privileges).
 */
export async function listAllTracks(params?: AdminListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${ADMIN_TRACKS_ENDPOINT}${queryString}`;
    console.log(`ADMIN SERVICE: Fetching tracks from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error listing tracks:`, error);
        throw error;
    }
}

/**
 * Fetches details for a specific audio track (requires admin privileges).
 */
export async function getAdminTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("ADMIN SERVICE: Track ID cannot be empty");
    }
    const endpoint = `${ADMIN_TRACKS_ENDPOINT}/${trackId}`;
    console.log(`ADMIN SERVICE: Fetching track details from: ${endpoint}`);
    try {
        const response = await apiClient<AudioTrackDetailsResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error fetching track details for ${trackId}:`, error);
        throw error;
    }
}

/**
 * Requests a presigned URL for uploading an audio file via the admin panel.
 */
export async function requestAdminUploadUrl(filename: string, contentType: string): Promise<RequestUploadResponseDTO> {
     if (!filename || !contentType) {
        throw new Error("ADMIN SERVICE: Filename and content type are required.");
    }
    const endpoint = `${ADMIN_UPLOAD_ENDPOINT}/request`;
     console.log(`ADMIN SERVICE: Requesting upload URL from: ${endpoint}`);
    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        const response = await apiClient<RequestUploadResponseDTO>(endpoint, {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        return response;
    } catch (error) {
         console.error(`ADMIN SERVICE: Error requesting upload URL for ${filename}:`, error);
        throw error;
    }
}


// Note: Create/Update/Delete track operations are typically handled directly in Server Actions
// using the apiClient, calling the respective ADMIN_TRACKS_ENDPOINT routes (POST, PUT, DELETE).```

---

## `apps/admin-panel/_services/adminUserService.ts`

```typescript
// apps/admin-panel/_services/adminUserService.ts
import apiClient from '@repo/api-client'; // Correct path
import type { PaginatedResponseDTO, UserResponseDTO } from '@repo/types'; // Use shared types
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params for admin user listing
export interface AdminListUsersParams {
    q?: string; // Search by email or name
    provider?: string; // Filter by auth provider ('local', 'google')
    isAdmin?: boolean; // Filter by admin status
    limit?: number;
    offset?: number;
    sortBy?: 'email' | 'name' | 'createdAt' | 'authProvider'; // Allowed sort fields
    sortDir?: 'asc' | 'desc';
}

const ADMIN_USERS_ENDPOINT = '/admin/users'; // Base endpoint for admin user operations

/**
 * Fetches a paginated list of ALL users (requires admin privileges).
 */
export async function listUsers(params?: AdminListUsersParams): Promise<PaginatedResponseDTO<UserResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${ADMIN_USERS_ENDPOINT}${queryString}`;
    console.log(`ADMIN SERVICE: Fetching users from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<UserResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error listing users:`, error);
        throw error;
    }
}

/**
 * Fetches details for a specific user (requires admin privileges).
 */
export async function getUserDetails(userId: string): Promise<UserResponseDTO> {
    if (!userId) {
        throw new Error("ADMIN SERVICE: User ID required");
    }
    const endpoint = `${ADMIN_USERS_ENDPOINT}/${userId}`;
    console.log(`ADMIN SERVICE: Fetching user details from: ${endpoint}`);
    try {
        const response = await apiClient<UserResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error fetching user details for ${userId}:`, error);
        throw error;
    }
}

// Note: Create/Update/Delete user operations are typically handled directly in Server Actions
// using the apiClient, calling the respective ADMIN_USERS_ENDPOINT routes (POST, PUT, DELETE).```

---

## `apps/admin-panel/app/(admin)/collections/page.tsx`

```tsx
// apps/admin-panel/app/(admin)/collections/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { DataTable } from '@/_components/admin/DataTable'; // Adjust path
import { useAdminCollections } from '@/_hooks/useAdminCollections'; // Adjust path
import { type AdminListCollectionsParams } from '@/_services/adminCollectionService'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { AudioCollectionResponseDTO } from '@repo/types';
import { Button, Badge } from '@repo/ui'; // Add Badge
import { Pencil, Trash2, Loader } from 'lucide-react'; // Remove Plus
import { deleteCollectionAction } from '@/_actions/adminCollectionActions'; // Adjust path
import { useQueryClient } from '@tanstack/react-query';
import { ResourceActions } from '@/_components/admin/ResourceActions'; // Use ResourceActions

// --- Main Page Component ---
export default function AdminCollectionsPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    // Client-side filtering example (remove if using server-side)
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });

    // Memoize query params
    const queryParams = useMemo((): AdminListCollectionsParams => {
        const params: AdminListCollectionsParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            // Ensure the id matches allowed sortBy values
            params.sortBy = sorting[0].id as AdminListCollectionsParams['sortBy'];
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // Add filter params if doing server-side filtering
        // const titleFilter = columnFilters.find(f => f.id === 'title');
        // if(titleFilter) params.q = titleFilter.value as string;
        return params;
    }, [pagination, sorting /*, columnFilters*/]);

    // Fetch data
    const { data: queryResponse, isLoading, isFetching, isError, error } = useAdminCollections(queryParams);

    // Memoize data
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalCollections = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    // Define Table Columns
    const collectionColumns = useMemo((): ColumnDef<AudioCollectionResponseDTO>[] => [
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Title <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            enableSorting: true,
            // enableColumnFilter: true, // Enable if using client-side filtering
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => <Badge variant={row.original.type === 'COURSE' ? 'default' : 'secondary'} >{row.original.type}</Badge>
        },
        {
            accessorKey: 'ownerId',
            header: 'Owner ID',
             // Consider fetching/displaying owner email if needed and feasible
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.ownerId}</span>
        },
        // { header: 'Track Count', cell: ({row}) => row.original.tracks?.length ?? 0 }, // Depends on API response
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                 <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Created At <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            enableSorting: true,
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                 <div className="flex justify-end">
                      <ResourceActions
                          resourceId={row.original.id}
                          resourceName="collection"
                          editPath={`/collections/${row.original.id}/edit`} // Link to admin edit page
                          deleteAction={deleteCollectionAction}
                          onDeleteSuccess={() => {
                              // Invalidate the query to refetch data after successful delete
                              queryClient.invalidateQueries({ queryKey: adminCollectionsQueryKeys.list(queryParams) });
                              // Optionally invalidate detail queries if needed elsewhere
                              queryClient.invalidateQueries({ queryKey: adminCollectionsQueryKeys.detail(row.original.id) });
                          }}
                          // onDeleteError={(msg) => { /* Show toast */ }}
                      />
                 </div>
            ),
        },
    ], [queryClient, queryParams]); // Include queryParams in dependencies if used for invalidation

    useEffect(() => { if (isError) console.error("Error fetching collections:", error) }, [isError, error]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Audio Collections</h1>
                 {/* Admins likely don't create collections from scratch this way? */}
                 {/* <Button asChild><Link href="/collections/new"><Plus className="h-4 w-4 mr-2" /> Add New Collection</Link></Button> */}
            </div>

            {isError && ( <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">Error loading collections: {error?.message}</div> )}

            <DataTable
                columns={collectionColumns}
                data={tableData}
                totalItems={totalCollections}
                isLoading={isLoading || isFetching} // Show loading indicator during fetch/refetch
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                // Pass filter state/setter if using client-side filtering
                // columnFilters={columnFilters}
                // setColumnFilters={setColumnFilters}
            />
        </div>
    );
}```

---

## `apps/admin-panel/app/(admin)/layout.tsx`

```tsx
// apps/admin-panel/app/(admin)/layout.tsx
// Server Component for layout structure
import React from 'react';
import { AdminHeader } from '@/_components/layout/AdminHeader'; // Adjust alias
import { AdminSidebar } from '@/_components/layout/AdminSidebar'; // Adjust alias

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware ensures only authenticated admins reach this layout
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <AdminSidebar />
      {/* Adjust margin-left based on sidebar width */}
      <div className="flex-1 flex flex-col overflow-hidden ml-60">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 md:p-6">
          {/* Container for consistent padding, or apply padding directly to main */}
          <div className="container mx-auto">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
}```

---

## `apps/admin-panel/app/(admin)/page.tsx`

```tsx
// apps/admin-panel/app/(admin)/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'; // Adjust path
import { Users, Music, ListMusic } from 'lucide-react';

// This is a placeholder. Fetch actual stats if needed using server-side fetching or TanStack Query.
async function getDashboardStats() {
    // Replace with actual API calls using admin services
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
    return {
        userCount: 123,
        trackCount: 456,
        collectionCount: 78,
    };
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats(); // Fetch stats server-side

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Audio Tracks</CardTitle>
                         <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.trackCount}</div>
                         <p className="text-xs text-muted-foreground">Uploaded tracks</p>
                    </CardContent>
                </Card>
                 <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">Collections</CardTitle>
                         <ListMusic className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold">{stats.collectionCount}</div>
                         <p className="text-xs text-muted-foreground">Created collections</p>
                     </CardContent>
                 </Card>
                {/* Add more stat cards or widgets */}
            </div>
            {/* Add charts or recent activity logs */}
        </div>
    );
}```

---

## `apps/admin-panel/app/(admin)/tracks/[trackId]/edit/page.tsx`

```tsx
// apps/admin-panel/app/(admin)/tracks/[trackId]/edit/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminTrack } from '@/_hooks/useAdminTracks'; // Use admin hook
import { ResourceForm, FieldSchema } from '@/_components/admin/ResourceForm';
import { updateTrackAction } from '@/_actions/adminTrackActions'; // Use admin action
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import type { CompleteUploadRequestDTO, AudioTrackResponseDTO, AudioLevel } from '@repo/types';
import Link from 'next/link';
import { Button } from '@repo/ui'; // Assuming Button is in ui

// Define the schema for editing track metadata
const trackEditSchema: FieldSchema<Partial<CompleteUploadRequestDTO>>[] = [
    // Key fields (often non-editable by admin once created)
    // { name: 'objectKey', label: 'Object Key', type: 'text', readOnly: true },
    // { name: 'durationMs', label: 'Duration (ms)', type: 'number', readOnly: true },

    // Editable fields
    { name: 'title', label: 'Title', type: 'text', required: 'Title is required.', validation: { maxLength: { value: 255, message: 'Title too long' } } },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'languageCode', label: 'Language Code', type: 'text', required: 'Language code is required.', placeholder: 'e.g., en-US' },
    { name: 'level', label: 'Level', type: 'select', options: [
        { value: "", label: "-- No Level --" },
        { value: "A1", label: "A1" }, { value: "A2", label: "A2" },
        { value: "B1", label: "B1" }, { value: "B2", label: "B2" },
        { value: "C1", label: "C1" }, { value: "C2", label: "C2" },
        { value: "NATIVE", label: "Native" },
    ], placeholder: "-- Select Level --" },
    { name: 'isPublic', label: 'Publicly Visible', type: 'checkbox' },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'news, easy, grammar' },
    { name: 'coverImageUrl', label: 'Cover Image URL (Optional)', type: 'text', validation: { pattern: { value: /^(https?:\/\/).*/, message: "Must be a valid URL" } } , placeholder: 'https://...'},
];

// Helper to map the fetched Track DTO to the subset needed for the form default values
function mapTrackToEditFormData(track?: AudioTrackResponseDTO): Partial<CompleteUploadRequestDTO> | undefined {
    if (!track) return undefined;
    return {
        title: track.title,
        description: track.description ?? '', // Ensure empty string if null
        languageCode: track.languageCode,
        level: track.level ?? '', // Map null/undefined level to empty string for select
        isPublic: track.isPublic,
        tags: track.tags ?? [], // Ensure array, even if null
        coverImageUrl: track.coverImageUrl ?? '', // Ensure empty string if null
        // Exclude non-editable fields like durationMs, objectKey
    };
}

export default function EditTrackPage() {
    const params = useParams();
    const router = useRouter();
    const trackId = params.trackId as string;

    // Fetch initial data using TanStack Query hook for ADMIN track details
    const { data: trackData, isLoading, isError, error } = useAdminTrack(trackId);

    // Handle successful update
    const handleUpdateSuccess = (result: any) => {
         if(result?.success) {
             console.log("Track updated successfully.");
             // Optionally show toast message
             alert("Track updated successfully!"); // Replace with toast
             // Navigate back to track list
             router.push('/tracks');
         } else {
             // Error handled by ResourceForm's useActionState display
             console.error("Track update failed (state received):", result?.message);
             // Optionally show error toast based on form state
         }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin" /> Loading track data...</div>;
    }

    if (isError) {
        return (
             <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700 flex items-center">
                 <AlertTriangle className="h-5 w-5 mr-2" />
                 Error loading track data: {error?.message || 'Unknown error'}
             </div>
        );
    }

    if (!trackData) {
         // This case might indicate a 404 handled by the hook/service, or an unexpected null
         return <div className="text-center p-10">Track not found. <Link href="/tracks" className="text-blue-600 hover:underline">Go back</Link></div>;
    }

    // Map the fetched data to the format expected by the form
    // Need to handle tags array -> comma-separated string for text input
    const initialFormData = mapTrackToEditFormData(trackData);
    const initialFormValuesForRHF = {
         ...initialFormData,
         tags: initialFormData?.tags?.join(', ') ?? '', // Convert tags array to comma-separated string
    };


    // Bind the trackId to the server action - **IMPORTANT**: updateTrackAction expects FormData, ResourceForm provides it
    // So, no need to manually bind data here if using form action prop.
    // const boundUpdateAction = (prevState: any, formData: FormData) => updateTrackAction(trackId, formData);

    return (
        <div className="container mx-auto py-6">
             <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/tracks"><ArrowLeft size={16} className="mr-1"/> Back to Tracks</Link>
            </Button>
            <h1 className="text-2xl font-bold mb-1">Edit Track</h1>
            <p className="text-sm text-slate-500 mb-6 truncate">ID: {trackId}</p>

            <div className="p-4 md:p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                 <ResourceForm<CompleteUploadRequestDTO> // Use DTO reflecting form fields
                    schema={trackEditSchema}
                    initialData={initialFormValuesForRHF} // Pass comma-separated tags
                    // Pass the action directly, ResourceForm handles FormData submission
                    action={(prevState, formData) => updateTrackAction(trackId, formData)}
                    onSuccess={handleUpdateSuccess}
                    // onError={(msg) => { /* Optional: Show toast */ }}
                    submitButtonText="Update Track"
                />
            </div>
        </div>
    );
}```

---

## `apps/admin-panel/app/(admin)/tracks/new/page.tsx`

```tsx
// apps/admin-panel/app/(admin)/tracks/new/page.tsx
'use client';

import React, { useState, useTransition, useCallback, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { requestAdminUploadAction, createTrackMetadataAction } from '@/_actions/adminTrackActions'; // Use ADMIN actions
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw, ArrowLeft } from 'lucide-react';
import type { CompleteUploadRequestDTO } from '@repo/types';
import { useForm } from 'react-hook-form';
import { cn } from '@repo/utils';
import Link from 'next/link';

// Define state types
type UploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';

// Helper to get audio duration client-side
const getAudioDuration = (audioFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContext.decodeAudioData(e.target?.result as ArrayBuffer)
                .then(buffer => resolve(Math.round(buffer.duration * 1000)))
                .catch(err => {
                    console.warn("Could not decode audio file client-side to get duration:", err);
                    resolve(null); // Resolve with null on error
                });
        };
        reader.onerror = () => {
            console.warn("FileReader error trying to get duration.");
            resolve(null);
        };
        reader.readAsArrayBuffer(audioFile);
    });
};

export default function NewTrackPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [stage, setStage] = useState<UploadStage>('select');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState<{ uploadUrl: string; objectKey: string } | null>(null);
    const [isProcessing, startTransition] = useTransition(); // Generic processing state
    const xhrRef = useRef<XMLHttpRequest | null>(null); // For cancelling upload

    // React Hook Form for metadata
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CompleteUploadRequestDTO>({
         defaultValues: { isPublic: true } // Default to public?
    });
    const durationValue = watch("durationMs"); // Watch duration to display

    const resetFlow = useCallback(() => {
        if (xhrRef.current) {
            xhrRef.current.abort();
            xhrRef.current = null;
        }
        setFile(null);
        setStage('select');
        setErrorMsg(null);
        setUploadProgress(0);
        setUploadResult(null);
        reset({ isPublic: true }); // Reset form to defaults
        const fileInput = document.getElementById('audioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [reset]);

    const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetFlow();
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Pre-fill title and attempt duration detection
             setValue('title', selectedFile.name.replace(/\.[^/.]+$/, ""));
            const duration = await getAudioDuration(selectedFile);
            if (duration) {
                setValue('durationMs', duration);
            } else {
                 setValue('durationMs', 0); // Reset or set to 0 if detection fails
            }
        }
    }, [resetFlow, setValue]);

    const handleRequestUpload = useCallback(() => {
        if (!file || stage !== 'select') return;
        setErrorMsg(null);
        setUploadProgress(0);
        setStage('requestingUrl');
        startTransition(async () => {
            const result = await requestAdminUploadAction(file.name, file.type); // Use ADMIN action
            if (!result.success || !result.uploadUrl || !result.objectKey) {
                setErrorMsg(result.message || "Failed to prepare upload.");
                setStage('error');
                return;
            }
            setUploadResult({ uploadUrl: result.uploadUrl, objectKey: result.objectKey });
            setStage('uploading');
            handleDirectUpload(result.uploadUrl, result.objectKey); // Pass key for metadata
        });
    }, [file, stage]);

    const handleDirectUpload = useCallback((url: string, objKey: string) => {
        if (!file || !url) return;

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open('PUT', url, true);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () => {
            xhrRef.current = null;
            if (xhr.status >= 200 && xhr.status < 300) {
                setStage('metadata');
                setValue('objectKey', objKey); // Set the object key in the form
            } else {
                setErrorMsg(`Upload failed: ${xhr.statusText || 'Error'} (${xhr.status})`);
                setStage('error');
            }
        };
        xhr.onerror = () => {
            xhrRef.current = null;
            if (stage !== 'select') { // Only set error if not already reset
                setErrorMsg(xhr.status === 0 ? "Upload failed: Network error or cancelled." : "Upload error occurred.");
                setStage('error');
            }
        };
         xhr.onabort = () => { xhrRef.current = null; console.log("Upload aborted."); };
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
    }, [file, stage, setValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
         if (!uploadResult?.objectKey || stage !== 'metadata') return;
         data.objectKey = uploadResult.objectKey; // Ensure key is set
         // Convert tags string back to array
         if (typeof data.tags === 'string') {
             data.tags = (data.tags as string).split(',').map(t => t.trim()).filter(Boolean);
         }
         if (data.coverImageUrl === '') data.coverImageUrl = undefined; // Handle empty optional URL
         if (data.level === '') data.level = undefined; // Handle empty optional level


         setStage('completing');
         setErrorMsg(null);
         startTransition(async () => {
             const result = await createTrackMetadataAction(data); // Use ADMIN action
             if (result.success && result.track) {
                 setStage('success');
                 setTimeout(() => router.push(`/tracks/${result.track?.id}/edit`), 1500); // Redirect to edit page
             } else {
                 setErrorMsg(result.message || "Failed to create track metadata.");
                 setStage('metadata'); // Return to metadata stage on error
             }
         });
     };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-bold">Upload New Track</h1>
                 <Button variant="outline" size="sm" asChild>
                    <Link href="/tracks"><ArrowLeft size={16} className="mr-1"/> Back to Tracks</Link>
                 </Button>
            </div>

            {/* Stage Display */}
            <div className="flex justify-center space-x-2 text-sm text-slate-500">
                <span className={cn(stage === 'select' && 'font-semibold text-blue-600')}>1. Select File</span>
                <span>&rarr;</span>
                <span className={cn(stage === 'uploading' && 'font-semibold text-blue-600')}>2. Upload</span>
                 <span>&rarr;</span>
                <span className={cn(stage === 'metadata' && 'font-semibold text-blue-600')}>3. Add Details</span>
                <span>&rarr;</span>
                 <span className={cn(stage === 'success' && 'font-semibold text-green-600')}>4. Complete</span>
            </div>

            {/* Error Display */}
            {stage === 'error' && errorMsg && (
                 <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700 flex items-center justify-between">
                     <span><AlertTriangle className="h-5 w-5 inline mr-2"/> {errorMsg}</span>
                     <Button variant="ghost" size="sm" onClick={resetFlow}><RotateCcw size={16}/> Try Again</Button>
                 </div>
            )}
             {stage === 'success' && (
                  <div className="p-4 border border-green-400 bg-green-50 rounded-lg text-green-700 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 inline mr-2"/> Track created successfully! Redirecting...
                  </div>
             )}

             {/* Step 1: Select File */}
             <Card className={cn(stage !== 'select' && 'hidden')}>
                 <CardHeader><CardTitle>Select Audio File</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                      <Label htmlFor="audioFile">Audio File (MP3, WAV, etc.)</Label>
                      <Input
                          id="audioFile"
                          name="audioFile"
                          type="file"
                          accept="audio/*"
                          onChange={handleSingleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600"
                      />
                      {file && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Selected: {file.name} ({file.type})</p>}
                      {watch("durationMs") > 0 && <p className="text-sm text-gray-500">Detected duration: ~{Math.round(watch("durationMs") / 1000)}s</p>}
                      <Button onClick={handleRequestUpload} disabled={!file || isProcessing} >
                          {isProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                          {isProcessing ? 'Preparing...' : 'Start Upload'}
                      </Button>
                 </CardContent>
             </Card>

            {/* Step 2: Uploading */}
            <Card className={cn(stage !== 'uploading' && 'hidden')}>
                <CardHeader><CardTitle>Uploading {file?.name}...</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-center text-sm">{uploadProgress}% Complete</p>
                    <Button variant="outline" size="sm" onClick={resetFlow} disabled={!xhrRef.current}>Cancel Upload</Button>
                </CardContent>
            </Card>

            {/* Step 3: Metadata */}
            <Card className={cn(stage !== 'metadata' && 'hidden')}>
                <CardHeader>
                    <CardTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Upload Complete - Add Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onMetadataSubmit)} className="space-y-4">
                         {/* Hidden field for objectKey */}
                        <input type="hidden" {...register('objectKey')} />

                         {/* Render Metadata Fields (Simplified Example) */}
                        <div><Label htmlFor="title">Title*</Label><Input id="title" {...register('title', { required: true })} className={cn(errors.title && "border-red-500")}/>{errors.title && <p className='text-xs text-red-500 mt-1'>Title is required.</p>}</div>
                        <div><Label htmlFor="languageCode">Language Code*</Label><Input id="languageCode" {...register('languageCode', { required: true })} className={cn(errors.languageCode && "border-red-500")} placeholder="e.g., en-US"/>{errors.languageCode && <p className='text-xs text-red-500 mt-1'>Language code is required.</p>}</div>
                        <div><Label htmlFor="durationMs">Duration (ms)*</Label><Input id="durationMs" type="number" {...register('durationMs', { required: true, min: 1, valueAsNumber: true })} className={cn(errors.durationMs && "border-red-500")} readOnly={!!watch("durationMs")} />{errors.durationMs && <p className='text-xs text-red-500 mt-1'>Valid duration (ms) is required.</p>}</div>
                        <div><Label htmlFor="level">Level</Label><Select id="level" {...register('level')}><option value="">-- Optional --</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>NATIVE</option></Select></div>
                        <div className="flex items-center space-x-2"><Checkbox id="isPublic" {...register('isPublic')} defaultChecked={true} /><Label htmlFor="isPublic">Publicly Visible</Label></div>
                        <div><Label htmlFor="description">Description</Label><Textarea id="description" {...register('description')} /></div>
                        <div><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...register('tags')} /></div>
                        <div><Label htmlFor="coverImageUrl">Cover Image URL</Label><Input id="coverImageUrl" type="url" {...register('coverImageUrl')} placeholder="https://..." /></div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" type="button" onClick={resetFlow} disabled={isProcessing}>Cancel</Button>
                            <Button type="submit" disabled={isProcessing}>
                                {isProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
                                Create Track
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* --- Batch Upload Section (Future Implementation) --- */}
            {/* <Card> ... </Card> */}

        </div>
    );
}```

---

## `apps/admin-panel/app/(admin)/tracks/page.tsx`

```tsx
// apps/admin-panel/app/(admin)/tracks/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { DataTable } from '@/_components/admin/DataTable'; // Adjust path
import { useAdminTracks } from '@/_hooks/useAdminTracks'; // Adjust path
import { type AdminListTracksParams } from '@/_services/adminTrackService'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { AudioTrackResponseDTO } from '@repo/types';
import { Button } from '@repo/ui';
import { Pencil, Trash2, Plus, Loader } from 'lucide-react';
import { formatDuration } from '@repo/utils';
import { deleteTrackAction } from '@/_actions/adminTrackActions'; // Adjust path
import { useQueryClient } from '@tanstack/react-query';

// --- Delete Confirmation Component (Example) ---
function DeleteTrackButton({ trackId, trackTitle, onSuccess }: { trackId: string, trackTitle: string, onSuccess: () => void }) {
    const [isDeleting, startDeleteTransition] = useTransition();

    const handleDelete = () => {
        if (!window.confirm(`Are you sure you want to delete track "${trackTitle}" (${trackId})? This action cannot be undone.`)) {
            return;
        }
        startDeleteTransition(async () => {
            const result = await deleteTrackAction(trackId);
            if (result.success) {
                console.log(`Track ${trackId} deleted successfully.`);
                alert(`Track "${trackTitle}" deleted.`); // Replace with toast notification
                onSuccess(); // Trigger refetch via cache invalidation
            } else {
                console.error(`Failed to delete track ${trackId}:`, result.message);
                alert(`Error deleting track: ${result.message}`); // Replace with toast notification
            }
        });
    };

    return (
        <Button variant="ghost" size="icon" title="Delete Track" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />}
        </Button>
    );
}


// --- Main Page Component ---
export default function AdminTracksPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Example: client-side filtering state
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
    });

    // Memoize query params based on table state
    const queryParams = useMemo(() => {
        const params: AdminListTracksParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id;
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // Map columnFilters to backend query params if doing server-side filtering
        // Example: If filtering by title column
        // const titleFilter = columnFilters.find(f => f.id === 'title');
        // if(titleFilter && typeof titleFilter.value === 'string') {
        //     params.q = titleFilter.value;
        // }
        return params;
    }, [pagination, sorting/*, columnFilters*/]); // Include columnFilters if server-side

    // Fetch data
    const { data: queryResponse, isLoading, isError, error } = useAdminTracks(queryParams);

    // Memoize data for stability
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalTracks = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    // --- Define Table Columns ---
    const trackColumns = useMemo((): ColumnDef<AudioTrackResponseDTO>[] => [
        { accessorKey: 'title', header: 'Title', enableColumnFilter: true }, // Enable filtering for title
        { accessorKey: 'languageCode', header: 'Language' },
        { accessorKey: 'level', header: 'Level' },
        { accessorKey: 'durationMs', header: 'Duration', cell: ({row}) => formatDuration(row.original.durationMs) },
        { accessorKey: 'isPublic', header: 'Public', cell: ({row}) => (row.original.isPublic ? 'Yes' : 'No') },
        { accessorKey: 'createdAt', header: 'Created At', cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString() },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild title="Edit Track">
                        <Link href={`/tracks/${row.original.id}/edit`}>
                            <Pencil className="h-4 w-4 text-blue-600" />
                        </Link>
                    </Button>
                    <DeleteTrackButton
                         trackId={row.original.id}
                         trackTitle={row.original.title}
                         onSuccess={() => {
                            // Invalidate the query to refetch data after successful delete
                            queryClient.invalidateQueries({ queryKey: ['admin', 'tracks'] });
                         }}
                    />
                </div>
            ),
        },
    ], [queryClient]); // Include queryClient if used in cell renderers (like Delete button)


    useEffect(() => { if (isError) console.error("Error fetching tracks:", error) }, [isError, error]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Audio Tracks</h1>
                 <Button asChild>
                     <Link href="/tracks/new">
                         <Plus className="h-4 w-4 mr-2" /> Add New Track
                     </Link>
                 </Button>
            </div>

             {isError && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                     Error loading tracks: {error?.message}
                 </div>
             )}

            <DataTable
                columns={trackColumns}
                data={tableData}
                totalItems={totalTracks}
                isLoading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                // Enable if using client-side filtering with the input example in DataTable
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                // manualFiltering={false} // Set true if filtering server-side
            />
        </div>
    );
}```

---

## `apps/admin-panel/app/(admin)/users/page.tsx`

```tsx
// apps/admin-panel/app/(admin)/users/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/_components/admin/DataTable';
import { useAdminUsers } from '@/_hooks/useAdminUsers';
import { type AdminListUsersParams } from '@/_services/adminUserService';
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { UserResponseDTO } from '@repo/types';
import { ResourceActions } from '@/_components/admin/ResourceActions';
import { deleteUserAction } from '@/_actions/adminUserActions';
import { Badge, Button } from '@repo/ui'; // Use shared UI
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpDown, UserPlus } from 'lucide-react'; // Add UserPlus for Add button
import Link from 'next/link'; // Import Link

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]); // Default sort
    // Client-side filtering example (remove if using server-side)
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

    // --- Define Table Columns ---
    // Memoize columns to prevent unnecessary re-renders
    const userColumns = useMemo((): ColumnDef<UserResponseDTO>[] => [
        {
            accessorKey: 'name',
            header: ({ column }) => ( // Make header sortable
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
             enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => ( // Make header sortable
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
             enableSorting: true,
        },
        {
            accessorKey: 'authProvider',
            header: 'Provider',
            cell: ({ row }) => <Badge variant={row.original.authProvider === 'google' ? 'default' : 'secondary'}>{row.original.authProvider}</Badge>,
             enableSorting: false, // Provider likely not sortable meaningfully
        },
         {
             accessorKey: 'isAdmin', // Assuming UserResponseDTO includes this
             header: 'Admin',
             cell: ({ row }) => (row.original.isAdmin ? <Badge variant="destructive">Yes</Badge> : <Badge variant="outline">No</Badge>),
             enableSorting: true, // Allow sorting by admin status
         },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => ( // Make header sortable
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Registered <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            enableSorting: true,
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
        },
        {
            id: 'actions',
            header: () => <div className="text-right pr-4">Actions</div>,
            cell: ({ row }) => (
                 <div className="flex justify-end">
                    <ResourceActions
                        resourceId={row.original.id}
                        resourceName="user"
                        editPath={`/users/${row.original.id}/edit`} // Link to admin edit page
                        deleteAction={deleteUserAction}
                        onDeleteSuccess={() => {
                             queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
                             // Also invalidate detail query if necessary
                             queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail', row.original.id] });
                         }}
                         // Add onDeleteError for toast notifications if needed
                    />
                 </div>
            ),
        },
    ], [queryClient]); // Dependency for invalidation callback


    // Build query params (adapt if using server-side filtering)
    const queryParams: AdminListUsersParams = useMemo(() => {
         const params: AdminListUsersParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            // Cast needed as accessorKey might not perfectly match allowed sortBy values
            params.sortBy = sorting[0].id as AdminListUsersParams['sortBy'];
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
         // Map columnFilters if server-side:
         // const emailFilter = columnFilters.find(f => f.id === 'email');
         // if(emailFilter) params.q = emailFilter.value as string;
        return params;
    }, [pagination, sorting /*, columnFilters*/]);

    const { data: queryResponse, isLoading, isFetching, isError, error } = useAdminUsers(queryParams);

    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalUsers = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold">Manage Users</h1>
                 {/* Add button to create new user (if applicable) */}
                  {/* <Button asChild>
                     <Link href="/users/new"><UserPlus className="mr-2 h-4 w-4"/> Add User</Link>
                 </Button> */}
            </div>

            {/* TODO: Add Filter components based on DataTable structure */}
            {/* Example: <Input placeholder="Filter emails..." onChange={(e) => table.getColumn('email')?.setFilterValue(e.target.value)} /> */}

            {isError && ( <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">Error loading users: {error?.message}</div> )}

            <DataTable
                columns={userColumns}
                data={tableData}
                totalItems={totalUsers}
                isLoading={isLoading || isFetching} // Show loader during initial load and refetch
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting} // Pass setter for server-side sorting
                // Pass filter state/setter if using client-side filtering in DataTable
                // columnFilters={columnFilters}
                // setColumnFilters={setColumnFilters}
                // Set manualFiltering to true if filters are handled server-side via queryParams
                // manualFiltering={true}
            />
        </div>
    );
}```

---

## `apps/admin-panel/app/api/auth/session/route.ts`

```typescript
// apps/admin-panel/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession, SessionOptions } from 'iron-session';
// Assuming SessionData structure might be shared or similar enough
// If not shared, define AdminSessionData specifically here.
import type { SessionData } from '@repo/auth'; // Or define AdminSessionData locally

// --- Configure ADMIN Session Options ---
// !! IMPORTANT: Use DIFFERENT names and secrets than the user app !!
const adminSessionOptions: SessionOptions = {
  cookieName: process.env.ADMIN_SESSION_NAME || 'admin_panel_auth_session', // DIFFERENT Name
  password: process.env.ADMIN_SESSION_SECRET!, // DIFFERENT Secret - MUST be set in .env, complex, >= 32 chars
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    sameSite: 'strict', // Use 'strict' for admin panel for better CSRF protection
    maxAge: undefined, // Session cookie (expires when browser closes) - Or set duration (e.g., 8 hours: 8 * 60 * 60)
    path: '/', // Ensure cookie applies to all admin panel paths
  },
};

// Environment variable check at startup
if (!adminSessionOptions.password) {
  console.error("FATAL ERROR: ADMIN_SESSION_SECRET environment variable is not set!");
  // In a real app, you might want to prevent startup if the secret is missing
  // For now, this will cause errors when getIronSession is called.
  // Consider adding a check in your build process or main app initialization.
}
// --- End Configuration ---

// GET handler to check current ADMIN session and admin status
export async function GET(request: NextRequest) {
  // Add explicit try-catch for robustness
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), adminSessionOptions);

    // Check for BOTH userId AND isAdmin flag for a valid admin session
    if (!session.userId || session.isAdmin !== true) {
      console.log("Admin Session GET: No valid admin session found.");
      // Destroy potentially incomplete session data if checks fail
      session.destroy();
      // Return a clear unauthorized status
      const response = NextResponse.json({ user: null, isAuthenticated: false, isAdmin: false }, { status: 401 });
      // Ensure cookie removal headers are set by iron-session during destroy
      await session.save(); // Need to save after destroy to send cookie removal header
      return response;

    }

    console.log(`Admin Session GET: Valid admin session found for userId: ${session.userId}`);
    // Return relevant session data, explicitly including isAdmin
    return NextResponse.json({
      // Only return necessary, non-sensitive info
      user: { id: session.userId /* add other safe fields if needed */ },
      isAuthenticated: true,
      isAdmin: session.isAdmin, // Return the admin status
    });

  } catch (error) {
      console.error("Admin Session GET Error:", error);
      // Return a generic server error if session handling fails unexpectedly
      return NextResponse.json({ message: "Failed to retrieve session information." }, { status: 500 });
  }
}

// POST handler to create/update ADMIN session (called after successful backend ADMIN login/auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId as string;
    // **Crucially, expect and require the 'isAdmin' flag from the caller (Admin Login Server Action)**
    const isAdmin = body.isAdmin === true; // Explicitly check for true boolean

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }
    // **Require the caller (Admin Login Action) to confirm the user IS an admin**
    if (!isAdmin) {
      console.warn(`Admin Session POST: Attempt to set session without isAdmin flag for userId: ${userId}`);
      return NextResponse.json({ message: 'Admin status confirmation is required to create admin session' }, { status: 403 }); // Forbidden
    }

    const session = await getIronSession<SessionData>(request, NextResponse.next(), adminSessionOptions);

    // Store essential admin session data
    session.userId = userId;
    session.isAdmin = true; // Set the admin flag in the session

    await session.save(); // Encrypts and sets the cookie in the response

    console.log(`Admin Session POST: Session saved for admin userId: ${session.userId}`);
    // Return confirmation
    return NextResponse.json({ ok: true, userId: session.userId, isAdmin: session.isAdmin });

  } catch (error) {
    console.error("Admin Session POST Error:", error);
    const message = error instanceof Error ? error.message : "Failed to set admin session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// DELETE handler to destroy ADMIN session (logout)
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ ok: true }); // Prepare response first
    const session = await getIronSession<SessionData>(request, response, adminSessionOptions);
    session.destroy(); // Clears session data and sets cookie removal headers via iron-session's save on destroy

    console.log("Admin Session DELETE: Session destroyed.");
    return response; // Return the response with cookie headers set by iron-session

  } catch (error) {
    console.error("Admin Session DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy admin session";
    return NextResponse.json({ message }, { status: 500 });
  }
}```

---

## `apps/admin-panel/app/globals.css`

```css
/* apps/admin-panel/app/globals.css */
/* Import shared UI base styles (which includes Tailwind import and @theme) */
@import "@repo/ui/src/globals.css";

/* Add any admin-panel SPECIFIC global styles or overrides below */
/* For example:
body {
  font-family: 'Inter', sans-serif; // Specific font for admin panel
}
*/```

---

## `apps/admin-panel/app/layout.tsx`

```tsx
// apps/admin-panel/app/layout.tsx
// Can likely remain a Server Component if just setting up context providers
import React from 'react';
import { Inter as FontSans } from "next/font/google"; // Example font
import { cn } from "@repo/utils"; // Assuming shared util
import { SharedQueryClientProvider } from '@repo/query-client'; // Import the shared provider
import './globals.css'; // Import app-specific global styles

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
         <SharedQueryClientProvider>
            {children}
         </SharedQueryClientProvider>
      </body>
    </html>
  );
}```

---

## `apps/admin-panel/app/login/page.tsx`

```tsx
// apps/admin-panel/app/login/page.tsx
import { AdminLoginForm } from '@/_components/auth/AdminLoginForm'; // Adjust import alias based on your tsconfig paths

export const metadata = { // Optional: Set page metadata
  title: 'Admin Login - AudioLang Player',
  description: 'Login to the administrative panel.',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-800 p-4"> {/* Admin might have a darker theme */}
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl"> {/* Slightly different styling maybe */}
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-700">
          Admin Panel Login
        </h1>

        {/* Render the admin-specific login form component */}
        <AdminLoginForm />

        {/* No link to register usually for admin panels */}
        {/* Optional: Add forgot password link if implemented */}
      </div>
       <p className="mt-4 text-center text-xs text-gray-400">
           Language Learning Player Administration
       </p>
    </div>
  );
}```

---

## `apps/admin-panel/app/page.tsx`

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
```

---

## `apps/admin-panel/eslint.config.mjs`

```
// apps/admin-panel/eslint.config.mjs
import { defineConfig } from 'eslint/config'; // Import the helper
import eslintConfigRepo from '@repo/eslint-config'; // Import the shared config array

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // Spread the shared configurations defined in @repo/eslint-config
  ...eslintConfigRepo,

  // --- Admin Panel Specific Overrides ---
  // Apply overrides *after* spreading the base config
  {
    files: ["_actions/**/*.ts"],
    rules: {
      "no-console": "off", // Allow console.log/warn/error in admin actions
    },
  },
  // Add more admin-specific rules or overrides here
]);```

---

## `apps/admin-panel/middleware.ts`

```typescript
// apps/admin-panel/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getAdminSessionOptions } from '@repo/auth'; // Use shared config and admin options

const adminSessionOptions = getAdminSessionOptions();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including /api/auth/session)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (public admin login page)
     */
     // This protects all routes under '/' including the dashboard, users, tracks etc.
     // EXCEPT the ones explicitly excluded above (like /login)
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Prepare default response
  const requestedPath = request.nextUrl.pathname;

  try {
    const session = await getIronSession<SessionData>(request, response, adminSessionOptions);
    const { userId, isAdmin } = session;

    // Check for BOTH userId AND isAdmin flag being explicitly true
    if (!userId || isAdmin !== true) {
      const loginUrl = new URL('/login', request.url);
      console.log(`Admin Middleware: No valid admin session for path ${requestedPath}, redirecting to login.`);
      // Destroy potentially invalid session data
      session.destroy();
      // Redirect to login - note: modifying response after redirect might not set cookie header correctly
      // It's better to destroy session and then redirect. Iron-session handles setting removal cookie on destroy+save.
      await session.save(); // Save destruction to set cookie header
      return NextResponse.redirect(loginUrl);
    }

    // Admin user is logged in and has the flag, allow request
    // console.log(`Admin Middleware: Valid admin session (userId ${userId}) for path ${requestedPath}, allowing.`);
    return response; // Allow request, response might have session attached if needed later

  } catch (error) {
       console.error(`Admin Middleware Error processing path ${requestedPath}:`, error);
       // Fallback: Redirect to login on session handling error
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('error', 'session_error');
       // Cannot easily clear cookie here on error, redirect is the main action
       return NextResponse.redirect(loginUrl);
  }
}```

---

## `apps/admin-panel/next.config.ts`

```typescript
// apps/admin-panel/next.config.ts
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Ensure experimental features match if needed, e.g., serverActions
   experimental: {
       serverActions: {
         // Allowed origins for server actions if needed (e.g., specific domains)
         // allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
       },
     },
   // Configure transpilePackages if using packages that need transpilation
   // (Often needed for UI packages that import CSS directly)
   transpilePackages: ['@repo/ui', '@repo/utils'], // Example
   reactStrictMode: true,
   // Add other configurations as needed
};

export default nextConfig;```

---

## `apps/admin-panel/package.json`

```json
{
  "name": "admin-panel",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001 --turbopack",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint . --max-warnings 0"
  },
  "dependencies": {
    "@repo/api-client": "workspace:*",
    "@repo/auth": "workspace:*",
    "@repo/query-client": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*",
    "@tailwindcss/typography": "^0.5.16",
    "@tanstack/react-query": "^5.72.2",
    "@tanstack/react-table": "^8.21.2",
    "iron-session": "^8.0.4",
    "lucide-react": "^0.487.0",
    "next": "15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.55.0"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@tailwindcss/postcss": "^4.1.3",
    "@tanstack/react-query-devtools": "^5.72.2",
    "@types/node": "^22.14.1",
    "@types/react": "^19.1.1",
    "@types/react-dom": "^19.1.2",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.1.3",
    "typescript": "^5.8.3"
  }
}```

---

## `apps/admin-panel/postcss.config.mjs`

```
const config = {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
  export default config;```

---

## `apps/admin-panel/tailwind.config.ts`

```typescript
// apps/admin-panel/tailwind.config.ts
import type { Config } from "tailwindcss";

// Removed theme and container definitions as they belong in CSS (@repo/ui/src/globals.css)
const config: Pick<Config, "content" | "darkMode" | "plugins"> = {
  darkMode: "class",
  content: [ // Define content paths specific to this app
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    // IMPORTANT: Include path to shared UI package
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Removed 'theme' block - customizations go in packages/ui/src/globals.css @theme
  plugins: [
      // Define app-specific plugins here
      require('@tailwindcss/typography'),
  ],
};
export default config;```

---

## `apps/admin-panel/tsconfig.json`

```json
// apps/admin-panel/tsconfig.json
{
  "extends": "../../packages/tsconfig/base.json", // Extend the root base config
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "baseUrl": ".", // Set base URL for this app
    "paths": {
      "@/*": ["./*"] // Standard alias for app-specific paths
    },
    "jsx": "preserve", // Required for Next.js App Router
    "allowJs": true,
    "incremental": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": ["node", "@types/react", "@types/react-dom"] // Add specific types if needed
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    // Ensure paths cover your _ directories
    "_actions/**/*.ts",
    "_components/**/*.tsx",
    "_context/**/*.tsx", // If context is used
    "_hooks/**/*.ts",
    "_lib/**/*.ts", // If lib is used
    "_services/**/*.ts",
    "_stores/**/*.ts" // If stores are used
  ],
  "exclude": ["node_modules"]
}```

---

## `apps/user-app/.env.local`

```
# apps/user-app/.env.local
# Ensure this URL points to your Go backend API, including the /api/v1 prefix
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Unique session configuration for the user app
USER_SESSION_NAME=user_app_auth_session
# Generate a strong, unique secret (at least 32 characters) - DO NOT USE THIS EXAMPLE
USER_SESSION_SECRET=replace-with-your-very-strong-user-secret-key-32-chars-long

# Google Client ID for client-side library (@react-oauth/google)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Optional: URL of this user app itself, useful for fetch calls in server actions to API routes
# Ensure this is correct for your deployment environment (e.g., https://yourapp.com)
NEXT_PUBLIC_APP_URL=http://localhost:3000```

---

## `apps/user-app/_actions/authActions.ts`

```typescript
// apps/user-app/_actions/authActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import apiClient, { APIError } from '@repo/api-client';
import type {
    AuthResponseDTO,
    LoginRequestDTO,
    RegisterRequestDTO,
    GoogleCallbackRequestDTO,
    RefreshRequestDTO,
    LogoutRequestDTO,
    UserResponseDTO,
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// Action Result Type
interface ActionResult {
    success: boolean;
    message?: string;
    isNewUser?: boolean; // For Google callback
}

// REFACTORED: Helper to set the user session cookie directly
async function setUserSessionCookie(userId: string): Promise<boolean> {
    if (!userId) {
        console.error("Auth Action: Cannot set session: userId is missing.");
        return false;
    }
    try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        session.userId = userId;
        delete session.isAdmin; // Ensure admin flag is not set
        await session.save();
        // console.log("Auth Action: User session cookie set successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Auth Action: Error setting user session directly:", error);
        return false;
    }
}

// REFACTORED: Helper to clear the user session cookie directly
async function clearUserSessionCookie(): Promise<boolean> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        session.destroy();
        console.log("Auth Action: User session destroyed directly.");
        return true;
    } catch (error) {
        console.error("Auth Action: Error destroying user session directly:", error);
        return false;
    }
}


// REFACTORED: Login Action
export async function loginAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };
        // Backend returns full AuthResponseDTO including user details
        const authResponse = await apiClient<AuthResponseDTO>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        const userId = authResponse.user?.id;
        if (!userId) {
            console.error("Login Action: Backend response missing user ID after successful login.");
            return { success: false, message: 'Login failed: Could not establish session (missing user ID).' };
        }

        // --- Set Session Cookie Directly ---
        const sessionSet = await setUserSessionCookie(userId);
        if (!sessionSet) {
            return { success: false, message: 'Login failed: Could not save session state.' };
        }
        // --- End Session Cookie ---

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken on client if needed for refresh flow
        console.log(`User ${userId} logged in successfully.`);
        return { success: true };

    } catch (error) {
        console.error("Login Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: 'Invalid email or password.' };
            return { success: false, message: error.message || 'Login failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during login.' };
    }
}

// REFACTORED: Register Action
export async function registerAction(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) { return { success: false, message: 'Email, password, and name are required.' }; }
    if (password.length < 8) { return { success: false, message: 'Password must be at least 8 characters.' }; }

    try {
        const registerData: RegisterRequestDTO = { email, password, name };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
        });

        const userId = authResponse.user?.id;
        if (!userId) {
             console.error("Register Action: Backend response missing user ID after successful registration.");
            return { success: false, message: 'Registration failed: Could not establish session (missing user ID).' };
        }

        // --- Set Session Cookie Directly ---
        const sessionSet = await setUserSessionCookie(userId);
        if (!sessionSet) {
            return { success: false, message: 'Registration failed: Could not save session state.' };
        }
        // --- End Session Cookie ---

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken
        console.log(`User ${userId} registered successfully.`);
        return { success: true };

    } catch (error) {
        console.error("Register Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 409) { return { success: false, message: 'Email already exists.' }; }
            if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: error.message || 'Registration failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during registration.' };
    }
}

// REFACTORED: Google Callback Action
export async function googleCallbackAction(idToken: string): Promise<ActionResult> {
    if (!idToken) { return { success: false, message: 'Google ID token is required.' }; }

    try {
        const callbackData: GoogleCallbackRequestDTO = { idToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/google/callback', {
            method: 'POST',
            body: JSON.stringify(callbackData),
        });

        const userId = authResponse.user?.id;
        if (!userId) {
             console.error("Google Callback Action: Backend response missing user ID after successful callback.");
             return { success: false, message: 'Google Sign-In failed: Could not establish session (missing user ID).' };
        }

        // --- Set Session Cookie Directly ---
        const sessionSet = await setUserSessionCookie(userId);
        if (!sessionSet) {
            return { success: false, message: 'Google Sign-In failed: Could not save session state.' };
        }
        // --- End Session Cookie ---

        revalidatePath('/', 'layout');
        // TODO: Securely handle/store authResponse.refreshToken
        console.log(`User ${userId} authenticated via Google (New User: ${!!authResponse.isNewUser}).`);
        return { success: true, isNewUser: authResponse.isNewUser };

    } catch (error) {
        console.error("Google Callback Action Error:", error);
        if (error instanceof APIError) {
            if (error.status === 409) { return { success: false, message: 'Email already linked to another account.' }; }
            if (error.status === 401) { return { success: false, message: 'Google authentication failed. Please try again.' }; }
            return { success: false, message: error.message || 'Google sign-in failed due to an API error.' };
        }
        return { success: false, message: 'An unexpected error occurred during Google sign-in.' };
    }
}

// REFACTORED: Logout Action
export async function logoutAction() {
    // 1. Backend Logout (Optional - requires refresh token handling)
    // console.log("Logout Action: Skipping backend /auth/logout call.");
    // Retrieve stored refresh token, call API, clear stored token...

    // 2. Clear the frontend session cookie directly
    const cleared = await clearUserSessionCookie();
    if (!cleared) {
        console.warn("Logout Action: Failed to clear user session cookie, redirecting anyway.");
    }

    // 3. Revalidate and redirect
    revalidatePath('/', 'layout');
    redirect('/login');
}

// Refresh Action (Remains placeholder - requires complex client coordination)
export async function refreshSessionAction(refreshToken: string): Promise<ActionResult & { newAccessToken?: string; newRefreshToken?: string }> {
    console.warn("refreshSessionAction called - requires secure refresh token storage & client-side coordination.");
    if (!refreshToken) {
        return { success: false, message: 'Refresh token is required.' };
    }
    try {
        const refreshData: RefreshRequestDTO = { refreshToken };
        const authResponse = await apiClient<AuthResponseDTO>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(refreshData),
        });
        // Client-side logic needs to handle storing new tokens
        return {
            success: true,
            newAccessToken: authResponse.accessToken,
            newRefreshToken: authResponse.refreshToken,
        };
    } catch (error) {
        console.error("Refresh Action Error:", error);
        if (error instanceof APIError && error.status === 401) {
             console.log("Refresh token invalid/expired during refresh attempt.");
             return { success: false, message: 'Session expired. Please log in again.' };
        }
        return { success: false, message: 'Failed to refresh session.' };
    }
}```

---

## `apps/user-app/_actions/collectionActions.ts`

```typescript
// apps/user-app/_actions/collectionActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type {
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    UpdateCollectionTracksRequestDTO,
    AudioCollectionResponseDTO,
    CollectionType,
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// --- Helper to get authenticated User ID ---
// Returns null if not authenticated
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in collection action:", error);
        return null;
     }
}
// --- End Helper ---

// --- Action: Create Collection ---
interface CreateCollectionResult {
    success: boolean;
    message?: string;
    collection?: AudioCollectionResponseDTO; // Return created collection DTO
}
export async function createCollectionAction(requestData: CreateCollectionRequestDTO): Promise<CreateCollectionResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) {
        return { success: false, message: "User not authenticated." };
    }

    // Basic server-side validation
    if (!requestData.title?.trim()) {
         return { success: false, message: "Collection title is required." };
    }
    if (!requestData.type || (requestData.type !== "COURSE" && requestData.type !== "PLAYLIST")) {
        return { success: false, message: "Valid collection type (COURSE or PLAYLIST) is required." };
    }
    // TODO: Validate format of initialTrackIds if provided

    try {
        // Backend endpoint for user collections is /audio/collections (auth determines ownership)
        const createdCollection = await apiClient<AudioCollectionResponseDTO>(`/audio/collections`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            // Auth token is implicitly handled by apiClient cookies/fetch config
        });

        revalidateTag(`collections-${userId}`); // Invalidate user's collection list cache

        console.log(`Collection created for user ${userId}, collection ${createdCollection.id}`);
        return { success: true, collection: createdCollection, message: "Collection created successfully." };

    } catch (error) {
        console.error(`Error creating collection for user ${userId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 400 && error.message?.includes('track IDs do not exist')) {
                  return { success: false, message: 'One or more initial tracks could not be found.' };
             }
              if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             return { success: false, message: `Failed to create collection: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while creating the collection.' };
    }
}

// --- Action: Update Collection Metadata ---
interface UpdateCollectionResult { success: boolean; message?: string; }
export async function updateCollectionMetadataAction(collectionId: string, requestData: UpdateCollectionRequestDTO): Promise<UpdateCollectionResult> {
    const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
    if (!userId) { return { success: false, message: "User not authenticated." }; }
    if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
    // Allow empty title/description if that's the intent of the update
    if (requestData.title === undefined && requestData.description === undefined) {
         return { success: false, message: "No update data provided (title or description required)."};
    }
    // Validate title length if provided
     if (requestData.title !== undefined && requestData.title !== null && requestData.title.length > 255) {
          return { success: false, message: "Title cannot exceed 255 characters."};
     }


     try {
        // Backend endpoint: PUT /audio/collections/{collectionId}
        // Backend handles ownership check based on authenticated user
        await apiClient<void>(`/audio/collections/${collectionId}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        // Invalidate caches
        revalidateTag(`collection-${collectionId}`); // Invalidate specific collection detail page/data
        revalidateTag(`collections-${userId}`); // Invalidate user's collection list (title might have changed)
        revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path
        revalidatePath(`/collections/${collectionId}/edit`); // Invalidate edit page path

        console.log(`Collection metadata updated for ${collectionId}`);
        return { success: true, message: "Collection updated successfully." };

    } catch (error) {
        console.error(`Error updating collection metadata ${collectionId}:`, error);
         if (error instanceof APIError) {
            if (error.status === 404) { return { success: false, message: "Collection not found." }; }
            if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Action: Update Collection Tracks ---
export async function updateCollectionTracksAction(collectionId: string, requestData: UpdateCollectionTracksRequestDTO): Promise<UpdateCollectionResult> {
     const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }
     // TODO: Optionally add UUID validation for track IDs client-side before sending

     try {
         // Backend endpoint: PUT /audio/collections/{collectionId}/tracks
         // Backend handles ownership and track existence checks
         await apiClient<void>(`/audio/collections/${collectionId}/tracks`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        });

        // Invalidate cache for this specific collection
        revalidateTag(`collection-${collectionId}`);
         revalidatePath(`/collections/${collectionId}`); // Invalidate detail page path

        console.log(`Collection tracks updated for ${collectionId}`);
        return { success: true, message: "Tracks updated successfully." };

    } catch (error) {
        console.error(`Error updating collection tracks ${collectionId}:`, error);
        if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "Collection or one/more specified tracks not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to update tracks: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// --- Action: Delete Collection ---
export async function deleteCollectionAction(collectionId: string): Promise<UpdateCollectionResult> {
     const userId = await getAuthenticatedUserID(); // Needed for tag invalidation
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!collectionId) { return { success: false, message: "Collection ID is required." }; }

      try {
        // Backend endpoint: DELETE /audio/collections/{collectionId}
        // Backend handles ownership check
        await apiClient<void>(`/audio/collections/${collectionId}`, {
            method: 'DELETE',
        });

        // Invalidate caches
        revalidateTag(`collections-${userId}`); // Invalidate user's collection list
        revalidatePath(`/collections`); // Invalidate the collection list page path
        revalidatePath(`/collections/${collectionId}`); // Invalidate specific detail page path (will now 404)

        console.log(`Collection deleted for user ${userId}, collection ${collectionId}`);
        return { success: true, message: "Collection deleted." };

    } catch (error) {
        console.error(`Error deleting collection ${collectionId}:`, error);
         if (error instanceof APIError) {
             if (error.status === 404) { return { success: false, message: "Collection not found." }; }
             if (error.status === 403) { return { success: false, message: "Permission denied. You may not own this collection." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
            return { success: false, message: `Failed to delete collection: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}```

---

## `apps/user-app/_actions/uploadActions.ts`

```typescript
// apps/user-app/_actions/uploadActions.ts
'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers'; // Needed for auth check
import apiClient, { APIError } from '@repo/api-client';
import type {
    RequestUploadRequestDTO,
    RequestUploadResponseDTO,
    CompleteUploadRequestDTO, // Changed from CompleteUploadInputDTO based on backend
    AudioTrackResponseDTO,
    BatchRequestUploadInputRequestDTO,
    BatchRequestUploadInputResponseDTO,
    BatchCompleteUploadInputDTO, // Changed based on backend
    BatchCompleteUploadResponseDTO,
    BatchCompleteUploadItemDTO // Used in BatchCompleteUploadInputDTO
} from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';

// --- Helper to get authenticated User ID ---
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in upload action:", error);
        return null;
     }
}
// --- End Helper ---

// --- Action Result Types ---
interface RequestUploadResult {
    success: boolean;
    message?: string;
    uploadUrl?: string;
    objectKey?: string;
}
interface CompleteUploadResult {
    success: boolean;
    message?: string;
    track?: AudioTrackResponseDTO;
}
interface BatchRequestUploadResult {
    success: boolean;
    message?: string;
    results?: BatchRequestUploadInputResponseDTO['results'];
}
interface BatchCompleteUploadResult {
     success: boolean;
     message?: string;
     results?: BatchCompleteUploadResponseDTO['results'];
}

// --- Single File Actions ---

export async function requestUploadAction(filename: string, contentType: string): Promise<RequestUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

     if (!filename || !contentType) {
         return { success: false, message: "Filename and content type are required." };
     }

    try {
        const reqData: RequestUploadRequestDTO = { filename, contentType };
        // User endpoint for requesting upload
        const response = await apiClient<RequestUploadResponseDTO>('/uploads/audio/request', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        console.log(`Upload URL requested for user ${userId}, file ${filename}`);
        return { success: true, uploadUrl: response.uploadUrl, objectKey: response.objectKey };
    } catch (error) {
        console.error(`Error requesting upload URL for ${filename}:`, error);
        if (error instanceof APIError) {
            if (error.status === 401) return { success: false, message: "Authentication required." };
            return { success: false, message: `Failed to request upload URL: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// Action called after successful upload to create metadata
// Takes JSON data matching CompleteUploadRequestDTO from @repo/types
export async function createTrackMetadataAction(
    // objectKey is now part of the requestData DTO
    requestData: CompleteUploadRequestDTO
): Promise<CompleteUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

     // Basic Validation from DTO fields
     if (!requestData.objectKey || !requestData.title?.trim() || !requestData.languageCode?.trim() || !requestData.durationMs || requestData.durationMs <= 0) {
         return { success: false, message: "Object Key, Title, Language Code, and a valid Duration (ms) are required." };
     }
     // Ensure optional fields are handled correctly (e.g., empty strings become undefined/null if needed by backend)
     if (requestData.description === '') requestData.description = undefined;
     if (requestData.level === '') requestData.level = undefined;
     if (requestData.coverImageUrl === '') requestData.coverImageUrl = undefined;
     requestData.isPublic = requestData.isPublic ?? false; // Default to false if null/undefined
     requestData.tags = requestData.tags?.filter(Boolean) ?? []; // Ensure array and remove empty tags

     try {
         // User endpoint for completing upload and creating track
         const createdTrack = await apiClient<AudioTrackResponseDTO>(`/audio/tracks`, {
             method: 'POST',
             body: JSON.stringify(requestData), // Send the validated DTO
         });

         revalidateTag('tracks'); // Invalidate public track list cache
         revalidateTag(`tracks-${userId}`); // Invalidate user-specific track list cache if applicable

         console.log(`Track metadata created for user ${userId}, track ${createdTrack.id}`);
         return { success: true, track: createdTrack, message: "Track created successfully." };

     } catch (error) {
         console.error(`Error creating track metadata for key ${requestData.objectKey}:`, error);
         if (error instanceof APIError) {
             if (error.status === 409) return { success: false, message: "Conflict: This file may have already been processed or the identifier is duplicated." };
             if (error.status === 400) return { success: false, message: `Invalid input: ${error.message}` };
             if (error.status === 403) return { success: false, message: `Permission denied: ${error.message}` }; // e.g., object key ownership mismatch
             if (error.status === 401) return { success: false, message: "Authentication required." };
             return { success: false, message: `Failed to create track: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred.' };
     }
}


// --- Batch File Actions ---

export async function requestBatchUploadAction(files: { filename: string; contentType: string }[]): Promise<BatchRequestUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

    if (!files || files.length === 0) {
        return { success: false, message: "At least one file is required for batch upload request." };
    }

    try {
        const reqData: BatchRequestUploadInputRequestDTO = {
            files: files.map(f => ({ filename: f.filename, contentType: f.contentType })),
        };
        // User endpoint for requesting batch upload URLs
        const response = await apiClient<BatchRequestUploadInputResponseDTO>('/uploads/audio/batch/request', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });
        console.log(`Batch upload URLs requested for user ${userId}, count: ${files.length}`);
        return { success: true, results: response.results };
    } catch (error) {
        console.error(`Error requesting batch upload URLs for user ${userId}:`, error);
        if (error instanceof APIError) {
             if (error.status === 401) return { success: false, message: "Authentication required." };
            return { success: false, message: `Failed to request batch upload URLs: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function completeBatchUploadAction(
    // Matches the input DTO expected by the backend
    tracksData: BatchCompleteUploadItemDTO[]
): Promise<BatchCompleteUploadResult> {
    const userId = await getAuthenticatedUserID();
    if (!userId) return { success: false, message: "User not authenticated." };

     if (!tracksData || tracksData.length === 0) {
        return { success: false, message: "At least one track's metadata is required for batch completion." };
    }

     // Basic validation of items (can be more thorough)
     for (const item of tracksData) {
         if (!item.objectKey || !item.title?.trim() || !item.languageCode?.trim() || !item.durationMs || item.durationMs <= 0) {
             return { success: false, message: `Invalid data for track with key ${item.objectKey || '(unknown)'}: Missing required fields.` };
         }
          // Ensure optional fields are handled correctly
         item.description = item.description === '' ? undefined : item.description;
         item.level = item.level === '' ? undefined : item.level;
         item.coverImageUrl = item.coverImageUrl === '' ? undefined : item.coverImageUrl;
         item.isPublic = item.isPublic ?? false;
         item.tags = item.tags?.filter(Boolean) ?? [];
     }

    try {
        const reqData: BatchCompleteUploadInputDTO = { tracks: tracksData };
        // User endpoint for completing batch upload
        const response = await apiClient<BatchCompleteUploadResponseDTO>('/audio/tracks/batch/complete', {
            method: 'POST',
            body: JSON.stringify(reqData),
        });

         revalidateTag('tracks'); // Invalidate public track list cache
         revalidateTag(`tracks-${userId}`); // Invalidate user-specific track list cache if applicable

        console.log(`Batch upload completed for user ${userId}, items processed: ${response.results?.length ?? 0}`);
        return { success: true, results: response.results }; // Assume overall success if API call succeeds (201)

    } catch (error) {
        console.error(`Error completing batch upload for user ${userId}:`, error);
        if (error instanceof APIError) {
             const errorDetails = error.details as { results?: BatchCompleteUploadResponseDTO['results'] };
             // If backend returns partial results even on error, include them
             if (errorDetails?.results) {
                 return { success: false, message: `Batch completion failed: ${error.message}`, results: errorDetails.results };
             }
             if (error.status === 401) return { success: false, message: "Authentication required." };
             if (error.status === 403) return { success: false, message: `Permission denied: ${error.message}` };
             if (error.status === 400) return { success: false, message: `Invalid input: ${error.message}` };
             if (error.status === 409) return { success: false, message: `Conflict: ${error.message}` };
             return { success: false, message: `Batch completion failed: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred during batch completion.' };
    }
}```

---

## `apps/user-app/_actions/userActivityActions.ts`

```typescript
// apps/user-app/_actions/userActivityActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
import apiClient, { APIError } from '@repo/api-client';
import type { RecordProgressRequestDTO, CreateBookmarkRequestDTO, BookmarkResponseDTO } from '@repo/types';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use user options

// --- Helper to get authenticated User ID ---
async function getAuthenticatedUserID(): Promise<string | null> {
     try {
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        return session.userId ?? null;
     } catch(error) {
        console.error("Error getting session in user activity action:", error);
        return null;
     }
}
// --- End Helper ---

// --- Action: Record Progress ---
export async function recordProgressAction(trackId: string, progressMs: number): Promise<{ success: boolean; message?: string }> {
    const userId = await getAuthenticatedUserID();
    if (!userId) {
        // Require authentication to record progress
        return { success: false, message: "User not authenticated." };
    }

    if (!trackId || progressMs < 0) {
         console.warn(`Invalid progress data: trackId=${trackId}, progressMs=${progressMs}`);
         return { success: false, message: "Invalid track ID or progress value." };
    }

    const requestData: RecordProgressRequestDTO = { trackId, progressMs };

    try {
        // Endpoint: POST /users/me/progress
        // Backend expects 204 No Content on success
        await apiClient<void>(`/users/me/progress`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

        // console.log(`Progress recorded for user ${userId}, track ${trackId}: ${progressMs}ms`);
        // Optionally revalidate progress-related data if other components display it
        // revalidateTag(`progress-${userId}`);
        // revalidateTag(`progress-${userId}-${trackId}`); // Revalidate specific track progress
        return { success: true };

    } catch (error) {
        // Don't log overly verbose errors for progress updates if they happen frequently
        // console.error(`Error recording progress for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
             if(error.status === 404) { return { success: false, message: "Track not found." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
            return { success: false, message: `Failed to record progress: ${error.message}` };
        }
        return { success: false, message: 'Could not save progress.' };
    }
}

// --- Action: Create Bookmark ---
interface CreateBookmarkResult {
    success: boolean;
    message?: string;
    bookmark?: BookmarkResponseDTO; // Return the created bookmark DTO
}
export async function createBookmarkAction(trackId: string, timestampMs: number, note?: string | null): Promise<CreateBookmarkResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!trackId || timestampMs < 0) { return { success: false, message: "Invalid track ID or timestamp value." }; }

     const requestData: CreateBookmarkRequestDTO = { trackId, timestampMs, note: note ?? undefined };

     try {
         // Endpoint: POST /users/me/bookmarks
         const createdBookmark = await apiClient<BookmarkResponseDTO>(`/users/me/bookmarks`, {
             method: 'POST',
             body: JSON.stringify(requestData),
         });

         // Invalidate relevant TanStack Query caches or Next.js cache tags
         revalidateTag(`bookmarks-${userId}`);
         revalidateTag(`bookmarks-${userId}-${trackId}`);
         revalidatePath(`/tracks/${trackId}`); // Invalidate track detail page
         revalidatePath(`/bookmarks`); // Invalidate main bookmarks page

         console.log(`Bookmark created for user ${userId}, track ${trackId}`);
         return { success: true, bookmark: createdBookmark, message: "Bookmark added." };

     } catch (error) {
        console.error(`Error creating bookmark for user ${userId}, track ${trackId}:`, error);
        if (error instanceof APIError) {
             if(error.status === 404) { return { success: false, message: "Track not found." }; }
             if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             if (error.status === 400) { return { success: false, message: `Invalid input: ${error.message}` }; }
            return { success: false, message: `Failed to create bookmark: ${error.message}` };
        }
        return { success: false, message: 'An unexpected error occurred while creating the bookmark.' };
     }
}

// --- Action: Delete Bookmark ---
interface DeleteBookmarkResult {
     success: boolean;
     message?: string;
}
// ADDED optional trackId for more precise cache invalidation
export async function deleteBookmarkAction(bookmarkId: string, trackId?: string): Promise<DeleteBookmarkResult> {
     const userId = await getAuthenticatedUserID();
     if (!userId) { return { success: false, message: "User not authenticated." }; }
     if (!bookmarkId) { return { success: false, message: "Bookmark ID is required." }; }

     try {
         // Endpoint: DELETE /users/me/bookmarks/{bookmarkId}
         await apiClient<void>(`/users/me/bookmarks/${bookmarkId}`, { method: 'DELETE' });

         // Invalidate caches
         revalidateTag(`bookmarks-${userId}`); // Invalidate user's general bookmark list
         revalidatePath(`/bookmarks`); // Invalidate main bookmarks page path
         // Invalidate specific track list/page if trackId is provided
         if (trackId) {
             revalidateTag(`bookmarks-${userId}-${trackId}`);
             revalidatePath(`/tracks/${trackId}`);
         }

         console.log(`Bookmark deleted for user ${userId}, bookmark ${bookmarkId}`);
         return { success: true, message: "Bookmark deleted." };

     } catch (error) {
         console.error(`Error deleting bookmark ${bookmarkId} for user ${userId}:`, error);
         if (error instanceof APIError) {
              if(error.status === 404) { return { success: false, message: "Bookmark not found." }; }
              if(error.status === 403) { return { success: false, message: "Permission denied. You may not own this bookmark." }; }
              if (error.status === 401) { return { success: false, message: "Authentication required." }; }
             return { success: false, message: `Failed to delete bookmark: ${error.message}` };
         }
         return { success: false, message: 'An unexpected error occurred while deleting the bookmark.' };
     }
}```

---

## `apps/user-app/_components/activity/BookmarkList.tsx`

```tsx
// apps/user-app/_components/activity/BookmarkList.tsx
'use client';

import React, { useState, useTransition } from 'react';
import type { BookmarkResponseDTO } from '@repo/types';
import { formatDuration, cn } from '@repo/utils'; // Import cn
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui'; // Add Tooltip
import { X, Loader, Bookmark } from 'lucide-react';
import { deleteBookmarkAction } from '@/_actions/userActivityActions'; // Adjust alias
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/_hooks/useAuth'; // Need user ID for invalidation
import { bookmarksQueryKeys } from '@/_hooks/useBookmarks'; // Import query keys

interface BookmarkListProps {
  bookmarks: BookmarkResponseDTO[];
  onSeek: (timeSeconds: number) => void; // Callback to seek player
  isLoading?: boolean;
  trackId?: string; // Track ID IS needed for specific cache invalidation on delete
}

export function BookmarkList({ bookmarks, onSeek, isLoading, trackId }: BookmarkListProps) {
    const { user } = useAuth();
    const [isDeleting, startDeleteTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleDelete = (bookmarkId: string, bookmarkNote?: string | null) => {
        if (isDeleting) return;
        const bookmarkToDelete = bookmarks.find(b => b.id === bookmarkId);
        if (!bookmarkToDelete) return;

        if (!window.confirm(`Delete bookmark${bookmarkNote ? ` "${bookmarkNote}"` : ''} at ${formatDuration(bookmarkToDelete.timestampMs)}?`)) {
            return;
        }

        setDeletingId(bookmarkId);
        startDeleteTransition(async () => {
            // MODIFIED: Pass trackId to the action
            const result = await deleteBookmarkAction(bookmarkId, trackId);
            if (result.success) {
                console.log(`Bookmark ${bookmarkId} deleted`);
                // Invalidation logic (remains the same, action now handles invalidation based on provided trackId)
                const userId = user?.id;
                if (userId) {
                    queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.all(userId) });
                    if (trackId) {
                        queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.trackDetail(userId, trackId) });
                    }
                }
                 alert("Bookmark deleted!"); // Replace with toast
            } else {
                console.error("Failed to delete bookmark:", result.message);
                alert(`Error deleting bookmark: ${result.message || 'Unknown error'}`);
            }
            setDeletingId(null);
        });
    };

    if (isLoading) {
        return <div className="text-center p-4"><Loader className="h-5 w-5 animate-spin inline-block text-slate-400"/> Loading bookmarks...</div>;
    }

    if (!bookmarks || bookmarks.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 px-4 py-2 text-center italic">No bookmarks added for this track yet.</p>;
    }

    return (
        <TooltipProvider delayDuration={300}>
            <ul className="space-y-1">
                {bookmarks.map((bm) => {
                     const isCurrentlyDeleting = isDeleting && deletingId === bm.id;
                     return (
                        <li
                            key={bm.id}
                            className={cn(
                                "flex justify-between items-center p-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-700",
                                isCurrentlyDeleting && "opacity-50 pointer-events-none"
                            )}
                        >
                            <button
                                onClick={() => onSeek(bm.timestampMs / 1000)}
                                className="flex-grow text-left hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 truncate disabled:hover:text-inherit"
                                title={`Jump to ${formatDuration(bm.timestampMs)}`}
                                disabled={isCurrentlyDeleting}
                            >
                                <span className="font-mono text-sm mr-2 tabular-nums text-blue-700 dark:text-blue-300 w-[55px] inline-block">{formatDuration(bm.timestampMs)}</span>
                                {bm.note ? (
                                     <span className="text-slate-700 dark:text-slate-300 text-sm italic"> - {bm.note}</span>
                                ) : (
                                     <span className="text-slate-400 dark:text-slate-500 text-sm italic"> (No note)</span>
                                )}
                            </button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 h-7 w-7 flex-shrink-0"
                                        onClick={() => handleDelete(bm.id, bm.note)}
                                        disabled={isCurrentlyDeleting}
                                        aria-label={`Delete bookmark at ${formatDuration(bm.timestampMs)}`}
                                    >
                                        {isCurrentlyDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Delete Bookmark</p>
                                </TooltipContent>
                            </Tooltip>
                        </li>
                     );
                 })}
            </ul>
        </TooltipProvider>
    );
}```

---

## `apps/user-app/_components/auth/GoogleSignInButton.tsx`

```tsx
// apps/user-app/_components/auth/GoogleSignInButton.tsx
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { googleCallbackAction } from '@/_actions/authActions'; // Adjust path
import { Button } from '@repo/ui'; // Use shared button for consistency
import { Loader } from 'lucide-react'; // Example loading icon

// IMPORTANT: This MUST be prefixed with NEXT_PUBLIC_ for client-side access
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton() {
  const router = useRouter();
  const [isProcessing, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Store action result locally to trigger effects
  const [actionResult, setActionResult] = useState<{ success: boolean; message?: string; isNewUser?: boolean } | null>(null);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    setError(null);
    setActionResult(null);
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError('Google Sign-In failed: No ID token received.');
      return;
    }

    startTransition(async () => {
      const result = await googleCallbackAction(idToken);
      setActionResult(result); // Store action result to trigger useEffect
    });
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Provider Error');
    setError('Google Sign-In failed. Please ensure popups are allowed and try again.');
    setActionResult(null); // Clear previous results
  };

  // Effect to handle redirection or error display after action completes
  useEffect(() => {
     if (actionResult?.success) {
        console.log("Google Sign-In successful via action, redirecting...");
        // Redirect to home page or intended destination
        router.push('/'); // Redirect to dashboard
        // router.refresh(); // Optional: Force refresh
     } else if (actionResult && actionResult.success === false) {
        // Set error state based on the action's message
        setError(actionResult.message || 'Google Sign-In failed.');
     }
  }, [actionResult, router]);

  if (!googleClientId) {
    console.error("GoogleSignInButton: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
    return <p className="text-xs text-center text-red-500 mt-2">Google Sign-In is currently unavailable.</p>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
        <div className="flex flex-col items-center space-y-2 w-full">
             <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={handleGoogleError}
                 useOneTap={false} // Disable one-tap initially
                 shape="rectangular" // or 'circle', 'pill'
                 theme="outline" // or 'filled_blue', 'filled_black'
                 size="large"
                 width="100%" // Make it responsive
                 // containerProps={{ style: { width: '100%'} }} // Ensure container allows full width
             />

             {isProcessing && (
                 <div className="flex items-center justify-center text-sm text-gray-500 pt-2">
                     <Loader className="h-4 w-4 mr-2 animate-spin" /> Verifying...
                 </div>
             )}
             {/* Display error messages below the button */}
             {error && !isProcessing && ( // Only show error if not processing
                 <p className="text-red-600 text-sm pt-1 text-center">{error}</p>
             )}
         </div>
    </GoogleOAuthProvider>
  );
}```

---

## `apps/user-app/_components/auth/LoginForm.tsx`

```tsx
// apps/user-app/_components/auth/LoginForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/_actions/authActions';
import { Button, Input, Label } from '@repo/ui'; // Use shared components
import { Loader } from 'lucide-react';
import { cn } from '@repo/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
        {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
        {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Redirect on successful login
  React.useEffect(() => {
    if (state?.success) {
      console.log("Login successful, redirecting...");
      // Redirect to dashboard or intended page
      // Consider using searchParams.get('next') if implementing redirect after login
      router.push('/');
      // router.refresh(); // Can help ensure layout reflects logged-in state immediately
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="user@example.com"
            className={cn(state && !state.success && state.message?.toLowerCase().includes('email') ? 'border-red-500' : '')}
            aria-invalid={state && !state.success && state.message?.toLowerCase().includes('email') ? "true" : "false"}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="********"
            className={cn(state && !state.success && state.message?.toLowerCase().includes('password') ? 'border-red-500' : '')}
            aria-invalid={state && !state.success && state.message?.toLowerCase().includes('password') ? "true" : "false"}
        />
      </div>

      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200" role="alert">
            {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}```

---

## `apps/user-app/_components/auth/RegisterForm.tsx`

```tsx
// apps/user-app/_components/auth/RegisterForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/_actions/authActions';
import { Button, Input, Label } from '@repo/ui';
import { Loader } from 'lucide-react';
import { cn } from '@repo/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
        {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
        {pending ? 'Registering...' : 'Register'}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  // Redirect on successful registration
  useEffect(() => {
    if (state?.success) {
      console.log("Registration successful, redirecting...");
      router.push('/'); // Redirect to dashboard after successful registration
      // router.refresh(); // Optional
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Doe"
          className={cn(state && !state.success && state.message?.toLowerCase().includes('name') ? 'border-red-500' : '')}
          aria-invalid={state && !state.success && state.message?.toLowerCase().includes('name') ? "true" : "false"}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="user@example.com"
          className={cn(state && !state.success && state.message?.toLowerCase().includes('email') ? 'border-red-500' : '')}
           aria-invalid={state && !state.success && state.message?.toLowerCase().includes('email') ? "true" : "false"}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8} // Enforce minimum length on client too
          placeholder="********"
           className={cn(state && !state.success && state.message?.toLowerCase().includes('password') ? 'border-red-500' : '')}
           aria-invalid={state && !state.success && state.message?.toLowerCase().includes('password') ? "true" : "false"}
        />
         <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
      </div>

      {/* Display general form error message */}
      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200" role="alert">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}```

---

## `apps/user-app/_components/collection/CollectionCard.tsx`

```tsx
// apps/user-app/_components/collection/CollectionCard.tsx
import Link from 'next/link';
import type { AudioCollectionResponseDTO } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'; // Use Card parts
import { ListMusic, BookOpen } from 'lucide-react'; // Example icons
import { cn } from '@repo/utils';

interface CollectionCardProps {
    collection: AudioCollectionResponseDTO;
    className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
    const Icon = collection.type === 'COURSE' ? BookOpen : ListMusic;
    return (
        // Wrap Card in Link
        <Link href={`/collections/${collection.id}`} className={cn("block group", className)}>
             <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200"> {/* Ensure card fills height if in grid */}
                <CardHeader className="pb-2"> {/* Adjust padding */}
                     <div className="flex justify-between items-start gap-2">
                         <CardTitle className="text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                             {collection.title}
                         </CardTitle>
                         <Icon className="h-5 w-5 text-slate-400 flex-shrink-0 mt-1" />
                     </div>
                </CardHeader>
                 <CardContent className="flex-grow pt-0"> {/* Remove top padding, allow grow */}
                     <CardDescription className="text-xs line-clamp-3">
                         {collection.description || <span className="italic text-slate-400">No description.</span>}
                     </CardDescription>
                 </CardContent>
                 <div className="text-xs text-slate-500 border-t dark:border-slate-700 px-4 py-2 mt-auto"> {/* Footer style */}
                     <span className="capitalize">{collection.type.toLowerCase()}</span>
                     {/* TODO: Add track count if API provides it */}
                     {/* {collection.trackCount !== undefined && <span className="ml-2">{collection.trackCount} Tracks</span>} */}
                </div>
            </Card>
        </Link>
    );
}```

---

## `apps/user-app/_components/collection/CollectionForm.tsx`

```tsx
// apps/user-app/_components/collection/CollectionForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select, Label } from '@repo/ui';
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    CollectionType,
} from '@repo/types';
import {
    createCollectionAction,
    updateCollectionMetadataAction,
} from '@/_actions/collectionActions';
import { cn } from '@repo/utils';
import { Loader } from 'lucide-react';

// Define the shape of the form data handled by react-hook-form
interface CollectionFormData {
    title: string;
    description: string;
    type: CollectionType;
    // initialTrackIds removed - handle track selection separately
}

interface CollectionFormProps {
    initialData?: AudioCollectionResponseDTO | null; // For editing
    // Callback triggered on successful form submission (create or update)
    onSuccess?: (collection: AudioCollectionResponseDTO) => void;
    onCancel?: () => void; // Callback for cancel action
}

// --- Submit Button Component ---
function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[120px]">
            {pending ? (
                <> <Loader className="h-4 w-4 mr-2 animate-spin"/> Saving... </>
            ) : (isEditing ? 'Update Collection' : 'Create Collection')}
        </Button>
    );
}

// --- Main Form Component ---
export function CollectionForm({ initialData, onSuccess, onCancel }: CollectionFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const {
        register,
        handleSubmit, // Use RHF's handleSubmit for client-side validation *before* calling the action programmatically
        reset,
        control, // For Controller component (Select)
        formState: { errors, isDirty }, // Track errors and changes
    } = useForm<CollectionFormData>({
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            type: (initialData?.type as CollectionType) ?? 'PLAYLIST', // Default to PLAYLIST for new
        },
    });

    // Determine the correct server action based on mode
    const actionToCall = isEditing
        ? (data: CollectionFormData) => updateCollectionMetadataAction(initialData!.id, data) // Pass data directly
        : (data: CollectionFormData) => createCollectionAction({ ...data, initialTrackIds: [] }); // Create without tracks

    // State for handling server action feedback
    type ActionState = { success: boolean; message?: string; collection?: AudioCollectionResponseDTO } | null;
    const [state, submitAction, isPending] = useActionState<ActionState, CollectionFormData>(actionToCall, null);

    // Reset form if initialData changes (e.g., navigating between edit pages)
    useEffect(() => {
        if (initialData) {
            reset({ title: initialData.title, description: initialData.description ?? '', type: initialData.type });
        } else {
            reset({ title: '', description: '', type: 'PLAYLIST' });
        }
    }, [initialData, reset]);

    // Handle success/error feedback after server action completes
    useEffect(() => {
        if (state?.success) {
            const collection = state.collection ?? initialData; // Use returned or initial data
            // Show success feedback (e.g., toast)
            alert(isEditing ? "Collection updated successfully!" : "Collection created successfully!"); // Replace with toast
            if (onSuccess && collection) {
                onSuccess(collection); // Call onSuccess callback if provided
            } else if (collection?.id && !isEditing) { // Default redirect on create if no callback
                router.push(`/collections/${collection.id}`);
            }
            // Optionally reset form after successful creation if not redirecting
            // if (!isEditing && !onSuccess) reset();
        } else if (state && !state.success && state.message) {
            // Show server-side error (e.g., toast or inline message)
            console.error("Server Action Error:", state.message);
            // Error message is displayed below the form using `state.message`
        }
    }, [state, isEditing, onSuccess, initialData, router, reset]);

    // RHF's onSubmit handles client validation THEN calls submitAction
    const onSubmit: SubmitHandler<CollectionFormData> = (data) => {
        // Client-side validation passed, now call the server action
        submitAction(data);
    };

    return (
        // Use RHF's handleSubmit to trigger client validation before calling the action
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Title Field */}
            <div>
                <Label htmlFor="title" className={cn(errors.title && "text-red-600")}>Title*</Label>
                <Input
                    id="title"
                    {...register('title', { required: 'Title is required', maxLength: { value: 255, message: 'Title cannot exceed 255 characters'} })}
                    className={cn("mt-1", errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                    aria-invalid={errors.title ? "true" : "false"}
                    disabled={isPending}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1" role="alert">{errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className={cn("mt-1", errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                    aria-invalid={errors.description ? "true" : "false"}
                    disabled={isPending}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1" role="alert">{errors.description.message}</p>}
            </div>

            {/* Type Field */}
            <div>
                <Label htmlFor="type" className={cn(errors.type && "text-red-600")}>Collection Type*</Label>
                {/* Use Controller for integrating non-standard inputs like Select with RHF */}
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Collection type is required' }}
                    render={({ field }) => (
                        <Select
                            id="type"
                            {...field} // Spread field props (value, onChange, onBlur)
                            className={cn("mt-1 block w-full", errors.type ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                            aria-invalid={errors.type ? "true" : "false"}
                            disabled={isPending}
                        >
                            <option value="PLAYLIST">Playlist</option>
                            <option value="COURSE">Course</option>
                        </Select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-xs mt-1" role="alert">{errors.type.message}</p>}
            </div>

            {/* Display Server Action Error Message (if not handled by toasts) */}
            {state && !state.success && state.message && (
                <p className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded" role="alert">
                    {state.message}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t dark:border-slate-700">
                 {/* Allow Cancel button only if callback provided */}
                 {onCancel && (
                     <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
                         Cancel
                     </Button>
                 )}
                {/* SubmitButton uses useFormStatus which is tied to the <form> */}
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    );
}```

---

## `apps/user-app/_components/collection/CollectionList.tsx`

```tsx
// apps/user-app/_components/collection/CollectionList.tsx
import type { AudioCollectionResponseDTO } from '@repo/types';
import { CollectionCard } from './CollectionCard';
import { ListMusic } from 'lucide-react';

interface CollectionListProps {
    collections: AudioCollectionResponseDTO[];
    isLoading?: boolean;
}

export function CollectionList({ collections, isLoading }: CollectionListProps) {
    if (isLoading) {
      // Optional: Render skeleton loaders
      return (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg aspect-[4/3]"></div> // Placeholder aspect ratio
               ))}
           </div>
      );
  }

    if (!collections || collections.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <ListMusic className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2"/>
                No collections found.
                {/* TODO: Add a button/link to create one? */}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
    );
}```

---

## `apps/user-app/_components/collection/CollectionTrackList.tsx`

```tsx
// apps/user-app/_components/collection/CollectionTrackList.tsx
'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import type { AudioTrackResponseDTO } from '@repo/types';
import { PlayTrackButton } from '@/_components/track/PlayTrackButton'; // Use correct import alias
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui';
import { X, GripVertical, Loader, AlertTriangle, ListRestart } from 'lucide-react';
import { updateCollectionTracksAction } from '@/_actions/collectionActions'; // Use correct import alias
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@repo/utils';
import { useAuth } from '@/_hooks/useAuth'; // Use correct import alias

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CollectionTrackListProps {
    initialTracks: AudioTrackResponseDTO[];
    collectionId: string;
    isOwner: boolean; // Determines if edit controls are shown
}

// --- Sortable Item Component ---
interface SortableTrackItemProps {
    track: AudioTrackResponseDTO;
    isOwner: boolean;
    onRemove: (trackId: string) => void;
    isProcessing: boolean; // Is THIS item being removed?
    isSavingOrder: boolean; // Is the overall order being saved?
}

function SortableTrackItem({ track, isOwner, onRemove, isProcessing, isSavingOrder }: SortableTrackItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: track.id, disabled: !isOwner || isProcessing || isSavingOrder }); // Disable during any processing

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 250ms ease',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
        cursor: isOwner ? (isDragging ? 'grabbing' : 'grab') : 'default',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm mb-2 transition-shadow",
                isDragging && "shadow-lg ring-2 ring-blue-500",
                (isProcessing || isSavingOrder) && "opacity-50 pointer-events-none animate-pulse"
            )}
            {...attributes} // Attributes for accessibility
        >
            <div className="flex items-center gap-2 md:gap-3 flex-grow min-w-0">
                {isOwner && (
                    <button
                        {...listeners} // Listeners only on the handle
                        aria-label={`Drag to reorder ${track.title}`}
                        title="Drag to reorder"
                        className="cursor-grab touch-none p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isProcessing || isSavingOrder}
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                )}
                {/* Add padding if not owner to align with handle space */}
                {!isOwner && <div className="w-7 h-7 flex-shrink-0"></div>}
                <div className="truncate flex-grow">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {track.languageCode} {track.level && `(${track.level})`}
                    </p>
                </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-1 ml-2">
                <PlayTrackButton trackId={track.id} trackTitle={track.title} />
                {isOwner && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 w-7 h-7"
                                onClick={() => onRemove(track.id)}
                                disabled={isProcessing || isSavingOrder}
                                aria-label={`Remove ${track.title}`}
                            >
                                {isProcessing ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                         <TooltipContent side="top"><p>Remove from Collection</p></TooltipContent>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

// --- Main List Component ---
export function CollectionTrackList({ initialTracks, collectionId, isOwner }: CollectionTrackListProps) {
    const { user } = useAuth();
    const [tracks, setTracks] = useState(initialTracks);
    const [isSaving, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [processingTrackId, setProcessingTrackId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Memoize track IDs for SortableContext
    const trackIds = useMemo(() => tracks.map(t => t.id), [tracks]);

    // Sync local state if initialTracks prop changes externally
    useEffect(() => {
        // Only update if the incoming list is different from the current list order
        const initialIds = initialTracks.map(t => t.id).join(',');
        const currentIds = tracks.map(t => t.id).join(',');
        if (initialIds !== currentIds) {
            setTracks(initialTracks);
        }
    }, [initialTracks]); // Intentionally exclude 'tracks'

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const saveTrackOrder = useCallback((newOrderedTracks: AudioTrackResponseDTO[]) => {
        if (!isOwner) return;
        const orderedIds = newOrderedTracks.map(t => t.id);
        setError(null);
        startTransition(async () => {
            const result = await updateCollectionTracksAction(collectionId, { orderedTrackIds: orderedIds });
            setProcessingTrackId(null); // Clear specific track processing state after save attempt
            if (!result.success) {
                console.error("Failed to update track order:", result.message);
                setError(result.message || "Failed to save changes.");
                setTracks(initialTracks); // Revert optimistic update on error
            } else {
                console.log("Track order saved successfully.");
                // Invalidate query after successful save
                const userId = user?.id;
                // Invalidate collection detail to get updated track list/order
                 queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
                 // Optionally invalidate user's collection list if order affects display there
                 if (userId) {
                    queryClient.invalidateQueries({ queryKey: ['collections', userId] });
                 }
            }
        });
    }, [collectionId, initialTracks, isOwner, queryClient, user?.id]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTracks((currentTracks) => {
            const oldIndex = currentTracks.findIndex((t) => t.id === active.id);
            const newIndex = currentTracks.findIndex((t) => t.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return currentTracks;
            const reorderedTracks = arrayMove(currentTracks, oldIndex, newIndex);
            saveTrackOrder(reorderedTracks); // Save new order async
            return reorderedTracks; // Optimistic update
        });
    }

    const handleRemoveTrack = useCallback((trackIdToRemove: string) => {
        if (isSaving) return;
        const trackToRemove = tracks.find(t => t.id === trackIdToRemove);
         if (!window.confirm(`Remove "${trackToRemove?.title ?? 'this track'}" from the collection?`)) return;

        const filteredTracks = tracks.filter(track => track.id !== trackIdToRemove);
        setProcessingTrackId(trackIdToRemove); // Indicate which track is being processed
        setTracks(filteredTracks); // Optimistic UI Update
        saveTrackOrder(filteredTracks); // Save new order (without the track)
    }, [tracks, isSaving, saveTrackOrder]);

    const handleRevertChanges = useCallback(() => {
        if (isSaving) return;
        if (window.confirm("Discard local changes and revert to the last saved order?")) {
            setError(null);
            setTracks(initialTracks);
        }
    }, [initialTracks, isSaving]);

    const hasLocalChanges = useMemo(() => {
        return JSON.stringify(initialTracks.map(t => t.id)) !== JSON.stringify(tracks.map(t => t.id));
    }, [initialTracks, tracks]);


    if (!tracks) return <div className="p-4 text-center text-slate-500">Loading tracks...</div>;
    if (tracks.length === 0 && initialTracks.length === 0) return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No tracks in this collection yet.</p>;

    return (
        <div className="space-y-3">
            {error && (
                <div className="p-3 border border-red-400 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-center justify-between">
                    <span className="flex items-center"><AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0"/> {error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"><IconX size={16}/></Button>
                </div>
            )}
             {isOwner && hasLocalChanges && !isSaving && !error && (
                 <div className="p-2 border border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md flex items-center justify-between text-sm">
                    <span>You have unsaved changes in the track order.</span>
                    <Button onClick={handleRevertChanges} variant="ghost" size="sm" className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50">
                        <ListRestart size={14} className="mr-1"/> Revert
                    </Button>
                </div>
             )}

            <TooltipProvider delayDuration={300}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                >
                    <SortableContext items={trackIds} strategy={verticalListSortingStrategy} disabled={!isOwner || isSaving}>
                        {tracks.map((track) => (
                            <SortableTrackItem
                                key={track.id}
                                track={track}
                                isOwner={isOwner}
                                onRemove={handleRemoveTrack}
                                isProcessing={processingTrackId === track.id} // Specific track being removed
                                isSavingOrder={isSaving && processingTrackId !== track.id} // Overall save in progress
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </TooltipProvider>

             {isSaving && !processingTrackId && ( // Show generic saving indicator only if not processing a specific track removal
                <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <Loader className="h-4 w-4 animate-spin mr-2" /> Saving changes...
                </div>
             )}
        </div>
    );
}```

---

## `apps/user-app/_components/collection/CollectionTrackSelector.tsx`

```tsx
// apps/user-app/_components/collection/CollectionTrackSelector.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@repo/utils'; // Use shared hook if available, or local one
import { listTracks } from '@/_services/trackService'; // User track service
import type { AudioTrackResponseDTO, ListTrackQueryParams } from '@repo/types';
import { Input, Checkbox, Label, Spinner, Button } from '@repo/ui';
import { X as IconX, Search, ListPlus, Check } from 'lucide-react';
import { cn } from '@repo/utils';

// Query key factory for track search
const trackSearchQueryKeys = {
    search: (term: string) => ['tracks', 'search', term] as const,
};

interface CollectionTrackSelectorProps {
    // IDs of tracks already in the collection (to disable selection)
    existingTrackIds?: string[];
    // Callback when tracks are selected/deselected to be added
    onTracksSelected: (selectedIds: string[]) => void;
    disabled?: boolean; // Disable the whole component
}

export function CollectionTrackSelector({
    existingTrackIds = [],
    onTracksSelected,
    disabled = false
}: CollectionTrackSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<AudioTrackResponseDTO[]>([]);
    // Store IDs of tracks selected *in this component instance*
    const [newlySelectedIds, setNewlySelectedIds] = useState<Set<string>>(new Set());
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const existingIdsSet = useMemo(() => new Set(existingTrackIds), [existingTrackIds]);

    // Fetch search results using TanStack Query
    const { data: searchData, isLoading, isFetching, isError, error } = useQuery({
        queryKey: trackSearchQueryKeys.search(debouncedSearchTerm),
        queryFn: async () => {
            if (!debouncedSearchTerm.trim()) return { data: [], total: 0 }; // Return empty if no search term
            const params: ListTrackQueryParams = { q: debouncedSearchTerm, limit: 20 }; // Limit results
            // Assuming listTracks service function exists and works
            return listTracks(params);
        },
        enabled: !!debouncedSearchTerm.trim(), // Only fetch when search term is present
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000, // Cache search results for 5 mins
    });

    // Update local results state when query data changes
    useEffect(() => {
        setSearchResults(searchData?.data ?? []);
    }, [searchData]);

    // Handle checkbox change for newly selected tracks
    const handleSelect = useCallback((trackId: string, isSelected: boolean) => {
        setNewlySelectedIds(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(trackId);
            } else {
                newSet.delete(trackId);
            }
            return newSet;
        });
    }, []);

    // Handle adding selected tracks
    const handleAddSelected = () => {
        onTracksSelected(Array.from(newlySelectedIds));
        // Clear selection and search after adding
        setNewlySelectedIds(new Set());
        setSearchTerm('');
        setSearchResults([]);
    };

    const isSearching = isLoading || isFetching;

    return (
        <div className={cn("space-y-3 border p-3 rounded bg-slate-50 dark:bg-slate-800/50", disabled && "opacity-70 pointer-events-none")}>
            <Label className="text-sm font-medium" htmlFor="track-search-input">Add Tracks to Collection</Label>
            <div className="relative">
                <Input
                    id="track-search-input"
                    type="search"
                    placeholder="Search tracks by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled || isSearching}
                    className="pl-8"
                />
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 {isSearching && <Spinner size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" />}
            </div>

            {isError && (
                 <p className="text-xs text-red-600">Error searching: {error instanceof Error ? error.message : 'Unknown error'}</p>
             )}

            {/* Search Results List */}
            {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border rounded bg-white dark:bg-slate-900 p-2 space-y-1 shadow-sm">
                    {searchResults.map(track => {
                         const isAlreadyInCollection = existingIdsSet.has(track.id);
                         const isSelected = newlySelectedIds.has(track.id);
                         const isDisabled = isAlreadyInCollection || disabled;
                         return (
                             <div key={track.id} className={cn("flex items-center space-x-2 p-1 rounded", isDisabled ? "opacity-60" : "hover:bg-slate-100 dark:hover:bg-slate-700/50")}>
                                 <Checkbox
                                    id={`track-select-${track.id}`}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onCheckedChange={(checked) => handleSelect(track.id, !!checked)}
                                    aria-label={`Select track ${track.title}`}
                                />
                                <Label
                                    htmlFor={`track-select-${track.id}`}
                                    className={cn("text-sm font-normal flex-grow truncate", isDisabled ? "cursor-not-allowed" : "cursor-pointer")}
                                >
                                    {track.title}
                                    <span className="text-xs text-slate-500 ml-1">({track.languageCode})</span>
                                    {isAlreadyInCollection && <span className="text-xs text-green-600 dark:text-green-400 ml-1 italic">(Already Added)</span>}
                                </Label>
                             </div>
                         );
                    })}
                </div>
            )}
            {!isSearching && debouncedSearchTerm && searchResults.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 p-2 text-center italic">
                    No tracks found matching "{debouncedSearchTerm}".
                </p>
            )}

            {/* Add Button */}
            {newlySelectedIds.size > 0 && (
                 <div className="flex justify-end pt-2 border-t dark:border-slate-700/50">
                     <Button type="button" onClick={handleAddSelected} size="sm" disabled={disabled}>
                         <ListPlus size={16} className="mr-1"/> Add {newlySelectedIds.size} Selected Track(s)
                     </Button>
                 </div>
            )}
        </div>
    );
}```

---

## `apps/user-app/_components/layout/Footer.tsx`

```tsx
// apps/user-app/_components/layout/Footer.tsx
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 p-4 mt-auto border-t dark:border-slate-700">
      © {currentYear} YourAppName. All rights reserved.
       {/* Optional: Add links */}
       {/* <span className="mx-2">|</span>
       <a href="/privacy" className="hover:underline">Privacy Policy</a> */}
    </footer>
  );
}```

---

## `apps/user-app/_components/layout/Navbar.tsx`

```tsx
// apps/user-app/_components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/_hooks/useAuth';
import { logoutAction } from '@/_actions/authActions';
import { Button } from '@repo/ui';
import { User, LogOut, LogIn, UserPlus, Music, ListMusic, Bookmark, Loader } from 'lucide-react';
import { cn } from '@repo/utils';

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/tracks", label: "Tracks", icon: Music },
    { href: "/collections", label: "Collections", icon: ListMusic, protected: true },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, protected: true },
    // Add Upload link if desired
    // { href: "/upload", label: "Upload", icon: UploadCloud, protected: true },
  ];

  return (
    <nav className="bg-slate-900 text-slate-200 p-3 shadow-md sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold hover:text-white transition-colors flex items-center gap-2">
           {/* <Headphones className="h-5 w-5"/> Optional Logo */}
           AudioLang
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          {/* Main Navigation */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4">
              {navItems.map((item) => {
                 // Hide protected routes if not authenticated or still loading auth state
                 if (item.protected && (!isAuthenticated || isLoading)) return null;

                 const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                 return (
                     <Link
                         key={item.href}
                         href={item.href}
                         className={cn(
                             "flex items-center text-sm font-medium transition-colors px-2 py-1 rounded",
                             isActive ? "text-white bg-slate-700" : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                         )}
                         aria-current={isActive ? "page" : undefined}
                     >
                         <item.icon className="h-4 w-4 mr-1.5" />
                         {item.label}
                     </Link>
                 );
              })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin text-slate-400" />
            ) : isAuthenticated && user ? (
              <>
                <Link href="/profile" className="flex items-center hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-slate-500" title="Profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
                {/* Logout Form */}
                <form action={logoutAction}>
                  <Button variant="ghost" size="sm" type="submit" className="text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1" title="Logout">
                    <LogOut className="h-4 w-4 mr-1" /> Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1">
                   <Link href="/login"><LogIn className="h-4 w-4 mr-1" /> Login</Link>
                </Button>
                 <Button variant="outline" size="sm" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-2 py-1">
                   <Link href="/register"><UserPlus className="h-4 w-4 mr-1" /> Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}```

---

## `apps/user-app/_components/player/AddBookmarkButton.tsx`

```tsx
// apps/user-app/_components/player/AddBookmarkButton.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { usePlayerStore } from '@/_stores/playerStore';
import { createBookmarkAction } from '@/_actions/userActivityActions';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui';
import { BookmarkPlus, Loader } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { bookmarksQueryKeys } from '@/_hooks/useBookmarks'; // Import query keys
import { useAuth } from '@/_hooks/useAuth';
import { PlaybackState } from '@/_lib/constants';

export function AddBookmarkButton() {
  const { user } = useAuth(); // Get user for query keys
  const { currentTrackDetails, currentTime, playbackState } = usePlayerStore(state => ({
    currentTrackDetails: state.currentTrackDetails,
    currentTime: state.currentTime,
    playbackState: state.playbackState,
  }));
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  // Can bookmark if a track is loaded, playing/paused/ready/ended, and time > 0
  const canBookmark = currentTrackDetails && currentTime >= 0 &&
                      playbackState !== PlaybackState.IDLE &&
                      playbackState !== PlaybackState.LOADING &&
                      playbackState !== PlaybackState.DECODING &&
                      playbackState !== PlaybackState.ERROR;

  const handleAddBookmark = () => {
    if (!canBookmark || !user?.id) return;

    const timestampMs = Math.floor(currentTime * 1000);
    const trackId = currentTrackDetails!.id; // Assert non-null because canBookmark is true

    startTransition(async () => {
      // TODO: Implement input for a 'note' if desired
      const note = prompt("Add an optional note for this bookmark:"); // Simple prompt, replace with proper UI
      const result = await createBookmarkAction(trackId, timestampMs, note); // Pass note

      if (result.success && result.bookmark) {
        console.log('Bookmark created:', result.bookmark);
        // Invalidate relevant bookmark queries
        // Use query keys factory for consistency
        queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.trackDetail(user.id, trackId) });
        queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.all(user.id) });
        // TODO: Show success toast
         alert("Bookmark added!");
      } else {
        console.error("Failed to add bookmark:", result.message);
        // TODO: Show error toast
        alert(`Error adding bookmark: ${result.message || 'Unknown error'}`);
      }
    });
  };

  return (
     <TooltipProvider delayDuration={300}>
         <Tooltip>
             <TooltipTrigger asChild>
                 <Button
                    onClick={handleAddBookmark}
                    disabled={!canBookmark || isPending}
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                 >
                 {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <BookmarkPlus className="h-4 w-4" />}
                 <span className="ml-1 hidden md:inline">Bookmark</span>
                 </Button>
             </TooltipTrigger>
             <TooltipContent side="top">
                 <p>Add bookmark at current time</p>
             </TooltipContent>
         </Tooltip>
     </TooltipProvider>
  );
}```

---

## `apps/user-app/_components/player/PlayerUI.tsx`

```tsx
// apps/user-app/_components/player/PlayerUI.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/_stores/playerStore';
import { PlaybackState } from '@/_lib/constants';
import { formatDuration } from '@repo/utils';
import { Button, Progress } from '@repo/ui'; // Add Progress
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Loader, AlertTriangle, Rewind, FastForward } from 'lucide-react'; // Added Rewind/FF
import { AddBookmarkButton } from './AddBookmarkButton'; // Import bookmark button
import Link from 'next/link';
import Image from 'next/image';

export function PlayerUI() {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Select needed state and actions from store
  const {
    playbackState,
    currentTrackDetails,
    duration,
    currentTime,
    // bufferedTime, // Less useful with WAAPI, maybe hide progress bar fill for streaming?
    volume,
    isMuted,
    isLoading, // Combined loading/decoding/buffering indicator
    error,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    _setHtmlAudioElementRef,
    stop, // Add stop action
  } = usePlayerStore(state => ({
    playbackState: state.playbackState,
    currentTrackDetails: state.currentTrackDetails,
    duration: state.duration,
    currentTime: state.currentTime,
    // bufferedTime: state.bufferedTime,
    volume: state.volume,
    isMuted: state.isMuted,
    // Consolidate loading states
    isLoading: state.playbackState === PlaybackState.LOADING || state.playbackState === PlaybackState.DECODING || state.playbackState === PlaybackState.BUFFERING,
    error: state.error,
    togglePlayPause: state.togglePlayPause,
    seek: state.seek,
    setVolume: state.setVolume,
    toggleMute: state.toggleMute,
    _setHtmlAudioElementRef: state._setHtmlAudioElementRef,
    stop: state.stop, // Get stop action
  }));

  // Pass the audio element ref to the store when it mounts/unmounts
  useEffect(() => {
    _setHtmlAudioElementRef(audioRef.current);
    return () => _setHtmlAudioElementRef(null);
  }, [_setHtmlAudioElementRef]);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(event.target.value));
  };

   const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

   const handleSeekRelative = (deltaSeconds: number) => {
       seek(currentTime + deltaSeconds);
   };

  // --- Conditional Rendering ---
  if (playbackState === PlaybackState.IDLE && !isLoading) {
    return null; // Don't render player if nothing is loaded/loading
  }

  const isPlaying = playbackState === PlaybackState.PLAYING; // Simplify playing check
  const canInteract = playbackState !== PlaybackState.IDLE && playbackState !== PlaybackState.LOADING && playbackState !== PlaybackState.DECODING && playbackState !== PlaybackState.ERROR;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-slate-100 p-3 shadow-lg border-t border-slate-700 z-50">
       {/* Hidden Audio Element for Streaming */}
       <audio ref={audioRef} preload="metadata" />

       <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">

            {/* Left: Track Info */}
            <div className="flex items-center gap-3 flex-shrink min-w-0 w-full sm:w-1/4">
                {currentTrackDetails?.coverImageUrl ? (
                    <Image
                        src={currentTrackDetails.coverImageUrl}
                        alt={currentTrackDetails.title ?? 'Track cover'}
                        width={40} height={40}
                        className="h-10 w-10 rounded object-cover flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide img on error
                     />
                 ) : (
                    <div className="h-10 w-10 rounded bg-slate-700 flex-shrink-0"></div> // Placeholder
                 )}
                <div className="truncate">
                    {currentTrackDetails ? (
                         <Link href={`/tracks/${currentTrackDetails.id}`} className="font-semibold text-sm truncate hover:underline" title={currentTrackDetails.title}>
                             {currentTrackDetails.title}
                         </Link>
                    ) : (
                        <span className="font-semibold text-sm truncate italic text-slate-400">Loading...</span>
                    )}
                     {/* Add artist/source later if available */}
                </div>
            </div>

            {/* Center: Controls & Progress */}
             <div className="flex flex-col items-center flex-grow w-full sm:w-1/2 max-w-xl">
                 {/* Control Buttons */}
                <div className="flex items-center justify-center gap-2 mb-1 w-full">
                     <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => handleSeekRelative(-10)} disabled={!canInteract} title="Rewind 10s">
                       <Rewind className="h-5 w-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700 w-10 h-10" onClick={togglePlayPause} disabled={!canInteract || isLoading} title={isPlaying ? "Pause" : "Play"}>
                         {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : (isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />)}
                     </Button>
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => handleSeekRelative(30)} disabled={!canInteract} title="Forward 30s">
                        <FastForward className="h-5 w-5" />
                     </Button>
                      {/* Bookmark Button */}
                     <div className="ml-auto">
                         <AddBookmarkButton />
                     </div>
                </div>
                 {/* Progress Bar */}
                 <div className="w-full flex items-center gap-2 text-xs">
                     <span className="font-mono tabular-nums w-[45px] text-right">{formatDuration(currentTime * 1000)}</span>
                     <input
                        type="range"
                        min="0"
                        max={duration || 1} // Use 1 if duration is 0
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={!canInteract}
                        className="w-full h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Seek slider"
                     />
                     <span className="font-mono tabular-nums w-[45px]">{formatDuration(duration * 1000)}</span>
                </div>
                 {/* Error state */}
                 {playbackState === PlaybackState.ERROR && error && (
                     <span className="text-xs text-red-400 mt-1 flex items-center justify-center">
                         <AlertTriangle className="h-3 w-3 mr-1" /> {error}
                          <Button variant="ghost" size="sm" onClick={stop} className="ml-2 text-red-400 hover:text-red-300 h-auto p-0 underline">Clear</Button>
                     </span>
                 )}

             </div>

            {/* Right: Volume Control */}
            <div className="flex items-center gap-2 w-full justify-center sm:w-1/4 sm:justify-end">
                 <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                     {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                 </Button>
                 <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 accent-blue-500"
                    aria-label="Volume slider"
                 />
            </div>
       </div>
    </div>
  );
}```

---

## `apps/user-app/_components/track/PlayTrackButton.tsx`

```tsx
// apps/user-app/_components/track/PlayTrackButton.tsx
'use client';
import { usePlayerStore } from '@/_stores/playerStore'; // Adjust path
import { Button } from '@repo/ui';
import { Play, Pause, Loader } from 'lucide-react';
import { PlaybackState } from '@/_lib/constants'; // Adjust path
import { cn } from '@repo/utils';

interface PlayTrackButtonProps {
  trackId: string;
  trackTitle: string;
  size?: 'sm' | 'default' | 'lg' | 'icon'; // Allow different sizes
  className?: string; // Allow custom classes
  showLabel?: boolean; // Option to show/hide label text
}

export function PlayTrackButton({
    trackId,
    trackTitle,
    size = 'sm',
    className,
    showLabel = true,
}: PlayTrackButtonProps) {
  // Select needed state and actions
  const { loadAndPlayTrack, togglePlayPause, currentTrackId, playbackState } = usePlayerStore(
    (state) => ({
        loadAndPlayTrack: state.loadAndPlayTrack,
        togglePlayPause: state.togglePlayPause,
        currentTrackId: state.currentTrackDetails?.id,
        playbackState: state.playbackState,
    })
  );

  const isCurrentTrack = currentTrackId === trackId;
  // Consider LOADING/DECODING/BUFFERING as intermediate states before playing/pausing
  const isPlaying = isCurrentTrack && playbackState === PlaybackState.PLAYING;
  const isPaused = isCurrentTrack && playbackState === PlaybackState.PAUSED;
  const isLoading = isCurrentTrack && (
        playbackState === PlaybackState.LOADING ||
        playbackState === PlaybackState.DECODING ||
        playbackState === PlaybackState.BUFFERING
  );
  const isReady = isCurrentTrack && (playbackState === PlaybackState.READY || playbackState === PlaybackState.ENDED);


  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlayPause(); // Toggle play/pause if it's already the loaded track
    } else {
      loadAndPlayTrack(trackId); // Load and play if it's a different track
    }
  };

  // Determine button icon and text
  let Icon = Play;
  let label = "Play";
  let title = `Play ${trackTitle}`;
  let variant: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | null | undefined = "secondary"; // Default variant

  if (isLoading) {
      Icon = Loader;
      label = "Loading...";
      title = `Loading ${trackTitle}`;
      variant = "ghost"; // Use ghost variant while loading
  } else if (isPlaying) {
      Icon = Pause;
      label = "Pause";
      title = `Pause ${trackTitle}`;
      variant = "default"; // Use primary variant when playing
  } else if (isPaused || isReady) {
      Icon = Play; // Show Play icon if paused or ready/ended
      label = "Play";
      title = `Play ${trackTitle}`;
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn("w-full justify-center", className)} // Default to full width, allow override
      title={title}
      disabled={isLoading} // Disable only while loading this specific track
      aria-label={title}
    >
      <Icon className={cn("h-4 w-4", showLabel && "mr-2", isLoading && 'animate-spin')} />
      {showLabel && label}
    </Button>
  );
}```

---

## `apps/user-app/_components/track/TrackActivityClient.tsx`

```tsx
// apps/user-app/_components/track/TrackActivityClient.tsx
'use client';

import { useAuth } from '@/_hooks/useAuth';
import { useTrackBookmarks } from '@/_hooks/useBookmarks';
import { usePlayerStore } from '@/_stores/playerStore';
import { BookmarkList } from '@/_components/activity/BookmarkList';
import { AddBookmarkButton } from '@/_components/player/AddBookmarkButton';
import { Loader, Info } from 'lucide-react';
import Link from 'next/link';

interface TrackActivityClientProps {
    trackId: string;
}

export function TrackActivityClient({ trackId }: TrackActivityClientProps) {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
    const { seek: playerSeek } = usePlayerStore(state => ({ seek: state.seek }));

    // Fetch bookmarks specifically for this track
    const { data: bookmarks, isLoading: isLoadingBookmarks, error: bookmarksError } =
        useTrackBookmarks(user?.id, trackId); // Hook handles enabled flag

    // --- Render Logic ---

    // Show loading indicator while auth state is resolving
    if (isLoadingAuth) {
        return <div className="flex justify-center items-center p-4"><Loader className="h-5 w-5 animate-spin text-slate-400"/></div>;
    }

    // Prompt login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="text-sm text-center text-slate-500 dark:text-slate-400 my-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50">
                <Info size={18} className="inline-block mr-1 mb-0.5"/>
                <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                to save your progress and add bookmarks.
            </div>
        );
    }

    // Render bookmark section for authenticated users
    return (
        <div className="mt-6 space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                    <h3 className="font-semibold text-lg">Bookmarks</h3>
                    {/* AddBookmarkButton already checks if track is loaded/playing */}
                    <AddBookmarkButton />
                </div>
                {bookmarksError && <p className="text-red-500 text-sm px-4 py-2">Error loading bookmarks.</p>}
                <BookmarkList
                    bookmarks={bookmarks ?? []}
                    isLoading={isLoadingBookmarks}
                    onSeek={playerSeek}
                    trackId={trackId} // Pass trackId for cache invalidation on delete
                />
            </div>
        </div>
    );
}```

---

## `apps/user-app/_components/track/TrackCard.tsx`

```tsx
// apps/user-app/_components/track/TrackCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AudioTrackResponseDTO } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'; // Use Card parts
import { formatDuration, cn } from '@repo/utils';
import { PlayTrackButton } from './PlayTrackButton';
import { Badge } from '@repo/ui';
import { WifiOff, MusicNote } from 'lucide-react'; // Example icons

interface TrackCardProps {
  track: AudioTrackResponseDTO;
  className?: string;
}

export function TrackCard({ track, className }: TrackCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden h-full shadow hover:shadow-md transition-shadow duration-200", className)}>
      {/* Image/Link Area */}
      <Link href={`/tracks/${track.id}`} className="block group relative aspect-[16/10] bg-slate-200 dark:bg-slate-700 overflow-hidden">
        {track.coverImageUrl ? (
           <Image
               src={track.coverImageUrl}
               alt={`Cover art for ${track.title}`}
               fill
               sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
               className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
               priority={false} // Lower priority unless critical
               onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.svg'; /* Fallback image */ }}
            />
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                 <MusicNote size={32}/>
                 <span className="mt-1 text-xs">{track.languageCode}</span>
           </div>
        )}
         {!track.isPublic && (
            <TooltipProvider delayDuration={100}>
                 <Tooltip>
                     <TooltipTrigger asChild>
                         <div className="absolute top-2 right-2 bg-slate-800/70 text-white p-1 rounded-full backdrop-blur-sm">
                              <WifiOff size={14} aria-label="Private Track"/>
                          </div>
                      </TooltipTrigger>
                      <TooltipContent side="left"><p>Private Track</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
         )}
      </Link>

      {/* Content Area */}
      <CardContent className="p-3 flex-grow flex flex-col"> {/* Reduced padding, allow grow */}
         <Link href={`/tracks/${track.id}`} className="block mb-1">
           <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400" title={track.title}>
            {track.title}
           </CardTitle>
         </Link>
         <CardDescription className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 flex-grow mb-2">
           {track.description || ''}
         </CardDescription>

         {/* Tags */}
         {track.tags && track.tags.length > 0 && (
             <div className="mb-2 flex flex-wrap gap-1">
                 {track.tags.slice(0, 3).map(tag => (
                     <Badge key={tag} variant="secondary">{tag}</Badge>
                 ))}
             </div>
         )}
        {/* Metadata Footer */}
         <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="truncate">
                {track.languageCode}
                {track.level && <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">{track.level}</Badge>}
            </span>
            <span>{formatDuration(track.durationMs)}</span>
        </div>
      </CardContent>

      {/* Play Button Area */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
         <PlayTrackButton trackId={track.id} trackTitle={track.title} />
      </div>
    </Card>
  );
}```

---

## `apps/user-app/_components/track/TrackList.tsx`

```tsx
// apps/user-app/_components/track/TrackList.tsx
import type { AudioTrackResponseDTO } from '@repo/types';
import { TrackCard } from './TrackCard';
import { cn } from '@repo/utils'; // Import cn

interface TrackListProps {
  tracks: AudioTrackResponseDTO[];
  isLoading?: boolean;
  className?: string; // Allow passing custom classes to the grid
}

export function TrackList({ tracks, isLoading, className }: TrackListProps) {
  if (isLoading) {
      // Grid for skeleton loaders
      return (
           <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
               {Array.from({ length: 8 }).map((_, i) => ( // Render a fixed number of skeletons
                   <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg aspect-[16/13]"></div>
               ))}
           </div>
      );
  }

  if (!tracks || tracks.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 my-10">No tracks found matching your criteria.</p>;
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}```

---

## `apps/user-app/_components/ui/PaginationControls.tsx`

```tsx
// apps/user-app/_components/ui/PaginationControls.tsx
'use client';

import React, { useCallback, useMemo } from 'react'; // Added useMemo
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@repo/ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
// CORRECTED IMPORT PATH
import { DefaultLimit, MaxLimit } from '@repo/utils';

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
}

export function PaginationControls({
  totalItems,
  itemsPerPage: itemsPerPageProp, // Allow overriding limit via props
  currentPage: currentPageProp, // Allow overriding page via props
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use props first, then URL params, then defaults for limit and page
  const limit = useMemo(() => {
      let l = itemsPerPageProp ?? parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
      if (isNaN(l) || l <= 0) l = DefaultLimit;
      return Math.min(l, MaxLimit);
  }, [itemsPerPageProp, searchParams]);

  const currentPage = useMemo(() => {
      let p = currentPageProp ?? parseInt(searchParams.get('page') || '1', 10);
      if (isNaN(p) || p < 1) p = 1;
      return p;
  }, [currentPageProp, searchParams]);

  const totalPages = useMemo(() => (limit > 0 ? Math.ceil(totalItems / limit) : 0), [totalItems, limit]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = useCallback((pageNumber: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', String(pageNumber));
    // Only set limit param if it's different from default or was already present
    if (limit !== DefaultLimit || searchParams.has('limit')) {
        current.set('limit', String(limit));
    } else {
        current.delete('limit'); // Remove if default
    }
    current.delete('offset'); // Always prefer page param

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }, [searchParams, pathname, router, limit]);

  if (totalPages <= 1 || isNaN(totalPages)) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-4 mt-6 border-t dark:border-slate-700">
      <Button
        variant="outline" size="icon"
        onClick={() => handlePageChange(1)}
        disabled={!canGoPrevious}
        aria-label="Go to first page"
        className="h-8 w-8"
      >
         <ChevronsLeft className="h-4 w-4"/>
      </Button>
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
        className="h-8 px-2"
      >
          <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0"/> <span className="hidden sm:inline">Previous</span>
      </Button>
       <span className="text-sm font-medium px-2 sm:px-3 text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
       </span>
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
        className="h-8 px-2"
      >
          <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4 ml-1 sm:ml-0"/>
      </Button>
       <Button
        variant="outline" size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={!canGoNext}
        aria-label="Go to last page"
        className="h-8 w-8"
      >
           <ChevronsRight className="h-4 w-4"/>
       </Button>
    </div>
  );
}```

---

## `apps/user-app/_context/AuthContext.tsx`

```tsx
// apps/user-app/_context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

// Minimal user representation for context
interface AuthUser {
  id: string;
  // Add other non-sensitive fields if needed by UI frequently (e.g., name)
  // name?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>; // Function to manually re-check session
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading on initial mount
  const isCheckingSession = useRef(false); // Prevent race conditions

  const checkSession = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingSession.current) {
        // console.log("AuthContext: Session check already in progress.");
        return;
    }
    // console.log("AuthContext: Checking session...");
    isCheckingSession.current = true;
    setIsLoading(true); // Set loading true at the start of check

    try {
      const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store', // Ensure fresh check
      });

      // Check status code explicitly
      if (response.status === 401 || response.status === 403) {
         // console.log("AuthContext: No authenticated session found (401/403).");
         setUser(null);
      } else if (!response.ok) {
         // Handle other non-OK statuses
         console.error(`AuthContext: Session check failed with status ${response.status}`);
         setUser(null); // Assume logged out on other errors too
      } else {
         const data = await response.json() as { user: AuthUser | null, isAuthenticated: boolean };
         if (data.isAuthenticated && data.user?.id) {
            // console.log("AuthContext: Session validated for user:", data.user.id);
            setUser(data.user);
         } else {
            // console.log("AuthContext: Session check returned unauthenticated.");
            setUser(null);
         }
      }
    } catch (error) {
      setUser(null);
      console.error("AuthContext: Failed to fetch session API:", error);
    } finally {
      setIsLoading(false); // Set loading false after check completes
      isCheckingSession.current = false;
      // console.log("AuthContext: Session check finished.");
    }
  }, []); // No dependencies needed for useCallback itself

  // Initial check on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    checkSession,
  }), [user, isAuthenticated, isLoading, checkSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}```

---

## `apps/user-app/_hooks/useAuth.ts`

```typescript
// apps/user-app/_hooks/useAuth.ts
'use client';
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/_context/AuthContext'; // Adjust path

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error indicates the hook is used outside of the AuthProvider
    // Ensure AuthProvider wraps the component tree in the root layout.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};```

---

## `apps/user-app/_hooks/useBookmarks.ts`

```typescript
// apps/user-app/_hooks/useBookmarks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { listUserBookmarks } from '@/_services/userService';
// Use specific DTOs and PaginationParams
import type { PaginatedResponseDTO, BookmarkResponseDTO, ListBookmarkQueryParams } from '@repo/types';
import type { PaginationParams } from '@repo/utils'; // Import PaginationParams if defined here

// Query key factory for bookmark queries
export const bookmarksQueryKeys = {
  base: ['bookmarks'] as const, // Root key
  userBase: (userId: string) => [...bookmarksQueryKeys.base, 'user', userId] as const,
  // Key for PAGINATED list, potentially filtered
  list: (userId: string, params: ListBookmarkQueryParams) => // Use ListBookmarkQueryParams
    [...bookmarksQueryKeys.userBase(userId), 'list', params] as const,
  // Key for fetching ALL bookmarks for a specific track
  trackDetail: (userId: string, trackId: string) =>
    [...bookmarksQueryKeys.userBase(userId), 'detail', trackId] as const,
};

// Hook to fetch PAGINATED list of user bookmarks (can be filtered by trackId)
export const useBookmarks = (
  userId: string | undefined,
  params: ListBookmarkQueryParams // Use specific param type
) => {
  const queryKey = bookmarksQueryKeys.list(userId ?? 'guest', params);

  return useQuery<PaginatedResponseDTO<BookmarkResponseDTO>, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      // Service function handles adding trackId query param if present
      return listUserBookmarks(params);
    },
    enabled: !!userId, // Only run if user is logged in
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to fetch ALL bookmarks for a SINGLE track (non-paginated)
export const useTrackBookmarks = (
    userId: string | undefined,
    trackId: string | undefined
) => {
    const queryKey = bookmarksQueryKeys.trackDetail(userId ?? 'guest', trackId ?? 'none');

    return useQuery<BookmarkResponseDTO[], Error>({ // Expecting array response
       queryKey: queryKey,
       queryFn: async () => {
            if (!userId || !trackId) throw new Error("User or Track ID missing");
            // Fetch bookmarks for the specific track using the service.
            // Use the service function with the trackId filter and a high limit.
            const result = await listUserBookmarks({ trackId: trackId, limit: 500 }); // High limit
            return result.data ?? []; // Return just the data array
       },
       enabled: !!userId && !!trackId, // Enable only when both IDs are present
       staleTime: 1 * 60 * 1000, // 1 minute stale time
   });
}```

---

## `apps/user-app/_lib/constants.ts`

```typescript
// apps/user-app/_lib/constants.ts

// Threshold (in milliseconds) to decide between WAAPI direct buffer vs. streaming
// A lower threshold means more files might use WAAPI (potentially faster start after load, but uses more memory).
// A higher threshold means more files use streaming (lower memory, potentially slower start).
export const AUDIO_DURATION_THRESHOLD_MS = 5 * 60 * 1000; // Example: 5 minutes = 300,000 ms

export enum PlaybackState {
  IDLE = 'IDLE',         // No track loaded or player stopped/reset
  LOADING = 'LOADING',   // Fetching track metadata or audio data (initial load)
  DECODING = 'DECODING', // WAAPI only: Browser is decoding the ArrayBuffer
  BUFFERING = 'BUFFERING', // Streaming only: Waiting for enough data to play/resume
  READY = 'READY',       // Audio data is loaded/decoded, ready to play (but currently paused/stopped)
  PLAYING = 'PLAYING',   // Audio is actively playing
  PAUSED = 'PAUSED',     // Playback explicitly paused by user or interruption
  ENDED = 'ENDED',       // Playback reached the natural end of the track
  ERROR = 'ERROR',       // An error occurred during loading or playback
}```

---

## `apps/user-app/_services/collectionService.ts`

```typescript
// apps/user-app/_services/collectionService.ts
import apiClient from '@repo/api-client';
import type {
    AudioCollectionResponseDTO,
    PaginatedResponseDTO,
    AudioTrackResponseDTO,
} from '@repo/types';
// Corrected import path assuming utils is structured correctly
import { buildQueryString, PaginationParams } from '@repo/utils'; // Use shared util and type

// Define specific param types for listing user collections
export interface ListMyCollectionsParams extends PaginationParams { // Extend shared PaginationParams
    sortBy?: 'createdAt' | 'title' | 'updatedAt'; // Fields available for sorting user collections
    sortDir?: 'asc' | 'desc';
    // Add other filters if API supports (e.g., 'type')
    // type?: CollectionType;
}

const USER_COLLECTIONS_ENDPOINT = '/users/me/collections'; // Endpoint for the logged-in user's collections
const PUBLIC_COLLECTIONS_ENDPOINT = '/audio/collections'; // Base endpoint for public collection details

/**
 * Fetches the collections belonging to the currently authenticated user.
 */
export async function listMyCollections(params?: ListMyCollectionsParams): Promise<PaginatedResponseDTO<AudioCollectionResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${USER_COLLECTIONS_ENDPOINT}${queryString}`;
    console.log(`SERVICE: Fetching user collections from: ${endpoint}`);
    try {
        // Auth is handled by apiClient sending cookies
        const response = await apiClient<PaginatedResponseDTO<AudioCollectionResponseDTO>>(endpoint);
        console.log(`SERVICE: Received ${response.data?.length ?? 0} collections, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user collections:", error);
        throw error; // Re-throw for query hook/component to handle
    }
}

/**
 * Fetches the details of a specific collection, including its associated tracks.
 * Uses the public endpoint, backend handles auth/ownership for accessing details.
 */
export async function getCollectionDetailsWithTracks(collectionId: string): Promise<AudioCollectionResponseDTO> {
    if (!collectionId) {
        throw new Error("SERVICE: Collection ID cannot be empty");
    }
    // Use the public endpoint; backend checks if user can view it
    const endpoint = `${PUBLIC_COLLECTIONS_ENDPOINT}/${collectionId}`;
    console.log(`SERVICE: Fetching collection details from: ${endpoint}`);
    try {
        // Backend should populate 'tracks' based on its logic (e.g., ordered IDs -> fetch tracks)
        const response = await apiClient<AudioCollectionResponseDTO>(endpoint);
        console.log(`SERVICE: Received collection details for ${collectionId}, tracks: ${response.tracks?.length ?? 0}`);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching collection details for ${collectionId}:`, error);
        throw error; // Re-throw
    }
}

/**
 * Fetches ONLY the ordered list of tracks for a specific collection.
 * Useful if the main detail endpoint doesn't include tracks or for updates.
 */
export async function getTracksForCollection(collectionId: string): Promise<AudioTrackResponseDTO[]> {
     if (!collectionId) {
        throw new Error("SERVICE: Collection ID cannot be empty");
    }
    // Assuming endpoint like GET /audio/collections/{collectionId}/tracks exists
    // This endpoint might be protected similarly to the main detail endpoint
    const endpoint = `${PUBLIC_COLLECTIONS_ENDPOINT}/${collectionId}/tracks`;
    console.log(`SERVICE: Fetching tracks for collection from: ${endpoint}`);
     try {
        // Backend returns just the list of tracks in order
        const response = await apiClient<AudioTrackResponseDTO[]>(endpoint);
        console.log(`SERVICE: Received ${response?.length ?? 0} tracks for collection ${collectionId}`);
        return response ?? []; // Return empty array if response is null/undefined
    } catch (error) {
        console.error(`SERVICE: Error fetching tracks for collection ${collectionId}:`, error);
        throw error; // Re-throw
    }
}```

---

## `apps/user-app/_services/trackService.ts`

```typescript
// apps/user-app/_services/trackService.ts
import apiClient, { APIError } from '@repo/api-client';
import type {
    AudioTrackResponseDTO,
    AudioTrackDetailsResponseDTO,
    PaginatedResponseDTO,
    ListTrackQueryParams, // Use the type from @repo/types
} from '@repo/types';
import { buildQueryString } from '@repo/utils'; // Use shared util

const TRACKS_ENDPOINT = '/audio/tracks'; // Base endpoint

/**
 * Fetches a paginated list of audio tracks based on query parameters.
 * Uses the public track listing endpoint.
 */
export async function listTracks(params?: ListTrackQueryParams): Promise<PaginatedResponseDTO<AudioTrackResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${TRACKS_ENDPOINT}${queryString}`;
    console.log(`SERVICE: Fetching tracks from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<AudioTrackResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error listing tracks:`, error);
        throw error;
    }
}

/**
 * Fetches the details for a specific audio track, including playback URL and user-specific data if authenticated.
 * Uses the public track detail endpoint. Backend includes user data based on auth cookie.
 */
export async function getTrackDetails(trackId: string): Promise<AudioTrackDetailsResponseDTO> {
    if (!trackId) {
        throw new Error("SERVICE: Track ID cannot be empty");
    }
    const endpoint = `${TRACKS_ENDPOINT}/${trackId}`;
    console.log(`SERVICE: Fetching track details from: ${endpoint}`);
    try {
        // Auth cookie is sent automatically by apiClient
        const response = await apiClient<AudioTrackDetailsResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching track details for ${trackId}:`, error);
        // Let apiClient's error handling propagate (it should throw APIError for 404 etc.)
        throw error;
    }
}

// Removed incorrect references to TrackData and TrackProgressPatchPayload types
// as they are not defined in the provided context or @repo/types.
// Mutations like updating progress are handled via Server Actions.```

---

## `apps/user-app/_services/userService.ts`

```typescript
// apps/user-app/_services/userService.ts
import apiClient from '@repo/api-client';
import type {
    UserResponseDTO,
    PaginatedResponseDTO,
    BookmarkResponseDTO,
    PlaybackProgressResponseDTO,
    // Import specific query param types
    ListProgressQueryParams,
    ListBookmarkQueryParams,
} from '@repo/types';
import { buildQueryString } from '@repo/utils';

const USER_ME_ENDPOINT = '/users/me'; // Base for current user data

/**
 * Fetches the profile of the currently authenticated user.
 */
export async function getMyProfile(): Promise<UserResponseDTO> {
    const endpoint = `${USER_ME_ENDPOINT}`;
    console.log(`SERVICE: Fetching user profile from: ${endpoint}`);
    try {
        const response = await apiClient<UserResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user profile:", error);
        throw error;
    }
}

/**
 * Fetches the paginated list of playback progress records for the authenticated user.
 */
// MODIFIED: Use specific param type
export async function listUserProgress(params?: ListProgressQueryParams): Promise<PaginatedResponseDTO<PlaybackProgressResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${USER_ME_ENDPOINT}/progress${queryString}`;
    console.log(`SERVICE: Fetching user progress from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<PlaybackProgressResponseDTO>>(endpoint);
         console.log(`SERVICE: Received ${response.data?.length ?? 0} progress records, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user progress:", error);
        throw error;
    }
}

/**
 * Fetches the specific playback progress for a user on a given track.
 */
export async function getUserTrackProgress(trackId: string): Promise<PlaybackProgressResponseDTO> {
     if (!trackId) {
        throw new Error("SERVICE: Track ID cannot be empty");
    }
    const endpoint = `${USER_ME_ENDPOINT}/progress/${trackId}`;
    console.log(`SERVICE: Fetching user progress for track from: ${endpoint}`);
     try {
        const response = await apiClient<PlaybackProgressResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`SERVICE: Error fetching progress for track ${trackId}:`, error);
        throw error;
    }
}


/**
 * Fetches the paginated list of bookmarks for the authenticated user, optionally filtered by track.
 */
// MODIFIED: Use specific param type
export async function listUserBookmarks(params?: ListBookmarkQueryParams): Promise<PaginatedResponseDTO<BookmarkResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${USER_ME_ENDPOINT}/bookmarks${queryString}`;
    console.log(`SERVICE: Fetching user bookmarks from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<BookmarkResponseDTO>>(endpoint);
         console.log(`SERVICE: Received ${response.data?.length ?? 0} bookmarks, total ${response.total}`);
        return response;
    } catch (error) {
        console.error("SERVICE: Error fetching user bookmarks:", error);
        throw error;
    }
}```

---

## `apps/user-app/_stores/playerStore.ts`

```typescript
// apps/user-app/_stores/playerStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
// Corrected import path assuming constants are moved or accessible
import { PlaybackState } from '@/_lib/constants'; // Use constants
import { getTrackDetails } from '@/_services/trackService';
// Corrected import path assuming utils structure
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// --- State Interface ---
interface PlayerState {
  playbackState: PlaybackState;
  currentTrackDetails: AudioTrackDetailsResponseDTO | null;
  duration: number; // seconds, from audio element metadata
  currentTime: number; // seconds, from audio element timeupdate
  volume: number; // 0 to 1
  isMuted: boolean;
  error: string | null;
  // Internal state (prefixed with _)
  _audioContext: AudioContext | null;
  _gainNode: GainNode | null;
  _mediaElementSourceNode: MediaElementAudioSourceNode | null; // Source connected to the <audio> element
  _htmlAudioElement: HTMLAudioElement | null; // Ref to the <audio> element
  _currentTrackIdLoading: string | null; // Track which track ID is currently being loaded/processed
  _loadTimeoutId: NodeJS.Timeout | null; // Timeout for loading state
  _isSeeking: boolean; // Flag to manage state during seek operations
}

// --- Actions Interface ---
interface PlayerActions {
  loadAndPlayTrack: (trackId: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (timeSeconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  stop: () => void; // Full stop and unload
  cleanup: () => void; // Cleanup audio resources on component unmount
  _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void; // Internal action to set ref
}

// --- Initial State ---
const initialState: PlayerState = {
  playbackState: PlaybackState.IDLE,
  currentTrackDetails: null,
  duration: 0,
  currentTime: 0,
  volume: 0.8,
  isMuted: false,
  error: null,
  _audioContext: null,
  _gainNode: null,
  _mediaElementSourceNode: null,
  _htmlAudioElement: null,
  _currentTrackIdLoading: null,
  _loadTimeoutId: null,
  _isSeeking: false,
};

// --- Debounced Progress Recording ---
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    // console.log(`Debounced: Recording progress ${progressMs}ms for track ${trackId}`);
    if (trackId && progressMs >= 0) {
        recordProgressAction(trackId, Math.round(progressMs))
            .then(result => { if (!result.success) console.warn("[PlayerStore] Failed to record progress via action:", result.message); })
            .catch(err => { console.error("[PlayerStore] Error calling recordProgressAction:", err); });
    }
}, 3000);

// --- Store Implementation ---
export const usePlayerStore = create(
  immer<PlayerState & PlayerActions>((set, get) => {

    // --- Internal Helper Functions ---
    const log = (message: string, ...args: any[]) => console.log(`[PlayerStore] ${message}`, ...args);
    const warn = (message: string, ...args: any[]) => console.warn(`[PlayerStore] ${message}`, ...args);
    const errorLog = (message: string, ...args: any[]) => console.error(`[PlayerStore] ${message}`, ...args);

    const clearLoadTimeout = () => {
        const loadTimeoutId = get()._loadTimeoutId;
        if (loadTimeoutId) {
            clearTimeout(loadTimeoutId);
            set({ _loadTimeoutId: null });
        }
    };

    const setError = (message: string, trackId?: string | null) => {
        clearLoadTimeout();
        errorLog("Error set:", message, trackId ? `(Track: ${trackId})` : '');
        set((state) => {
            // Only set error if it pertains to the track currently being loaded/played
            if (!trackId || state._currentTrackIdLoading === trackId || state.currentTrackDetails?.id === trackId) {
                state.playbackState = PlaybackState.ERROR;
                state.error = message;
                // Don't necessarily stop here, error might be recoverable or user might want to retry load
                state._currentTrackIdLoading = null;
            } else {
                warn(`Error for track ${trackId} ignored, current loading/playing is ${state._currentTrackIdLoading ?? state.currentTrackDetails?.id}`);
            }
        });
    };

    // Initializes AudioContext and GainNode if needed
    const initAudioContextIfNeeded = (): AudioContext | null => {
        let state = get();
        let ctx = state._audioContext;
        if (!ctx || ctx.state === 'closed') {
            log("Initializing AudioContext");
            try {
                ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const gainNode = ctx.createGain();
                gainNode.connect(ctx.destination);
                gainNode.gain.setValueAtTime(state.isMuted ? 0 : state.volume, ctx.currentTime);
                set({ _audioContext: ctx, _gainNode: gainNode });
                ctx = get()._audioContext; // Get updated ref
            } catch (e) {
                 errorLog("Failed to initialize AudioContext", e);
                 setError("Audio playback not supported.");
                 return null;
            }
        }
        if (ctx && ctx.state === 'suspended') {
             ctx.resume().catch(e => warn("Could not resume AudioContext (may require user gesture):", e));
        }
        return ctx;
    };

    // Connects the HTMLAudioElement to the WAAPI graph (Context -> Gain -> Destination)
    const connectMediaElementSource = (state: PlayerState): MediaElementAudioSourceNode | null => {
        if (!state._audioContext || !state._htmlAudioElement || !state._gainNode) {
            warn("Cannot connect MediaElementSource: Context, Element, or GainNode missing.");
            return null;
        }
        if (state._mediaElementSourceNode) {
            // Already connected (or attempt was made)
            return state._mediaElementSourceNode;
        }
        log("Creating and connecting MediaElementAudioSourceNode");
        try {
            const sourceNode = state._audioContext.createMediaElementSource(state._htmlAudioElement);
            sourceNode.connect(state._gainNode);
            return sourceNode; // Return the created node
        } catch (err: any) {
            errorLog("Failed to create MediaElementAudioSourceNode:", err);
            // This can happen if the element's src is cross-origin without CORS headers
            setError(`Audio source connection error: ${err.message}`);
            return null;
        }
    };

     // Apply volume/mute to both GainNode and HTML element
     const applyVolumeAndMute = (state: PlayerState) => {
         if (state._gainNode && state._audioContext && state._audioContext.state === 'running') {
              state._gainNode.gain.setTargetAtTime(state.isMuted ? 0 : state.volume, state._audioContext.currentTime, 0.01);
         }
         if (state._htmlAudioElement) {
            state._htmlAudioElement.volume = state.volume;
            state._htmlAudioElement.muted = state.isMuted;
         }
    };

    // --- HTML Audio Element Event Handlers ---
    // These update the Zustand state based on the audio element's events
    const handlePlay = () => set(state => { if (!state._isSeeking) { log("Event: play -> PLAYING"); state.playbackState = PlaybackState.PLAYING; state.error = null; } });
    const handlePause = () => set(state => { if (state.playbackState !== PlaybackState.ENDED && state.playbackState !== PlaybackState.IDLE && state.playbackState !== PlaybackState.ERROR && !state._isSeeking) { log("Event: pause -> PAUSED"); state.playbackState = PlaybackState.PAUSED; }});
    const handleEnded = () => {
        log("Event: ended -> ENDED");
        const endedState = get();
        const finalDuration = endedState.duration;
        set(state => {
            state.playbackState = PlaybackState.ENDED;
            state.currentTime = finalDuration;
            state._isSeeking = false;
        });
        // Record final progress
        if (endedState.currentTrackDetails?.id) {
            debouncedRecordProgress.cancel();
            recordProgressAction(endedState.currentTrackDetails.id, Math.floor(finalDuration * 1000))
                .catch(err => errorLog("Error recording final progress on end:", err));
        }
    };
    const handleWaiting = () => set(state => { if (state.playbackState === PlaybackState.PLAYING) { log("Event: waiting -> BUFFERING"); state.playbackState = PlaybackState.BUFFERING; }});
    const handlePlaying = () => set(state => { if (state.playbackState === PlaybackState.BUFFERING || state._isSeeking) { log("Event: playing -> PLAYING"); state.playbackState = PlaybackState.PLAYING; state._isSeeking = false; }});
    const handleLoadedMetadata = () => {
        const audioEl = get()._htmlAudioElement;
        if (audioEl) {
            log("Event: loadedmetadata");
            set(state => { state.duration = audioEl.duration || 0; });
        }
    };
    const handleCanPlay = () => {
        log("Event: canplay");
        clearLoadTimeout();
        set(state => {
            // If we were loading this specific track, move to ready state if not already playing/paused
            if (state._currentTrackIdLoading === state.currentTrackDetails?.id) {
                if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.PAUSED) {
                    state.playbackState = PlaybackState.READY;
                }
                state._currentTrackIdLoading = null; // Mark loading complete
            }
            // If seeking, transition back to previous state (usually PAUSED or PLAYING via 'playing' event)
             if (state._isSeeking) {
                state.playbackState = state._htmlAudioElement?.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING;
                state._isSeeking = false;
             }
        });
    };
    const handleTimeUpdate = () => {
        const state = get();
        const audioEl = state._htmlAudioElement;
        if (!audioEl || state._isSeeking || state.playbackState === PlaybackState.IDLE) return; // Ignore during seek or if idle

        const htmlCurrentTime = audioEl.currentTime;
        // Update only if time changed significantly to avoid excessive re-renders
        if (Math.abs(state.currentTime - htmlCurrentTime) > 0.05) {
            set(draft => { draft.currentTime = htmlCurrentTime; });
            // Debounce progress recording only when actually playing
            if (state.currentTrackDetails?.id && state.playbackState === PlaybackState.PLAYING) {
                debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(htmlCurrentTime * 1000));
            }
        }
    };
    const handleError = (e: Event) => {
        const audioEl = e.target as HTMLAudioElement;
        const error = audioEl.error;
        errorLog("HTMLAudioElement error:", error?.code, error?.message);
        setError(`Audio error: ${error?.message || `Code ${error?.code}` || 'Unknown'}`, get().currentTrackDetails?.id);
    };

    // --- Attach/Detach Listeners ---
    const setupAudioElementListeners = (element: HTMLAudioElement) => {
        log("Setting up HTMLAudioElement listeners");
        element.addEventListener('play', handlePlay);
        element.addEventListener('pause', handlePause);
        element.addEventListener('ended', handleEnded);
        element.addEventListener('waiting', handleWaiting);
        element.addEventListener('playing', handlePlaying);
        element.addEventListener('loadedmetadata', handleLoadedMetadata);
        element.addEventListener('canplay', handleCanPlay);
        element.addEventListener('timeupdate', handleTimeUpdate);
        element.addEventListener('error', handleError);
        // Add seeked listener to reliably exit seeking state
        element.addEventListener('seeked', () => set(state => {
            if (state._isSeeking) {
                log("Event: seeked");
                state._isSeeking = false;
                // Restore state based on paused status AFTER seek completes
                state.playbackState = state._htmlAudioElement?.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING;
            }
        }));
    };
    const removeAudioElementListeners = (element: HTMLAudioElement) => {
        log("Removing HTMLAudioElement listeners");
        element.removeEventListener('play', handlePlay);
        element.removeEventListener('pause', handlePause);
        element.removeEventListener('ended', handleEnded);
        element.removeEventListener('waiting', handleWaiting);
        element.removeEventListener('playing', handlePlaying);
        element.removeEventListener('loadedmetadata', handleLoadedMetadata);
        element.removeEventListener('canplay', handleCanPlay);
        element.removeEventListener('timeupdate', handleTimeUpdate);
        element.removeEventListener('error', handleError);
        element.removeEventListener('seeked', () => set(state => { state._isSeeking = false; }));
    };

    // --- Public Actions ---
    return {
      ...initialState,

      _setHtmlAudioElementRef: (element) => {
         set(state => {
             const previousElement = state._htmlAudioElement;
             if (previousElement && previousElement !== element) {
                 removeAudioElementListeners(previousElement);
                 // Optionally disconnect source node if element changes drastically
                 if (state._mediaElementSourceNode) {
                      try { state._mediaElementSourceNode.disconnect(); } catch (e) {}
                      state._mediaElementSourceNode = null;
                 }
             }
             state._htmlAudioElement = element;
             if (element && previousElement !== element) {
                setupAudioElementListeners(element);
                applyVolumeAndMute(state);
                // Attempt connection immediately if context exists
                 state._mediaElementSourceNode = connectMediaElementSource(state);
             }
        });
      },

      loadAndPlayTrack: async (trackId) => {
        const state = get();
        const currentLoadingId = state._currentTrackIdLoading;
        const currentPlayingId = state.currentTrackDetails?.id;

        if (currentLoadingId === trackId) { log(`Track ${trackId} is already loading.`); return; }
        // If track is already loaded and ready/paused/ended, just play it
        if (currentPlayingId === trackId && [PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(state.playbackState)) {
            log(`Track ${trackId} is loaded, calling play().`);
            get().play();
            return;
        }
        // If it's already playing, do nothing (or maybe seek to start? TBD)
        if (currentPlayingId === trackId && state.playbackState === PlaybackState.PLAYING) {
            log(`Track ${trackId} is already playing.`);
            // Optionally seek to 0: get().seek(0);
            return;
        }

        log(`Loading track: ${trackId}`);
        get().stop(); // Stop previous track & save progress

        set({
            _currentTrackIdLoading: trackId,
            playbackState: PlaybackState.LOADING,
            error: null, currentTrackDetails: null, duration: 0, currentTime: 0,
            isStreamingMode: true, // Simplified: always streaming mode now
        });
        clearLoadTimeout();
        set(draft => { draft._loadTimeoutId = setTimeout(() => { /* ... loading timeout logic ... */ }, 30000); });

        try {
          const trackDetails = await getTrackDetails(trackId);
          if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} during fetch.`); return; }
          if (!trackDetails?.playUrl) throw new Error("Track details or play URL missing.");

          const trackDurationSec = trackDetails.durationMs / 1000;
          let initialSeekTime = trackDetails.userProgressMs != null && trackDetails.userProgressMs > 0
                                ? Math.min(trackDetails.userProgressMs / 1000, trackDurationSec) : 0;

          log(`Details loaded for ${trackId}. Duration: ${trackDurationSec}s. Initial Seek: ${initialSeekTime}s`);

          const audioContext = initAudioContextIfNeeded(); // Ensure context is ready
          const audioEl = get()._htmlAudioElement;
          if (!audioEl) throw new Error("HTMLAudioElement ref not available.");

          set(state => {
              state.currentTrackDetails = trackDetails;
              state.duration = trackDurationSec; // Initial duration from metadata
              state.currentTime = initialSeekTime; // Set initial time state
              // Connect MediaElementSourceNode if needed
              if (!state._mediaElementSourceNode && audioContext && state._gainNode) {
                  state._mediaElementSourceNode = connectMediaElementSource(state);
              }
          });

          // Set src, load, and handle initial seek & play
          audioEl.src = trackDetails.playUrl;
          audioEl.load();

          // Handler to set currentTime and attempt play once ready
          const playWhenReady = () => {
              const currentState = get();
              if (currentState.currentTrackDetails?.id === trackId) { // Only act if this is still the target track
                  log(`Stream can play. Setting currentTime: ${initialSeekTime}`);
                  audioEl.currentTime = initialSeekTime; // Set time now
                  audioEl.play()
                     .then(() => log("Playback started via loadAndPlayTrack."))
                     .catch(err => {
                         warn(`Autoplay likely blocked for track ${trackId}:`, err);
                         // Update state to READY, user must click play
                         set(s => { if (s.currentTrackDetails?.id === trackId) s.playbackState = PlaybackState.READY; s._currentTrackIdLoading = null; });
                     });
              } else {
                   log(`Skipping play for ${trackId}, another track is active.`);
              }
              clearLoadTimeout(); // Clear timeout once playable
              audioEl.removeEventListener('canplay', playWhenReady);
              audioEl.removeEventListener('loadeddata', playWhenReady); // Use loadeddata as another trigger
          };
          // Use 'canplay' as the trigger, it usually fires after enough data to start
          audioEl.addEventListener('canplay', playWhenReady, { once: true });
          audioEl.addEventListener('loadeddata', playWhenReady, { once: true }); // Fallback

        } catch (err: any) {
          setError(`Failed to load track ${trackId}: ${err.message}`, trackId);
        }
      },

      play: () => {
        const { playbackState, _htmlAudioElement } = get();
        log(`Play action called. State: ${playbackState}`);

        if (playbackState !== PlaybackState.READY && playbackState !== PlaybackState.PAUSED && playbackState !== PlaybackState.ENDED) {
            warn(`Cannot play from state: ${playbackState}`); return;
        }
        if (!_htmlAudioElement) { setError("Audio element not available."); return; }

        // Ensure AudioContext is running (user gesture likely needed initially)
        const ctx = initAudioContextIfNeeded();
        if (!ctx) return; // Stop if context failed

        set(state => { state.error = null; }); // Clear previous errors

        const playPromise = _htmlAudioElement.play();
        if (playPromise !== undefined) {
             playPromise.catch(err => {
                 errorLog("Error starting playback:", err);
                 setError(`Playback failed: ${err.message}`, get().currentTrackDetails?.id);
             });
        }
        // State change to PLAYING/BUFFERING is handled by element events
      },

      pause: () => {
         const state = get();
         log(`Pause action called. State: ${state.playbackState}`);
         if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.BUFFERING) return;
         if (!state._htmlAudioElement) { warn("Cannot pause: HTML element not available."); return; }

          // Flush and record progress *before* pausing
          debouncedRecordProgress.flush();
          if (state.currentTrackDetails?.id) {
              recordProgressAction(state.currentTrackDetails.id, Math.floor(state.currentTime * 1000))
                   .catch(err => errorLog("Error recording progress on pause:", err));
          }

          state._htmlAudioElement.pause();
          // State change to PAUSED is handled by element 'onpause' event
      },

      togglePlayPause: () => {
         const { playbackState, _htmlAudioElement } = get();
         log(`Toggle Play/Pause. Current State: ${playbackState}`);
         if (!_htmlAudioElement) return;

         if (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING) {
             get().pause();
         } else if ([PlaybackState.PAUSED, PlaybackState.READY, PlaybackState.ENDED].includes(playbackState)) {
             get().play();
         } else {
             warn(`Toggle Play/Pause ignored in state: ${playbackState}`);
         }
      },

      seek: (timeSeconds) => {
          const { duration, playbackState, _htmlAudioElement } = get();
          log(`Seek action called. Time: ${timeSeconds}s, State: ${playbackState}`);
          const canSeek = duration > 0 && _htmlAudioElement && playbackState !== PlaybackState.IDLE && playbackState !== PlaybackState.LOADING && playbackState !== PlaybackState.ERROR;

          if (!canSeek) { warn(`Seek ignored in state: ${playbackState} or duration=${duration}`); return; }

          const seekTime = Math.max(0, Math.min(timeSeconds, duration));

          // Set seeking flag, update UI time immediately
          set(state => { state.currentTime = seekTime; state._isSeeking = true; state.playbackState = PlaybackState.SEEKING; });

           _htmlAudioElement!.currentTime = seekTime; // Set the element's time

           // Final progress recorded after seek completes via 'seeked' event triggering 'timeupdate' or pause/stop
           // Flush any pending progress before seek starts
           debouncedRecordProgress.flush();
           // Schedule recording for the new position
           if (get().currentTrackDetails?.id) {
               debouncedRecordProgress(get().currentTrackDetails!.id, Math.floor(seekTime * 1000));
           }
           // The 'seeked' event listener will reset _isSeeking and update playbackState
      },

      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
         set(state => {
             state.volume = newVolume;
             if (newVolume > 0 && state.isMuted) { state.isMuted = false; }
             applyVolumeAndMute(state);
         });
      },

      toggleMute: () => {
         set(state => {
            state.isMuted = !state.isMuted;
            applyVolumeAndMute(state);
         });
      },

      stop: () => {
          log("Stop action called - unloading track");
          const state = get();
          const currentTrackId = state.currentTrackDetails?.id;
          const currentTimeMs = state.currentTime * 1000;

          // Force immediate progress recording before unloading
          debouncedRecordProgress.cancel();
          if (currentTrackId && currentTimeMs >= 0) {
               log(`Recording final progress ${Math.round(currentTimeMs)}ms on stop`);
               recordProgressAction(currentTrackId, Math.round(currentTimeMs))
                   .catch(err => errorLog("Error recording final progress on stop:", err));
          }

          clearLoadTimeout();

          set(draft => {
              const audioEl = draft._htmlAudioElement; // Cache ref before resetting
              const audioCtx = draft._audioContext;
              const gainNode = draft._gainNode;
              const sourceNode = draft._mediaElementSourceNode;

              // Reset state to initial
              Object.assign(draft, initialState);

              // Keep essential refs if they exist
              draft._htmlAudioElement = audioEl;
              draft._audioContext = audioCtx;
              draft._gainNode = gainNode;
              draft._mediaElementSourceNode = sourceNode; // Keep source node if element ref persists

               // Reset HTML element state
               if (audioEl) {
                   try {
                       if (!audioEl.paused) audioEl.pause();
                       audioEl.removeAttribute("src");
                       // Force browser to release resources
                       audioEl.load();
                       log("HTMLAudioElement reset on stop.");
                   } catch (e) { warn("Error resetting HTMLAudioElement on stop:", e); }
               }
          });
      },

      cleanup: () => {
         log("Cleanup action called");
         get().stop(); // Ensure stop logic runs

         set(state => {
              // Close AudioContext
              if (state._audioContext && state._audioContext.state !== 'closed') {
                 state._audioContext.close().then(()=>log("AudioContext closed.")).catch(e => warn("Error closing AudioContext:", e));
              }
              // Remove listeners from element if it exists
              if (state._htmlAudioElement) {
                   removeAudioElementListeners(state._htmlAudioElement);
              }
              // Nullify all internal refs completely
              Object.assign(state, initialState);
         });
      }
    };
  }, {
      name: 'player-storage-v2', // Use a different name if migrating
  })
);```

---

## `apps/user-app/app/(auth)/login/page.tsx`

```tsx
// apps/user-app/app/(auth)/login/page.tsx
import Link from 'next/link';
import { LoginForm } from '@/_components/auth/LoginForm'; // Adjust import alias
import { GoogleSignInButton } from '@/_components/auth/GoogleSignInButton'; // Adjust import alias

export const metadata = { // Optional: Set page metadata
  title: 'Login - AudioLang Player',
  description: 'Login to your AudioLang Player account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white dark:bg-slate-800 p-6 md:p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Welcome Back!
        </h1>

        {/* Render the login form component */}
        <LoginForm />

         {/* Divider */}
        <div className="my-6 flex items-center">
           <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
           <span className="mx-4 flex-shrink text-xs text-slate-500 dark:text-slate-400">OR</span>
           <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
        </div>

        {/* Google Sign-In Button */}
        <GoogleSignInButton />

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}```

---

## `apps/user-app/app/(auth)/register/page.tsx`

```tsx
// apps/user-app/app/(auth)/register/page.tsx
import Link from 'next/link';
import { RegisterForm } from '@/_components/auth/RegisterForm'; // Adjust import alias

export const metadata = {
  title: 'Register - AudioLang Player',
  description: 'Create a new account to start learning languages with audio.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-6 md:p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Create your Account
        </h1>

        {/* Render the registration form component */}
        <RegisterForm />

        {/* Separator */}
        {/* <div className="my-6 flex items-center">
           <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
           <span className="mx-4 flex-shrink text-xs text-slate-500 dark:text-slate-400">OR</span>
           <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
        </div> */}

        {/* Optional: Add Google Sign-In option during registration */}
        {/* <GoogleSignInButton /> */}

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}```

---

## `apps/user-app/app/(main)/bookmarks/page.tsx`

```tsx
// apps/user-app/app/(main)/bookmarks/page.tsx
'use client';

import React, { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/_hooks/useAuth';
import { useBookmarks } from '@/_hooks/useBookmarks';
import { BookmarkList } from '@/_components/activity/BookmarkList';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { usePlayerStore } from '@/_stores/playerStore';
import { Loader, BookmarkX, Info } from 'lucide-react';
import { DefaultLimit } from '@repo/utils'; // Use shared constant

// Separate component to handle logic dependent on searchParams and auth state
function BookmarksPageContent() {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
    const searchParams = useSearchParams();
    const playerSeek = usePlayerStore((state) => state.seek);
    const loadAndPlay = usePlayerStore((state) => state.loadAndPlayTrack);

    // --- Pagination State from URL ---
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
    const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

    // --- Data Fetching ---
    // Fetch paginated list of *all* user bookmarks (no trackId filter here)
    const bookmarkParams = useMemo(() => ({ limit, offset }), [limit, offset]);
    const {
        data: queryResponse,
        isLoading: isLoadingBookmarks,
        isFetching, // Use for refetch indicator
        isError,
        error,
    } = useBookmarks(user?.id, bookmarkParams); // Use the hook for paginated lists

    // --- Seek and Play Handler ---
    const handleSeekAndPlay = (trackId: string, timeSeconds: number) => {
        loadAndPlay(trackId).then(() => {
            // Seek slightly after play starts to ensure it takes effect
            setTimeout(() => playerSeek(timeSeconds), 100);
        }).catch(err => console.error("Failed to load track for bookmark:", err));
    };

    // --- Render Logic ---
    const isLoading = isLoadingAuth || (isLoadingBookmarks && !queryResponse?.data); // Show initial loader
    const bookmarks = queryResponse?.data ?? [];
    const totalBookmarks = queryResponse?.total ?? 0;

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>;
    }

    if (!isAuthenticated && !isLoadingAuth) {
        return (
             <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                 <Info size={24} className="mx-auto mb-2 text-slate-400"/>
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view your bookmarks.
             </div>
        );
    }

    return (
        <div className="space-y-6">
            {isError && (
                <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
                    Error loading bookmarks: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            {totalBookmarks === 0 && !isFetching ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <BookmarkX className="mx-auto h-12 w-12 text-slate-400 mb-2"/>
                    You haven&apos;t added any bookmarks yet. Bookmarks you add while playing tracks will appear here.
                </div>
            ) : (
                // Pass the seek AND play handler to the list
                <BookmarkList
                    bookmarks={bookmarks}
                    // Correct the onSeek prop name if BookmarkList expects something different
                    onSeek={(timeSec) => {
                        // Find the corresponding bookmark to get the trackId
                        const bm = bookmarks.find(b => b.timestampMs / 1000 === timeSec); // Approximation needed? Or pass ID too?
                        if (bm) {
                            handleSeekAndPlay(bm.trackId, timeSec);
                        } else {
                             console.warn("Could not find trackId for bookmark seek time:", timeSec);
                             playerSeek(timeSec); // Fallback to just seeking
                        }
                    }}
                    isLoading={isFetching} // Show subtle loading within list on refetch
                    // trackId is not needed here as we invalidate the whole user list
                />
            )}

            {totalBookmarks > 0 && !isLoading && (
                <PaginationControls
                    totalItems={totalBookmarks}
                    currentPage={currentPage}
                    itemsPerPage={limit}
                />
            )}
        </>
    );
}

// Main export using Suspense for searchParams
export default function BookmarksPage() {
  return (
      <div className="container mx-auto py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">My Bookmarks</h1>
          <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>}>
              <BookmarksPageContent />
          </Suspense>
      </div>
  );
}```

---

## `apps/user-app/app/(main)/collections/[collectionId]/edit/page.tsx`

```tsx
// apps/user-app/app/(main)/collections/[collectionId]/edit/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCollectionDetailsWithTracks } from '@/_services/collectionService';
import { CollectionForm } from '@/_components/collection/CollectionForm';
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { useAuth } from '@/_hooks/useAuth'; // Check ownership client-side

// Define query key factory
const collectionQueryKeys = {
    detail: (id: string) => ['collection', id] as const,
};

export default function EditCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoading: isLoadingAuth } = useAuth();
    const collectionId = params.collectionId as string;

    // Fetch collection data
    const { data: collectionData, isLoading: isLoadingCollection, isError, error, isFetching } = useQuery({
        queryKey: collectionQueryKeys.detail(collectionId),
        queryFn: () => getCollectionDetailsWithTracks(collectionId),
        enabled: !!collectionId, // Only fetch if ID exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isLoading = isLoadingAuth || isLoadingCollection;
    const isOwner = user?.id === collectionData?.ownerId;

    // Handle success: Invalidate cache and navigate back to detail page
    const handleSuccess = () => {
        // Invalidate the specific collection query
        queryClient.invalidateQueries({ queryKey: collectionQueryKeys.detail(collectionId) });
        // Invalidate the user's list of collections if title changed
        if (user?.id) {
            queryClient.invalidateQueries({ queryKey: ['collections', user.id] });
        }
        // Redirect back to the collection detail page
        router.push(`/collections/${collectionId}`);
        alert("Collection updated successfully!"); // TODO: Replace with toast
    };

    const handleCancel = () => {
        router.back(); // Go back to previous page
    };

    // --- Render Logic ---

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/> Loading...</div>;
    }

    if (isError) {
        return (
            <div className="container mx-auto py-6">
                <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700">
                    <AlertTriangle className="h-5 w-5 inline mr-2"/>
                    Error loading collection: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            </div>
        );
    }

    // Check ownership *after* data has loaded
    if (!isLoadingAuth && !isOwner && collectionData) { // Only check if auth loaded and user is not owner
         return (
             <div className="container mx-auto py-6 text-center">
                 <p className="text-red-600">You do not have permission to edit this collection.</p>
                 <Button variant="link" asChild className="mt-4"><Link href="/collections">Back to Collections</Link></Button>
             </div>
         );
     }

    if (!collectionData) {
        return <div className="container mx-auto py-6 text-center">Collection not found.</div>;
    }

    return (
        <div className="container mx-auto py-6">
            {/* Breadcrumbs or Back Button */}
             <Button variant="outline" size="sm" onClick={handleCancel} className="mb-4">
                <ArrowLeft size={16} className="mr-1"/> Back
            </Button>

            <h1 className="text-2xl font-bold mb-1">Edit Collection</h1>
             <p className="text-sm text-slate-500 mb-6 truncate" title={collectionData.title}>
                Editing: {collectionData.title}
            </p>

            <div className="p-4 md:p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm max-w-2xl">
                 {/* Pass initial data to the form */}
                 <CollectionForm
                    initialData={collectionData}
                    onSuccess={handleSuccess} // Use specific callback
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}```

---

## `apps/user-app/app/(main)/collections/[collectionId]/page.tsx`

```tsx
// apps/user-app/app/(main)/collections/[collectionId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCollectionDetailsWithTracks } from '@/_services/collectionService'; // Use correct path
import { CollectionTrackList } from '@/_components/collection/CollectionTrackList'; // Use correct path
import { Button } from '@repo/ui';
import { ListMusic, BookOpen, Edit, Trash2, ArrowLeft } from 'lucide-react'; // Use correct path
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use correct path
import { APIError } from '@repo/api-client'; // Use correct path
import { DeleteCollectionButton } from '@/_components/collection/DeleteCollectionButton'; // Client component for delete confirmation

interface CollectionDetailPageProps {
    params: { collectionId: string };
}

// --- Generate Metadata ---
export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
    try {
        // Fetch only basic details if possible, otherwise reuse full fetch
        const collection = await getCollectionDetailsWithTracks(params.collectionId);
        return { title: `${collection?.title || 'Collection'} - AudioLang Player`, description: collection?.description };
    } catch (error) {
        // Handle 404 specifically for metadata generation
        if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
            return { title: 'Collection Not Found' };
        }
        console.error("Error generating metadata for collection:", params.collectionId, error);
        return { title: 'Error' };
    }
}

// --- Server Component Logic ---
export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
    const collectionId = params.collectionId;
    let collectionDetails: Awaited<ReturnType<typeof getCollectionDetailsWithTracks>> | null = null;
    // Tracks are usually included in the details response, initialize based on that
    let trackDetails: Awaited<ReturnType<typeof getCollectionDetailsWithTracks>>['tracks'] = [];
    let fetchError: string | null = null;
    let isOwner = false; // Determine ownership

    try {
        // Check session server-side to determine ownership *before* making potentially sensitive UI decisions
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        const currentUserId = session.userId;

        // Fetch collection details (backend handles actual data access permissions)
        collectionDetails = await getCollectionDetailsWithTracks(collectionId);

        // Determine if the logged-in user is the owner for UI controls
        isOwner = !!currentUserId && !!collectionDetails && collectionDetails.ownerId === currentUserId;

        // Extract tracks if they were included in the details response
        trackDetails = collectionDetails?.tracks ?? [];

    } catch (error: any) {
        console.error(`Error loading collection ${collectionId}:`, error);
        if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
            notFound(); // 404 or Forbidden -> Not Found Page
        }
        fetchError = error.message || "Failed to load collection details.";
    }

    // Handle case where fetch succeeded but returned null (should be caught by error ideally)
    if (!fetchError && !collectionDetails) {
        notFound();
    }

    // Display error if fetch failed but wasn't a 404/403
    if (fetchError) {
        return <div className="container mx-auto py-6 text-center p-10 text-red-600">{fetchError}</div>;
    }

    // Type guard for collectionDetails after error handling
    if (!collectionDetails) return null;

    const Icon = collectionDetails.type === 'COURSE' ? BookOpen : ListMusic;

    return (
        <div className="container mx-auto py-6">
             <Button variant="outline" size="sm" asChild className="mb-4">
                 <Link href="/collections"><ArrowLeft size={16} className="mr-1"/> Back to Collections</Link>
             </Button>

            <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium uppercase">{collectionDetails.type}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-1">{collectionDetails.title}</h1>
                    </div>
                     {/* Edit/Delete Buttons - Only visible to owner */}
                     {isOwner && (
                         <div className="flex-shrink-0 flex space-x-2 mt-2 sm:mt-0">
                             <Button variant="outline" size="sm" asChild>
                                 <Link href={`/collections/${collectionId}/edit`}>
                                     <Edit className="h-4 w-4 mr-1.5"/> Edit
                                 </Link>
                             </Button>
                             {/* Client component for delete confirmation */}
                             <DeleteCollectionButton collectionId={collectionId} collectionTitle={collectionDetails.title} />
                         </div>
                     )}
                </div>
                {collectionDetails.description && (
                    <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">{collectionDetails.description}</p>
                )}
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-6">Tracks ({trackDetails?.length ?? 0})</h2>

            {/* Pass tracks and ownership status to Client Component */}
             {/* No Suspense needed here if tracks are included in initial load */}
            <CollectionTrackList
                initialTracks={trackDetails ?? []}
                collectionId={collectionId}
                isOwner={isOwner}
            />
        </div>
    );
}

// --- Client Component for Delete Button ---
// (Can be in a separate file e.g., _components/collection/DeleteCollectionButton.tsx)
'use client';
import { useState, useTransition } from 'react';
import { deleteCollectionAction } from '@/_actions/collectionActions';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui"; // Assume AlertDialog exists

interface DeleteCollectionButtonProps {
    collectionId: string;
    collectionTitle: string;
}
function DeleteCollectionButton({ collectionId, collectionTitle }: DeleteCollectionButtonProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = () => {
        setError(null);
        startDeleteTransition(async () => {
            const result = await deleteCollectionAction(collectionId);
            if (result.success) {
                alert("Collection deleted."); // Replace with toast
                router.push('/collections'); // Redirect after delete
            } else {
                setError(result.message || "Failed to delete collection.");
                 // Keep dialog open on error? Or close and show toast? Closing is simpler.
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                    {isDeleting ? <Loader className="h-4 w-4 mr-1.5 animate-spin"/> : <Trash2 className="h-4 w-4 mr-1.5"/>}
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the collection &quot;{collectionTitle}&quot;? This action cannot be undone.
                         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}```

---

## `apps/user-app/app/(main)/collections/new/page.tsx`

```tsx
// apps/user-app/app/(main)/collections/new/page.tsx
'use client'; // Form interaction requires client component

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollectionForm } from '@/_components/collection/CollectionForm';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import type { AudioCollectionResponseDTO } from '@repo/types';

// Note: Metadata can still be defined in Server Components, but this page needs to be client-rendered
// export const metadata = {
//     title: 'Create New Collection - AudioLang Player',
// };

export default function CreateCollectionPage() {
    const router = useRouter();

    const handleSuccess = (createdCollection?: AudioCollectionResponseDTO) => {
         // Redirect to the newly created collection's page
         if (createdCollection?.id) {
             alert("Collection created!"); // Replace with toast
             router.push(`/collections/${createdCollection.id}`);
         } else {
             // Fallback redirect if ID isn't returned (shouldn't happen ideally)
             router.push('/collections');
         }
     };

     const handleCancel = () => {
         router.back(); // Or redirect to /collections
     };

    return (
        <div className="container mx-auto py-6">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/collections"><ArrowLeft size={16} className="mr-1"/> Back to Collections</Link>
            </Button>
            <h1 className="text-2xl font-bold mb-6">Create New Collection</h1>

            <div className="p-4 md:p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm max-w-2xl">
                {/* CollectionForm handles the server action call */}
                <CollectionForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}```

---

## `apps/user-app/app/(main)/collections/page.tsx`

```tsx
// apps/user-app/app/(main)/collections/page.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { listMyCollections, type ListMyCollectionsParams } from '@/_services/collectionService';
import { CollectionList } from '@/_components/collection/CollectionList';
import { Button } from '@repo/ui';
import { Plus, ListMusic, Info } from 'lucide-react';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { DefaultLimit } from '@repo/utils'; // Use shared constant

interface CollectionsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function CollectionsContent({ searchParams }: CollectionsPageProps) {
    const page = parseInt(searchParams?.page as string || '1', 10);
    const limit = parseInt(searchParams?.limit as string || String(DefaultLimit), 10);
    const offset = (page - 1) * limit;

    // Check auth status directly here to avoid fetching if not logged in
    const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
    if (!session.userId) {
        return (
             <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                  <Info size={24} className="mx-auto mb-2 text-slate-400"/>
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view or create collections.
             </div>
        );
    }

    try {
        // Fetch data for the current page
        const params: ListMyCollectionsParams = { limit, offset, sortBy: 'updatedAt', sortDir: 'desc' }; // Example sort
        const { data: collections, total } = await listMyCollections(params);

        if (total === 0) {
             return (
                 <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <ListMusic className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2"/>
                    You haven't created any collections yet.
                     <Button asChild size="sm" className="mt-4">
                        <Link href="/collections/new">
                            <Plus className="h-4 w-4 mr-1" /> Create Your First Collection
                        </Link>
                     </Button>
                </div>
             );
        }

        return (
            <>
                <CollectionList collections={collections} />
                <PaginationControls
                    totalItems={total}
                    currentPage={page}
                    itemsPerPage={limit}
                />
            </>
        );
    } catch (error: any) {
         console.error("Failed to load user collections:", error);
         // Handle specific errors if needed (e.g., API down)
         return <p className="text-center text-red-500 dark:text-red-400">Could not load your collections at this time. Please try again later.</p>;
    }
}

export default function CollectionsPage({ searchParams }: CollectionsPageProps) {
    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Your Collections</h1>
                <Button asChild size="sm">
                    <Link href="/collections/new">
                        <Plus className="h-4 w-4 mr-1" /> Create Collection
                    </Link>
                </Button>
            </div>
             {/* Suspense handles loading state */}
            <Suspense fallback={<div className="text-center p-10 text-slate-500">Loading collections...</div>}>
                <CollectionsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}```

---

## `apps/user-app/app/(main)/layout.tsx`

```tsx
// apps/user-app/app/(main)/layout.tsx
'use client'; // Required for PlayerUI and useAuth hook

import React from 'react';
import { Navbar } from '@/_components/layout/Navbar';
import { Footer } from '@/_components/layout/Footer';
import { PlayerUI } from '@/_components/player/PlayerUI';
// import { useAuth } from '@/_hooks/useAuth'; // AuthProvider wraps this in root layout

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isAuthenticated, isLoading } = useAuth(); // Can use auth state if layout needs it

  // PlayerUI is always rendered, its internal state handles visibility/functionality
  const showPlayer = true;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      {/* Adjust padding-bottom to accommodate player height (pb-20 assumes ~80px height) */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 pb-24 relative">
        {children}
      </main>
      {showPlayer && <PlayerUI />} {/* Render player */}
      {/* Footer is less common when a persistent player is present */}
      {/* <Footer /> */}
    </div>
  );
}```

---

## `apps/user-app/app/(main)/page.tsx`

```tsx
// apps/user-app/app/(main)/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { listTracks } from '@/_services/trackService';
import { listMyCollections } from '@/_services/collectionService';
import { TrackList } from '@/_components/track/TrackList';
import { CollectionList } from '@/_components/collection/CollectionList';
import { Button } from '@repo/ui';
import { ArrowRight, Loader } from 'lucide-react';

// Server Component to fetch recent tracks
async function RecentlyAddedTracks() {
    try {
        // Fetch last 4 added tracks
        const { data: tracks } = await listTracks({ limit: 4, sortBy: 'createdAt', sortDir: 'desc' });
        if (!tracks || tracks.length === 0) {
             return <p className="text-sm text-slate-500 dark:text-slate-400">No tracks available yet.</p>;
        }
        return (
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Recently Added</h2>
                    <Button variant="link" size="sm" asChild className="text-sm">
                        <Link href="/tracks">View All <ArrowRight size={16} className="ml-1 inline-block"/></Link>
                    </Button>
                </div>
                {/* TrackList itself handles the grid */}
                <TrackList tracks={tracks} />
            </section>
        );
    } catch (error) {
        console.error("Failed to load recent tracks:", error);
        return <p className="text-sm text-red-500 dark:text-red-400">Could not load recent tracks.</p>;
    }
}

// Server Component to fetch user's recent collections
async function UserCollectionsPreview() {
    let collections = [];
    let total = 0;
    let userId = null;
    try {
         // Check session server-side
         const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
         userId = session.userId;

         // Only fetch if user is logged in
         if (userId) {
             const response = await listMyCollections({ limit: 4, sortBy: 'updatedAt', sortDir: 'desc' });
             collections = response.data;
             total = response.total;
         }

         // Don't render section if not logged in or no collections
         if (!userId || total === 0) return null;

        return (
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Your Collections</h2>
                     <Button variant="link" size="sm" asChild className="text-sm">
                        <Link href="/collections">View All <ArrowRight size={16} className="ml-1 inline-block"/></Link>
                    </Button>
                </div>
                <CollectionList collections={collections} />
            </section>
        );
    } catch (error) {
        console.error("Failed to load user collections preview:", error);
        // Don't render the section on error
        return null;
    }
}

// Main Page Component
export default function MainPage() {
    // This Server Component orchestrates fetching data server-side via other Server Components
    return (
        <div className="space-y-8">
            {/* TODO: Add a more engaging dashboard/welcome message */}
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Discover new audio or continue where you left off.</p>

            {/* Recent Tracks Section */}
            <Suspense fallback={<div className="p-4 text-center text-slate-500"><Loader className="inline-block mr-2 h-5 w-5 animate-spin"/>Loading recent tracks...</div>}>
                <RecentlyAddedTracks />
            </Suspense>

            {/* User Collections Section */}
            <Suspense fallback={<div className="p-4 text-center text-slate-500"><Loader className="inline-block mr-2 h-5 w-5 animate-spin"/>Loading your collections...</div>}>
                <UserCollectionsPreview />
            </Suspense>

            {/* Placeholder for other potential dashboard sections */}
            {/* <section>
                <h2 className="text-xl font-semibold mb-3">Continue Listening</h2>
                <p className="text-slate-500">...</p>
            </section> */}
        </div>
    );
}```

---

## `apps/user-app/app/(main)/profile/page.tsx`

```tsx
// apps/user-app/app/(main)/profile/page.tsx
'use client'; // Needs client hooks for auth check and data fetching

import { useAuth } from '@/_hooks/useAuth';
import { Loader, AlertTriangle, Edit, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/_services/userService';
import Image from 'next/image';
import Link from 'next/link';

// Query key for the user's profile
const profileQueryKey = (userId?: string) => ['profile', userId || 'guest'] as const;

export default function ProfilePage() {
    const { user: authUser, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

    // Fetch full profile details using TanStack Query
    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isError,
        error,
        isFetching, // Indicates background refetching
    } = useQuery({
        queryKey: profileQueryKey(authUser?.id),
        queryFn: getMyProfile, // Service function fetches from /users/me
        enabled: !!authUser?.id, // Only run query if user ID is available
        staleTime: 5 * 60 * 1000, // Cache profile for 5 minutes
    });

    const isLoading = isLoadingAuth || (isAuthenticated && isLoadingProfile);

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/></div>;
    }

    if (!isAuthenticated || !authUser) {
        // Should be handled by middleware, but provide a clear message
        return (
             <p className="text-center text-slate-500 dark:text-slate-400 py-10">
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view your profile.
             </p>
        );
    }

    if (isError) {
        return (
             <div className="container mx-auto py-6">
                 <div className="p-4 border border-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5 inline mr-2"/>
                    Error loading profile: {error instanceof Error ? error.message : 'Unknown error'}
                 </div>
             </div>
        );
    }

    if (!profileData && !isFetching) {
        // Could happen if API returns empty success or if authUser exists but profile fetch fails silently
        return <p className="text-center text-slate-500 dark:text-slate-400 py-10">Could not load profile data.</p>;
    }

    // Display data, handle potential fetching state
    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
                {/* TODO: Implement Edit Profile functionality and link */}
                 {/* <Button variant="outline" size="sm" asChild>
                     <Link href="/profile/edit"><Edit className="h-4 w-4 mr-1.5"/> Edit Profile</Link>
                 </Button> */}
            </div>

            <Card className="max-w-lg mx-auto md:mx-0"> {/* Center on small screens */}
                <CardHeader className="flex flex-row items-center gap-4">
                     {/* Profile Image */}
                     <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden relative">
                         {profileData?.profileImageUrl ? (
                             <Image
                                 src={profileData.profileImageUrl}
                                 alt="Profile picture"
                                 fill // Use fill layout
                                 sizes="64px" // Specify size hint
                                 className="object-cover"
                                 onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; /* Hide on error */ }}
                             />
                         ) : (
                             <UserCircle size={40} className="text-slate-400 dark:text-slate-500" />
                         )}
                     </div>
                    <div>
                         <CardTitle>{profileData?.name || 'User'}</CardTitle>
                         <CardDescription>Your account details.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                     {profileData ? (
                         <>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">User ID:</span> <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{profileData.id}</span></div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Email:</span> {profileData.email}</div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Name:</span> {profileData.name || <span className="italic text-slate-400">Not set</span>}</div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Provider:</span> <span className="capitalize px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{profileData.authProvider}</span></div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Joined:</span> {new Date(profileData.createdAt).toLocaleDateString()}</div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Last Update:</span> {new Date(profileData.updatedAt).toLocaleString()}</div>
                          </>
                     ) : (
                         <div className="text-center text-slate-500">Loading profile details...</div>
                     )}
                 </CardContent>
            </Card>
        </div>
    );
}```

---

## `apps/user-app/app/(main)/tracks/[trackId]/page.tsx`

```tsx
// apps/user-app/app/(main)/tracks/[trackId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTrackDetails } from '@/_services/trackService'; // Adjust alias
import { formatDuration } from '@repo/utils'; // Adjust alias
import { PlayTrackButton } from '@/_components/track/PlayTrackButton'; // Adjust alias
import { TrackActivityClient } from '@/_components/track/TrackActivityClient'; // Client component for bookmarks/progress
import { Badge } from '@repo/ui'; // Assuming shared badge
import { WifiOff, Clock, Tag, UserCircle, Languages, Activity } from 'lucide-react'; // More icons
import Image from 'next/image';
import Link from 'next/link';
import { APIError } from '@repo/api-client';

interface TrackDetailPageProps {
  params: { trackId: string };
}

// Generate Metadata server-side
export async function generateMetadata({ params }: TrackDetailPageProps): Promise<Metadata> {
    try {
        const trackDetails = await getTrackDetails(params.trackId);
        return {
             title: `${trackDetails?.title || 'Track'} - AudioLang Player`,
             description: trackDetails?.description || 'Listen and learn with this audio track.',
             // OpenGraph metadata
             openGraph: {
                 title: trackDetails?.title || 'Audio Track',
                 description: trackDetails?.description || '',
                 images: trackDetails?.coverImageUrl ? [{ url: trackDetails.coverImageUrl }] : [],
                 type: 'music.song', // or 'article' depending on content
             },
        };
    } catch (error) {
         if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
             return { title: 'Track Not Found' };
         }
         console.error("Error generating metadata for track:", params.trackId, error);
        return { title: 'Error Loading Track' };
    }
}

// Main Page Component (Server Component)
export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const trackId = params.trackId;
  let trackDetails;

  try {
     trackDetails = await getTrackDetails(trackId);
     // Service should throw APIError for 404/403, which we catch below
  } catch (error: any) {
     console.error(`Error fetching track details server-side for ${trackId}:`, error);
     if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
          notFound(); // Trigger Next.js 404 page
     }
     // For other errors, show a generic error message
     // Consider creating a dedicated error display component
     return (
         <div className="container mx-auto py-10 text-center text-red-600 dark:text-red-400">
             Error loading track details. Please try again later.
         </div>
     );
  }

  // If fetch somehow succeeded but returned null/undefined (unlikely with apiClient setup)
  if (!trackDetails) notFound();

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8">
      {/* Header Section with Image and Core Info */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
         {/* Cover Image */}
         <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative shadow">
                 {trackDetails.coverImageUrl ? (
                     <Image
                         src={trackDetails.coverImageUrl}
                         alt={`Cover for ${trackDetails.title}`}
                         fill
                         sizes="(max-width: 768px) 100vw, 33vw"
                         className="object-cover"
                         priority // Prioritize loading cover image
                         onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; /* Hide img on error, placeholder below shows */ }}
                      />
                  ) : (
                     <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-4xl">
                         <MusicNote/> {/* Placeholder Icon */}
                     </div>
                  )}
                   {!trackDetails.isPublic && (
                      <span title="Private Track" className="absolute top-2 right-2 bg-slate-800/70 text-white p-1.5 rounded-full backdrop-blur-sm">
                          <WifiOff size={16} />
                      </span>
                  )}
              </div>
         </div>

         {/* Title, Metadata, Play Button */}
         <div className="flex-grow">
             <h1 className="text-3xl md:text-4xl font-bold mb-2">{trackDetails.title}</h1>
             {/* Metadata row */}
             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <span className="flex items-center"><Languages size={14} className="mr-1"/> {trackDetails.languageCode}</span>
                {trackDetails.level && <span><Badge variant="outline">{trackDetails.level}</Badge></span>}
                <span className="flex items-center"><Clock size={14} className="mr-1"/> {formatDuration(trackDetails.durationMs)}</span>
                {/* Optionally display uploader - requires backend to provide name */}
                 {/* {trackDetails.uploaderName && <span className="flex items-center"><UserCircle size={14} className="mr-1"/> {trackDetails.uploaderName}</span>} */}
             </div>

             {/* Play Button */}
             <div className="my-4">
                 <PlayTrackButton trackId={trackDetails.id} trackTitle={trackDetails.title} size="lg" showLabel={true} />
                 {/* Note: Player UI itself is likely fixed in the layout */}
             </div>

             {/* Description */}
             {trackDetails.description && (
                 <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                     <p>{trackDetails.description}</p>
                 </div>
             )}

             {/* Tags */}
             {trackDetails.tags && trackDetails.tags.length > 0 && (
                 <div className="mt-4 flex flex-wrap gap-2">
                      <Tag size={14} className="text-slate-500 dark:text-slate-400 mt-0.5"/>
                      {trackDetails.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                 </div>
             )}
         </div>
      </div>


      {/* Activity Section (Bookmarks, Progress) - Client Component */}
      <div className="mt-8 pt-6 border-t dark:border-slate-700">
         <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Activity size={20}/> Your Activity</h2>
         <Suspense fallback={<div className="mt-6"><Loader className="h-5 w-5 animate-spin text-slate-400"/> Loading activity...</div>}>
            <TrackActivityClient trackId={trackDetails.id} />
         </Suspense>
      </div>

       {/* Optional Debug Info (Remove in Production) */}
       {/* <details className="mt-10 text-xs opacity-50">
           <summary>Debug Info</summary>
           <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">{JSON.stringify(trackDetails, null, 2)}</pre>
       </details> */}
    </div>
  );
}```

---

## `apps/user-app/app/(main)/tracks/page.tsx`

```tsx
// apps/user-app/app/(main)/tracks/page.tsx
'use client'; // Needs client hooks for filters/pagination

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Use Next.js hooks
import { useQuery } from '@tanstack/react-query';
import { listTracks } from '@/_services/trackService';
import { TrackList } from '@/_components/track/TrackList';
import type { ListTrackQueryParams, AudioLevel } from '@repo/types';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { Input, Select } from '@repo/ui';
import { useDebounce } from '@/_hooks/useDebounce';
import { DefaultLimit, MaxLimit } from '@repo/utils'; // Use shared constants
import { Loader } from 'lucide-react';

// Define keys for react-query
const tracksQueryKeys = {
    list: (params: ListTrackQueryParams) => ['tracks', params] as const,
};

// Separate component to read search params and manage state/fetching
function TrackPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- State Management ---
    // Read initial state FROM URL search params
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
    const [languageFilter, setLanguageFilter] = useState(() => searchParams.get('lang') || '');
    const [levelFilter, setLevelFilter] = useState(() => searchParams.get('level') || '');
    // TODO: Add state for other filters like tags if needed

    // Sorting state (example, you might want Select dropdowns for this)
    const [sortBy, setSortBy] = useState<ListTrackQueryParams['sortBy']>(() => (searchParams.get('sortBy') as ListTrackQueryParams['sortBy']) || 'createdAt');
    const [sortDir, setSortDir] = useState<ListTrackQueryParams['sortDir']>(() => (searchParams.get('sortDir') as ListTrackQueryParams['sortDir']) || 'desc');

    // Pagination state (driven by URL params via PaginationControls)
    const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
    const limit = useMemo(() => {
        let l = parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
        if (isNaN(l) || l <= 0) l = DefaultLimit;
        return Math.min(l, MaxLimit);
    }, [searchParams]);
    const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

    // Debounce search term for API call efficiency
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // Build query params MEMOIZED for the API call based on current state
    const queryParams: ListTrackQueryParams = useMemo(() => ({
        limit,
        offset,
        q: debouncedSearchTerm || undefined,
        lang: languageFilter || undefined,
        level: levelFilter as AudioLevel || undefined, // Cast to type
        sortBy: sortBy,
        sortDir: sortDir,
    }), [limit, offset, debouncedSearchTerm, languageFilter, levelFilter, sortBy, sortDir]);

    // --- Data Fetching ---
    const { data: queryResponse, isLoading, isFetching, isError, error } = useQuery({
        queryKey: tracksQueryKeys.list(queryParams), // Query key includes all params
        queryFn: () => listTracks(queryParams),
        placeholderData: (prev) => prev, // Keep previous data while loading new page/filters
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    const tracks = queryResponse?.data ?? [];
    const totalTracks = queryResponse?.total ?? 0;

    // --- Event Handlers to Update URL Search Params ---
    const updateSearchParams = (newParams: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        // Update provided params
        for (const key in newParams) {
            if (newParams[key]) {
                current.set(key, newParams[key]);
            } else {
                current.delete(key); // Remove param if value is empty
            }
        }
        // Reset page to 1 when filters change
        current.set('page', '1');
        // Keep existing limit or set default
        current.set('limit', String(limit));
        current.delete('offset'); // Use page param

        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`); // Navigate, triggering refetch
    };

    // Update URL when debounced search term changes
    useEffect(() => {
        updateSearchParams({ q: debouncedSearchTerm });
    }, [debouncedSearchTerm]); // Only trigger when debounced value changes

    // Update URL immediately for other filters/sorts
    const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLanguageFilter(value);
        updateSearchParams({ lang: value });
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLevelFilter(value);
        updateSearchParams({ level: value });
    };

     const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
         const value = e.target.value;
         const [newSortBy, newSortDir] = value.split('_') as [ListTrackQueryParams['sortBy'], ListTrackQueryParams['sortDir']];
         setSortBy(newSortBy ?? 'createdAt');
         setSortDir(newSortDir ?? 'desc');
         updateSearchParams({ sortBy: newSortBy ?? 'createdAt', sortDir: newSortDir ?? 'desc' });
     };


    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Explore Tracks</h1>

            {/* Filter/Sort Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800 shadow-sm">
                <Input
                    placeholder="Search title/desc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update local state, useEffect handles URL update
                    aria-label="Search tracks"
                />
                <Input
                    placeholder="Language (e.g., en)"
                    value={languageFilter}
                    onChange={handleLanguageChange}
                    aria-label="Filter by language"
                />
                 <Select value={levelFilter} onChange={handleLevelChange} aria-label="Filter by level">
                    <option value="">Any Level</option>
                    <option value="A1">A1</option> <option value="A2">A2</option>
                    <option value="B1">B1</option> <option value="B2">B2</option>
                    <option value="C1">C1</option> <option value="C2">C2</option>
                    <option value="NATIVE">Native</option>
                 </Select>
                 <Select value={`${sortBy}_${sortDir}`} onChange={handleSortChange} aria-label="Sort tracks">
                     <option value="createdAt_desc">Newest First</option>
                     <option value="createdAt_asc">Oldest First</option>
                     <option value="title_asc">Title (A-Z)</option>
                     <option value="title_desc">Title (Z-A)</option>
                     <option value="durationMs_asc">Duration (Shortest)</option>
                     <option value="durationMs_desc">Duration (Longest)</option>
                     <option value="level_asc">Level (A1-Native)</option> {/* May need custom sorting logic */}
                 </Select>
            </div>

            {isError && (
                <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
                     Error loading tracks: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            {/* TrackList handles its own loading state based on isLoading prop */}
            <TrackList tracks={tracks} isLoading={isLoading || isFetching} />

            {/* Pagination */}
            {totalTracks > 0 && !isLoading && (
                <PaginationControls
                    totalItems={totalTracks}
                    itemsPerPage={limit}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
}

// Wrap with Suspense to allow useSearchParams in the client component
export default function TracksPageWrapper() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/> Loading...</div>}>
            <TrackPageContent />
        </Suspense>
    );
}```

---

## `apps/user-app/app/(main)/upload/page.tsx`

```tsx
// apps/user-app/app/(main)/upload/page.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, useTransition, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    requestUploadAction, // Use USER actions
    createTrackMetadataAction, // Use USER actions
    requestBatchUploadAction, // Use USER actions
    completeBatchUploadAction // Use USER actions
} from '@/_actions/uploadActions';
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw, ArrowLeft } from 'lucide-react';
import type {
    AudioLevel,
    CompleteUploadRequestDTO, // Type from @repo/types
    BatchCompleteUploadItemDTO, // Type from @repo/types
    BatchRequestUploadInputResponseItemDTO,
    BatchCompleteUploadResponseItemDTO
 } from '@repo/types';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { cn } from '@repo/utils';
import Link from 'next/link';

// --- State Types ---
type SingleUploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';
interface BatchFileStatus {
    id: string; // Unique ID for list key
    file: File;
    status: 'pending' | 'requesting' | 'uploading' | 'error' | 'uploaded';
    progress: number;
    uploadUrl?: string;
    objectKey?: string;
    errorMsg?: string;
    xhr?: XMLHttpRequest; // To allow cancellation
}
type BatchUploadStage = 'select' | 'uploading' | 'metadata' | 'completing' | 'results';

// --- Helper ---
// Client-side duration detection (remains the same)
const getAudioDuration = (audioFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
        // Safari needs explicit check
        if (typeof window.AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
             console.warn("AudioContext not supported, cannot detect duration client-side.");
             return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (!e.target?.result) return resolve(null);
            audioContext.decodeAudioData(e.target.result as ArrayBuffer)
                .then(buffer => resolve(Math.round(buffer.duration * 1000)))
                .catch(err => {
                    console.warn("Could not decode audio file client-side to get duration:", err);
                    resolve(null);
                });
        };
        reader.onerror = () => {
            console.warn("FileReader error trying to get duration.");
            resolve(null);
        };
        reader.readAsArrayBuffer(audioFile);
    });
};


export default function UploadPage() {
    const router = useRouter();

    // --- Single Upload State & Logic ---
    const [singleFile, setSingleFile] = useState<File | null>(null);
    const [singleStage, setSingleStage] = useState<SingleUploadStage>('select');
    const [singleError, setSingleError] = useState<string | null>(null);
    const [singleProgress, setSingleProgress] = useState(0);
    const [singleUploadResult, setSingleUploadResult] = useState<{ uploadUrl: string; objectKey: string } | null>(null);
    const [singleIsProcessing, startSingleTransition] = useTransition();
    const singleXhrRef = useRef<XMLHttpRequest | null>(null);

    // RHF for single upload metadata form
    const { register: registerMeta, handleSubmit: handleMetaSubmit, formState: { errors: metaErrors }, reset: resetMetaForm, setValue: setMetaValue, watch: watchMeta } = useForm<CompleteUploadRequestDTO>({
        defaultValues: { isPublic: true } // Default public for user uploads?
    });

    // --- Single Upload Functions ---
    const resetSingleUpload = useCallback(() => {
        if (singleXhrRef.current) { singleXhrRef.current.abort(); singleXhrRef.current = null; }
        setSingleFile(null); setSingleStage('select'); setSingleError(null); setSingleProgress(0); setSingleUploadResult(null); resetMetaForm({ isPublic: true });
        const fileInput = document.getElementById('singleAudioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [resetMetaForm]);

    const handleSingleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetSingleUpload();
        const file = event.target.files?.[0];
        if (file) {
            setSingleFile(file);
            setValue('title', file.name.replace(/\.[^/.]+$/, ""));
            const duration = await getAudioDuration(file);
            setValue('durationMs', duration ?? 0); // Set duration or 0
        }
    }, [resetSingleUpload, setValue]);

    const handleRequestSingleUpload = useCallback(async () => {
        if (!singleFile || singleStage !== 'select') return;
        setErrorMsg(null); setSingleProgress(0); setSingleStage('requestingUrl');
        startSingleTransition(async () => {
            const result = await requestUploadAction(singleFile.name, singleFile.type);
            if (!result.success || !result.uploadUrl || !result.objectKey) {
                setSingleError(result.message || "Failed to prepare upload."); setSingleStage('error'); return;
            }
            setSingleUploadResult({ uploadUrl: result.uploadUrl, objectKey: result.objectKey });
            setSingleStage('uploading');
            handleDirectUpload(result.uploadUrl, result.objectKey, setSingleProgress, () => { singleXhrRef.current = null; setSingleStage('metadata'); setValue('objectKey', result.objectKey); }, (errMsg) => { singleXhrRef.current = null; setSingleError(errMsg); setSingleStage('error'); }, singleXhrRef);
        });
    }, [singleFile, singleStage, setValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
         if (!singleUploadResult?.objectKey || singleStage !== 'metadata') return;
         // RHF data should be correct types, but ensure tags/optional handled
         data.tags = (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [];
         data.level = data.level === "" ? undefined : data.level;
         data.coverImageUrl = data.coverImageUrl === "" ? undefined : data.coverImageUrl;

         setSingleStage('completing'); setSingleError(null);
         startSingleTransition(async () => {
             const result = await createTrackMetadataAction(data); // Pass DTO directly
             if (result.success && result.track) {
                 setSingleStage('success');
                 setTimeout(() => router.push(`/tracks/${result.track?.id}`), 1500);
             } else {
                 setSingleError(result.message || "Failed to create track.");
                 setSingleStage('metadata');
             }
         });
     };

    // --- Batch Upload State & Logic ---
    const [batchFiles, setBatchFiles] = useState<BatchFileStatus[]>([]);
    const [batchStage, setBatchStage] = useState<BatchUploadStage>('select');
    const [batchError, setBatchError] = useState<string | null>(null);
    const [batchIsProcessing, startBatchTransition] = useTransition();
    const [batchResults, setBatchResults] = useState<BatchCompleteUploadResponseItemDTO[]>([]);

    // RHF for batch metadata form
    const { control: batchControl, register: batchRegister, handleSubmit: handleBatchMetaSubmit, formState: { errors: batchMetaErrors }, reset: resetBatchMetaForm, getValues: getBatchMetaValues, setValue: setBatchMetaValue, watch: watchBatch } = useForm<{ tracks: BatchCompleteUploadItemDTO[] }>({ defaultValues: { tracks: [] } });
    const { fields, append, remove, replace } = useFieldArray({ control: batchControl, name: "tracks", keyName: "formId" }); // Use "formId" for unique key

    // --- Batch Upload Functions ---
    const resetBatchUpload = useCallback(() => {
        batchFiles.forEach(bf => bf.xhr?.abort());
        setBatchFiles([]); setBatchStage('select'); setBatchError(null); setBatchResults([]); replace([]);
        const fileInput = document.getElementById('batchAudioFiles') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [batchFiles, replace]);

     const handleBatchFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetBatchUpload();
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newFileStatuses: BatchFileStatus[] = [];
        const metadataDefaults: Partial<BatchCompleteUploadItemDTO>[] = [];

        // Show loading state while processing files client-side
        setBatchStage('uploading'); // Use 'uploading' state to show processing indicator
        startBatchTransition(async () => {
             for (const file of Array.from(files)) {
                 const duration = await getAudioDuration(file);
                 const fileId = crypto.randomUUID();
                 newFileStatuses.push({ id: fileId, file, status: 'pending', progress: 0 });
                 metadataDefaults.push({
                     title: file.name.replace(/\.[^/.]+$/, ""), durationMs: duration ?? 0, isPublic: true, languageCode: '', level: undefined, description: '', tags: [], coverImageUrl: ''
                 });
             }
             setBatchFiles(newFileStatuses);
             replace(metadataDefaults as BatchCompleteUploadItemDTO[]);
             setBatchStage('select'); // Go back to select stage after processing
        });

    }, [resetBatchUpload, replace]);

    const handleBatchUpload = useCallback(async () => {
        const pendingFiles = batchFiles.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0 || batchStage !== 'select') return;

        setBatchStage('uploading'); setBatchError(null);
        startBatchTransition(async () => {
            const requestItems = pendingFiles.map(f => ({ filename: f.file.name, contentType: f.file.type }));
            const urlResult = await requestBatchUploadAction(requestItems);

            if (!urlResult.success || !urlResult.results) {
                setBatchError(urlResult.message || "Failed to prepare batch upload URLs.");
                setBatchStage('error'); // Or back to 'select' with error?
                return;
            }

            // Match results back to files and prepare for uploads
            const uploadPromises: Promise<boolean>[] = []; // Promise resolves to true on success, false on error
            let filesToUpload: BatchFileStatus[] = [];

            setBatchFiles(currentFiles => {
                filesToUpload = currentFiles.map(bf => {
                    if (bf.status !== 'pending') return bf; // Skip already processed/error files

                    const resultItem = urlResult.results?.find(res => res.originalFilename === bf.file.name);
                    if (!resultItem || resultItem.error || !resultItem.uploadUrl || !resultItem.objectKey) {
                        return { ...bf, status: 'error', errorMsg: resultItem?.error || 'Missing URL/Key' };
                    }
                    // Find corresponding RHF field index
                    const rhfIndex = currentFiles.findIndex(f => f.id === bf.id);
                    if (rhfIndex !== -1) {
                        setBatchMetaValue(`tracks.${rhfIndex}.objectKey`, resultItem.objectKey);
                    }
                    return { ...bf, status: 'requesting', uploadUrl: resultItem.uploadUrl, objectKey: resultItem.objectKey };
                });
                return filesToUpload; // Update state with keys/statuses
            });


            // Start individual uploads
            filesToUpload.filter(f => f.status === 'requesting').forEach(fileStatus => {
                 const rhfIndex = fields.findIndex(field => field.id === fileStatus.id); // Find index using RHF keyName if id matches

                 const promise = new Promise<boolean>((resolve) => {
                     setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'uploading', progress: 0 } : f));

                     const xhr = new XMLHttpRequest();
                     fileStatus.xhr = xhr; // Store ref

                     xhr.open('PUT', fileStatus.uploadUrl!, true);
                     xhr.upload.onprogress = (event) => {
                          if (event.lengthComputable) {
                             const progress = Math.round((event.loaded / event.total) * 100);
                             setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, progress: progress } : f));
                          }
                     };
                     xhr.onload = () => {
                         fileStatus.xhr = null;
                         const success = xhr.status >= 200 && xhr.status < 300;
                         setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: success ? 'uploaded' : 'error', errorMsg: success ? undefined : `Upload failed (${xhr.status})` } : f));
                         resolve(success);
                     };
                     xhr.onerror = () => {
                         fileStatus.xhr = null;
                         const errorMsg = xhr.status === 0 ? "Network error or cancelled" : "Upload error";
                         setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'error', errorMsg: errorMsg } : f));
                         resolve(false);
                     };
                     xhr.onabort = () => { fileStatus.xhr = null; resolve(false); }; // Treat abort as failure for promise
                     xhr.setRequestHeader('Content-Type', fileStatus.file.type);
                     xhr.send(fileStatus.file);
                 });
                 uploadPromises.push(promise);
            });

             try {
                 const uploadOutcomes = await Promise.all(uploadPromises);
                 const allSucceeded = uploadOutcomes.every(success => success);
                 if (allSucceeded) {
                     setBatchStage('metadata');
                     console.log("All batch uploads successful.");
                 } else {
                      setBatchError("One or more files failed to upload. Please review statuses.");
                      setBatchStage('uploading'); // Stay on uploading stage to show errors
                     console.warn("Some batch uploads failed.");
                 }
             } catch (uploadError: any) {
                 console.error("Batch upload general error:", uploadError);
                 setBatchError(uploadError.message || "Some uploads failed unexpectedly.");
                 setBatchStage('uploading'); // Stay on uploading stage
             }
        });
    }, [batchFiles, batchStage, setBatchMetaValue, fields]);


    const onBatchMetadataSubmit: SubmitHandler<{ tracks: BatchCompleteUploadItemDTO[] }> = (data) => {
        // Filter data to include only those successfully uploaded and having an objectKey
        const tracksToComplete = data.tracks.filter((item, index) =>
            batchFiles[index]?.status === 'uploaded' && !!item.objectKey
        ).map((item) => { // Clean up optional fields for the API call
            return {
                ...item,
                level: item.level === "" ? undefined : item.level,
                description: item.description === "" ? undefined : item.description,
                coverImageUrl: item.coverImageUrl === "" ? undefined : item.coverImageUrl,
                tags: (item.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
                isPublic: item.isPublic ?? false,
            };
        });


        if (tracksToComplete.length === 0) {
            setBatchError("No completed uploads with metadata to finalize.");
            return;
        }

        setBatchStage('completing'); setBatchError(null);
        startBatchTransition(async () => {
            const result = await completeBatchUploadAction(tracksToComplete);
            setBatchResults(result.results ?? []); // Store detailed results
            setBatchStage('results'); // Move to results stage regardless of partial failures
            if (!result.success) {
                setBatchError(result.message || "Batch completion reported errors.");
            }
        });
    };

    // --- Generic Direct Upload Helper ---
    const handleDirectUpload = useCallback((
        url: string,
        objKey: string,
        setProgress: (p: number) => void,
        onSuccess: () => void,
        onError: (msg: string) => void,
        xhrRef: React.MutableRefObject<XMLHttpRequest | null>
    ) => {
        const fileToUpload = singleFile; // Use singleFile state for this instance
        if (!fileToUpload || !url) return;

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open('PUT', url, true);
        xhr.upload.onprogress = (event) => { if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100)); };
        xhr.onload = () => { xhrRef.current = null; if (xhr.status >= 200 && xhr.status < 300) onSuccess(); else onError(`Upload failed: ${xhr.statusText || 'Error'} (${xhr.status})`); };
        xhr.onerror = () => { xhrRef.current = null; onError(xhr.status === 0 ? "Upload failed: Network error or cancelled." : "Upload error occurred."); };
        xhr.onabort = () => { xhrRef.current = null; console.log("Upload aborted for", objKey); };
        xhr.setRequestHeader('Content-Type', fileToUpload.type);
        xhr.send(fileToUpload);
    }, [singleFile]); // Depends on singleFile state


    return (
        <div className="container mx-auto py-6 space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold">Upload Audio</h1>

            {/* --- Single File Upload Section --- */}
            <Card>
                <CardHeader><CardTitle>Single Track Upload</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {/* Error Display */}
                    {singleStage === 'error' && singleError && (
                         <div className="p-3 border border-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 flex items-center justify-between">
                            <span><AlertTriangle className="h-5 w-5 inline mr-2"/> {singleError}</span>
                             <Button variant="ghost" size="sm" onClick={resetSingleUpload} className="text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50"><RotateCcw size={16}/> Try Again</Button>
                        </div>
                    )}
                    {singleStage === 'success' && (
                         <div className="p-3 border border-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 inline mr-2"/> Track created! Redirecting...
                        </div>
                    )}

                    {/* File Input & Upload Button */}
                    {['select', 'error'].includes(singleStage) && (
                        <div className="space-y-3">
                            <Label htmlFor="singleAudioFile">Select Audio File</Label>
                            <Input id="singleAudioFile" type="file" accept="audio/*" onChange={handleSingleFileChange} />
                            {singleFile && <p className="text-sm text-slate-600 dark:text-slate-400">Selected: {singleFile.name}</p>}
                            {watchMeta("durationMs") > 0 && <p className="text-sm text-slate-500">Detected duration: ~{Math.round(watchMeta("durationMs") / 1000)}s</p>}
                            <Button onClick={handleRequestSingleUpload} disabled={!singleFile || singleIsProcessing}>
                                {singleIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                {singleIsProcessing ? 'Preparing...' : 'Upload & Continue'}
                            </Button>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {singleStage === 'uploading' && (
                         <div className="space-y-2">
                            <p className="text-sm font-medium">Uploading {singleFile?.name}...</p>
                            <Progress value={singleProgress} className="w-full" />
                            <p className="text-center text-xs">{singleProgress}%</p>
                             <Button variant="outline" size="sm" onClick={resetSingleUpload} disabled={!xhrRef.current}>Cancel Upload</Button>
                         </div>
                    )}

                    {/* Metadata Form */}
                    {singleStage === 'metadata' && singleUploadResult?.objectKey && (
                         <form onSubmit={handleMetaSubmit(onMetadataSubmit)} className="space-y-4 mt-4 border-t dark:border-slate-700 pt-4">
                             <h3 className="font-semibold">Enter Track Details</h3>
                              {/* Hidden field for objectKey */}
                             <input type="hidden" {...registerMeta('objectKey')} />

                             {/* Metadata Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><Label htmlFor="title">Title*</Label><Input id="title" {...registerMeta('title', { required: true })} className={cn(metaErrors.title && "border-red-500")}/>{metaErrors.title && <p className='text-xs text-red-500 mt-1'>Title is required.</p>}</div>
                                 <div><Label htmlFor="languageCode">Language Code*</Label><Input id="languageCode" {...registerMeta('languageCode', { required: true })} className={cn(metaErrors.languageCode && "border-red-500")} placeholder="e.g., en-US"/>{metaErrors.languageCode && <p className='text-xs text-red-500 mt-1'>Language code is required.</p>}</div>
                                 <div><Label htmlFor="durationMs">Duration (ms)*</Label><Input id="durationMs" type="number" {...registerMeta('durationMs', { required: true, min: 1, valueAsNumber: true })} className={cn(metaErrors.durationMs && "border-red-500")} />{metaErrors.durationMs && <p className='text-xs text-red-500 mt-1'>Valid duration (ms) is required.</p>}</div>
                                 <div><Label htmlFor="level">Level</Label><Select id="level" {...registerMeta('level')}><option value="">-- Optional --</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>NATIVE</option></Select></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" {...registerMeta('description')} /></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...registerMeta('tags')} /></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="coverImageUrl">Cover Image URL</Label><Input id="coverImageUrl" type="url" {...registerMeta('coverImageUrl')} placeholder="https://..." /></div>
                                 <div className="flex items-center space-x-2 col-span-1 md:col-span-2"><Checkbox id="isPublic" {...registerMeta('isPublic')} /><Label htmlFor="isPublic">Publicly Visible</Label></div>
                             </div>

                             <div className="flex justify-end pt-4">
                                 <Button type="submit" disabled={singleIsProcessing}>
                                     {singleIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
                                     {singleIsProcessing ? 'Saving...' : 'Create Track'}
                                 </Button>
                             </div>
                         </form>
                     )}
                </CardContent>
            </Card>

            {/* --- Batch File Upload Section --- */}
             <Card>
                <CardHeader><CardTitle>Batch Track Upload</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     {/* Batch Error Display */}
                     {batchError && (
                         <div className="p-3 border border-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 flex items-center justify-between">
                            <span><AlertTriangle className="h-5 w-5 inline mr-2"/> {batchError}</span>
                            <Button variant="ghost" size="sm" onClick={resetBatchUpload} className="text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50"><RotateCcw size={16}/> Start Over</Button>
                         </div>
                     )}

                    {/* File Input & Upload Button */}
                    {batchStage === 'select' && (
                         <div className="space-y-3">
                             <Label htmlFor="batchAudioFiles">Select Multiple Audio Files</Label>
                             <Input id="batchAudioFiles" type="file" accept="audio/*" multiple onChange={handleBatchFileChange} />
                             {batchFiles.length > 0 && <p className="text-sm text-slate-600">{batchFiles.length} file(s) selected.</p>}
                             <Button onClick={handleBatchUpload} disabled={batchFiles.length === 0 || batchIsProcessing} >
                                 {batchIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                 {batchIsProcessing ? 'Preparing...' : `Upload ${batchFiles.length} File(s)`}
                             </Button>
                         </div>
                    )}

                    {/* File List & Metadata Form during Upload/Metadata stages */}
                     {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'completing') && (
                         <form onSubmit={handleBatchMetaSubmit(onBatchMetadataSubmit)} className="space-y-4">
                             {fields.length > 0 ? (
                                 <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                      {fields.map((field, index) => {
                                         const fileStatus = batchFiles[index]; // Get corresponding file status
                                         return (
                                             <div key={field.formId} className={`p-3 border rounded relative ${fileStatus?.status === 'error' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                                 <div className="flex justify-between items-start mb-2">
                                                     <h4 className="font-medium text-sm truncate pr-10">{fileStatus?.file?.name ?? `Track ${index + 1}`}</h4>
                                                      {/* Status Indicator */}
                                                     {fileStatus && (
                                                        <span className={`text-xs px-1.5 py-0.5 rounded-full absolute top-2 right-2 ${
                                                            fileStatus.status === 'uploaded' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                            fileStatus.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                            fileStatus.status === 'uploading' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                            'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                                        }`}>
                                                             {fileStatus.status === 'uploading' ? `${fileStatus.progress}%` : fileStatus.status}
                                                         </span>
                                                     )}
                                                 </div>

                                                  {fileStatus?.status === 'error' && <p className="text-xs text-red-600 mb-2">{fileStatus.errorMsg}</p>}

                                                 {/* Metadata Inputs - Only show fully if uploaded */}
                                                 {(fileStatus?.status === 'uploaded' || batchStage === 'metadata') && (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-2 border-t dark:border-slate-700/50">
                                                         <input type="hidden" {...batchRegister(`tracks.${index}.objectKey`)} />
                                                         <div><Label className="text-xs">Title*</Label><Input size="sm" {...batchRegister(`tracks.${index}.title`, { required: true })} className={cn(batchMetaErrors.tracks?.[index]?.title && "border-red-500")}/></div>
                                                         <div><Label className="text-xs">Language*</Label><Input size="sm" placeholder="en-US" {...batchRegister(`tracks.${index}.languageCode`, { required: true })} className={cn(batchMetaErrors.tracks?.[index]?.languageCode && "border-red-500")}/></div>
                                                         <div><Label className="text-xs">Level</Label><Select size="sm" {...batchRegister(`tracks.${index}.level`)}><option value="">-- Optional --</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>NATIVE</option></Select></div>
                                                         <div><Label className="text-xs">Duration(ms)*</Label><Input size="sm" type="number" {...batchRegister(`tracks.${index}.durationMs`, { required: true, min: 1, valueAsNumber: true })} className={cn(batchMetaErrors.tracks?.[index]?.durationMs && "border-red-500")} /></div>
                                                         <div className="col-span-1 md:col-span-2"><Label className="text-xs">Description</Label><Input size="sm" {...batchRegister(`tracks.${index}.description`)} /></div>
                                                         <div className="col-span-1 md:col-span-2"><Label className="text-xs">Tags</Label><Input size="sm" placeholder="Comma, separated" {...batchRegister(`tracks.${index}.tags`)} /></div>
                                                         {/* Add Public Checkbox, CoverURL input */}
                                                         <div className="flex items-center space-x-2 col-span-1 md:col-span-2"><Checkbox id={`isPublic-${field.formId}`} {...batchRegister(`tracks.${index}.isPublic`)} /><Label htmlFor={`isPublic-${field.formId}`}>Publicly Visible</Label></div>
                                                     </div>
                                                 )}
                                             </div>
                                         );
                                     })}
                                 </div>
                             ) : (
                                 <p className="text-slate-500 text-sm italic">No files selected for batch upload.</p>
                             )}
                             {/* Submit Button for Metadata */}
                             {batchStage === 'metadata' && batchFiles.some(f => f.status === 'uploaded') && (
                                 <div className="flex justify-end pt-4">
                                     <Button type="submit" disabled={batchIsProcessing}>
                                         {batchIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <ListPlus size={16} className="mr-1"/>}
                                         {batchIsProcessing ? 'Saving...' : 'Complete Batch & Create Tracks'}
                                     </Button>
                                 </div>
                             )}
                         </form>
                    )}

                     {/* Results View */}
                     {batchStage === 'results' && (
                         <div className="space-y-3">
                             <h3 className="font-semibold">Batch Results</h3>
                             {batchResults.length > 0 ? (
                                 <ul className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                                     {batchResults.map((res, index) => (
                                         <li key={res.objectKey || index} className={`flex justify-between items-center p-1.5 text-sm rounded ${res.success ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                                             <span className="truncate mr-2" title={res.objectKey}>{res.objectKey?.split('/').pop() ?? `Item ${index+1}`}</span>
                                             {res.success ? (
                                                 <span className="text-green-700 dark:text-green-300 text-xs font-medium flex items-center"><CircleCheckBig size={14} className="mr-1"/> Created ({res.trackId?.substring(0,8)}...)</span>
                                             ) : (
                                                  <span className="text-red-700 dark:text-red-300 text-xs font-medium flex items-center" title={res.error}><CircleX size={14} className="mr-1"/> {res.error || 'Failed'}</span>
                                             )}
                                         </li>
                                     ))}
                                 </ul>
                             ) : <p className="text-slate-500 italic">No results processed.</p>}
                              <Button variant="outline" size="sm" onClick={resetBatchUpload}>Upload More</Button>
                         </div>
                     )}

                      {/* Reset/Cancel Button */}
                       {(batchStage === 'uploading' || batchStage === 'metadata') && (
                          <div className="pt-4">
                             <Button variant="outline" size="sm" onClick={resetBatchUpload} disabled={batchIsProcessing && batchStage !== 'uploading'}>
                                {batchStage === 'uploading' ? 'Cancel All Uploads' : 'Clear Batch'}
                             </Button>
                          </div>
                       )}

                </CardContent>
             </Card>
        </div>
    );
}```

---

## `apps/user-app/app/api/auth/session/route.ts`

```typescript
// apps/user-app/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions(); // Get user-specific options

/**
 * GET /api/auth/session
 * Checks if a valid user session exists and returns basic user info (ID only).
 * Used by AuthContext to check client-side auth state.
 */
export async function GET(request: NextRequest) {
  // Response must be constructed BEFORE accessing session if using Route Handler context
  const response = NextResponse.json({ user: null, isAuthenticated: false });
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.userId) {
      // console.log("User Session GET: No userId found.");
      // No need to explicitly return 401, just return unauthenticated state
      // Session cookie might be cleared/expired, client needs to know they aren't logged in.
      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    // User has a valid session according to the cookie
    // console.log(`User Session GET: Valid session found for userId ${session.userId}`);
    return NextResponse.json({
      user: { id: session.userId }, // Only return non-sensitive ID
      isAuthenticated: true,
    });

  } catch (error) {
      console.error("User Session GET Error:", error);
      // Return a generic server error if session handling fails unexpectedly
      return NextResponse.json({ message: "Failed to retrieve session information." }, { status: 500 });
  }
}

/**
 * POST /api/auth/session
 * Creates or updates the user session after successful login/registration/callback.
 * Should ONLY be called securely by Server Actions within this app.
 */
export async function POST(request: NextRequest) {
  // Response must be constructed BEFORE accessing session
  const response = NextResponse.json({ ok: false }); // Default to failure
  try {
    const body = await request.json();
    const userId = body.userId as string;

    if (!userId) {
      console.warn("User Session POST: userId is required.");
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // Basic UUID validation could be added here if desired

    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.userId = userId;
    // Ensure admin flag is NEVER set for regular user sessions
    delete session.isAdmin;
    await session.save();

    // console.log(`User Session POST: Session saved successfully for userId ${session.userId}`);
    // Return success with the user ID confirmed in session
    return NextResponse.json({ ok: true, userId: session.userId });

  } catch (error) {
    console.error("User Session POST Error:", error);
    const message = error instanceof Error ? error.message : "Failed to set user session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Destroys the current user session (logout).
 * Should ONLY be called securely by Server Actions within this app.
 */
export async function DELETE(request: NextRequest) {
  // Prepare response first, session destroy will add headers to it
  const response = NextResponse.json({ ok: true });
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    await session.destroy(); // Clears session data and sets cookie removal headers

    console.log("User Session DELETE: Session destroyed.");
    return response; // Return the response with cookie headers set by iron-session

  } catch (error) {
    console.error("User Session DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy user session";
    return NextResponse.json({ message }, { status: 500 });
  }
}```

---

## `apps/user-app/app/globals.css`

```css
/* apps/user-app/app/globals.css */
/* Import shared UI base styles (which includes Tailwind import and @theme) */
@import "@repo/ui/src/globals.css";

/* Add any user-app SPECIFIC global styles or overrides below */

/* Example: Custom scrollbar styling (optional) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: hsl(var(--muted) / 0.5);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.5);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.7);
}```

---

## `apps/user-app/app/layout.tsx`

```tsx
// apps/user-app/app/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/utils";
import { AuthProvider } from '@/_context/AuthContext';
import { SharedQueryClientProvider } from '@repo/query-client';
import { usePlayerStore } from '@/_stores/playerStore';
import '@/app/globals.css'; // Use relative path for app's globals

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const playerCleanup = usePlayerStore((state) => state.cleanup);

  // Cleanup audio resources on root unmount
  useEffect(() => {
    return () => {
      playerCleanup();
    };
  }, [playerCleanup]);

  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SharedQueryClientProvider>
          <AuthProvider>
             {/* Zustand store is accessed via hook, no Provider needed */}
             {children}
          </AuthProvider>
        </SharedQueryClientProvider>
      </body>
    </html>
  );
}```

---

## `apps/user-app/app/page.tsx`

```tsx
// apps/user-app/app/page.tsx (Assuming this is the PUBLIC landing page, not the logged-in dashboard)
import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui"; // Use shared UI

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
        {/* Simple Landing Page Header */}
        <header className="p-4 border-b dark:border-slate-700">
             <div className="container mx-auto flex justify-between items-center">
                 <span className="font-bold text-xl">AudioLang Player</span>
                 <div className="space-x-2">
                     <Button variant="ghost" asChild size="sm"><Link href="/login">Login</Link></Button>
                     <Button variant="default" asChild size="sm"><Link href="/register">Register</Link></Button>
                 </div>
             </div>
        </header>

      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Languages with Audio</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
              Immerse yourself in authentic audio content, track your progress, and reach fluency faster.
          </p>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
               <Button size="lg" asChild>
                   <Link href="/register">Get Started Free</Link>
               </Button>
               <Button variant="outline" size="lg" asChild>
                   <Link href="/tracks">Explore Tracks</Link>
               </Button>
          </div>

          {/* Placeholder for features section */}
          {/* <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>Feature 1</div>
              <div>Feature 2</div>
              <div>Feature 3</div>
          </div> */}

      </main>

      {/* Simple Landing Page Footer */}
       <footer className="p-4 border-t dark:border-slate-700 text-center text-xs text-slate-500">
           © {new Date().getFullYear()} YourAppName.
       </footer>
    </div>
  );
}```

---

## `apps/user-app/eslint.config.mjs`

```
// apps/user-app/eslint.config.mjs
import { defineConfig } from 'eslint/config'; // Import the helper
import eslintConfigRepo from '@repo/eslint-config'; // Import the shared config array

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // Spread the shared configurations defined in @repo/eslint-config
  ...eslintConfigRepo,

  // --- User App Specific Overrides ---
  // Apply overrides *after* spreading the base config
  // Example:
  // {
  //   files: ["_components/player/**/*.tsx"],
  //   rules: {
  //       "@typescript-eslint/no-explicit-any": "error",
  //   },
  // },
]);```

---

## `apps/user-app/middleware.ts`

```typescript
// apps/user-app/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions();

export const config = {
  matcher: [
    /*
     * Define paths that REQUIRE authentication.
     * Public pages like landing page ('/'), public track/collection lists ('/tracks', '/collections'),
     * and individual track/collection details should NOT be listed here
     * if they can be viewed by non-logged-in users.
     */
    '/profile/:path*', // User profile pages
    '/collections/new', // Creating new collections
    '/collections/:collectionId/edit', // Editing collections (dynamic path)
    '/bookmarks', // Viewing bookmarks list
    '/upload', // Upload page
    // Add other paths that strictly require login
    // Example: '/settings/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  const response = NextResponse.next(); // Prepare default response

  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    const { userId } = session;

    // If accessing a protected route without a userId in the session, redirect to login
    if (!userId) {
      const loginUrl = new URL('/login', request.url);
      // Preserve the originally requested URL to redirect back after login
      loginUrl.searchParams.set('next', requestedPath + request.nextUrl.search);
      console.log(`User Middleware: No userId for protected path ${requestedPath}, redirecting to login.`);
      // Clear potentially invalid session cookie? Optional.
      // session.destroy(); await session.save(); // Could add this, but redirect is primary action
      return NextResponse.redirect(loginUrl);
    }

    // User has a valid session, allow the request
    // console.log(`User Middleware: Valid session (userId ${userId}) for protected path ${requestedPath}, allowing.`);
    // Important: Attach session data to the response if needed by subsequent handlers/pages using headers
    // response.headers.set('x-user-id', userId); // Example (Not typically needed with App Router server context)
    return response;

  } catch (error) {
       console.error(`User Middleware Error processing path ${requestedPath}:`, error);
       // Fallback: Redirect to login on session handling error
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('error', 'session_error');
       // Cannot reliably clear cookie here on error
       return NextResponse.redirect(loginUrl);
  }
}```

---

## `apps/user-app/next.config.ts`

```typescript
// apps/user-app/next.config.ts
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Ensure experimental features match if needed, e.g., serverActions
   experimental: {
       serverActions: {
            // Allowed origins for server actions if needed (e.g., specific domains)
            // allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
       },
     },
   // Configure transpilePackages if using packages that need transpilation
   // (Often needed for UI packages that import CSS directly or use specific syntax)
   transpilePackages: ['@repo/ui', '@repo/utils', '@repo/auth', '@repo/types', '@repo/api-client'], // List shared packages
   reactStrictMode: true,
   // Configure image optimization domains if using external images
   images: {
       remotePatterns: [
           {
               protocol: 'https', // or 'http' if needed
               hostname: 'lh3.googleusercontent.com', // Example for Google profile pics
           },
           {
               protocol: 'http', // Example for local MinIO during development
               hostname: 'localhost',
               port: '9000', // Or your MinIO API port
               pathname: '/language-audio/**', // Match your bucket name
           },
           // Add other domains for cover images if applicable
       ],
   },
};

export default nextConfig;```

---

## `apps/user-app/package.json`

```json
{
  "name": "user-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings 0"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@react-oauth/google": "^0.12.1",
    "@repo/api-client": "workspace:*",
    "@repo/auth": "workspace:*",
    "@repo/query-client": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*",
    "@tailwindcss/typography": "^0.5.16",
    "@tanstack/react-query": "^5.72.2",
    "immer": "^10.1.1",
    "iron-session": "^8.0.4",
    "lucide-react": "^0.487.0",
    "next": "15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.55.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@tailwindcss/postcss": "^4.1.3",
    "@tanstack/react-query-devtools": "^5.72.2",
    "@types/node": "^22.14.1",
    "@types/react": "^19.1.1",
    "@types/react-dom": "^19.1.2",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.1.3",
    "typescript": "^5.8.3"
  }
}```

---

## `apps/user-app/postcss.config.mjs`

```
const config = {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
  export default config;```

---

## `apps/user-app/tailwind.config.ts`

```typescript
// apps/user-app/tailwind.config.ts
import type { Config } from "tailwindcss";

// Removed theme and container definitions as they belong in CSS (@repo/ui/src/globals.css)
const config: Pick<Config, "content" | "darkMode" | "plugins"> = {
  darkMode: "class",
  content: [ // Define content paths specific to this app
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    // IMPORTANT: Include path to shared UI package
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Removed 'theme' block - customizations go in packages/ui/src/globals.css @theme
  plugins: [
      // Define app-specific plugins here
      require('@tailwindcss/typography'),
  ],
};
export default config;```

---

## `apps/user-app/tsconfig.json`

```json
// apps/user-app/tsconfig.json
{
  "extends": "../../packages/tsconfig/base.json", // Extend the root base config
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "baseUrl": ".", // Set base URL for this app
    "paths": {
      "@/*": ["./*"] // Standard alias for app-specific paths
    },
    "jsx": "preserve", // Required for Next.js App Router
    "lib": ["dom", "dom.iterable", "esnext"], // Ensure DOM libs are included
    "allowJs": true,
    "incremental": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": ["node", "@types/react", "@types/react-dom"] // Add specific types if needed
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    // Ensure paths cover your _ directories
    "_actions/**/*.ts",
    "_components/**/*.tsx",
    "_context/**/*.tsx",
    "_hooks/**/*.ts",
    "_lib/**/*.ts",
    "_services/**/*.ts",
    "_stores/**/*.ts",
    "_types/**/*.ts" // If you have app-specific types
  ],
  "exclude": ["node_modules"]
}```

---

## `combine_code.py`

```python
#!/usr/bin/env python3
import os
import fnmatch
import argparse
import subprocess
from typing import List, Optional, Dict, Set

# 文件扩展名到 Markdown 语言标识符的映射
EXTENSION_MAP = {
    '.py': 'python',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'jsx',
    '.tsx': 'tsx',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.rb': 'ruby',
    '.php': 'php',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sass': 'sass',
    '.less': 'less',
    '.sql': 'sql',
    '.sh': 'bash',
    '.bash': 'bash',
    '.zsh': 'bash',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.json': 'json',
    '.xml': 'xml',
    '.kt': 'kotlin',
    '.swift': 'swift',
    '.rs': 'rust',
    '.dart': 'dart',
    '.lua': 'lua',
    '.r': 'r',
    '.scala': 'scala',
    '.pl': 'perl',
    '.h': 'cpp',
    '.hpp': 'cpp',
    '.conf': 'ini',
    '.ini': 'ini',
    '.toml': 'toml',
    '.md': 'markdown',
    '.vue': 'vue',
    '.svelte': 'svelte',
}

# 默认排除的模式
DEFAULT_EXCLUDES = [
    '*.md',
    '*.git*',
    '*.log',
    '*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp', '*.svg', '*.bmp', '*.ico',  # 图片文件
    '*.pdf', '*.doc', '*.docx', '*.xls', '*.xlsx', '*.ppt', '*.pptx',  # 文档文件
    '*.zip', '*.tar', '*.gz', '*.rar', '*.7z',  # 压缩文件
    '*.mp3', '*.mp4', '*.avi', '*.mov', '*.wav', '*.ogg',  # 媒体文件
    '*.ttf', '*.otf', '*.woff', '*.woff2', '*.eot',  # 字体文件
    '*.bin', '*.dat', '*.so', '*.dll', '*.exe',  # 二进制文件
    'node_modules/*',
    'venv/*',
    '.venv/*',
    '__pycache__/*',
    'dist/*',
    'build/*',
    '.next/*',
    'out/*',
    '.vscode/*',
    '.idea/*',
    "pnpm-lock.yaml",
    "tailwindcss-v4-reference.css",
]

def is_git_repo() -> bool:
    """检查当前目录是否是 Git 仓库"""
    try:
        subprocess.run(
            ['git', 'rev-parse', '--is-inside-work-tree'],
            capture_output=True, check=True
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def get_tracked_files() -> Optional[List[str]]:
    """获取 Git 跟踪的所有文件列表"""
    try:
        result = subprocess.run(
            ['git', 'ls-files', '--cached', '--exclude-standard'],
            capture_output=True, text=True, check=True, encoding='utf-8'
        )
        return result.stdout.splitlines()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None

def should_exclude_dir(dirpath: str, dirname: str, exclude_patterns: List[str]) -> bool:
    """检查目录是否应该被排除"""
    full_path = os.path.join(dirpath, dirname)
    
    # 排除隐藏目录（以点开头）
    if dirname.startswith('.'):
        return True
        
    for pattern in exclude_patterns:
        # 匹配目录名本身
        if fnmatch.fnmatch(dirname, pattern.rstrip('/*')):
            return True
            
        # 匹配完整路径
        if fnmatch.fnmatch(full_path, pattern):
            return True
            
        # 匹配目录通配符 (如 node_modules/*)
        if pattern.endswith('/*') and fnmatch.fnmatch(full_path, pattern[:-2]):
            return True
    
    return False

def get_files_by_walking(root_dir: str, exclude_patterns: List[str]) -> List[str]:
    """通过遍历文件系统获取文件列表，支持排除模式"""
    files_list = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=True):
        # 过滤排除的目录（修复排除逻辑）
        dirnames[:] = [d for d in dirnames if not should_exclude_dir(dirpath, d, exclude_patterns)]
        
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(file_path, root_dir)
            
            # 检查文件是否应被排除
            if not any(fnmatch.fnmatch(rel_path, pattern) for pattern in exclude_patterns):
                files_list.append(rel_path)
    
    return files_list

def get_language_identifier(filename: str) -> str:
    """根据文件扩展名获取 Markdown 语言标识符"""
    _, ext = os.path.splitext(filename)
    return EXTENSION_MAP.get(ext.lower(), '')  # 如果找不到映射，则返回空字符串

def should_exclude(filename: str, exclude_patterns: List[str]) -> bool:
    """检查文件是否匹配任何排除模式"""
    for pattern in exclude_patterns:
        if fnmatch.fnmatch(filename, pattern):
            return True
    return False

def is_binary_file(filepath: str) -> bool:
    """检查文件是否是二进制文件"""
    # 检查文件扩展名
    _, ext = os.path.splitext(filepath)
    if ext.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', 
                      '.exe', '.dll', '.so', '.pyc', '.zip', '.tar', '.gz'}:
        return True
        
    # 尝试读取文件开头的字节来检测二进制内容
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
            return b'\0' in chunk  # 如果包含空字节，通常是二进制文件
    except Exception:
        # 如果无法打开文件，出于安全考虑将其视为二进制
        return True

def combine_code_to_markdown(
    output_filename: str = "project_code.md", 
    exclude_list: Optional[List[str]] = None,
    use_git: bool = True,
    root_dir: str = ".",
    verbose: bool = False,
    max_lines: Optional[int] = None
) -> None:
    """将符合条件的文件合并到 Markdown 文件中"""
    if exclude_list is None:
        exclude_list = DEFAULT_EXCLUDES.copy()
    
    # 始终排除输出文件
    if output_filename not in exclude_list:
        exclude_list.append(output_filename)
        exclude_list.append(f"*/{output_filename}")  # 防止在子目录中有同名文件
    
    if verbose:
        print(f"排除模式: {exclude_list}")
    
    if use_git and is_git_repo():
        if verbose:
            print("使用 Git 获取文件列表...")
        files = get_tracked_files()
        if not files:
            print("未找到 Git 跟踪的文件或无法执行 Git 命令。")
            return
    else:
        if verbose and use_git:
            print("未找到 Git 仓库，使用文件系统遍历...")
        files = get_files_by_walking(root_dir, exclude_list)
    
    # 对文件列表进行进一步过滤，排除二进制文件
    filtered_files = []
    skipped_binaries = []
    
    for filename in files:
        full_path = os.path.join(root_dir, filename)
        
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            if verbose:
                print(f"跳过不存在或非文件: {filename}")
            continue
            
        if is_binary_file(full_path):
            skipped_binaries.append(filename)
            if verbose:
                print(f"跳过二进制文件: {filename}")
            continue
            
        if not any(fnmatch.fnmatch(filename, pattern) for pattern in exclude_list):
            filtered_files.append(filename)
        elif verbose:
            print(f"排除: {filename}")
    
    if not filtered_files:
        print("过滤后没有文件可以处理。")
        return
    
    if verbose and skipped_binaries:
        print(f"跳过了 {len(skipped_binaries)} 个二进制文件。")
    
    # 排序文件列表以确保一致性
    filtered_files.sort()
    
    if verbose:
        print(f"处理 {len(filtered_files)} 个文件，写入到 {output_filename}...")
    
    project_name = os.path.basename(os.path.abspath(root_dir))
    
    try:
        with open(output_filename, 'w', encoding='utf-8') as outfile:
            # 添加标题和简介
            outfile.write(f"# {project_name} 代码库\n\n")
            outfile.write("*通过 combine_code.py 自动生成*\n\n")
            outfile.write("## 目录\n\n")
            
            # 生成目录
            for filename in filtered_files:
                outfile.write(f"- [{filename}](#{filename.replace('/', '-').replace('.', '-')})\n")
            
            outfile.write("\n---\n\n")
            
            # 写入文件内容
            for filename in filtered_files:
                if verbose:
                    print(f"处理: {filename}")
                
                file_path = os.path.join(root_dir, filename)
                
                # 为每个文件创建锚点兼容的标题
                outfile.write(f"## `{filename}`\n\n")
                
                # 获取语言标识符并写入代码块
                lang = get_language_identifier(filename)
                outfile.write(f"```{lang}\n")
                
                try:
                    # 逐行读取文件以处理大文件
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        if max_lines is not None:
                            # 如果设置了最大行数限制
                            for i, line in enumerate(infile):
                                if i >= max_lines:
                                    outfile.write(f"\n... (已截断，显示了 {max_lines} 行中的前 {max_lines} 行) ...\n")
                                    break
                                outfile.write(line)
                        else:
                            # 无行数限制，直接逐行复制
                            for line in infile:
                                outfile.write(line)
                except Exception as e:
                    error_msg = f"\n[读取文件时出错: {e}]\n"
                    outfile.write(error_msg)
                    if verbose:
                        print(f"错误: 无法读取文件 {filename}: {e}")
                
                outfile.write("```\n\n")
                outfile.write("---\n\n")
        
        print(f"✅ 成功将代码合并到 {output_filename}")
        
    except IOError as e:
        print(f"❌ 写入输出文件 {output_filename} 时出错: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="将代码文件合并到单个 Markdown 文件中，支持 Git 跟踪的文件或文件系统遍历。",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        "-o", "--output",
        default="project_code.md",
        help="输出的 Markdown 文件名"
    )
    
    parser.add_argument(
        "-e", "--exclude",
        action='append',
        help="要排除的 glob 模式（可多次使用）"
    )
    
    parser.add_argument(
        "--no-git",
        action='store_true',
        help="不使用 Git，始终使用文件系统遍历"
    )
    
    parser.add_argument(
        "-d", "--directory",
        default=".",
        help="要处理的项目根目录（当不使用 Git 时）"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action='store_true',
        help="显示详细处理信息"
    )
    
    parser.add_argument(
        "--max-lines",
        type=int,
        help="每个文件的最大行数（超过将被截断）"
    )
    
    args = parser.parse_args()
    
    # 如果用户提供了排除列表，使用它，否则使用默认列表
    exclusions = args.exclude if args.exclude else DEFAULT_EXCLUDES.copy()
    
    combine_code_to_markdown(
        output_filename=args.output,
        exclude_list=exclusions,
        use_git=not args.no_git,
        root_dir=args.directory,
        verbose=args.verbose,
        max_lines=args.max_lines
    )```

---

## `package.json`

```json
{
  "name": "language-player-monorepo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "pnpm run --recursive --parallel build",
    "build:user-app": "pnpm --filter user-app build",
    "build:admin-panel": "pnpm --filter admin-panel build",
    "dev": "pnpm run --recursive --parallel dev",
    "dev:user-app": "pnpm --filter user-app dev",
    "dev:admin-panel": "pnpm --filter admin-panel dev",
    "lint": "pnpm run --recursive --parallel lint",
    "test": "pnpm run --recursive --parallel test",
    "clean": "pnpm run --recursive --parallel clean && rm -rf node_modules",
    "type-check": "pnpm run --recursive --parallel type-check"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^22.14.1",
    "@types/react": "^19.1.1",
    "@typescript-eslint/parser": "^8.29.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.24.0",
    "eslint-config-next": "15.3.0",
    "postcss": "^8.5.3",
    "prettier": "^3.5.3",
    "tailwindcss": "^4.1.3",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "@react-oauth/google": "^0.12.1",
    "@tanstack/react-query": "^5.72.2",
    "iron-session": "^8.0.4",
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zustand": "^5.0.3"
  }
}
```

---

## `packages/api-client/package.json`

```json
{
  "name": "@repo/api-client",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint . --max-warnings 0"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "@repo/types": "workspace:*"
  }
}```

---

## `packages/api-client/src/index.ts`

```typescript
// packages/api-client/src/index.ts
import type { ErrorResponseDTO } from "@repo/types";

/**
 * Custom Error class for API-specific issues, providing status and code.
 */
export class APIError extends Error {
  status: number; // HTTP status code (0 for network errors)
  code: string; // Backend's application-specific error code or generic code
  requestId?: string; // Optional request ID for tracing
  details?: unknown; // Can hold validation details or original error

  constructor(message: string, status: number, code: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Retrieves the API base URL from environment variables.
 * Prefers NEXT_PUBLIC_API_BASE_URL (for client & server).
 * Logs a warning if the variable is missing and falls back.
 * @returns {string} The API base URL.
 */
function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        console.warn(
            "API Client Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set. " +
            "Ensure it's configured in your environment (.env.local, etc.). " +
            "Falling back to relative '/api/v1'. This may fail for server-side requests."
        );
        return "/api/v1"; // Adjust fallback if necessary
    }
    // Remove trailing slash if present
    return baseUrl.replace(/\/$/, '');
}

// --- Core API Client Function ---
interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any; // Allow structured data, FormData, etc.
}

/**
 * Generic API client function using fetch.
 * Handles request/response processing, JSON parsing, error standardization.
 * Includes credentials (cookies) by default for API requests.
 *
 * @template T - The expected type of the successful response data.
 * @param {string} endpoint - API endpoint path (e.g., '/users/me', must start with '/').
 * @param {RequestOptions} [options={}] - Fetch options (method, body, headers, cache, signal, etc.).
 * @returns {Promise<T>} Promise resolving to the parsed JSON response body of type T, or undefined for 204 No Content.
 * @throws {APIError} on network errors or non-2xx HTTP status codes.
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Ensure endpoint starts with a slash
  if (!endpoint.startsWith('/')) {
      console.warn(`API Client: Endpoint "${endpoint}" should start with '/'. Prepending automatically.`);
      endpoint = `/${endpoint}`;
  }

  const baseURL = getApiBaseUrl();
  const url = `${baseURL}${endpoint}`;
  const headers = new Headers(options.headers); // Use Headers interface

  // --- Prepare Body & Content-Type ---
  let bodyToSend: BodyInit | null = null;
  if (options.body !== undefined && options.body !== null) {
    if (options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof ArrayBuffer || options.body instanceof Blob || typeof options.body === 'string') {
        // For these types, let fetch handle Content-Type or expect caller to set it
        bodyToSend = options.body;
        if(options.body instanceof FormData) {
            headers.delete('Content-Type'); // Crucial for FormData
        } else if(options.body instanceof URLSearchParams && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/x-www-form-urlencoded");
        }
    } else { // Assume JSON for other objects/arrays
        try {
            bodyToSend = JSON.stringify(options.body);
            if (!headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
        } catch (stringifyError) {
            console.error(`API Client: Failed to stringify JSON request body for ${url}:`, stringifyError);
            throw new APIError("Failed to serialize request body.", 0, "SERIALIZATION_ERROR", undefined, stringifyError);
        }
    }
  }

  // Set default Accept header if not already set
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // --- Fetch Configuration ---
  const config: RequestInit = {
    ...options,
    method: options.method?.toUpperCase() || (bodyToSend ? 'POST' : 'GET'),
    headers: headers,
    body: bodyToSend,
    cache: options.cache ?? 'no-store',
    credentials: options.credentials ?? 'include', // Send cookies by default
  };

  // --- Execute Fetch ---
  let response: Response;
  try {
    // console.log(`API Client Request: ${config.method} ${url}`); // Reduce logging verbosity
    response = await fetch(url, config);
  } catch (networkError: any) {
    console.error(`API Client Network Error: ${config.method} ${url}`, networkError);
    throw new APIError(
      `Network request failed: ${networkError?.message || 'Check connection or CORS policy.'}`,
      0, "NETWORK_ERROR", undefined, networkError
    );
  }

  // --- Process Response ---
  const requestId = response.headers.get("X-Request-ID") ?? undefined;

  if (response.status === 204) {
    return undefined as T; // Handle No Content
  }

  let responseText: string | null = null;
  try {
      responseText = await response.text();
  } catch (readError: any) {
      console.warn(`API Client: Failed to read response body for ${url} (status: ${response.status})`, readError);
      if (!response.ok) {
          throw new APIError(
              `API request failed (${response.status}) and response body could not be read.`,
              response.status, `HTTP_${response.status}`, requestId, { bodyReadError: readError.message }
          );
      } else {
           throw new APIError(
              `API request succeeded (${response.status}) but failed to read response body.`,
              response.status, "READ_ERROR", requestId, { bodyReadError: readError.message }
           );
      }
  }

  let responseBody: any = responseText; // Default to text
  let parseError: Error | null = null;
  const contentType = response.headers.get("Content-Type");

  if (responseText && contentType?.toLowerCase().includes("application/json")) {
    try {
      responseBody = JSON.parse(responseText);
    } catch (e: any) {
      parseError = e;
      console.warn(`API Client: Could not parse JSON response from ${url} (status: ${response.status}). Body: ${responseText.substring(0, 100)}...`, parseError);
    }
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    let code = `HTTP_${response.status}`;
    let details: unknown = responseBody;

    if (!parseError && responseBody && typeof responseBody === 'object' && (responseBody as ErrorResponseDTO).code) {
        const errorDto = responseBody as ErrorResponseDTO;
        message = errorDto.message || message;
        code = errorDto.code;
        details = errorDto;
    } else if (typeof responseBody === 'string' && responseBody) {
       message = responseBody.substring(0, 200);
    }

    console.error(`API Error: ${config.method} ${url} -> ${response.status} ${code} - ${message}`, { requestId, details }); // Log full details

    // Throw the APIError with extracted/constructed info
    throw new APIError(message, response.status, code, requestId, details);
  }

  if (parseError) {
    // Success status but failed to parse JSON body
    throw new APIError(
      `API request succeeded (${response.status}) but failed to parse expected JSON response.`,
      response.status, "PARSE_ERROR", requestId,
      { parseErrorMessage: parseError.message, responseText: responseText?.substring(0, 500) }
    );
  }

  return responseBody as T;
}

export default apiClient;

// Convenience Methods
export const apiGet = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body });

export const apiPut = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });```

---

## `packages/api-client/tsconfig.json`

```json
{
    "extends": "../../packages/tsconfig/base.json", // Use base config from monorepo root
    "compilerOptions": {
      "outDir": "dist", // Specify output directory for builds (if needed)
      "rootDir": "src" // Specify root source directory
    },
    "include": ["src"], // Only include files in the src directory
    "exclude": ["node_modules", "dist"] // Exclude standard build/dependency folders
  }```

---

## `packages/auth/package.json`

```json
{
    "name": "@repo/auth",
    "version": "0.0.0",
    "private": true,
    "main": "./src/index.ts",
    "types": "./src/index.ts",
    "dependencies": {
      "iron-session": "^8.0.4"
    },
    "devDependencies": {
      "@repo/tsconfig": "workspace:*"
    }
  }```

---

## `packages/auth/src/index.ts`

```typescript
// packages/auth/src/index.ts
export * from './session';```

---

## `packages/auth/src/session.ts`

```typescript
// packages/auth/src/session.ts
import type { SessionOptions } from 'iron-session';

// Define shared session data structure
export interface SessionData {
    userId?: string; // Store as string (UUID)
    isAdmin?: boolean; // Explicitly track admin status in session
    // Add other fields if needed, e.g., csrfToken: string;
}

// Recommended: Use environment variables for secrets and names
const DEFAULT_USER_SESSION_NAME = 'user_app_auth_session';
const DEFAULT_ADMIN_SESSION_NAME = 'admin_panel_auth_session';
// const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60; // Example for persistent login TTL

// Base cookie options
const baseCookieOptions: SessionOptions['cookieOptions'] = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    // REMOVED maxAge: undefined - use ttl: 0 for session cookies
};

// Function to get User App Session Options
export function getUserSessionOptions(): SessionOptions {
    const name = process.env.USER_SESSION_NAME || DEFAULT_USER_SESSION_NAME;
    const secret = process.env.USER_SESSION_SECRET;

    // --- CRITICAL CHECK ---
    if (!secret || secret.length < 32) {
        const message = "FATAL SECURITY WARNING: USER_SESSION_SECRET environment variable is missing or less than 32 characters long! Session encryption is compromised.";
        console.error("\n" + "*".repeat(message.length) + "\n" + message + "\n" + "*".repeat(message.length) + "\n");
        if (process.env.NODE_ENV === 'production') {
            throw new Error("USER_SESSION_SECRET environment variable is not configured correctly.");
        }
    }
    // --- END CHECK ---

    return {
        cookieName: name,
        password: secret || "fallback-insecure-user-secret-for-dev-only-32-chars", // Fallback ONLY for dev
        ttl: 0, // Session cookie (expires when browser closes)
        // ttl: THIRTY_DAYS_IN_SECONDS, // Uncomment for persistent login
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'lax', // Good default for user apps
        },
    };
}

// Function to get Admin Panel Session Options
export function getAdminSessionOptions(): SessionOptions {
    const name = process.env.ADMIN_SESSION_NAME || DEFAULT_ADMIN_SESSION_NAME;
    const secret = process.env.ADMIN_SESSION_SECRET;
    const userSecret = process.env.USER_SESSION_SECRET;

    // --- CRITICAL CHECKS ---
    if (!secret || secret.length < 32) {
         const message = "FATAL SECURITY WARNING: ADMIN_SESSION_SECRET environment variable is missing or less than 32 characters long! Session encryption is compromised.";
         console.error("\n" + "*".repeat(message.length) + "\n" + message + "\n" + "*".repeat(message.length) + "\n");
        if (process.env.NODE_ENV === 'production') {
            throw new Error("ADMIN_SESSION_SECRET environment variable is not configured correctly.");
        }
    }
    if (secret && userSecret && secret === userSecret) {
         const message = "FATAL SECURITY WARNING: ADMIN_SESSION_SECRET must be DIFFERENT from USER_SESSION_SECRET!";
         console.error("\n" + "*".repeat(message.length) + "\n" + message + "\n" + "*".repeat(message.length) + "\n");
         if (process.env.NODE_ENV === 'production') {
             throw new Error("Admin and User session secrets cannot be the same.");
         }
    }
    // --- END CHECKS ---

    return {
        cookieName: name,
        password: secret || "fallback-insecure-admin-secret-for-dev-only-32-chars", // Fallback ONLY for dev
        ttl: 0, // Session cookie strongly recommended for admin panels
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'strict', // Stricter setting for admin panel
        },
    };
}```

---

## `packages/auth/tsconfig.json`

```json
{
    "extends": "../../packages/tsconfig/base.json", // Use base config from monorepo root
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src"
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }```

---

## `packages/eslint-config/index.mjs`

```
// packages/eslint-config/index.mjs
import { defineConfig } from 'eslint/config'; // ESLint v9.6+ helper
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // 1. Global ignores (remains the same)
  {
    ignores: [
      "**/node_modules/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.ts",
      "**/generated/**",
      ".eslintrc.json",
    ],
  },

  // 2. Base configuration object using extends
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Standard browser globals
        ...globals.node,   // Standard Node.js globals
        ...globals.es2022, // Modern ECMAScript features
        React: 'readonly', // Optional React global
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        // project: true, // Enable if using typed rules that require tsconfig.json
        // tsconfigRootDir: process.cwd(), // Set root directory for tsconfig resolution
      },
    },
    // Define all plugins used in this configuration object
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    // Use extends to incorporate recommended rule sets
    // Note: tseslint.configs.recommended is an array, so spread it here
    // Other plugin configs are objects and can be directly referenced
    extends: [
      eslintJs.configs.recommended,
      // tseslint.configs.recommended, // Spread this below instead
      reactPlugin.configs.recommended,
      hooksPlugin.configs.recommended,
      nextPlugin.configs['core-web-vitals'],
    ],
    // Rules defined here will apply on top of the extended configurations
    rules: {
      // --- Custom Overrides/Additions ---
      // These rules will override any conflicting rules from the 'extends' array
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-key": "warn",

      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-debugger": "warn",

      // Add other shared rules or overrides here
    },
  },

  // 3. Spread the TypeScript recommended config array
  // This ensures TS rules are applied correctly after JS/React rules
  ...tseslint.configs.recommended,

  // 4. Optional: Further specific overrides
  // {
  //   files: ["**/*.test.{ts,tsx}"],
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off",
  //   }
  // }
]);```

---

## `packages/eslint-config/package.json`

```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "index.mjs",
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "@next/eslint-plugin-next": "^15.3.0",
    "eslint": "^9.24.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "globals": "^16.0.0",
    "typescript-eslint": "^8.29.1"
  }
}```

---

## `packages/query-client/package.json`

```json
{
  "name": "@repo/query-client",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "dependencies": {
    "@tanstack/react-query": "^5.72.2",
    "react": "^19.1.0"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@tanstack/react-query-devtools": "^5.72.2",
    "@types/react": "^19.1.1"
  }
}```

---

## `packages/query-client/src/index.tsx`

```tsx
'use client';
// packages/query-client/src/index.ts
import React from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Global error handler for TanStack Query
const handleQueryError = (error: unknown, context?: string) => {
    console.error(`TanStack Query Error${context ? ` (${context})` : ''}:`, error);
    // TODO: Implement global error logging/reporting service (e.g., Sentry)
    // reportErrorToServer(error);
    // TODO: Potentially show a global toast notification for critical errors
    // showGlobalErrorToast("An error occurred while fetching data.");
};

// Create a single QueryClient instance with default options
export const queryClient = new QueryClient({
    // Global error handlers for queries and mutations
    queryCache: new QueryCache({
        onError: (error) => handleQueryError(error, 'QueryCache'),
    }),
    mutationCache: new MutationCache({
        onError: (error) => handleQueryError(error, 'MutationCache'),
    }),
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - how long data is considered fresh
            gcTime: 15 * 60 * 1000,  // 15 minutes - how long inactive data stays in cache
            refetchOnWindowFocus: process.env.NODE_ENV === 'production', // Refetch on focus only in production
            retry: (failureCount, error: any) => {
                 // Don't retry on 404, 403, 401 errors
                 if (error?.status === 404 || error?.status === 403 || error?.status === 401) {
                     return false;
                 }
                 // Retry once otherwise
                 return failureCount < 1;
             },
        },
         mutations: {
             onError: (error) => handleQueryError(error, 'MutationDefault'),
             // Default retry for mutations is usually 0
         },
    },
});

// Shared provider component wrapper
export const SharedQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add DevTools only in development environments */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
    </QueryClientProvider>
  );
};```

---

## `packages/query-client/tsconfig.json`

```json
{
    "extends": "../../packages/tsconfig/base.json", // Use base config
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src",
      "jsx": "react-jsx" // Needed for the provider component
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }```

---

## `packages/tsconfig/base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    // Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": false, // Often false for React components
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false, // Can be strict, but sometimes inconvenient
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": false, // Consider enabling for more safety
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false,

    // Modules
    "module": "ESNext", // Use ESNext for modern module features
    "moduleResolution": "Bundler", // Recommended for modern TS/JS interop
    "baseUrl": ".", // Important for path aliases
    "resolveJsonModule": true, // Allow importing JSON files

    // Emit
    "noEmit": true, // Let Turborepo/build tools handle emit, TS only checks
    "isolatedModules": true, // Required by Turborepo/SWC/Babel

    // Interop Constraints
    "esModuleInterop": true, // Enables compatibility with CJS modules
    "forceConsistentCasingInFileNames": true, // Prevent OS-dependent casing issues
    "allowSyntheticDefaultImports": true, // Allow default imports from modules with no default export

    // Language and Environment
    "target": "ES2020", // Target modern JS features
    "lib": ["dom", "dom.iterable", "esnext"], // Include necessary DOM and modern JS libs
    "jsx": "preserve", // Let Next.js/React handle JSX transform
    "skipLibCheck": true, // Skip type checking of declaration files (node_modules)

    // Path Aliases (Define common aliases here)
    "paths": {
      "@repo/api-client": ["./packages/api-client/src/index.ts"],
      "@repo/auth": ["./packages/auth/src/index.ts"],
      "@repo/query-client": ["./packages/query-client/src/index.ts"],
      "@repo/ui": ["./packages/ui/src/index.ts"],
      "@repo/utils": ["./packages/utils/src/index.ts"],
      "@repo/types": ["./packages/types/src/index.ts"]
    }
  },
  "exclude": [
      "node_modules",
      ".turbo",
      "dist",
      "**/dist",
      "**/.next",
      "**/coverage"
    ] // Exclude common build/dependency/cache folders
}```

---

## `packages/tsconfig/package.json`

```json
{
    "name": "@repo/tsconfig",
    "version": "0.0.0",
    "private": true,
    "files": [
      "base.json"
    ]
  }```

---

## `packages/types/package.json`

```json
{
    "name": "@repo/types",
    "version": "0.0.0",
    "private": true,
    "main": "./src/index.ts",
    "types": "./src/index.ts",
    "devDependencies": {
      "@repo/tsconfig": "workspace:*"
    }
  }```

---

## `packages/types/src/index.ts`

```typescript
// packages/types/src/index.ts

// --- Common/Pagination ---
/** Standardized error response structure from the backend */
export interface ErrorResponseDTO {
  code: string; // e.g., "NOT_FOUND", "INVALID_INPUT", "UNAUTHENTICATED"
  message: string;
  requestId?: string; // Optional trace ID
  // details?: unknown; // Optional structured details (e.g., validation errors)
}

/** Standardized paginated response structure from the backend */
export interface PaginatedResponseDTO<T> {
  data: T[];         // Items for the current page
  total: number;     // Total number of items available
  limit: number;     // The limit used for this page
  offset: number;    // The offset used for this page
  page: number;      // Current page number (1-based, calculated)
  totalPages: number;// Total number of pages (calculated)
}

// --- Authentication DTOs (Matching backend API) ---
export interface RegisterRequestDTO {
  email: string;
  password?: string; // Required for 'local' provider
  name: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string; // Required for 'local' provider
}

export interface GoogleCallbackRequestDTO {
  idToken: string; // Google ID Token from client
}

export interface RefreshRequestDTO {
  refreshToken: string;
}

export interface LogoutRequestDTO {
  refreshToken: string;
}

// MODIFIED: Added 'user' field to match backend responses on login/register/callback
export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean; // Provided by Google callback response
  user?: UserResponseDTO; // Included on login/register/callback success
}

// --- User DTOs ---
export type AuthProvider = 'local' | 'google'; // Matches backend domain AuthProvider

export interface UserResponseDTO {
  id: string; // UUID
  email: string;
  name: string;
  authProvider: AuthProvider;
  profileImageUrl?: string | null;
  createdAt: string; // ISO 8601 datetime string (e.g., "2023-10-27T10:00:00Z")
  updatedAt: string; // ISO 8601 datetime string
  isAdmin?: boolean; // Important for Admin Panel checks, backend needs to include this for admin users
}

// --- Admin User DTOs ---
// NEW: Define DTO for updating user info via admin panel
export interface AdminUpdateUserRequestDTO {
    name?: string;
    email?: string; // Be cautious allowing email updates
    isAdmin?: boolean;
    // Add other fields as needed, matching backend capabilities
    // status?: 'active' | 'inactive';
}
// NEW: Define DTO for creating user via admin panel (if needed)
// export interface AdminCreateUserRequestDTO {
//     email: string;
//     name: string;
//     isAdmin?: boolean;
//     // initialPassword?: string; // If admin sets initial password
// }


// --- Audio Track DTOs ---
// MODIFIED: Allow empty string for level filter/response consistency
export type AudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE" | "";

// Basic track info returned in lists
export interface AudioTrackResponseDTO {
  id: string; // UUID
  title: string;
  description?: string | null;
  languageCode: string; // e.g., 'en-US'
  level?: AudioLevel | null; // Optional level
  durationMs: number; // Always in milliseconds
  coverImageUrl?: string | null;
  uploaderId?: string | null; // UUID string
  uploaderName?: string | null; // ADDED: Optional uploader name if backend provides it
  isPublic: boolean;
  tags?: string[] | null;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// Detailed track info including playback URL and user-specific data
export interface AudioTrackDetailsResponseDTO extends AudioTrackResponseDTO {
  playUrl: string; // Presigned URL for playback
  userProgressMs?: number | null; // User's progress in milliseconds
  userBookmarks?: BookmarkResponseDTO[] | null; // Array of user's bookmarks for this track
}

// --- Audio Collection DTOs ---
export type CollectionType = "COURSE" | "PLAYLIST";

export interface CreateCollectionRequestDTO {
  title: string;
  description?: string | null;
  type: CollectionType;
  initialTrackIds?: string[] | null; // Array of Track UUID strings
}

export interface UpdateCollectionRequestDTO {
  title?: string | null; // Optional for partial updates
  description?: string | null; // Optional for partial updates
}

export interface UpdateCollectionTracksRequestDTO {
  orderedTrackIds: string[]; // Array of Track UUID strings in desired order
}

export interface AudioCollectionResponseDTO {
  id: string; // UUID
  title: string;
  description?: string | null;
  ownerId: string; // User UUID string
  type: CollectionType;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  // Tracks might be included in detail view, optional in lists
  tracks?: AudioTrackResponseDTO[] | null;
  trackCount?: number; // ADDED: Optional track count
}

// --- User Activity DTOs ---
export interface RecordProgressRequestDTO {
  trackId: string; // UUID
  progressMs: number; // Progress in milliseconds
}

export interface PlaybackProgressResponseDTO {
  userId: string; // UUID
  trackId: string; // UUID
  progressMs: number; // Progress in milliseconds
  lastListenedAt: string; // ISO 8601 string
}

export interface CreateBookmarkRequestDTO {
  trackId: string; // UUID
  timestampMs: number; // Timestamp in milliseconds
  note?: string | null;
}

export interface BookmarkResponseDTO {
  id: string; // UUID
  userId: string; // UUID
  trackId: string; // UUID
  timestampMs: number; // Timestamp in milliseconds
  note?: string | null;
  createdAt: string; // ISO 8601 string
}

// --- Upload DTOs (Matching Go backend DTOs/ports) ---
export interface RequestUploadRequestDTO {
    filename: string;
    contentType: string;
}

export interface RequestUploadResponseDTO {
    uploadUrl: string;
    objectKey: string;
}

// DTO for POST /audio/tracks and Admin PUT /admin/audio/tracks/{id} body
// Corresponds to port.CompleteUploadInput + partial updates
// Renamed for clarity, matches structure used by backend handlers now
export interface CompleteUploadRequestDTO {
    objectKey?: string; // Required only for POST /audio/tracks
    title?: string;
    description?: string | null;
    languageCode?: string;
    level?: AudioLevel | null;
    durationMs?: number; // Required only for POST /audio/tracks
    isPublic?: boolean | null;
    tags?: string[] | null;
    coverImageUrl?: string | null;
}


// DTO for POST /uploads/audio/batch/request (matches port.BatchRequestUploadInput)
export interface BatchRequestUploadInputItemDTO {
    filename: string;
    contentType: string;
}
export interface BatchRequestUploadInputRequestDTO {
    files: BatchRequestUploadInputItemDTO[];
}

// DTO for response of /uploads/audio/batch/request (matches port.BatchURLResultItem structure)
export interface BatchRequestUploadInputResponseItemDTO {
    originalFilename: string;
    objectKey: string;
    uploadUrl: string;
    error?: string; // Error message if specific URL generation failed
}
export interface BatchRequestUploadInputResponseDTO {
    results: BatchRequestUploadInputResponseItemDTO[];
}

// DTO for POST /audio/tracks/batch/complete items (matches port.BatchCompleteItem structure)
// Renamed for clarity to match frontend usage.
export interface BatchCompleteUploadItemDTO {
    objectKey: string; // Required
    title: string; // Required
    description?: string | null;
    languageCode: string; // Required
    level?: AudioLevel | null;
    durationMs: number; // Required
    isPublic?: boolean | null;
    tags?: string[] | null;
    coverImageUrl?: string | null;
}
// DTO for POST /audio/tracks/batch/complete (matches port.BatchCompleteInput)
export interface BatchCompleteUploadInputDTO {
    tracks: BatchCompleteUploadItemDTO[]; // List of items to process
}

// DTO for response of /audio/tracks/batch/complete (matches port.BatchCompleteResultItem structure)
export interface BatchCompleteUploadResponseItemDTO {
    objectKey: string;
    success: boolean;
    trackId?: string; // UUID string of created track if successful
    error?: string;   // Error message if processing failed for this item
}
export interface BatchCompleteUploadResponseDTO {
    results: BatchCompleteUploadResponseItemDTO[];
}


// --- Query Parameter Interfaces (for API services/hooks) ---

// Generic pagination params used by multiple list requests
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

// Params for GET /audio/tracks
// MODIFIED: Changed lang -> languageCode, added uploaderId
export interface ListTrackQueryParams extends PaginationParams {
  q?: string; // General search
  languageCode?: string; // Use full name consistent with backend DTOs
  level?: AudioLevel;
  isPublic?: boolean;
  tags?: string[];
  uploaderId?: string; // Filter by uploader UUID
  sortBy?: 'createdAt' | 'title' | 'durationMs' | 'level' | 'languageCode'; // Ensure these match backend capabilities
  sortDir?: 'asc' | 'desc';
}

// Params for GET /users/me/bookmarks
export interface ListBookmarkQueryParams extends PaginationParams {
    trackId?: string; // Optional track UUID filter
    // Add sorting if API supports it
    // sortBy?: 'createdAt' | 'timestampMs';
    // sortDir?: 'asc' | 'desc';
}

// Params for GET /users/me/progress
export interface ListProgressQueryParams extends PaginationParams {
    // Add sorting if API supports it
    // sortBy?: 'lastListenedAt';
    // sortDir?: 'asc' | 'desc';
}```

---

## `packages/types/tsconfig.json`

```json
{
    "extends": "../../packages/tsconfig/base.json", // Use base config
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src"
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }```

---

## `packages/ui/package.json`

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "sideEffects": false,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint . --max-warnings 0"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@repo/utils": "workspace:*",
    "@types/react": "^19.1.1",
    "@types/react-dom": "^19.1.2",
    "react": "^19.1.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.1.3",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.487.0",
    "tailwind-merge": "^3.2.0"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  }
}```

---

## `packages/ui/src/AlertDialog.tsx`

```tsx
// packages/ui/src/AlertDialog.tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@repo/utils"
import { buttonVariants } from "./Button" // Import button variants

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", // Dark overlay
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        "dark:border-slate-700 dark:bg-slate-900", // Dark mode styles
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground dark:text-slate-100", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground dark:text-slate-400", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    // Apply default button styles, allow overrides
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    // Apply outline button styles, allow overrides
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}```

---

## `packages/ui/src/Badge.tsx`

```tsx
// packages/ui/src/Badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@repo/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground dark:bg-blue-500 dark:text-white", // Example primary
        secondary: "border-transparent bg-secondary text-secondary-foreground dark:bg-slate-700 dark:text-slate-200",
        destructive: "border-transparent bg-destructive text-destructive-foreground dark:bg-red-700 dark:text-red-100",
        outline: "text-foreground dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }```

---

## `packages/ui/src/Button.tsx`

```tsx
// packages/ui/src/Button.tsx
'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/utils"; // Use shared cn utility

// Define button variants using CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9", // Adjusted default icon size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Allow rendering as a different element (e.g., Link)
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Use cn helper
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };```

---

## `packages/ui/src/Card.tsx`

```tsx
// packages/ui/src/Card.tsx
import * as React from "react";
import { cn } from "@repo/utils"; // Use shared cn utility

// Card container
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm dark:border-slate-700 dark:bg-slate-800", // Base styles, ensure CSS vars are defined in globals
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Card Header
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} // Standard padding
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Card Title (using h3 for semantic structure)
const CardTitle = React.forwardRef<
  HTMLParagraphElement, // Can be h3 as well
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight", // Adjusted size
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Use muted color
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} /> // Remove top padding if header used
));
CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 sm:p-6 pt-0", className)} // Remove top padding
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };```

---

## `packages/ui/src/Checkbox.tsx`

```tsx
// packages/ui/src/Checkbox.tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@repo/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-slate-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }```

---

## `packages/ui/src/ErrorMessage.tsx`

```tsx
// packages/ui/src/ErrorMessage.tsx
'use client';

import * as React from 'react';
import { cn } from '@repo/utils'; // Assuming shared util
import { AlertTriangle } from 'lucide-react'; // Optional icon

interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message: string | null | undefined;
  showIcon?: boolean;
}

export function ErrorMessage({ message, className, showIcon = false, ...props }: ErrorMessageProps): JSX.Element | null {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
          "text-red-600 dark:text-red-400 text-sm", // Base styles
          showIcon && "flex items-center", // Add flex for icon alignment
          className // Allow overriding classes
      )}
      role="alert"
      {...props}
    >
       {showIcon && <AlertTriangle className="h-4 w-4 mr-1.5 flex-shrink-0"/>}
      {message}
    </p>
  );
}```

---

## `packages/ui/src/Input.tsx`

```tsx
// packages/ui/src/Input.tsx
import * as React from "react";
import { cn } from "@repo/utils"; // Use shared util

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    // Add size variants if needed
    size?: 'default' | 'sm' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = 'default', ...props }, ref) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-2 py-2 text-sm',
        lg: 'h-11 px-4 text-base',
    };
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size], // Apply size class
          className // Allow overriding
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };```

---

## `packages/ui/src/Label.tsx`

```tsx
// packages/ui/src/Label.tsx
'use client'; // Radix uses client features

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200" // Base styles
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };```

---

## `packages/ui/src/Link.tsx`

```tsx
// packages/ui/src/Link.tsx
'use client';

import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { cn } from '@repo/utils';

interface LinkProps extends NextLinkProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  // className?: string; // Included in AnchorHTMLAttributes
  // Add other props if needed
}

export function Link({ children, className, ...props }: LinkProps): JSX.Element {
  return (
    <NextLink
      className={cn(
          "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm", // Added focus ring
          className // Allow overriding
      )}
      {...props} // Pass rest of the props (href, target, etc.)
    >
      {children}
    </NextLink>
  );
}```

---

## `packages/ui/src/Progress.tsx`

```tsx
// packages/ui/src/Progress.tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@repo/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary dark:bg-slate-700", // Adjusted height and colors
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary dark:bg-blue-500 transition-all duration-300 ease-linear" // Use primary color
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }```

---

## `packages/ui/src/Select.tsx`

```tsx
// packages/ui/src/Select.tsx
import * as React from "react"
import { cn } from "@repo/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
    size?: 'default' | 'sm' | 'lg';
  }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs rounded-sm', // Smaller size
        default: 'h-10 px-3 py-2 text-sm rounded-md',
        lg: 'h-11 px-4 text-base rounded-md',
    };
    return (
      <select
        className={cn(
          "flex w-full border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size], // Apply size class
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }```

---

## `packages/ui/src/Spinner.tsx`

```tsx
// packages/ui/src/Spinner.tsx
'use client';

import * as React from 'react';
import { cn } from '@repo/utils'; // Use shared util
import { Loader } from 'lucide-react'; // Use Lucide loader for consistency

interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps): JSX.Element {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader
      className={cn(
          "animate-spin text-primary", // Use primary color for spinner
          sizeClasses[size],
          className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      {...props}
    />
  );
}```

---

## `packages/ui/src/Textarea.tsx`

```tsx
// packages/ui/src/Textarea.tsx
import * as React from "react"
import { cn } from "@repo/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }```

---

## `packages/ui/src/Tooltip.tsx`

```tsx
// packages/ui/src/Tooltip.tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@repo/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200", // Dark mode styles
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }```

---

## `packages/ui/src/globals.css`

```css
/* packages/ui/src/globals.css */

/* 1. Import Tailwind FIRST */
@import "tailwindcss";

/* 2. Define Custom Variants (e.g., for dark mode) */
@custom-variant dark (&:where(.dark, .dark *));

/* 3. Import the theme definitions and base styles */
@import "./theme.css";

/*
   4. Optional: Define custom, VARIANT-AWARE component base styles or utility classes
      using the `@utility` directive. This replaces the common v3 practice of using
      `@layer components` or `@layer utilities` for classes intended to work with
      Tailwind variants (hover:, focus:, lg:, etc.).
      Example:
      @utility btn-primary {
        @apply px-4 py-2 rounded bg-primary text-primary-foreground font-semibold;
        &:hover {
           @apply bg-primary/90; // Standard CSS pseudo-class within @utility
        }
      }
      // Usage in HTML: <button class="btn-primary hover:opacity-80 lg:btn-primary">...</button>
      // Note: Tailwind variants like `hover:` can still be applied externally to the base defined by @utility.
*/

/*
   5. Optional: Add standard CSS rules to Tailwind's layers if needed, but NOT
      for defining variant-aware utility-like classes (use @utility for that).
      This is less common in v4 for shared styles.
      Example (Rarely needed here):
      @layer components {
        // Styles for a very specific, non-utility-like component part
        .special-widget-container {
          box-shadow: none; // Override some default perhaps
        }
      }
*/```

---

## `packages/ui/src/index.ts`

```typescript
// packages/ui/src/index.ts
// Ensure components intended for client-side use have 'use client' directive
// OR export them from specific client entry points if needed.
// For simplicity, assuming most UI components might need client context eventually.
// Add 'use client' here or individually in components.

import "./globals.css"; // Import base styles defined in this package

export * from './Button';
export * from './Card';
export * from './Spinner';
export * from './ErrorMessage';
export * from './Link';
export * from './Input';
export * from './Label';
export * from './Progress';
export * from './Select';
export * from './Textarea';
export * from './Checkbox';
export * from './Tooltip';
export * from './AlertDialog';
export * from './Badge';

// Add other UI component exports here...```

---

## `packages/ui/src/theme.css`

```css
/* packages/ui/src/theme.css */

/* --- Shared Theme Definition --- */
@theme {
    /* --- Default (Light Mode) Variables --- */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%; /* Default border color variable */
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%; /* Focus ring color */
    --radius: 0.5rem; /* Border radius */
  
    /* --- Shared Breakpoints (Optional) --- */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
  
    /* --- Keyframes --- */
    @keyframes --accordion-down {
      from { height: 0px; }
      to { height: var(--radix-accordion-content-height); }
    }
    @keyframes --accordion-up {
      from { height: var(--radix-accordion-content-height); }
      to { height: 0px; }
    }
    /* --- End of @theme block --- */
  }
  
  /* --- Base Layer Styles & Dark Mode Variable Overrides --- */
  @layer base {
    /* --- Base Styles --- */
    /* Set base background and text colors using CSS variables */
    body {
      background-color: var(--background);
      color: var(--foreground);
      font-feature-settings: "rlig" 1, "calt" 1;
    }
  
    /*
     * Set default border color for all elements to use the theme variable.
     * Note: In v4, the default is `currentColor`. This override makes it
     * behave more like v3 if desired, but explicit `border-border` in HTML
     * is often preferred for clarity. Use this if you prefer the implicit default.
     */
    *, ::before, ::after {
      border-color: var(--border);
    }
  
  
    /* --- Dark Mode Variable Overrides --- */
    /* Apply these when html has the 'dark' class */
    html.dark {
      --background: 240 10% 3.9%;
      --foreground: 0 0% 98%;
      --card: 240 10% 3.9%;
      --card-foreground: 0 0% 98%;
      --popover: 240 10% 3.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%;
      --primary-foreground: 240 5.9% 10%;
      --secondary: 240 3.7% 15.9%;
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 15.9%;
      --muted-foreground: 240 5% 64.9%;
      --accent: 240 3.7% 15.9%;
      --accent-foreground: 0 0% 98%;
      --destructive: 0 72.2% 50.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 15.9%; /* Dark mode border color */
      --input: 240 3.7% 15.9%;
      --ring: 240 4.9% 83.9%; /* Dark mode ring color */
    }
  }```

---

## `packages/ui/tsconfig.json`

```json
{
    "extends": "../../packages/tsconfig/base.json", // Use base config
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src",
      "jsx": "react-jsx" // Needed for React components
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }```

---

## `packages/utils/package.json`

```json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*"
  }
}```

---

## `packages/utils/src/index.ts`

```typescript
// packages/utils/src/index.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Constants ---
// MOVED Pagination constants here
export const DefaultLimit = 20; // Default items per page
export const MaxLimit = 100; // Max items per page

// --- Types ---
// Moved PaginationParams here
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

// --- Functions ---

/** Merges Tailwind classes, handling conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in milliseconds into a string like MM:SS or H:MM:SS.
 * Handles undefined, null, and negative values gracefully.
 * @param ms Duration in milliseconds (number).
 * @returns Formatted time string "MM:SS" or "H:MM:SS". Returns "00:00" for invalid inputs.
 */
export function formatDuration(ms: number | undefined | null): string {
  if (ms === null || ms === undefined || ms < 0 || isNaN(ms)) {
    return "00:00";
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

  if (hours > 0) {
    return `${hours}:${minutesStr}:${secondsStr}`;
  }
  return `${minutesStr}:${secondsStr}`;
}

/**
 * Debounces a function.
 * @param func The function to debounce.
 * @param delay Delay in milliseconds.
 * @returns A debounced version of the function with a cancel and flush method.
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): T & { cancel: () => void; flush: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any = null;
    let trailingCallScheduled = false;

    const debounced = (...args: Parameters<T>) => {
        lastArgs = args;
        lastThis = this;
        trailingCallScheduled = true; // Mark that a call is pending

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            if (trailingCallScheduled) {
                func.apply(lastThis, lastArgs!); // Use apply to preserve context
            }
            timeoutId = null;
            trailingCallScheduled = false;
            lastArgs = null;
            lastThis = null;
        }, delay);
    };

    const cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = null;
        trailingCallScheduled = false;
        lastArgs = null;
        lastThis = null;
    };

    // Flush: Immediately call the function if there's a pending call
    const flush = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (trailingCallScheduled) {
            func.apply(lastThis, lastArgs!);
        }
        timeoutId = null;
        trailingCallScheduled = false;
        lastArgs = null;
        lastThis = null;
    };

    (debounced as any).cancel = cancel;
    (debounced as any).flush = flush;

    return debounced as T & { cancel: () => void; flush: () => void };
}


/**
 * Builds a URL query string from a parameters object.
 * Handles arrays by repeating the key. Encodes keys/values. Skips null/undefined/empty strings.
 * @param params - An object containing query parameters.
 * @returns A URL query string starting with '?' or an empty string.
 */
export function buildQueryString(params?: Record<string, any> | null): string {
    if (!params) {
      return '';
    }
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return; // Skip null, undefined, and empty strings
      }
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') { // Also skip empty strings in arrays
            query.append(key, String(item));
          }
        });
      } else {
        query.set(key, String(value));
      }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}

// Add useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}```

---

## `packages/utils/tsconfig.json`

```json
{
    "extends": "../../packages/tsconfig/base.json", // Use base config
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src"
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }```

---

## `pnpm-workspace.yaml`

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'```

---

