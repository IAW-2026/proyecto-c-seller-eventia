import { ClerkProvider } from '@clerk/nextjs';
import Sidenav from '@/app/ui/sideNav';
import '@/app/globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="flex min-h-screen flex-col">
          <Sidenav />
          <main className="flex-1 bg-white">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

