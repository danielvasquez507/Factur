"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const clientSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  celular: z.string().regex(/^\d{8}$/, "El celular debe tener exactamente 8 dígitos"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{8}$/, "El teléfono debe tener exactamente 8 dígitos").optional().or(z.literal("")),
  direccion: z.string().optional(),
  authorizedPersons: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function getClients(companyId?: string) {
  const session = await auth()
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user || !activeTenantId) throw new Error("No autorizado")

  const prisma = getTenantPrisma(activeTenantId)
  return await prisma.client.findMany({
    where: { companyId: activeTenantId },
    orderBy: { createdAt: "desc" }
  })
}

export async function createClient(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name") as string,
    celular: formData.get("celular") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    direccion: formData.get("direccion") as string,
    authorizedPersons: formData.get("authorizedPersons") as string,
  }

  const result = clientSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.issues[0].message }

  // SUPER_ADMIN puede crear clientes en cualquier empresa
  const companyId = session.user.role === "SUPER_ADMIN"
    ? (formData.get("companyId") as string)
    : await getActiveTenantId()

  if (!companyId) return { error: "No autorizado" }

  // Convertimos la lista separada por comas a un array JSON
  let authorizedArray: string[] = []
  if (result.data.authorizedPersons) {
    authorizedArray = result.data.authorizedPersons.split(',').map(p => p.trim()).filter(Boolean)
  }

  const prisma = session.user.role === "SUPER_ADMIN" ? getBypassPrisma() : getTenantPrisma(companyId)

  try {
    await prisma.client.create({
      data: {
        companyId,
        name: result.data.name,
        celular: result.data.celular,
        email: result.data.email || null,
        phone: result.data.phone || null,
        direccion: result.data.direccion || null,
        authorizedPersons: authorizedArray,
      }
    })

    revalidatePath("/clientes")
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
    celular: formData.get("celular") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    direccion: formData.get("direccion") as string,
    authorizedPersons: formData.get("authorizedPersons") as string,
    isActive: formData.get("isActive") === "true",
  }

  const result = clientSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.issues[0].message }

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
        celular: result.data.celular,
        email: result.data.email || null,
        phone: result.data.phone || null,
        direccion: result.data.direccion || null,
        authorizedPersons: authorizedArray,
        isActive: result.data.isActive,
      }
    })

    revalidatePath("/clientes")
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
    
    revalidatePath("/clientes")
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
    
    revalidatePath("/clientes")
    return { success: true }
  } catch (error) {
    console.error("Error toggling client status:", error)
    return { error: "Error al cambiar el estado del cliente" }
  }
}

export async function getClientInvoices(clientId: string) {
  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) throw new Error("No tenant active")

  const prisma = getTenantPrisma(activeTenantId)
  const invoices = await prisma.invoice.findMany({
    where: { clientId, companyId: activeTenantId },
    include: { items: true },
    orderBy: { issueDate: "desc" }
  })

  return invoices.map(inv => ({
    ...inv,
    subtotal: Number(inv.subtotal),
    taxAmount: Number(inv.taxAmount),
    total: Number(inv.total),
    items: inv.items.map(item => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      taxAmount: Number(item.taxAmount),
      lineTotal: Number(item.lineTotal),
    }))
  }))
}
