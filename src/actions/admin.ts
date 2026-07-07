"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"

export async function getGlobalClients() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  return await prisma.client.findMany({
    include: { company: true },
    orderBy: { createdAt: "desc" }
  })
}

export async function getGlobalServices() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  const services = await prisma.service.findMany({
    include: { company: true },
    orderBy: { name: "asc" }
  })
  return services.map(s => ({ ...s, defaultPrice: Number(s.defaultPrice) }))
}

export async function getGlobalInvoices() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  const invoices = await prisma.invoice.findMany({
    include: { company: true, client: true },
    orderBy: { issueDate: "desc" }
  })
  return invoices.map(inv => ({
    ...inv,
    subtotal: Number(inv.subtotal),
    taxAmount: Number(inv.taxAmount),
    total: Number(inv.total),
  }))
}

export async function getGlobalCompanies() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  return await prisma.company.findMany({
    orderBy: { name: "asc" }
  })
}
