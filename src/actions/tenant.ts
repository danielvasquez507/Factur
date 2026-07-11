"use server"

import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"

const TENANT_COOKIE_NAME = "factur_current_tenant"

export async function getUserCompanies() {
  const session = await auth()
  if (!session?.user) return []

  const prisma = getBypassPrisma()
  if (session.user.role === "SUPER_ADMIN") {
      return await prisma.company.findMany({
          orderBy: { name: 'asc' }
      })
  }

  const userCompanies = await prisma.userCompany.findMany({
    where: { userId: session.user.id },
    include: { company: true },
    orderBy: { company: { name: 'asc' } }
  })

  return userCompanies.map(uc => uc.company)
}

export async function setActiveTenant(companyId: string) {
  const cookieStore = await cookies()
  cookieStore.set(TENANT_COOKIE_NAME, companyId, { path: "/", maxAge: 60 * 60 * 24 * 30 })
}

export async function getActiveTenantId() {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(TENANT_COOKIE_NAME)?.value || null

  if (!cookieValue) return null

  const session = await auth()
  if (!session?.user) return null

  if (session.user.role === "SUPER_ADMIN") {
    return cookieValue
  }

  const prisma = getBypassPrisma()
  const userCompany = await prisma.userCompany.findFirst({
    where: { userId: session.user.id, companyId: cookieValue },
    select: { companyId: true }
  })

  if (userCompany) return cookieValue

  const firstCompany = await prisma.userCompany.findFirst({
    where: { userId: session.user.id },
    select: { companyId: true },
    orderBy: { createdAt: "asc" }
  })

  if (firstCompany) {
    cookieStore.set(TENANT_COOKIE_NAME, firstCompany.companyId, { path: "/", maxAge: 60 * 60 * 24 * 30 })
    return firstCompany.companyId
  }

  return null
}

export async function getActiveCompanyRole() {
  const session = await auth()
  if (!session?.user) return null

  const activeTenantId = await getActiveTenantId()
  if (!activeTenantId) return null

  if (session.user.role === "SUPER_ADMIN") return "OWNER"

  const prisma = getBypassPrisma()
  const uc = await prisma.userCompany.findUnique({
    where: {
      userId_companyId: {
        userId: session.user.id,
        companyId: activeTenantId
      }
    },
    select: {
      roleInCompany: true
    }
  })

  return uc?.roleInCompany || null
}
