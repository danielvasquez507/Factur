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
  return await prisma.clientService.findMany({
    where: { clientId },
    include: { service: true },
    orderBy: { createdAt: "desc" }
  })
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
    // Calculamos el próximo mes si es mensual, solo como default simple
    let nextDate = null
    if (result.data.billingFrequency === "MONTHLY") {
      const d = new Date()
      d.setMonth(d.getMonth() + 1)
      nextDate = d
    } else if (result.data.billingFrequency !== "MANUAL") {
      nextDate = new Date() // Fallback
    }

    await prisma.clientService.create({
      data: {
        companyId: activeTenantId,
        clientId: result.data.clientId,
        serviceId: result.data.serviceId,
        agreedPrice: result.data.agreedPrice,
        applyTax: result.data.applyTax,
        taxRate: result.data.taxRate,
        billingFrequency: result.data.billingFrequency,
        nextBillingDate: nextDate,
      }
    })

    revalidatePath(`/dashboard/clients/${result.data.clientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error assigning service:", error)
    return { error: "Error al asignar el servicio al cliente" }
  }
}
