"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const assignSchema = z.object({
  clientId: z.string().uuid(),
  serviceId: z.string().uuid(),
  agreedPrice: z.coerce.number().min(0),
  applyTax: z.boolean().default(false),
  taxRate: z.coerce.number().min(0).max(1).default(0.07),
  billingFrequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "MANUAL"]),
})

export async function getClientSubscriptions(clientId: string) {
  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) throw new Error("No tenant active")

  const prisma = getTenantPrisma(activeTenantId)
  const subs = await prisma.clientService.findMany({
    where: { clientId, companyId: activeTenantId },
    include: { service: true },
    orderBy: { createdAt: "desc" }
  })
  return subs.map(s => ({
    ...s,
    agreedPrice: Number(s.agreedPrice),
    taxRate: Number(s.taxRate),
    service: s.service ? { ...s.service, defaultPrice: Number(s.service.defaultPrice) } : s.service,
  }))
}

export async function assignServiceToClient(formData: FormData) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const rawData = {
    clientId: formData.get("clientId"),
    serviceId: formData.get("serviceId"),
    agreedPrice: formData.get("agreedPrice"),
    applyTax: formData.get("applyTax") === "on",
    taxRate: formData.get("taxRate") || 0.07,
    billingFrequency: formData.get("billingFrequency") || "MANUAL",
  }

  const result = assignSchema.safeParse(rawData)
  if (!result.success) return { error: "Datos de asignación inválidos" }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.clientService.create({
      data: {
        companyId: activeTenantId,
        clientId: result.data.clientId,
        serviceId: result.data.serviceId,
        agreedPrice: result.data.agreedPrice,
        applyTax: result.data.applyTax,
        taxRate: result.data.taxRate,
        billingFrequency: "MANUAL",
        nextBillingDate: null,
      }
    })

    revalidatePath(`/clientes/${result.data.clientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error assigning service:", error)
    return { error: "Error al asignar el servicio al cliente" }
  }
}

export async function unlinkClientService(clientServiceId: string, clientId: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.clientService.delete({
      where: { id: clientServiceId, clientId, companyId: activeTenantId }
    })

    revalidatePath(`/clientes/${clientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error unlinking service:", error)
    return { error: "Error al desvincular el servicio del cliente" }
  }
}
