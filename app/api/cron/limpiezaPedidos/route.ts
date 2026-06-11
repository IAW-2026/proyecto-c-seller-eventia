import prisma from "../../../lib/prisma";
import { limpiarPedidosExpirados } from "../../../lib/actions/pedidos";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    // Sin idEvento → limpia pedidos vencidos de todos los eventos
    const cancelados = await limpiarPedidosExpirados(prisma);

    return new Response(JSON.stringify({ cancelados: cancelados.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
