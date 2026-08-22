import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function sqliteFileUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  return `file:${path.resolve(process.cwd(), "dev.db")}`;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: sqliteFileUrl() }),
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientSingleton | undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
