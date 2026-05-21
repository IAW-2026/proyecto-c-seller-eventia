import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idPedido = Number(body.idPedido);
    const estadoTransaccion = String(body.estadoTransaccion ?? "").toLowerCase();
   

    if (!Number.isInteger(idPedido) || !estadoTransaccion) {
      return new Response(null, { status: 400 });
    }

    const pedido = await prisma.pedidos.findUnique({
      where: { idPedido },
      select: {
        idPedido: true,
        idEvento: true,
        cantEntradas: true,
        estado: true,
      },
    });

    if (!pedido) {
      return new Response(null, { status: 404 });
    }
    //evitar duplicados
    if (pedido.estado !== "PENDIENTE") {
      return new Response(null, { status: 204 });
    }

    if (estadoTransaccion === "pagado") {
      await prisma.pedidos.update({
        where: { idPedido },
        data: {
          estado: "PAGADO",
        },
      });

      return new Response(null, { status: 204 });
    }

    if (estadoTransaccion === "cancelado") {
      await prisma.$transaction(async (tx) => {
        await tx.eventos.update({
          where: { idEvento: pedido.idEvento as number },
          data: {
            stock: {
              increment: pedido.cantEntradas as number,
            },
          },
        });

        await tx.pedidos.update({
          where: { idPedido },
          data: {
            estado: "CANCELADO",
          },
        });
      });

      return new Response(null, { status: 204 });
    }

    return new Response(null, { status: 400 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}