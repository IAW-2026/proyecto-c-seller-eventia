/*
  Warnings:

  - Made the column `monto` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "monto" SET NOT NULL;
