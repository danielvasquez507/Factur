import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma

/**
 * Retorna un cliente Prisma con RLS habilitado para un tenant (company_id) específico.
 * Utiliza una transacción para inyectar el tenant de forma segura en cada operación.
 */
export const getTenantPrisma = (companyId: string) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.current_tenant', ${companyId}, TRUE)`,
            query(args),
          ])
          return result
        },
      },
    },
  })
}

/**
 * Retorna un cliente Prisma que salta el RLS explícitamente.
 * Utilizado por el Super Admin o procesos internos.
 */
export const getBypassPrisma = () => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`,
            query(args),
          ])
          return result
        },
      },
    },
  })
}
