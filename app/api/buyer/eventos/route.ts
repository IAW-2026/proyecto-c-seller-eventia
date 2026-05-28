import { NextResponse } from "next/server";

const SELLER_URL = process.env.SELLER_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(
      `${SELLER_URL}/api/seller/eventos`
    );

    if (!response.ok) {
      const detalle = await response.json().catch(() => null);
      return NextResponse.json(
        { error: "Error al obtener los eventos del seller", detalle },
        { status: response.status }
      );
    }

    const eventos = await response.json();
    return NextResponse.json(eventos);
  } catch (error) {
    console.error("[buyer/eventos] fetch falló:", error);
    return NextResponse.json(
      { error: "Error de conexión con el seller", detalle: String(error) },
      { status: 500 }
    );
  }
}