"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const clientSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  authorizedPersons: z.string().optional(),
})

export async function getClients() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) throw new Error("No autorizado")

  const prisma = getTenantPrisma(activeTenantId)
  return await prisma.client.findMany({
    where: { companyId: activeTenantId },
    orderBy: { createdAt: "desc" }
  })
}

export async function createClient(formData: FormData) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    authorizedPersons: formData.get("authorizedPersons") as string,
  }

  const result = clientSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0].message }

  // Convertimos la lista separada por comas a un array JSON
  let authorizedArray: string[] = []
  if (result.data.authorizedPersons) {
    authorizedArray = result.data.authorizedPersons.split(',').map(p => p.trim()).filter(Boolean)
  }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.client.create({
      data: {
        companyId: activeTenantId,
        name: result.data.name,
        email: result.data.email || null,
        phone: result.data.phone || null,
        authorizedPersons: authorizedArray,
      }
    })

    revalidatePath("/dashboard/clients")
    return { success: true }
  } catch (error) {
    console.error("Error creating client:", error)
    return { error: "Ocurrió un error al crear el cliente" }
  }
}

export async function updateClient(clientId: string, formData: FormData) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    authorizedPersons: formData.get("authorizedPersons") as string,
  }

  const result = clientSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0].message }

  let authorizedArray: string[] = []
  if (result.data.authorizedPersons) {
    authorizedArray = result.data.authorizedPersons.split(',').map(p => p.trim()).filter(Boolean)
  }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.client.update({
      where: { id: clientId, companyId: activeTenantId },
      data: {
        name: result.data.name,
        email: result.data.email || null,
        phone: result.data.phone || null,
        authorizedPersons: authorizedArray,
      }
    })

    revalidatePath("/dashboard/clients")
    return { success: true }
  } catch (error) {
    console.error("Error updating client:", error)
    return { error: "Ocurrió un error al actualizar el cliente" }
  }
}

export async function deleteClient(clientId: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.client.delete({
      where: { id: clientId, companyId: activeTenantId }
    })
    
    revalidatePath("/dashboard/clients")
    return { success: true }
  } catch (error) {
    console.error("Error deleting client:", error)
    return { error: "No se puede eliminar porque este cliente ya tiene servicios o facturas vinculadas." }
  }
}

export async function toggleClientStatus(clientId: string, isActive: boolean) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.client.update({
      where: { id: clientId, companyId: activeTenantId },
      data: { isActive }
    })
    
    revalidatePath("/dashboard/clients")
    return { success: true }
  } catch (error) {
    console.error("Error toggling client status:", error)
    return { error: "Error al cambiar el estado del cliente" }
  }
}
