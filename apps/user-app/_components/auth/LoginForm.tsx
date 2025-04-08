// apps/user-app/_components/auth/LoginForm.tsx
'use client';

import { useActionState } from 'react'; // Updated import for React 19+
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation'; // For client-side redirect
import { loginAction } from '@/../_actions/authActions'; // Adjust import alias
import { Button } from '@repo/ui'; // Use shared UI
import { Input } from '@repo/ui'; // Assume Input exists

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  // Use useActionState for form state management
  const [state, formAction, isPending] = useActionState(loginAction, null); // Updated usage

  // Redirect on successful login
  React.useEffect(() => {
    if (state?.success) {
      // Redirect after successful action completion
      router.push('/'); // Redirect to dashboard or intended page
      // router.refresh(); // Optional: force refresh to ensure layout updates state
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