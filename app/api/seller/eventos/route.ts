import prisma from "../../../lib/prisma";

export async function GET() {
  const eventos = await prisma.eventos.findMany();

  return new Response(JSON.stringify(eventos), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const { nombreEvento, descripcion, fecha, ubicacion, stock, precio } = 
      await request.json();
    const evento = await prisma.eventos.create({
      data: {
        nombreEvento,
        descripcion,
        fecha: fecha ? new Date(fecha) : null,
        ubicacion,
        stock: stock ? parseInt(stock) : null,
        precio: precio ? parseFloat(precio) : null,  
      },
    });

    return new Response(JSON.stringify(evento), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear evento' }), {
      status: 500,
    });
  }
}