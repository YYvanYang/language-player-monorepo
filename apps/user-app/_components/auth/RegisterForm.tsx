'use client';

import * as React from 'react'; // Updated import for React 19+
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation'; // For client-side redirect
import { registerAction } from '../../_actions/authActions'; // Use relative path

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
      {pending ? 'Registering...' : 'Register'}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, null);

  // Redirect on successful registration
  React.useEffect(() => {
    if (state?.success) {
      // Redirect after successful action completion
      // Optionally show a success message before redirecting
      router.push('/login?registered=true'); // Redirect to login page or dashboard
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" name="name" type="text" required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password (min. 8 characters)</label>
        <Input id="password" name="password" type="password" required minLength={8} />
      </div>

      {state && !state.success && state.message && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
} 