// apps/user-app/app/(auth)/register/page.tsx
import Link from 'next/link';
import { RegisterForm } from '@/../_components/auth/RegisterForm'; // Adjust import alias based on your tsconfig paths

export const metadata = { // Optional: Set page metadata
  title: 'Register - AudioLang Player',
  description: 'Create a new account to start learning languages with audio.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create your Account
        </h1>

        {/* Render the registration form component */}
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}