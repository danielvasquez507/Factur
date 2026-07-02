"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
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
            select: { name: true, email: true }
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

    revalidatePath("/dashboard/companies")
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
            select: { name: true, email: true, role: true }
          }
        }
      },
      invoices: {
        select: { total: true }
      },
      _count: {
        select: { clients: true, services: true, invoices: true }
      }
    }
  })

  if (!company) return null

  // Computed fields
  const volume = company.invoices.reduce((acc, inv) => acc + Number(inv.total), 0)

  return {
    ...company,
    volume
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

    revalidatePath("/dashboard/companies")
    revalidatePath(`/dashboard/companies/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error toggling company status:", error)
    return { error: "Error al actualizar estado de la empresa" }
  }
}
