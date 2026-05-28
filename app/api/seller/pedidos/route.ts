import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

const BUYER_URL = process.env.BUYER_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idEvento = Number(body.idEvento);
    const idUsuario = body.idUsuario; // Clerk ID es String
    const cantEntradasNum = Number(body.cantEntradas);

    if (
      !Number.isInteger(idEvento) ||
      typeof idUsuario !== "string" ||
      !Number.isInteger(cantEntradasNum) ||
      cantEntradasNum <= 0
    ) {
      return new Response(JSON.stringify({ error: "Entrada inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const idsCancelados: number[] = [];

    const pedido = await prisma.$transaction(async (tx) => {
      // 1. LIMPIEZA BAJO DEMANDA: Liberar stock de pedidos PENDIENTE de más de 15 min
      // Esto evita que el stock quede bloqueado si el usuario abandona la compra.
      const expiracion = new Date(Date.now() - 15 * 60 * 1000);

      const pedidosExpirados = await tx.pedidos.findMany({
        where: {
          idEvento,
          estado: "PENDIENTE",
          createdAt: { lt: expiracion },
        },
      });

      for (const p of pedidosExpirados) {
        await tx.eventos.update({
          where: { idEvento },
          data: { stock: { increment: p.cantEntradas ?? 0 } },
        });
        await tx.pedidos.update({
          where: { idPedido: p.idPedido },
          data: { estado: "CANCELADO" },
        });
        idsCancelados.push(p.idPedido);
      }
      // le mando a buyer
      if (idsCancelados.length > 0) {
        fetch(`${BUYER_URL}/api/buyer/pedidoCancelado`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    });

    return new Response(JSON.stringify(pedido), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error del servidor";

    if (message === "EVENTO_NO_ENCONTRADO") {
      return new Response(JSON.stringify({ error: "Evento no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (message === "STOCK_INSUFICIENTE") {
      return new Response(JSON.stringify({ error: "Stock insuficiente" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error(err);
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
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

