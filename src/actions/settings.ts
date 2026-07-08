"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { saveCompanyLogo } from "@/lib/filestore"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { FieldType } from "@prisma/client"

const updateSettingsSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres").max(100),
  ruc: z.string().regex(/^[0-9A-Za-z-]{1,20}$/, "RUC inválido: máximo 20 caracteres (letras, números y guiones)").optional().or(z.literal("")),
  dv: z.string().regex(/^\d{1,2}$/, "DV inválido: solo 1 o 2 dígitos").optional().or(z.literal("")),
  address: z.string().max(500, "Dirección demasiado larga").optional(),
  paymentDetails: z.string().max(2000, "Detalles de pago demasiado largos").optional(),
})

export async function updateCompanySettings(formData: FormData) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) {
    return { error: "No autorizado" }
  }

  const rawData = {
    name: formData.get("name") as string,
    ruc: formData.get("ruc") as string || undefined,
    dv: formData.get("dv") as string || undefined,
    address: formData.get("address") as string || undefined,
    paymentDetails: formData.get("paymentDetails") as string || undefined,
  }

  const logoFile = formData.get("logo") as File | null

  const result = updateSettingsSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Datos inválidos" }
  }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    const currentCompany = await prisma.company.findUnique({
      where: { id: activeTenantId }
    })

    if (!currentCompany) return { error: "Empresa no encontrada" }

    const updateData: any = {
      address: result.data.address,
      paymentDetails: result.data.paymentDetails,
    }

    const requests = []

    // RUC
    if (result.data.ruc && result.data.ruc !== currentCompany.ruc) {
      if (!currentCompany.ruc) {
        updateData.ruc = result.data.ruc
      } else {
        requests.push({
          companyId: activeTenantId,
          requestedById: session.user.id,
          fieldType: FieldType.RUC,
          currentValue: currentCompany.ruc,
          requestedValue: result.data.ruc,
        })
      }
    }

    // DV
    if (result.data.dv && result.data.dv !== currentCompany.dv) {
      if (!currentCompany.dv) {
        updateData.dv = result.data.dv
      } else {
        requests.push({
          companyId: activeTenantId,
          requestedById: session.user.id,
          fieldType: FieldType.DV,
          currentValue: currentCompany.dv,
          requestedValue: result.data.dv,
        })
      }
    }

    // Nombre Comercial
    if (result.data.name && result.data.name !== currentCompany.name) {
      if (!currentCompany.name) {
        updateData.name = result.data.name
      } else {
        requests.push({
          companyId: activeTenantId,
          requestedById: session.user.id,
          fieldType: FieldType.NAME,
          currentValue: currentCompany.name,
          requestedValue: result.data.name,
        })
      }
    }

    // Logo
    if (logoFile && logoFile.size > 0) {
      const newLogoUrl = await saveCompanyLogo(logoFile)
      if (!currentCompany.logoUrl) {
        updateData.logoUrl = newLogoUrl
      } else {
        requests.push({
          companyId: activeTenantId,
          requestedById: session.user.id,
          fieldType: FieldType.LOGO,
          currentValue: currentCompany.logoUrl,
          requestedValue: newLogoUrl,
        })
      }
    }

    // Aplicar actualizaciones directas
    if (Object.keys(updateData).length > 0) {
      await prisma.company.update({
        where: { id: activeTenantId },
        data: updateData
      })
    }

    // Crear solicitudes si las hay
    if (requests.length > 0) {
      await prisma.changeRequest.createMany({
        data: requests
      })
    }

    revalidatePath("/configuracion")
    return { success: true, pendingRequests: requests.length > 0 }
  } catch (error) {
    console.error(error)
    return { error: "Error interno del servidor" }
  }
}

export async function updateInvoiceDesign(template: string, color: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) {
    return { error: "No autorizado" }
  }

  const prisma = getTenantPrisma(activeTenantId)

  try {
    await prisma.company.update({
      where: { id: activeTenantId },
      data: {
        invoiceTemplate: template,
        invoiceColor: color,
      }
    })

    revalidatePath("/configuracion")
    revalidatePath("/facturas")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar el diseño de la factura" }
  }
}
