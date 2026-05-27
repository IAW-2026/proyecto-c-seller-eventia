import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/seller/eventos - Público: Ver todos los eventos de todos los organizadores
export async function GET() {
  try {
    const eventos = await prisma.eventos.findMany();
    return NextResponse.json(eventos);
  } catch (error) {
    console.error("[seller/eventos] Prisma error:", error);
    return NextResponse.json({ error: "Error al obtener los eventos", detalle: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombreEvento, descripcion, fecha, ubicacion, stock, precio } = 
      await request.json();
    const evento = await prisma.eventos.create({
      data: {
        nombreEvento,
        descripcion,
        fecha: fecha ? new Date(fecha) : null,
        ubicacion,
        stock: stock ? parseInt(stock) : null,
        precio: precio ? parseFloat(precio) : null,  
      },
    });

    return new Response(JSON.stringify(evento), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear evento' }), {
      status: 500,
    });
  }
}