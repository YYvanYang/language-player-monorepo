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
}