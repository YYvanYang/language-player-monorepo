// apps/user-app/_components/auth/RegisterForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/_actions/authActions';
import { Button, Input, Label } from '@repo/ui';
import { Loader } from 'lucide-react';
import { cn } from '@repo/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
        {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
        {pending ? 'Registering...' : 'Register'}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  // Redirect on successful registration
  useEffect(() => {
    if (state?.success) {
      console.log("Registration successful, redirecting...");
      router.push('/'); // Redirect to dashboard after successful registration
      // router.refresh(); // Optional
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
          className={cn(state && !state.success && state.message?.toLowerCase().includes('name') ? 'border-red-500' : '')}
          aria-invalid={state && !state.success && state.message?.toLowerCase().includes('name') ? "true" : "false"}
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
          minLength={8} // Enforce minimum length on client too
          placeholder="********"
           className={cn(state && !state.success && state.message?.toLowerCase().includes('password') ? 'border-red-500' : '')}
           aria-invalid={state && !state.success && state.message?.toLowerCase().includes('password') ? "true" : "false"}
        />
         <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
      </div>

      {/* Display general form error message */}
      {state && !state.success && state.message && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200" role="alert">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}