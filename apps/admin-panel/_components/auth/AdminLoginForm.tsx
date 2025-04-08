'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '../../_actions/adminAuthActions'; // Use relative path

// Placeholder for shared UI components
function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="border p-1" />;
}
// End Placeholder

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Logging in...' : 'Admin Login'}
    </Button>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(adminLoginAction, null);

  // Redirect on successful admin login
  React.useEffect(() => {
    if (state?.success) {
      router.push('/admin/dashboard'); // Redirect to admin dashboard
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required />
      </div>

      {state && !state.success && state.message && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
} 