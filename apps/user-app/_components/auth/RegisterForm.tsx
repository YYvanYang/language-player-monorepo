// apps/user-app/_components/auth/RegisterForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react'; // Updated import for React 19+
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/_actions/authActions'; // Adjust import alias
import { Button } from '@repo/ui';
import { Input } from '@repo/ui'; // Assuming Input exists in shared UI
import { Label } from '@repo/ui'; // Assuming Label exists in shared UI

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
      {pending ? 'Registering...' : 'Register'}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  // Use useActionState for form state management
  // Action signature: (prevState, formData) => Promise<{success: boolean, message?: string}>
  const [state, formAction, isPending] = useActionState(registerAction, null);

  // Redirect on successful registration
  useEffect(() => {
    if (state?.success) {
      // Registration successful, redirect to home/dashboard or show message
      console.log("Registration successful, redirecting...");
      router.push('/'); // Redirect to dashboard after successful registration
      // Optionally show a success message before redirecting
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
          className={state && !state.success && state.message?.includes('name') ? 'border-red-500' : ''} // Example error highlighting
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
          className={state && !state.success && state.message?.includes('email') ? 'border-red-500' : ''}
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
           className={state && !state.success && state.message?.includes('password') ? 'border-red-500' : ''}
        />
         <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
      </div>

      {/* Display general form error message */}
      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}