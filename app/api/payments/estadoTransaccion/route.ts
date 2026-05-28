import { NextResponse } from "next/server";

const SELLER_URL = process.env.SELLER_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idPedido, estadoTransaccion } = body;

    const response = await fetch(
      `${SELLER_URL}/api/seller/estadoTransaccion`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPedido, estadoTransaccion }),
      }
    );

    // si el seller devuelve 204 significa que el pedido ya fue procesado
    if (response.status === 204) {
      return NextResponse.json({ mensaje: "El pedido ya fue procesado anteriormente" }, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
