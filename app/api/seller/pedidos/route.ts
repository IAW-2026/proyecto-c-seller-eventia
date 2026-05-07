import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idEvento = Number(body.idEvento);
    const cantEntradasNum = Number(body.cantEntradas);

    if (!Number.isInteger(idEvento) || !Number.isInteger(cantEntradasNum) || cantEntradasNum < 0) {
      return new Response(JSON.stringify({ error: "Entrada inválida" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const evento = await prisma.eventos.findUnique({ where: { idEvento } });
    if (!evento) return new Response(JSON.stringify({ error: "Evento no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });

    const stock = Number(evento.stock ?? 0);
    if (stock < cantEntradasNum) return new Response(JSON.stringify({ error: "Stock insuficiente" }), { status: 400, headers: { "Content-Type": "application/json" } });

    const precio = evento.precio ?? 0;
    const monto = Number(precio) * cantEntradasNum;

    const [pedido] = await prisma.$transaction([
      prisma.pedidos.create({
        data: {
          idEvento,
          cantEntradas: cantEntradasNum,
          monto,
        },
      }),
      prisma.eventos.update({
        where: { idEvento },
        data: { stock: stock - cantEntradasNum },
      }),
    ]);

    return new Response(JSON.stringify({ idPedido: pedido.idPedido, monto }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error del servidor" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}