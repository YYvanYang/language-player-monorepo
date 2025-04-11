module.exports = {

"[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// apps/admin-panel/_actions/adminAuthActions.ts
/* __next_internal_action_entry_do_not_use__ {"00631cf6b1e461e074c35099ff4de0434a5768e80f":"adminLogoutAction","60ee578bacec8645f6f19dea0f2b8353d7f2aef625":"adminLoginAction"} */ __turbopack_context__.s({
    "adminLoginAction": (()=>adminLoginAction),
    "adminLogoutAction": (()=>adminLogoutAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ adminLoginAction(previousState, formData) {
    console.log("Admin Login Action Triggered (Simplified Test)");
    // TEMPORARY: Bypass all logic and return a plain object immediately
    return {
        success: true,
        message: 'Test successful!'
    };
/* --- Original Logic Commented Out ---
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basic server-side validation
    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    try {
        const loginData: LoginRequestDTO = { email, password };

        // 1. Call the Go backend's ADMIN login endpoint
        const adminAuthResponse = await apiClient<GoAdminLoginSuccessResponse>('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        });

        // 2. Verify backend confirmed admin status
        if (!adminAuthResponse?.userId || !adminAuthResponse?.isAdmin) {
             console.error(`Admin login error: Backend response missing userId or isAdmin flag for email: ${email}`);
             return { success: false, message: 'Login failed: Invalid admin credentials or permissions.' };
        }

        // 3. Call THIS admin panel's session API route handler to set the cookie
         const appUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001';
         const sessionResponse = await fetch(`${appUrl}/api/auth/session`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                userId: adminAuthResponse.userId,
                isAdmin: true
            }),
         });

         if (!sessionResponse.ok) {
             const errorBody = await sessionResponse.text();
             console.error(`Admin login error: Failed to set session cookie via API route. Status: ${sessionResponse.status}, Body: ${errorBody}`);
             return { success: false, message: `Failed to set session cookie (status: ${sessionResponse.status}). Check admin panel server logs.` };
         }

        // 4. Revalidate and prepare success state (don't redirect here)
        revalidatePath('/', 'layout');
        console.log(`Admin user ${adminAuthResponse.userId} logged in successfully.`);
        return { success: true };

    } catch (error) {
        console.error("Admin Login Action Error:", error);

        const errorInfo = {
            message: error instanceof Error ? error.message : 'Unknown error',
            status: error instanceof APIError ? error.status : undefined,
            code: error instanceof APIError ? error.code : undefined,
            isApiError: error instanceof APIError
        };

        if (errorInfo.isApiError) {
            if (errorInfo.status === 401) {
                return { success: false, message: 'Invalid email or password.' };
            }
            if (errorInfo.status === 403) {
                return { success: false, message: 'Access denied. User is not an administrator.' };
            }
            return { success: false, message: `Login failed: ${errorInfo.message}` };
        }

        return { success: false, message: `An unexpected error occurred during login: ${errorInfo.message}` };
    }
    */ }
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ adminLogoutAction() {
    // Call THIS admin panel's session API route handler to clear the cookie
    const appUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001';
    try {
        const response = await fetch(`${appUrl}/api/auth/session`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            console.error("Admin logout error: Failed to clear session via API route. Status:", response.status);
        // Proceed with redirect anyway? Best effort logout.
        } else {
            console.log("Admin session cleared successfully via API route.");
        }
    } catch (error) {
        console.error("Admin logout error: Fetching session API route failed:", error);
    // Proceed with redirect anyway?
    }
    // Alternative: Use iron-session directly if preferred and options are accessible
    // try {
    //     const session = await getIronSession<SessionData>(cookies(), adminSessionOptions);
    //     session.destroy();
    //     console.log("Admin session destroyed directly.");
    // } catch (error) {
    //     console.error("Admin logout error: Failed to destroy session directly:", error);
    // }
    // Revalidate paths relevant after logout and redirect to admin login
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout'); // Revalidate the whole admin layout
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login'); // Redirect to admin login page
} // --- Helper Function (if not using direct iron-session) ---
 // NOTE: This helper is primarily for use within the action itself if needed,
 //       but verifyAdmin above is likely sufficient.
 // async function getAdminSessionData(): Promise<SessionData | null> {
 //     try {
 //         const session = await getIronSession<SessionData>(cookies(), adminSessionOptions);
 //         if (!session.userId || !session.isAdmin) {
 //             return null;
 //         }
 //         return session;
 //     } catch (error) {
 //         console.error("Error getting admin session data in action:", error);
 //         return null;
 //     }
 // }
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    adminLoginAction,
    adminLogoutAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(adminLoginAction, "60ee578bacec8645f6f19dea0f2b8353d7f2aef625", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(adminLogoutAction, "00631cf6b1e461e074c35099ff4de0434a5768e80f", null);
}}),
"[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
}}),
"[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00631cf6b1e461e074c35099ff4de0434a5768e80f": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminLogoutAction"]),
    "60ee578bacec8645f6f19dea0f2b8353d7f2aef625": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminLoginAction"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00631cf6b1e461e074c35099ff4de0434a5768e80f": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00631cf6b1e461e074c35099ff4de0434a5768e80f"]),
    "60ee578bacec8645f6f19dea0f2b8353d7f2aef625": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60ee578bacec8645f6f19dea0f2b8353d7f2aef625"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$admin$2d$panel$2f$_actions$2f$adminAuthActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/apps/admin-panel/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/admin-panel/_actions/adminAuthActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/apps/admin-panel/app/favicon.ico.mjs { IMAGE => \"[project]/apps/admin-panel/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/admin-panel/app/favicon.ico.mjs { IMAGE => \"[project]/apps/admin-panel/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/apps/admin-panel/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/admin-panel/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AdminLoginForm": (()=>AdminLoginForm)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const AdminLoginForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AdminLoginForm() from the server but AdminLoginForm is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx <module evaluation>", "AdminLoginForm");
}}),
"[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AdminLoginForm": (()=>AdminLoginForm)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const AdminLoginForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AdminLoginForm() from the server but AdminLoginForm is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx", "AdminLoginForm");
}}),
"[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_components$2f$auth$2f$AdminLoginForm$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_components$2f$auth$2f$AdminLoginForm$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_components$2f$auth$2f$AdminLoginForm$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/apps/admin-panel/app/login/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// apps/admin-panel/app/login/page.tsx
__turbopack_context__.s({
    "default": (()=>AdminLoginPage),
    "metadata": (()=>metadata)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_components$2f$auth$2f$AdminLoginForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/admin-panel/_components/auth/AdminLoginForm.tsx [app-rsc] (ecmascript)"); // Adjust import alias based on your tsconfig paths
;
;
const metadata = {
    title: 'Admin Login - AudioLang Player',
    description: 'Login to the administrative panel.'
};
function AdminLoginPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col items-center justify-center bg-gray-800 p-4",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-sm rounded-lg bg-white p-8 shadow-xl",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mb-6 text-center text-xl font-semibold text-gray-700",
                        children: "Admin Panel Login"
                    }, void 0, false, {
                        fileName: "[project]/apps/admin-panel/app/login/page.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2d$panel$2f$_components$2f$auth$2f$AdminLoginForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdminLoginForm"], {}, void 0, false, {
                        fileName: "[project]/apps/admin-panel/app/login/page.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/admin-panel/app/login/page.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-center text-xs text-gray-400",
                children: "Language Learning Player Administration"
            }, void 0, false, {
                fileName: "[project]/apps/admin-panel/app/login/page.tsx",
                lineNumber: 23,
                columnNumber: 8
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/admin-panel/app/login/page.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}}),
"[project]/apps/admin-panel/app/login/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/admin-panel/app/login/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=apps_admin-panel_11b31ad2._.js.map