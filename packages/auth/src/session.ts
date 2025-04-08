// packages/auth/src/session.ts
// Define session data structure - adjust based on your needs
export interface SessionData {
    userId: string; // UUID string
    isAdmin?: boolean; // Crucial for Admin Panel
    // Add other relevant session data: expiry? csrf token?
  }
  
  // Define session options - THESE MUST BE DIFFERENT FOR USER & ADMIN APPS
  // You will configure these using ENV vars IN EACH APP
  export interface AppSessionOptions {
      cookieName: string;
      password: string; // Complex password for encryption, MUST BE ENV VAR
      cookieOptions: {
          secure: boolean; // Should be true in production (HTTPS)
          httpOnly: boolean;
          sameSite: 'lax' | 'strict' | 'none';
          maxAge: number | undefined; // In seconds, undefined for session cookie
          // path: '/'; // Usually root
      };
  }
  
  // Example usage function (can be used by route handlers)
  // Note: actual iron-session setup might look slightly different
  // This is more conceptual - the route handlers will use iron-session directly
  // export function getSessionOptions(env: 'user' | 'admin'): AppSessionOptions {
  //     if (env === 'user') {
  //         return {
  //             cookieName: process.env.USER_SESSION_NAME || 'user_app_session',
  //             password: process.env.USER_SESSION_SECRET!, // Assert non-null or handle error
  //             cookieOptions: { ... }
  //         }
  //     } else {
  //         return {
  //             cookieName: process.env.ADMIN_SESSION_NAME || 'admin_panel_session',
  //             password: process.env.ADMIN_SESSION_SECRET!, // DIFFERENT SECRET!
  //             cookieOptions: { ... } // Potentially stricter settings for admin
  //         }
  //     }
  // }