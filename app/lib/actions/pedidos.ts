import { EXPIRACION_PEDIDO_MS } from '@/app/lib/constants';
import prisma from '@/app/lib/prisma';

// Tipo que acepta tanto el cliente directo de Prisma como el cliente de transacción (tx)
type ClienteDB = Pick<typeof prisma, 'pedidos' | 'eventos'>;

// Marca como CANCELADO los pedidos PENDIENTE que superaron el tiempo de expiración,
// restaura el stock del evento y retorna los IDs cancelados.
// Acepta tx para ejecutarse dentro de una transacción existente, o prisma para uso independiente.
export async function limpiarPedidosExpirados(
  db: ClienteDB,
  idEvento?: number
): Promise<number[]> {
  const expiracion = new Date(Date.now() - EXPIRACION_PEDIDO_MS);

  const expirados = await db.pedidos.findMany({
    where: {
      ...(idEvento !== undefined ? { idEvento } : {}),
      estado: 'PENDIENTE',
      createdAt: { lt: expiracion },
    },
    select: { idPedido: true, idEvento: true, cantEntradas: true },
  });

  for (const p of expirados) {
    await db.eventos.update({
      where: { idEvento: p.idEvento! },
      data: { stock: { increment: p.cantEntradas ?? 0 } },
    });
    await db.pedidos.update({
      where: { idPedido: p.idPedido },
      data: { estado: 'CANCELADO' },
    });
  }

  return expirados.map((p) => p.idPedido);
}
