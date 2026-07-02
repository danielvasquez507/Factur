"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPendingRequests() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  return await prisma.changeRequest.findMany({
    where: { status: "PENDING" },
    include: {
      company: { select: { name: true } },
      requestedBy: { select: { email: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function getHistoricalRequests() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("No autorizado")

  const prisma = getBypassPrisma()
  return await prisma.changeRequest.findMany({
    where: { status: { not: "PENDING" } },
    include: {
      company: { select: { name: true } },
      requestedBy: { select: { email: true, name: true } }
    },
    orderBy: { reviewedAt: "desc" }
  })
}

export async function processRequest(requestId: string, action: "APPROVE" | "REJECT", reason?: string) {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") return { error: "No autorizado" }

  const prisma = getBypassPrisma()

  try {
    const request = await prisma.changeRequest.findUnique({ where: { id: requestId } })
    if (!request || request.status !== "PENDING") return { error: "Solicitud no encontrada o ya procesada" }

    if (action === "APPROVE") {
      const dataToUpdate: any = {}
      if (request.fieldType === "NAME") dataToUpdate.name = request.requestedValue
      if (request.fieldType === "LOGO") dataToUpdate.logoUrl = request.requestedValue
      if (request.fieldType === "RUC") dataToUpdate.ruc = request.requestedValue
      if (request.fieldType === "DV") dataToUpdate.dv = request.requestedValue

      await prisma.$transaction([
        prisma.company.update({
          where: { id: request.companyId },
          data: dataToUpdate
        }),
        prisma.changeRequest.update({
          where: { id: requestId },
          data: {
            status: "APPROVED",
            reviewedById: session.user.id,
            reviewedAt: new Date()
          }
        })
      ])
    } else {
      await prisma.changeRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          rejectionReason: reason,
          reviewedById: session.user.id,
          reviewedAt: new Date()
        }
      })
    }

    revalidatePath("/dashboard/requests")
    return { success: true }
  } catch (error) {
    console.error("Error processing request:", error)
    return { error: "Ocurrió un error al procesar la solicitud" }
  }
}
