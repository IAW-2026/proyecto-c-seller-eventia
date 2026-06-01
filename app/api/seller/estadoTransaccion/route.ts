import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

const BUYER_URL = process.env.BUYER_BASE_URL;

function jsonResponse(
  status: number,
  codigo: string,
  mensaje: string,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ codigo, mensaje, ...extra }, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idPedido = Number(body.idPedido);
    const estadoTransaccion = String(body.estadoTransaccion ?? "");

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
      return jsonResponse(404, "PEDIDO_NO_ENCONTRADO", "No se encontró el pedido.");
    }

    if (estadoTransaccion === "APROBADA") {
      if (pedido.estado !== "PENDIENTE") {
        if (pedido.estado === "PAGADO") {
          return jsonResponse(
            409,
            "PEDIDO_YA_APROBADO",
            "Este pedido ya fue aprobado."
          );
        }

        return jsonResponse(
          409,
          "PEDIDO_CANCELADO_NO_APROBABLE",
          "Este pedido ya fue cancelado. Solo se puede llegar a cancelar por una disputa de payments."
        );
      }

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
      return NextResponse.json(
        {
          codigo: "PEDIDO_APROBADO",
          mensaje: "El pedido fue aprobado correctamente.",
          pedido: pedidoActualizado,
        },
        { status: 200 }
      );
    }

    if (estadoTransaccion === "FALLIDA" || estadoTransaccion === "CANCELADA") {
      const estadoRequerido = estadoTransaccion === "FALLIDA" ? "PENDIENTE" : "PAGADO";

      if (pedido.estado === "CANCELADO") {
        return jsonResponse(
          409,
          "PEDIDO_YA_CANCELADO",
          "Este pedido ya fue cancelado. Solo se puede llegar a cancelar por una disputa de payments."
        );
      }

      if (estadoTransaccion === "CANCELADA" && pedido.estado === "PENDIENTE") {
        return jsonResponse(
          422,
          "CANCELACION_NO_VALIDA_POR_DISPUTA",
          "CANCELADA no aplica a un pedido PENDIENTE. Lo correcto es enviar FALLIDA para que el pedido se cancele, CANCELADA solo aplica a un pedido PAGADO que se quiere cancelar por disputa."
        );
      }

      if (pedido.estado !== estadoRequerido) {
        const mensajeError =
          estadoTransaccion === "FALLIDA"
            ? "Un pedido fallido debe estar pendiente"
            : "Un pedido cancelado debe estar pagado";

        return jsonResponse(
          409,
          estadoTransaccion === "FALLIDA" ? "PEDIDO_NO_PENDIENTE" : "PEDIDO_NO_PAGADO",
          mensajeError
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.eventos.update({
          where: { idEvento: pedido.idEvento },
          data: { stock: { increment: pedido.cantEntradas } },
        });

        await tx.pedidos.update({
          where: { idPedido },
          data: { estado: "CANCELADO" },
        });
      });

      fetch(`${BUYER_URL}/api/buyer/pedidoCancelado`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.BUYER_API_KEY ?? "" },
        body: JSON.stringify({ idsPedidos: [idPedido] }),
      }).catch((err) => console.error("Error notificando buyer pedido cancelado:", err));

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

      return NextResponse.json(
        {
          codigo: "PEDIDO_CERRADO_POR_DISPUTA",
          mensaje: "El pedido fue cancelado y el stock fue restaurado.",
          pedido: pedidoActualizado,
          evento: eventoActualizado,
        },
        { status: 200 }
      );
    }

    return jsonResponse(400, "ESTADO_TRANSACCION_INVALIDO", "Estado de transacción no válido.");
  } catch (error) {
    console.error(error);
    return jsonResponse(500, "ERROR_INTERNO", "Error del servidor.");
  }
}
