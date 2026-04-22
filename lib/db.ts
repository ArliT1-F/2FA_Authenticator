import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requiredEnv } from "@/lib/env";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg(requiredEnv("DATABASE_URL"));

export const db =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
