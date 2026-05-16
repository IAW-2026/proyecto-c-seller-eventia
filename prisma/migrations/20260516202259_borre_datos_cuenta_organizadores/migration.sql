/*
  Warnings:

  - You are about to drop the column `datosCuenta` on the `organizadores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizadores" DROP COLUMN "datosCuenta",
ADD COLUMN     "apellido" TEXT;
