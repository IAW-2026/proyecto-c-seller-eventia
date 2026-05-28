import { NextResponse } from "next/server";

const SELLER_URL = process.env.SELLER_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idEvento, idUsuario, cantEntradas } = body;

    const response = await fetch(
      `${SELLER_URL}/api/seller/pedidos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.SELLER_API_KEY as string },
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
