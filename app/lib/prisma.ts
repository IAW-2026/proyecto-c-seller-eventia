import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  });
  globalForPrisma.prisma = new PrismaClient({ adapter });
}


export const prisma = globalForPrisma.prisma;
export default prisma;