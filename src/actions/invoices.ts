"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const invoiceItemSchema = z.object({
  serviceId: z.string().uuid().optional().nullable(),
  description: z.string().min(1, "La descripción es requerida"),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
  applyTax: z.boolean(),
  taxRate: z.coerce.number().min(0).max(1).default(0.07),
})

const createInvoiceSchema = z.object({
  clientId: z.string().uuid("Seleccione un cliente válido"),
  issueDate: z.string(), // YYYY-MM-DD
  dueDate: z.string().optional().nullable(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Debe agregar al menos un ítem"),
})

export async function createManualInvoice(rawData: any) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const result = createInvoiceSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Datos inválidos" }
  }

  const { clientId, issueDate, dueDate, notes, items } = result.data

  // Calcular totales
  let subtotal = 0
  let taxAmount = 0
  let total = 0

  const processedItems = items.map(item => {
    const lineSubtotal = item.quantity * item.unitPrice
    const lineTax = item.applyTax ? lineSubtotal * item.taxRate : 0
    const lineTotal = lineSubtotal + lineTax

    subtotal += lineSubtotal
    taxAmount += lineTax
    total += lineTotal

    return {
      serviceId: item.serviceId || null,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      applyTax: item.applyTax,
      taxRate: item.taxRate,
      taxAmount: lineTax,
      lineTotal: lineTotal
    }
  })

  // Usamos el prisma con bypass porque actualizaremos el company y la factura dentro de una transacción,
  // y para evitar problemas de contextos en transacciones con RLS inyectado, hacemos un bypass controlado 
  // ya que sabemos exactamente a qué tenant apunta.
  const prisma = getBypassPrisma()

  try {
    const newInvoice = await prisma.$transaction(async (tx) => {
      // 1. Obtener y asegurar el número de factura de forma atómica
      const company = await tx.company.update({
        where: { id: activeTenantId },
        data: { nextInvoiceNumber: { increment: 1 } },
        select: { nextInvoiceNumber: true }
      })
      
      const assignedInvoiceNumber = company.nextInvoiceNumber - 1

      // 2. Crear la factura
      return await tx.invoice.create({
        data: {
          companyId: activeTenantId,
          clientId,
          invoiceNumber: assignedInvoiceNumber,
          issueDate: new Date(issueDate),
          dueDate: dueDate ? new Date(dueDate) : null,
          subtotal,
          taxAmount,
          total,
          status: "ISSUED",
          generationType: "MANUAL",
          notes,
          items: {
            create: processedItems
          }
        },
        include: {
          client: true,
          items: true
        }
      })
    })

    revalidatePath("/dashboard/invoices")
    return { success: true, invoiceId: newInvoice.id }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return { error: "Ocurrió un error al actualizar el estado de la factura" }
  }
}

export async function generateInvoicePublicLink(invoiceId: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const prisma = getTenantPrisma(activeTenantId)
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, companyId: activeTenantId }
  })

  if (!invoice) return { error: "Factura no encontrada" }

  // Firmar token usando un secreto (AUTH_SECRET)
  // Usamos dynamic import para que no cause problemas de top-level si se llama en client limits
  const jwt = (await import("jsonwebtoken")).default
  const secret = process.env.AUTH_SECRET || "facturdv_fallback_secret"
  
  const token = jwt.sign(
    { invoiceId, companyId: activeTenantId },
    secret,
    { expiresIn: "5d" }
  )

  // En local sería http://localhost:3000, en prod sería https://midominio.com
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "")
  
  const url = `${baseUrl}/api/invoices/${invoiceId}/pdf?token=${token}`
  
  return { success: true, url }
}

export async function getInvoices() {
  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) throw new Error("No tenant active")

  const prisma = getTenantPrisma(activeTenantId)
  const invoices = await prisma.invoice.findMany({
    where: { companyId: activeTenantId },
    include: {
      client: { select: { name: true, email: true } }
    },
    orderBy: { invoiceNumber: "desc" }
  })

  // Serializar Decimal a number para los componentes cliente
  return invoices.map(inv => ({
    ...inv,
    subtotal: Number(inv.subtotal),
    taxAmount: Number(inv.taxAmount),
    total: Number(inv.total),
  }))
}

export async function getInvoiceDetails(invoiceId: string) {
  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) throw new Error("No tenant active")

  const prisma = getTenantPrisma(activeTenantId)
  return await prisma.invoice.findFirst({
    where: { id: invoiceId, companyId: activeTenantId },
    include: {
      client: true,
      company: true,
      items: {
        include: { service: true }
      }
    }
  })
}
