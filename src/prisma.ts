import { PrismaClient } from "@prisma/client";
import { NodeENV } from "./types/general.types";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV === NodeENV.DEVELOPMENT)
  globalForPrisma.prisma = prisma;
