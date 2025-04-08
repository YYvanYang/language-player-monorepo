// apps/admin-panel/app/login/page.tsx
import { AdminLoginForm } from '@/../_components/auth/AdminLoginForm'; // Adjust import alias based on your tsconfig paths

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
}