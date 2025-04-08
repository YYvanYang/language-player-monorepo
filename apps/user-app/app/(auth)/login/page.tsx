// apps/user-app/app/(auth)/login/page.tsx
import { LoginForm } from '../../../_components/auth/LoginForm'; // Adjust alias
// Import GoogleSignInButton if using

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      {/* Separator */}
      <hr className="my-4" />
      {/* <GoogleSignInButton /> */}
      {/* Link to Register */}
    </div>
  );
}