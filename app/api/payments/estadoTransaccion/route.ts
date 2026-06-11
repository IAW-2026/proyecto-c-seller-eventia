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
        headers: { "Content-Type": "application/json", "x-api-key": process.env.SELLER_API_KEY ?? '' },
        body: JSON.stringify({ idPedido, estadoTransaccion }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
