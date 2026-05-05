import prisma from "../../../lib/prisma";

export async function GET() {
  const eventos = await prisma.eventos.findMany();

  return new Response(JSON.stringify(eventos), {
    headers: { "Content-Type": "application/json" },
  });
}