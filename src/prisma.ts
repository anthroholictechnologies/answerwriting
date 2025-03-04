import { PrismaClient } from "@prisma/client";
import { ENVNext } from "./types/general.types";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.ENV_NEXT === ENVNext.DEVELOPMENT)
  globalForPrisma.prisma = prisma;
