import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idEvento, idUsuario, cantEntradas } = body;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/pedidos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEvento, idUsuario, cantEntradas }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error de conexión con el seller" },
      { status: 500 }
    );
  }
}
