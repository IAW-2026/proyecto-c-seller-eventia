import { NextResponse } from "next/server";

// Proxy temporal para la simulación de payments: agrega la API key server-side
// antes de llamar al seller, ya que el browser no puede exponer la clave.
// TODO: eliminar cuando se integren las apps — buyer/payments van a llamar directamente con su propia key
export async function GET() {
  const res = await fetch(`${process.env.SELLER_BASE_URL}/api/seller/pedidos`, {
    headers: { "x-api-key": process.env.SELLER_API_KEY! },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
