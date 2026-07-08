"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { incrementRateLimit } from "@/lib/rate-limit"

// Helper to serialize Decimal fields to Number for client consumption
function toPlainInvoice(inv: any) {
  if (!inv) return inv
  return {
    ...inv,
    subtotal: Number(inv.subtotal),
    taxAmount: Number(inv.taxAmount),
    total: Number(inv.total),
  }
}

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

export async function createManualInvoice(rawData: any, companyId?: string) {
  const session = await auth()
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user || !activeTenantId) return { error: "No autorizado" }

  const rl = incrementRateLimit(`createInvoice:${session.user.id}`, 15, 60 * 1000)
  if (!rl.success) return { error: "Demasiadas solicitudes. Espere un momento." }

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

    revalidatePath("/facturas")
    revalidatePath("/empresas", "layout")
    return { success: true, invoiceId: newInvoice.id }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return { error: "Ocurrió un error al actualizar el estado de la factura" }
  }
}

export async function generateInvoicePublicLink(invoiceId: string) {
  const session = await auth()
  let activeTenantId = await getActiveTenantId()

  if (!session?.user) return { error: "No autorizado" }

  const rl = incrementRateLimit(`publicLink:${session.user.id}`, 30, 60 * 1000)
  if (!rl.success) return { error: "Demasiadas solicitudes. Espere un momento." }

  let invoice;

  if (session.user.role === "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    })
    if (invoice) {
      activeTenantId = invoice.companyId; // Ensure activeTenantId is set for the token
    }
  } else {
    if (!activeTenantId) return { error: "No autorizado" }
    const prisma = getTenantPrisma(activeTenantId)
    invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, companyId: activeTenantId }
    })
  }

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

  const headerList = await import("next/headers").then(m => m.headers())
  const host = headerList.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  
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
  return invoices.map(toPlainInvoice)
}

export async function getInvoiceDetails(invoiceId: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  let invoice;

  if (session?.user?.role === "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId },
      include: {
        client: true,
        company: true,
        items: {
          include: { service: true }
        }
      }
    })
  } else {
    if (!activeTenantId) throw new Error("No tenant active")
    const prisma = getTenantPrisma(activeTenantId)
    invoice = await prisma.invoice.findFirst({
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

  if (!invoice) return null

  return {
    ...invoice,
    subtotal: Number(invoice.subtotal),
    taxAmount: Number(invoice.taxAmount),
    total: Number(invoice.total),
    items: invoice.items.map(item => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      taxRate: Number(item.taxRate),
      taxAmount: Number(item.taxAmount),
      lineTotal: Number(item.lineTotal),
      service: item.service ? { ...item.service, defaultPrice: Number(item.service.defaultPrice) } : null,
    }))
  }
}

export async function updateInvoiceStatus(invoiceId: string, newStatus: string) {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) return { error: "No autorizado" }

  const validStatuses = ["DRAFT", "ISSUED", "PAID", "CANCELLED"]
  if (!validStatuses.includes(newStatus)) {
    return { error: "Estado inválido" }
  }

  let prisma;

  if (session.user.role === "SUPER_ADMIN") {
    prisma = getBypassPrisma()
    const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } })
    if (!inv) return { error: "Factura no encontrada" }
  } else {
    if (!activeTenantId) return { error: "No autorizado" }
    prisma = getTenantPrisma(activeTenantId)
    const inv = await prisma.invoice.findUnique({
      where: { id: invoiceId, companyId: activeTenantId }
    })
    if (!inv) return { error: "Factura no encontrada" }
  }

  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus as any }
    })
    
    revalidatePath("/facturas")
    revalidatePath(`/facturas/${invoiceId}`)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error updating invoice status:", error)
    return { error: "Error al actualizar estado" }
  }
}
