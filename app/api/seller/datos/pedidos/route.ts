import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/seller/pedidos - Público: Ver todos los pedidos
export async function GET() {
  try {
    const pedidos = await prisma.pedidos.findMany();
    return NextResponse.json(pedidos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los pedidos" }, { status: 500 });
  }
}