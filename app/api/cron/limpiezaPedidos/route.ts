import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const result = await prisma.pedidos.deleteMany({
      where: {
        OR: [
          { estado: "CANCELADO" },
          {
            estado: "PENDIENTE",
            createdAt: { lt: new Date(Date.now() - 15 * 60 * 1000) },
          },
        ],
      },
    });

    return new Response(
      JSON.stringify({ borrados: result.count }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
