"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

export async function getCompanyMetrics(forcedTenantId?: string) {
  const session = await auth()
  
  let activeTenantId = await getActiveTenantId()
  
  // Si es Super Admin y quiere ver uno específico, forzamos el tenant
  if (forcedTenantId && session?.user?.role === "SUPER_ADMIN") {
    activeTenantId = forcedTenantId
  }

  if (!activeTenantId) throw new Error("No tenant active")

  const prisma = getTenantPrisma(activeTenantId)

  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)

  const [
    totalClients,
    totalServices,
    invoicesThisMonth,
    pendingInvoices,
    recentInvoices
  ] = await Promise.all([
    prisma.client.count({ where: { companyId: activeTenantId, isActive: true } }),
    prisma.service.count({ where: { companyId: activeTenantId, isActive: true } }),
    prisma.invoice.findMany({
      where: {
        companyId: activeTenantId,
        issueDate: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        status: { not: "CANCELLED" }
      }
    }),
    prisma.invoice.findMany({
      where: { companyId: activeTenantId, status: "ISSUED" }
    }),
    prisma.invoice.findMany({
      where: { companyId: activeTenantId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true, email: true } } }
    })
  ])

  const incomeThisMonth = invoicesThisMonth.reduce((acc, inv) => acc + Number(inv.total), 0)
  const pendingAmount = pendingInvoices.reduce((acc, inv) => acc + Number(inv.total), 0)

  // Datos para la gráfica: Últimos 6 meses
  const chartData = []
  for (let i = 5; i >= 0; i--) {
    const targetMonth = subMonths(now, i)
    const start = startOfMonth(targetMonth)
    const end = endOfMonth(targetMonth)

    const monthInvoices = await prisma.invoice.findMany({
      where: {
        companyId: activeTenantId,
        issueDate: { gte: start, lte: end },
        status: { not: "CANCELLED" }
      },
      select: { total: true }
    })

    const monthIncome = monthInvoices.reduce((acc, inv) => acc + Number(inv.total), 0)

    chartData.push({
      name: format(targetMonth, "MMM", { locale: es }).toUpperCase(),
      Ingresos: monthIncome
    })
  }

  // Obtener nombre de la empresa para mostrarlo si somos super admin
  const company = await prisma.company.findUnique({ where: { id: activeTenantId }, select: { name: true } })

  return {
    companyName: company?.name || "Empresa",
    stats: {
      totalClients,
      totalServices,
      incomeThisMonth,
      pendingAmount
    },
    chartData,
recentInvoices: recentInvoices.map(inv => ({
  ...inv,
  subtotal: Number(inv.subtotal),
  taxAmount: Number(inv.taxAmount),
  total: Number(inv.total)
}))
  }
}

export async function getGlobalMetrics() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()

  const [
    totalCompanies,
    totalUsers,
    allInvoices,
    totalClients,
    totalServices,
    totalInvoicesCount
  ] = await Promise.all([
    prisma.company.count(),
    prisma.user.count({ where: { role: { not: "SUPER_ADMIN" } } }),
    prisma.invoice.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { total: true }
    }),
    prisma.client.count(),
    prisma.service.count(),
    prisma.invoice.count()
  ])

  const globalVolume = allInvoices.reduce((acc, inv) => acc + Number(inv.total), 0)

  const recentCompaniesRaw = await prisma.company.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          clients: true,
          services: true,
          invoices: true
        }
      },
      invoices: {
        where: { status: { not: "CANCELLED" } },
        select: { total: true }
      }
    }
  })

  const recentCompanies = recentCompaniesRaw.map(c => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    clientCount: c._count.clients,
    serviceCount: c._count.services,
    invoiceCount: c._count.invoices,
    volume: c.invoices.reduce((acc, inv) => acc + Number(inv.total), 0)
  }))

  return {
    stats: {
      totalCompanies,
      totalUsers,
      globalVolume,
      totalClients,
      totalServices,
      totalInvoicesCount
    },
    recentCompanies
  }
}
