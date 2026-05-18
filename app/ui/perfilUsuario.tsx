'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function PerfilUsuario() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isSignedIn && (
        <SignInButton mode="modal">
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Iniciar sesión
          </button>
        </SignInButton>
      )}

      {isSignedIn && (
        <div className="flex items-center gap-3">
          <UserButton />
          <span className="text-sm font-medium text-slate-700">
            Bienvenido/a, {user?.firstName ?? 'usuario'}
          </span>
        </div>
      )}
    </div>
  );
}