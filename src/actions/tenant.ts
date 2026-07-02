"use server"

import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"

const TENANT_COOKIE_NAME = "factur_current_tenant"

export async function getUserCompanies() {
  const session = await auth()
  if (!session?.user) return []

  const prisma = getBypassPrisma()
  // Si es super admin, cargamos todas las empresas (para que pueda entrar a probar)
  if (session.user.role === "SUPER_ADMIN") {
      return await prisma.company.findMany({
          orderBy: { name: 'asc' }
      })
  }

  // Si es company admin, cargamos solo sus empresas
  const userCompanies = await prisma.userCompany.findMany({
    where: { userId: session.user.id },
    include: { company: true },
    orderBy: { company: { name: 'asc' } }
  })

  return userCompanies.map(uc => uc.company)
}

export async function setActiveTenant(companyId: string) {
  const cookieStore = await cookies()
  cookieStore.set(TENANT_COOKIE_NAME, companyId, { path: "/", maxAge: 60 * 60 * 24 * 30 }) // 30 days
}

export async function getActiveTenantId() {
  const cookieStore = await cookies()
  return cookieStore.get(TENANT_COOKIE_NAME)?.value || null
}
