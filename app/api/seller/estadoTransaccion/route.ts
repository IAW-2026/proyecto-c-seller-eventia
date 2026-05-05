export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idPedido = Number(body.idPedido);
    const estadoTransaccion = String(body.estadoTransaccion);

    if (!Number.isInteger(idPedido) || !estadoTransaccion) {
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}