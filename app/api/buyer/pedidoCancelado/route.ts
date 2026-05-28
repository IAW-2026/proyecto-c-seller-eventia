import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.BUYER_API_KEY) {
    return new Response(JSON.stringify({ error: "API key inválida" }), { status: 401 });
  }

  try {
    const body = await request.json();
    const idsPedidos = body.idsPedidos;

    if (!Array.isArray(idsPedidos) || idsPedidos.length === 0) {
      return new Response(null, { status: 400 });
    }

    // TODO: reemplazar con lógica real del buyer (notificar usuario, actualizar estado, etc.)
    console.log("Pedidos cancelados recibidos:", idsPedidos);

    return NextResponse.json({ recibidos: idsPedidos }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
