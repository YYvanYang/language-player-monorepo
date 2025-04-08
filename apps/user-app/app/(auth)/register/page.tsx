import { RegisterForm } from '../../../_components/auth/RegisterForm'; // Adjust relative path

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
      {/* Optional: Add link back to login */}
      {/* <p>Already have an account? <a href="/login">Login</a></p> */}
    </div>
  );
} 