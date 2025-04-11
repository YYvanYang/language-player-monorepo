(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__8cde2345._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/apps/user-app/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// apps/user-app/middleware.ts
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$iron$2d$session$40$8$2e$0$2e$4$2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/iron-session@8.0.4/node_modules/iron-session/dist/index.js [middleware-edge] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@repo/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
const sessionOptions = getUserSessionOptions();
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including /api/auth/session)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (public auth pages)
     * - tracks$ (allow public listing of tracks, but not specific actions)
     * - collections$ (allow public listing of collections, but not specific actions)
     * Publicly accessible pages like / or /tracks/{id} should be EXCLUDED from this matcher
     * if they are meant to be viewable by non-logged-in users.
     */ // Example: Protect user-specific pages and creation pages
        '/profile/:path*',
        '/collections/new',
        '/collections/edit/:path*',
        '/bookmarks/:path*',
        '/upload'
    ]
};
async function middleware(request) {
    const requestedPath = request.nextUrl.pathname;
    // console.log(`User Middleware: Checking path: ${requestedPath}`);
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$iron$2d$session$40$8$2e$0$2e$4$2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getIronSession"])(request, response, sessionOptions);
        const { userId } = session;
        if (!userId) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('next', requestedPath);
            // console.log(`User Middleware: No userId found for protected path ${requestedPath}, redirecting to login.`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
        // console.log(`User Middleware: userId ${userId} found for path ${requestedPath}, allowing.`);
        return response; // Allow request, session might be attached to response
    } catch (error) {
        console.error(`User Middleware Error processing path ${requestedPath}:`, error);
        // Fallback: Redirect to login on session error
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'session_error');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
}
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__8cde2345._.js.map