import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  const { idEvento } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/eventos/${idEvento}`
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
