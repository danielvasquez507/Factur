"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma, getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createCompanySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  ruc: z.string().optional(),
  dv: z.string().optional(),
})

export async function getCompanies() {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("No autorizado")
  }

  const prisma = getBypassPrisma()
  return await prisma.company.findMany({
    include: {
      userCompanies: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createCompany(formData: FormData) {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    return { error: "No autorizado" }
  }

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    ruc: formData.get("ruc") as string || undefined,
    dv: formData.get("dv") as string || undefined,
  }

  const result = createCompanySchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const prisma = getBypassPrisma()

  try {
    const existing = await prisma.company.findUnique({
      where: { slug: result.data.slug }
    })

    if (existing) {
      return { error: "El slug ya está en uso" }
    }

    await prisma.company.create({
      data: result.data
    })

    revalidatePath("/empresas")
    return { success: true }
  } catch (error) {
    console.error("Error creating company:", error)
    return { error: "Ocurrió un error al crear la empresa" }
  }
}

export async function getCompanyById(id: string) {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("No autorizado")
  }

  const prisma = getBypassPrisma()
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      userCompanies: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      },
      invoices: {
        select: { total: true }
      },
      clients: {
        select: { id: true, name: true, email: true, celular: true }
      },
      services: {
        select: { id: true, name: true, defaultPrice: true, description: true }
      },
      _count: {
        select: { clients: true, services: true, invoices: true }
      }
    }
  })

  if (!company) return null

  const volume = company.invoices.reduce((acc, inv) => acc + Number(inv.total), 0)

  const recentInvoices = await prisma.invoice.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      invoiceNumber: true,
      issueDate: true,
      total: true,
      status: true,
      client: { select: { name: true } },
    },
  })

  return {
    ...company,
    invoices: company.invoices.map(inv => ({ total: Number(inv.total) })),
    volume,
    recentInvoices: recentInvoices.map(inv => ({
      ...inv,
      total: Number(inv.total),
    })),
  }
}

export async function toggleCompanyStatus(id: string) {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    return { error: "No autorizado" }
  }

  const prisma = getBypassPrisma()
  
  try {
    const company = await prisma.company.findUnique({ where: { id } })
    if (!company) return { error: "Empresa no encontrada" }

    await prisma.company.update({
      where: { id },
      data: { isActive: !company.isActive }
    })

    revalidatePath("/empresas")
    revalidatePath(`/empresas/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error toggling company status:", error)
    return { error: "Error al actualizar estado de la empresa" }
  }
}

const invoiceStyleSchema = z.object({
  invoiceTemplate: z.enum(["modern", "classic", "minimal", "corporate", "elegant", "bold", "professional", "creative", "executive"]),
  invoiceColor: z.enum(["blue", "emerald", "slate", "red", "orange", "purple", "amber", "teal", "indigo"]),
})

export async function updateCompanyInvoiceStyle(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) return { error: "No hay tenant activo" }

  const rawData = {
    invoiceTemplate: formData.get("invoiceTemplate") as string,
    invoiceColor: formData.get("invoiceColor") as string,
  }

  const result = invoiceStyleSchema.safeParse(rawData)
  if (!result.success) {
    return { error: "Valores inválidos para plantilla o color" }
  }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.company.update({
      where: { id: activeTenantId },
      data: {
        invoiceTemplate: result.data.invoiceTemplate,
        invoiceColor: result.data.invoiceColor,
      },
    })

    revalidatePath("/facturas/[id]")
    return { success: true }
  } catch (error) {
    console.error("Error updating invoice style:", error)
    return { error: "Error al guardar la preferencia" }
  }
}
