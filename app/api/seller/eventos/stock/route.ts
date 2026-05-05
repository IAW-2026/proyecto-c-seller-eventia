import prisma from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { idEvento: string } }
) {
  const idEvento = Number(params.idEvento);

  if (!Number.isInteger(idEvento)) {
    return new Response(JSON.stringify({ error: "idEvento inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const evento = await prisma.eventos.findUnique({
    where: { idEvento },
    select: {
      idEvento: true,
      stock: true,
    },
  });

  if (!evento) {
    return new Response(JSON.stringify({ error: "Evento no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(evento), {
    headers: { "Content-Type": "application/json" },
  });
}