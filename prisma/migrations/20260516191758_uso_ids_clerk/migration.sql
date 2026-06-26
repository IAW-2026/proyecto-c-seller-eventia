/*
  Warnings:

  - The primary key for the `organizadores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idEvento` on the `organizadores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "eventos" ALTER COLUMN "idOrganizador" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "organizadores" DROP CONSTRAINT "organizadores_pkey",
DROP COLUMN "idEvento",
ALTER COLUMN "idOrganizador" DROP DEFAULT,
ALTER COLUMN "idOrganizador" SET DATA TYPE TEXT,
ADD CONSTRAINT "organizadores_pkey" PRIMARY KEY ("idOrganizador");
DROP SEQUENCE "organizadores_idOrganizador_seq";

-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "idOrganizador" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idOrganizador_fkey" FOREIGN KEY ("idOrganizador") REFERENCES "organizadores"("idOrganizador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_idOrganizador_fkey" FOREIGN KEY ("idOrganizador") REFERENCES "organizadores"("idOrganizador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "eventos"("idEvento") ON DELETE SET NULL ON UPDATE CASCADE;
