import Sidenav from '@/app/ui/sidenav';
import '@/app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidenav />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
