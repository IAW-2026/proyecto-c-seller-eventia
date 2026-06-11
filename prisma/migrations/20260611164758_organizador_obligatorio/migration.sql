/*
  Warnings:

  - Made the column `idOrganizador` on table `eventos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idOrganizador` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "eventos" DROP CONSTRAINT "eventos_idOrganizador_fkey";

-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_idOrganizador_fkey";

-- AlterTable
ALTER TABLE "eventos" ALTER COLUMN "idOrganizador" SET NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "idOrganizador" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idOrganizador_fkey" FOREIGN KEY ("idOrganizador") REFERENCES "organizadores"("idOrganizador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_idOrganizador_fkey" FOREIGN KEY ("idOrganizador") REFERENCES "organizadores"("idOrganizador") ON DELETE RESTRICT ON UPDATE CASCADE;
