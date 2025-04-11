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
}