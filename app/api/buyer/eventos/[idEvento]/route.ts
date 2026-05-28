import { NextResponse } from "next/server";

const SELLER_URL = process.env.SELLER_BASE_URL;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  const { idEvento } = await params;
  try {
    const response = await fetch(
      `${SELLER_URL}/api/seller/eventos/${idEvento}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener el evento" },
        { status: response.status }
      );
    }

    const evento = await response.json();
    return NextResponse.json(evento);
  } catch (error) {
    return NextResponse.json(
      { error: "Error de conexión con el seller" },
      { status: 500 }
    );
  }
}
