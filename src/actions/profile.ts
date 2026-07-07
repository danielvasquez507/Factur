"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
})

export async function changePassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  const data = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  }

  const result = changePasswordSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Datos inválidos" }
  }

  const prisma = getBypassPrisma()
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user || !user.passwordHash) {
    return { error: "Usuario no válido o no utiliza contraseña." }
  }

  const isValid = await bcrypt.compare(result.data.currentPassword, user.passwordHash!)
  if (!isValid) {
    return { error: "La contraseña actual es incorrecta." }
  }

  const newPasswordHash = await bcrypt.hash(result.data.newPassword, 10)

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    })
    return { success: true }
  } catch (error) {
    console.error("Error cambiando contraseña:", error)
    return { error: "Ocurrió un error al actualizar la contraseña." }
  }
}
