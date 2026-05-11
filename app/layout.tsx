import { ClerkProvider } from '@clerk/nextjs'
import Sidenav from '@/app/ui/sideNav';
import PerfilUsuario from '@/app/ui/perfilUsuario';
import { auth } from "@clerk/nextjs/server";
import '@/app/globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="es">
        <body className="flex min-h-screen">
          {userId && (
            <>
              <PerfilUsuario />
              <Sidenav />
            </>
          )}
          <main className="flex-1">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}