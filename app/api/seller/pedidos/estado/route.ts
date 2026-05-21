import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const pedidos = await prisma.pedidos.findMany({
      select: {
        idPedido: true,
        estado: true,
      },
      orderBy: {
        idPedido: "asc",
      },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los estados de los pedidos" },
      { status: 500 }
    );
  }
}