import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

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

    // evitar duplicados
    if (pedido.estado !== "PENDIENTE") {
      return new Response(null, { status: 204 });
    }

    if (estadoTransaccion === "pagado") {
      await prisma.pedidos.update({
        where: { idPedido },
        data: { estado: "PAGADO" },
      });

      // TODO: quitar cuando se integren las apps — se devuelve el pedido actualizado
      // solo para que la simulación pueda visualizar el cambio de estado en la tabla
      const pedidoActualizado = await prisma.pedidos.findUnique({
        where: { idPedido },
        select: { idPedido: true, estado: true, monto: true, idEvento: true },
      });
      return NextResponse.json(pedidoActualizado, { status: 200 });
    }

    if (estadoTransaccion === "cancelado") {
      await prisma.$transaction(async (tx) => {
        await tx.eventos.update({
          where: { idEvento: pedido.idEvento as number },
          data: { stock: { increment: pedido.cantEntradas as number } },
        });

        await tx.pedidos.update({
          where: { idPedido },
          data: { estado: "CANCELADO" },
        });
      });

       // TODO: quitar cuando se integren las apps — se devuelve el pedido y stock actualizado
       // solo para que la simulación pueda visualizar los cambios en ambas tablas
       const pedidoActualizado = await prisma.pedidos.findUnique({
          where: { idPedido },
          select: { idPedido: true, estado: true, monto: true, idEvento: true },
        });

       const eventoActualizado = await prisma.eventos.findUnique({
          where: { idEvento: pedido.idEvento as number },
          select: { idEvento: true, nombreEvento: true, stock: true },
          });

       return NextResponse.json({ pedido: pedidoActualizado, evento: eventoActualizado }, { status: 200 });
    }

    return new Response(null, { status: 400 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
