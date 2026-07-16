"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const serviceSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional(),
  defaultPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
})

export async function getServices(companyId?: string) {
  const session = await auth()
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user || !activeTenantId) throw new Error("No autorizado")

  const prisma = getTenantPrisma(activeTenantId)
  const services = await prisma.service.findMany({
    where: { companyId: activeTenantId },
    orderBy: { createdAt: "desc" }
  })
  return services.map(s => ({ ...s, defaultPrice: Number(s.defaultPrice) }))
}

export async function createService(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    defaultPrice: formData.get("defaultPrice"),
  }

  const result = serviceSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.issues[0].message }

  // SUPER_ADMIN puede crear servicios en cualquier empresa
  const companyId = session.user.role === "SUPER_ADMIN"
    ? (formData.get("companyId") as string)
    : await getActiveTenantId()

  if (!companyId) return { error: "No autorizado" }

  const prisma = session.user.role === "SUPER_ADMIN" ? getBypassPrisma() : getTenantPrisma(companyId)

  try {
    await prisma.service.create({
      data: {
        companyId,
        name: result.data.name,
        description: result.data.description || null,
        defaultPrice: result.data.defaultPrice,
      }
    })

    revalidatePath("/servicios")
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
    
    revalidatePath("/servicios")
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
  if (!result.success) return { error: result.error.issues[0].message }

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

    revalidatePath("/servicios")
    return { success: true }
  } catch (error) {
    console.error("Error updating service:", error)
    return { error: "Ocurrió un error al actualizar el servicio" }
  }
}

export async function getServiceById(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("No autorizado")

  if (session.user.role === "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    const service = await prisma.service.findUnique({
      where: { id },
      include: { company: { select: { id: true, name: true } } }
    })
    if (!service) return null
    return { ...service, defaultPrice: Number(service.defaultPrice) }
  }

  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) throw new Error("No autorizado")

  const prisma = getTenantPrisma(activeTenantId)
  const service = await prisma.service.findUnique({
    where: { id, companyId: activeTenantId },
    include: { company: { select: { id: true, name: true } } }
  })
  if (!service) return null
  return { ...service, defaultPrice: Number(service.defaultPrice) }
}
