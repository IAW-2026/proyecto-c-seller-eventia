import { getOrCreateOrganizador } from "@/app/lib/actions/organizadores";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Al llamar a esta función aquí, aseguras que el usuario 
  // se sincronice con tu DB apenas entre a cualquier ruta de /seller
  await getOrCreateOrganizador();

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="border-b border-slate-200 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-semibold">Volver</span>
        </Link>
      </header>

      <main className="flex-1 bg-white">
        {children}
      </main>
    </div>
  );
}