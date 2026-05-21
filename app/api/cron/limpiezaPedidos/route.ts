import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const result = await prisma.pedidos.deleteMany({
      where: { estado: "CANCELADO" },
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
