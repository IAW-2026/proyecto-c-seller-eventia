/*
  Warnings:

  - Made the column `idEvento` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cantEntradas` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_idEvento_fkey";

-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "idEvento" SET NOT NULL,
ALTER COLUMN "cantEntradas" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "eventos"("idEvento") ON DELETE RESTRICT ON UPDATE CASCADE;
