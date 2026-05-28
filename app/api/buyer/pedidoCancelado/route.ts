import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
