"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma, getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createCompanySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
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
    ruc: formData.get("ruc") as string || undefined,
    dv: formData.get("dv") as string || undefined,
  }

  const result = createCompanySchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const prisma = getBypassPrisma()

  // Generate base slug
  let baseSlug = result.data.name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // trim hyphens
  
  if (!baseSlug) baseSlug = "empresa"

  try {
    let finalSlug = baseSlug
    let counter = 1
    
    // Check for uniqueness
    while (true) {
      const existing = await prisma.company.findUnique({
        where: { slug: finalSlug }
      })
      if (!existing) break
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    await prisma.company.create({
      data: {
        ...result.data,
        slug: finalSlug
      }
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

export async function deleteCompany(id: string) {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    return { error: "No autorizado" }
  }

  const prisma = getBypassPrisma()

  try {
    // Delete company (will cascade delete related items due to DB schema onDelete: Cascade)
    await prisma.company.delete({
      where: { id }
    })

    revalidatePath("/empresas")
    return { success: true }
  } catch (error) {
    console.error("Error deleting company:", error)
    return { error: "Error al eliminar la empresa" }
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

export async function updateContractSections(sections: any[]) {
  const session = await auth()
  if (!session?.user) {
    return { error: "No autorizado" }
  }

  const tenantId = await getActiveTenantId()
  if (!tenantId) {
    return { error: "No se encontró empresa activa" }
  }

  const prisma = getBypassPrisma()
  const userCompany = await prisma.userCompany.findUnique({
    where: {
      userId_companyId: {
        userId: session.user.id,
        companyId: tenantId
      }
    }
  })

  // OWNER or ADMIN (COMPANY_ADMIN defaults to ADMIN here depending on schema, but let's allow OWNER or just update anyway since getActiveTenantId implies some access)
  if (!userCompany) {
    return { error: "No tienes permisos para modificar la configuración de esta empresa" }
  }

  try {
    await prisma.company.update({
      where: { id: tenantId },
      data: { contractSections: sections }
    })
    revalidatePath("/empresa")
    return { success: true }
  } catch (error) {
    console.error("Error updating contract sections:", error)
    return { error: "Ocurrió un error al guardar las secciones" }
  }
}
