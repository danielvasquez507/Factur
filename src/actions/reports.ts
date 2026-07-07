"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"

export async function getTaxReport() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) {
    throw new Error("No autorizado")
  }

  const prisma = getTenantPrisma(activeTenantId)
  
  // Obtenemos facturas emitidas y pagadas del mes actual por defecto
  const invoices = await prisma.invoice.findMany({
    where: {
      companyId: activeTenantId,
      status: { in: ['ISSUED', 'PAID'] }
    },
    orderBy: { issueDate: 'desc' },
    select: {
      invoiceNumber: true,
      issueDate: true,
      subtotal: true,
      taxAmount: true,
      total: true,
      status: true,
      client: {
        select: { name: true }
      }
    }
  })

  return invoices.map(inv => ({
    ...inv,
    subtotal: Number(inv.subtotal),
    taxAmount: Number(inv.taxAmount),
    total: Number(inv.total),
  }))
}

export async function getTopClientsReport() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user || !activeTenantId) {
    throw new Error("No autorizado")
  }

  const prisma = getTenantPrisma(activeTenantId)
  
  // Agrupamos facturas por cliente y sumamos el total
  const grouped = await prisma.invoice.groupBy({
    by: ['clientId'],
    where: {
      companyId: activeTenantId,
      status: { in: ['ISSUED', 'PAID'] }
    },
    _sum: {
      total: true,
      subtotal: true,
      taxAmount: true
    },
    _count: {
      id: true
    },
    orderBy: {
      _sum: {
        total: 'desc'
      }
    },
    take: 10
  })

  // Obtener los datos reales de los clientes
  const clientIds = grouped.map(g => g.clientId).filter(Boolean) as string[]
  const clients = await prisma.client.findMany({
    where: { id: { in: clientIds } },
    select: { id: true, name: true, email: true }
  })

  return grouped.map(g => {
    const client = clients.find(c => c.id === g.clientId)
    return {
      clientId: g.clientId,
      clientName: client?.name || 'Desconocido',
      clientEmail: client?.email || '',
      invoiceCount: g._count.id,
      totalVolume: Number(g._sum.total || 0),
      totalSubtotal: Number(g._sum.subtotal || 0),
      totalTaxes: Number(g._sum.taxAmount || 0),
    }
  })
}
