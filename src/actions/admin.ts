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
  return await prisma.service.findMany({
    include: { company: true },
    orderBy: { name: "asc" }
  })
}

export async function getGlobalInvoices() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  return await prisma.invoice.findMany({
    include: { company: true, client: true },
    orderBy: { issueDate: "desc" }
  })
}

export async function getGlobalCompanies() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  return await prisma.company.findMany({
    orderBy: { name: "asc" }
  })
}
