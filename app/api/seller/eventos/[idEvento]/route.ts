import prisma from "../../../../lib/prisma";

function parseId(idEventoParam: string) {
  const idEvento = Number(idEventoParam);

  if (!Number.isInteger(idEvento)) {
    return null;
  }

  return idEvento;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  const { idEvento: idEventoParam } = await params;
  const idEvento = parseId(idEventoParam);

  if (!idEvento) {
    return new Response(JSON.stringify({ error: "idEvento inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const evento = await prisma.eventos.findUnique({
    where: { idEvento },
  });

  if (!evento) {
    return new Response(JSON.stringify({ error: "Evento no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(evento), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  try {
    const { idEvento: idEventoParam } = await params;
    const idEvento = parseId(idEventoParam);

    if (!idEvento) {
      return new Response(JSON.stringify({ error: "idEvento inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const {
      nombreEvento,
      descripcion,
      fecha,
      ubicacion,
      stock,
      precio,
    } = body;

    const eventoActualizado = await prisma.eventos.update({
      where: { idEvento },
      data: {
        nombreEvento,
        descripcion,
        fecha: fecha ? new Date(fecha) : null,
        ubicacion,
        stock: stock !== undefined && stock !== null && stock !== ""
          ? Number(stock)
          : null,
        precio: precio !== undefined && precio !== null && precio !== ""
          ? Number(precio)
          : null,
      },
    });

    return new Response(JSON.stringify(eventoActualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "No se pudo actualizar el evento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  try {
    const { idEvento: idEventoParam } = await params;
    const idEvento = parseId(idEventoParam);

    if (!idEvento) {
      return new Response(JSON.stringify({ error: "idEvento inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.eventos.delete({
      where: { idEvento },
    });

    return new Response(JSON.stringify({ message: "Evento eliminado" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "No se pudo eliminar el evento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}