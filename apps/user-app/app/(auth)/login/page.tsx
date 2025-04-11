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
}