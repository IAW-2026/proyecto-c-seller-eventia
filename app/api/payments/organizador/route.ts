import { NextResponse } from "next/server";

const SELLER_URL = process.env.SELLER_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${SELLER_URL}/api/seller/eventos/organizador`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.SELLER_API_KEY ?? '' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión con el seller" }, { status: 500 });
  }
}
