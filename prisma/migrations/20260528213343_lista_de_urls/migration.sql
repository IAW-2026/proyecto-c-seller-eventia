-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "imagenes" TEXT[] DEFAULT ARRAY[]::TEXT[];
