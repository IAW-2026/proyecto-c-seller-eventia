/*
  Warnings:

  - Added the required column `estado` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estado" "EstadoPedido" NOT NULL,
ALTER COLUMN "idUsuario" SET DATA TYPE TEXT,
ALTER COLUMN "idTransaccion" SET DATA TYPE TEXT;
