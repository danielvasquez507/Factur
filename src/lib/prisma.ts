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
  
  // Logical RLS (Prisma Extension)
  // Automáticamente inyecta `companyId` en las tablas tenant-scoped para evitar fugas de datos
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantModels = ['Invoice', 'Client', 'Service', 'ChangeRequest']
          
          if (tenantModels.includes(model)) {
            // Si la operación es de lectura o escritura que acepta 'where'
            if (['findUnique', 'findMany', 'findFirst', 'update', 'updateMany', 'delete', 'deleteMany', 'count'].includes(operation)) {
              args.where = { ...args.where, companyId }
            }
            // Si es creación, inyectar el companyId en la data
            if (['create', 'createMany'].includes(operation)) {
              if (Array.isArray(args.data)) {
                args.data = args.data.map((d: any) => ({ ...d, companyId }))
              } else {
                args.data = { ...args.data, companyId }
              }
            }
          }
          return query(args)
        }
      }
    }
  })
}

export const getBypassPrisma = () => {
  return prisma
}
