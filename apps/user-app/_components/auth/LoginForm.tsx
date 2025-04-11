// apps/user-app/_components/auth/LoginForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/_actions/authActions';
import { Button, Input, Label } from '@repo/ui'; // Use shared components
import { Loader } from 'lucide-react';
import { cn } from '@repo/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
        {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
        {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Redirect on successful login
  React.useEffect(() => {
    if (state?.success) {
      console.log("Login successful, redirecting...");
      // Redirect to dashboard or intended page
      // Consider using searchParams.get('next') if implementing redirect after login
      router.push('/');
      // router.refresh(); // Can help ensure layout reflects logged-in state immediately
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
            placeholder="user@example.com"
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
            className={cn(state && !state.success && state.message?.toLowerCase().includes('password') ? 'border-red-500' : '')}
            aria-invalid={state && !state.success && state.message?.toLowerCase().includes('password') ? "true" : "false"}
        />
      </div>

      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200" role="alert">
            {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}