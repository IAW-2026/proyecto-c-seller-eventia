import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* forceRedirectUrl garantiza que Clerk vaya a /auth/redirect al registrarse,
          donde se decide si el usuario es admin (/admin) o vendedor (/organizador) */}
      <SignUp forceRedirectUrl="/auth/redirect" />
    </div>
  );
}
