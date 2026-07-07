import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, max: 15 })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const getTenantPrisma = (companyId: string) => {
  if (!UUID_RE.test(companyId)) {
    throw new Error("companyId inválido: no es un UUID válido")
  }
  return prisma
}

export const getBypassPrisma = () => {
  return prisma
}
