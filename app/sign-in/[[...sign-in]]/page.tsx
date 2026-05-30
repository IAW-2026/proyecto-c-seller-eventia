import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* forceRedirectUrl garantiza que Clerk vaya a /auth/redirect al loguearse,
          donde se decide si el usuario es admin (/admin) o vendedor (/vendedor) */}
      <SignIn forceRedirectUrl="/auth/redirect" />
    </div>
  );
}
