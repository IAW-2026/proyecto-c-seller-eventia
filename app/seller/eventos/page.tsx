import prisma from '@/app/lib/prisma';
import TablaEventos from '@/app/ui/tablaEventos'; 

export default async function EventosPage() {
  // Traemos los datos directamente de Prisma
  const eventos = await prisma.eventos.findMany();

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-semibold">Mis Eventos</h2>
      {/* Pasamos los eventos reales al componente que maneja la interacción */}
      <TablaEventos eventos={eventos as any} />
    </div>
  );
}