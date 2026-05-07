-- CreateTable
CREATE TABLE "eventos" (
    "idEvento" SERIAL NOT NULL,
    "nombreEvento" TEXT,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3),
    "ubicacion" TEXT,
    "stock" INTEGER,
    "idOrganizador" INTEGER,
    "precio" REAL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("idEvento")
);

-- CreateTable
CREATE TABLE "organizadores" (
    "idOrganizador" SERIAL NOT NULL,
    "nombreOrganizador" TEXT,
    "mail" TEXT,
    "datosCuenta" TEXT,
    "idEvento" INTEGER,

    CONSTRAINT "organizadores_pkey" PRIMARY KEY ("idOrganizador")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "idPedido" SERIAL NOT NULL,
    "idOrganizador" INTEGER,
    "idUsuario" INTEGER,
    "idEvento" INTEGER,
    "idTransaccion" INTEGER,
    "cantEntradas" INTEGER,
    "monto" REAL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("idPedido")
);
