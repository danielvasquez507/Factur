"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const serviceSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional(),
  defaultPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
})

export async function getServices() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) throw new Error("No autorizado")

  const prisma = getTenantPrisma(activeTenantId)
  return await prisma.service.findMany({
    where: { companyId: activeTenantId },
    orderBy: { createdAt: "desc" }
  })
}

export async function createService(formData: FormData) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    defaultPrice: formData.get("defaultPrice"),
  }

  const result = serviceSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0].message }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.service.create({
      data: {
        companyId: activeTenantId,
        name: result.data.name,
        description: result.data.description || null,
        defaultPrice: result.data.defaultPrice,
      }
    })

    revalidatePath("/dashboard/services")
    return { success: true }
  } catch (error) {
    console.error("Error creating service:", error)
    return { error: "Ocurrió un error al crear el servicio" }
  }
}

export async function deleteService(serviceId: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.service.delete({
      where: { id: serviceId, companyId: activeTenantId }
    })
    
    revalidatePath("/dashboard/services")
    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { error: "No se puede eliminar (probablemente esté en uso)" }
  }
}

export async function updateService(serviceId: string, formData: FormData) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    defaultPrice: formData.get("defaultPrice"),
  }

  const result = serviceSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0].message }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.service.update({
      where: { id: serviceId, companyId: activeTenantId },
      data: {
        name: result.data.name,
        description: result.data.description || null,
        defaultPrice: result.data.defaultPrice,
      }
    })

    revalidatePath("/dashboard/services")
    return { success: true }
  } catch (error) {
    console.error("Error updating service:", error)
    return { error: "Ocurrió un error al actualizar el servicio" }
  }
}
