"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { incrementRateLimit } from "@/lib/rate-limit"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

function toPlainContract(c: any) {
  if (!c) return c;
  return {
    ...c,
    clientService: c.clientService ? {
      ...c.clientService,
      agreedPrice: c.clientService.agreedPrice ? Number(c.clientService.agreedPrice) : 0,
      taxRate: c.clientService.taxRate ? Number(c.clientService.taxRate) : 0,
      service: c.clientService.service ? {
        ...c.clientService.service,
        defaultPrice: c.clientService.service.defaultPrice ? Number(c.clientService.service.defaultPrice) : 0
      } : null
    } : null,
    client: c.client ? {
      ...c.client,
      clientServices: c.client.clientServices ? c.client.clientServices.map((cs: any) => ({
        ...cs,
        agreedPrice: Number(cs.agreedPrice),
        taxRate: Number(cs.taxRate),
        service: cs.service ? {
          ...cs.service,
          defaultPrice: Number(cs.service.defaultPrice)
        } : null
      })) : []
    } : c.client
  }
}

const contractSchema = z.object({
  clientId: z.string().uuid("Cliente inválido"),
  clientServiceId: z.string().uuid("Debe seleccionar un servicio asignado al cliente"),
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Fecha de inicio obligatoria"),
  endDate: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "EXPIRED", "CANCELLED"]).default("DRAFT"),
  clauses: z.array(z.any()),
  responsibilities: z.array(z.any()),
  conditions: z.array(z.any()),
  exceptions: z.array(z.any()),
  pdfTemplate: z.string().default("professional"),
  pdfColor: z.string().default("slate"),
})

export async function getContracts(companyIdParam?: string) {
  const session = await auth()
  if (!session?.user) return []

  const activeTenantId = companyIdParam || await getActiveTenantId()
  if (!activeTenantId) return []

  const prisma = getTenantPrisma(activeTenantId)
  const contracts = await prisma.contract.findMany({
    where: { companyId: activeTenantId },
    include: {
      client: {
        include: {
          clientServices: {
            include: { service: true }
          }
        }
      },
      clientService: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return contracts.map(toPlainContract)
}

export async function getClientContracts(clientId: string, companyIdParam?: string) {
  const session = await auth()
  if (!session?.user) return []

  const activeTenantId = companyIdParam || await getActiveTenantId()
  if (!activeTenantId) return []

  const prisma = getTenantPrisma(activeTenantId)
  const contracts = await prisma.contract.findMany({
    where: { companyId: activeTenantId, clientId },
    include: {
      clientService: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return contracts.map(toPlainContract)
}
export async function getContractById(id: string, companyIdParam?: string) {
  const session = await auth()
  if (!session?.user) return null

  const activeTenantId = companyIdParam || await getActiveTenantId()
  if (!activeTenantId) return null

  const prisma = getTenantPrisma(activeTenantId)
  const contract = await prisma.contract.findUnique({
    where: { id, companyId: activeTenantId },
    include: {
      client: {
        include: {
          clientServices: {
            include: { service: true }
          }
        }
      },
      clientService: {
        include: { service: true }
      }
    }
  })
  
  return toPlainContract(contract)
}

export async function createContract(data: z.infer<typeof contractSchema>, companyIdParam?: string) {
  try {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    const activeTenantId = companyIdParam || await getActiveTenantId()
    if (!activeTenantId) return { error: "No hay empresa activa" }

    const parsed = contractSchema.parse(data)

    const prisma = getTenantPrisma(activeTenantId)
    
    // Verify client and service belong to company
    const client = await prisma.client.findUnique({ where: { id: parsed.clientId, companyId: activeTenantId } })
    if (!client) return { error: "Cliente no encontrado" }

    const contract = await prisma.contract.create({
      data: {
        companyId: activeTenantId,
        clientId: parsed.clientId,
        clientServiceId: parsed.clientServiceId,
        title: parsed.title,
        description: parsed.description,
        startDate: new Date(parsed.startDate),
        endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        status: parsed.status,
        clauses: parsed.clauses || [],
        responsibilities: parsed.responsibilities || [],
        conditions: parsed.conditions || [],
        exceptions: parsed.exceptions || [],
        pdfTemplate: parsed.pdfTemplate,
        pdfColor: parsed.pdfColor
      }
    })

    revalidatePath("/contratos")
    revalidatePath(`/clientes/${parsed.clientId}`)
    return { success: true, contractId: contract.id }
  } catch (error: any) {
    console.error("Error creating contract:", error)
    return { error: error.message || "Error al crear contrato" }
  }
}

export async function updateContract(id: string, data: z.infer<typeof contractSchema>, companyIdParam?: string) {
  try {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    const activeTenantId = companyIdParam || await getActiveTenantId()
    if (!activeTenantId) return { error: "No hay empresa activa" }

    const parsed = contractSchema.parse(data)
    const prisma = getTenantPrisma(activeTenantId)
    
    const existing = await prisma.contract.findUnique({ where: { id, companyId: activeTenantId } })
    if (!existing) return { error: "Contrato no encontrado" }

    await prisma.contract.update({
      where: { id },
      data: {
        clientId: parsed.clientId,
        clientServiceId: parsed.clientServiceId,
        title: parsed.title,
        description: parsed.description,
        startDate: new Date(parsed.startDate),
        endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        status: parsed.status,
        clauses: parsed.clauses || [],
        responsibilities: parsed.responsibilities || [],
        conditions: parsed.conditions || [],
        exceptions: parsed.exceptions || [],
        pdfTemplate: parsed.pdfTemplate,
        pdfColor: parsed.pdfColor
      }
    })

    revalidatePath("/contratos")
    revalidatePath(`/contratos/${id}`)
    revalidatePath(`/clientes/${parsed.clientId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Error updating contract:", error)
    return { error: error.message || "Error al actualizar contrato" }
  }
}

export async function deleteContract(id: string, companyIdParam?: string) {
  try {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    const activeTenantId = companyIdParam || await getActiveTenantId()
    if (!activeTenantId) return { error: "No hay empresa activa" }

    const prisma = getTenantPrisma(activeTenantId)
    await prisma.contract.delete({
      where: { id, companyId: activeTenantId }
    })

    revalidatePath("/contratos")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting contract:", error)
    return { error: "Error al eliminar contrato" }
  }
}


export async function generateContractPublicLink(contractId: string) {
  const session = await auth()
  let activeTenantId = await getActiveTenantId()

  if (!session?.user) return { error: "No autorizado" }

  const rl = incrementRateLimit(`publicLink:${session.user.id}`, 30, 60 * 1000)
  if (!rl.success) return { error: "Demasiadas solicitudes. Espere un momento." }

  let contract;

  if (session.user.role === "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    contract = await prisma.contract.findUnique({
      where: { id: contractId }
    })
    if (contract) {
      activeTenantId = contract.companyId;
    }
  } else {
    if (!activeTenantId) return { error: "No autorizado" }
    const prisma = getTenantPrisma(activeTenantId)
    contract = await prisma.contract.findUnique({
      where: { id: contractId, companyId: activeTenantId }
    })
  }

  if (!contract) return { error: "Contrato no encontrado" }

  const jwt = (await import("jsonwebtoken")).default
  const secret = process.env.AUTH_SECRET || "facturdv_fallback_secret"
  
  const token = jwt.sign(
    { contractId, companyId: activeTenantId },
    secret,
    { expiresIn: "5d" }
  )

  const headerList = await import("next/headers").then(m => m.headers())
  const host = headerList.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  
  const url = `${baseUrl}/c/${contractId}?token=${token}`
  
  return { success: true, url }
}
