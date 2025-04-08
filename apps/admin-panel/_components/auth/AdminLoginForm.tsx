// apps/admin-panel/_components/auth/AdminLoginForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react'; // Updated import for React 19+
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/../_actions/adminAuthActions'; // Adjust import alias
import { Button } from '@repo/ui'; // Use shared UI
import { Input } from '@repo/ui'; // Assume Input exists
import { Label } from '@repo/ui'; // Assume Label exists

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
      {pending ? 'Logging in...' : 'Admin Login'}
    </Button>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  // Use useActionState for form state management
  // Action signature: (prevState, formData) => Promise<{success: boolean, message?: string}>
  const [state, formAction, isPending] = useActionState(adminLoginAction, null);

  // Redirect on successful login
  useEffect(() => {
    if (state?.success) {
      // Login successful, redirect to admin dashboard
      console.log("Admin login successful, redirecting...");
      router.push('/'); // Redirect to admin root/dashboard
      // router.refresh(); // Optional: force refresh
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
          placeholder="********"
          className={state && !state.success && state.message?.includes('password') ? 'border-red-500' : ''}
        />
      </div>

      {/* Display general form error message */}
      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}