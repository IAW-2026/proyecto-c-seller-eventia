import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { limpiarPedidosExpirados } from "../../../lib/actions/pedidos";

const BUYER_URL = process.env.BUYER_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idEvento = Number(body.idEvento);
    const idUsuario = body.idUsuario; // Clerk ID es String
    const cantEntradasNum = Number(body.cantidad);

    const idsCancelados: number[] = [];

    const pedido = await prisma.$transaction(async (tx) => {
      // 1. LIMPIEZA BAJO DEMANDA: liberar stock de pedidos vencidos para este evento
      const cancelados = await limpiarPedidosExpirados(tx, idEvento);
      idsCancelados.push(...cancelados);

      if (idsCancelados.length > 0) {
        fetch(`${BUYER_URL}/api/buyer/pedidoCancelado`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": process.env.BUYER_API_KEY ?? '' },
          body: JSON.stringify({ idsPedidos: idsCancelados }),
        }).catch((err) => console.error("Error notificando buyer pedidos cancelados:", err));
      }

      // 2. OBTENER DATOS DEL EVENTO
      const evento = await tx.eventos.findUnique({
        where: { idEvento },
        select: { precio: true, idOrganizador: true },
      });

      if (!evento) {
        throw new Error("EVENTO_NO_ENCONTRADO");
      }

      // 3. INTENTAR RESERVAR STOCK
      const reserva = await tx.eventos.updateMany({
        where: {
          idEvento,
          stock: { gte: cantEntradasNum },
        },
        data: {
          stock: { decrement: cantEntradasNum },
        },
      });

      if (reserva.count === 0) {
        throw new Error("STOCK_INSUFICIENTE");
      }

      const monto = Number(evento.precio ?? 0) * cantEntradasNum;

      // 4. CREAR EL PEDIDO
      return tx.pedidos.create({
        data: {
          idEvento,
          idUsuario,
          idOrganizador: evento.idOrganizador,
          cantEntradas: cantEntradasNum,
          monto,
          estado: "PENDIENTE",
        },
        select: {
          idPedido: true,
          monto: true,
        },
      });
    }, { maxWait: 10000, timeout: 15000 });

    return new Response(JSON.stringify({ ...pedido}), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error del servidor";
    return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });

  }
}

// GET temporal solo para poblar el select en la simulación
// TODO: quitar cuando se integren las apps
export async function GET() {
  try {
    const pedidos = await prisma.pedidos.findMany({
      select: {
        idPedido: true,
        idEvento: true,
        estado: true,
        monto: true,
      },
      orderBy: { idPedido: "desc" },
    });
    return NextResponse.json(pedidos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

