"use server"

import { getBypassPrisma } from "@/lib/prisma"

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export async function validateLoginAttempt(email: string) {
  const prisma = getBypassPrisma()
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true, lockedUntil: true }
  })

  if (!user) return { error: "El correo electrónico no existe en el sistema" }

  // Check if locked
  if (user.lockedUntil) {
    if (new Date() < user.lockedUntil) {
      return { error: `Usuario bloqueado. Intente nuevamente más tarde.` }
    } else {
      // Lock expired, reset
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null }
      })
      return { success: true }
    }
  }

  return { success: true }
}

export async function getRemainingAttempts(email: string) {
  const prisma = getBypassPrisma()
  const user = await prisma.user.findUnique({
    where: { email },
    select: { failedLoginAttempts: true, lockedUntil: true }
  })
  
  if (!user) return null

  if (user.lockedUntil && new Date() < user.lockedUntil) {
    return { error: `Bloqueado por ${LOCKOUT_MINUTES} minutos por múltiples intentos fallidos.` }
  }

  const remaining = MAX_ATTEMPTS - user.failedLoginAttempts
  if (remaining < MAX_ATTEMPTS) {
    return { error: `Contraseña incorrecta. Le quedan ${remaining} intentos.` }
  }
  
  return null
}

export async function recordFailedLogin(email: string) {
  const prisma = getBypassPrisma()
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true }
  })

  if (!user) return { error: "Credenciales incorrectas" }

  const newAttempts = user.failedLoginAttempts + 1
  const remaining = MAX_ATTEMPTS - newAttempts

  if (newAttempts >= MAX_ATTEMPTS) {
    const lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: newAttempts, lockedUntil }
    })
    return { error: `Bloqueado por ${LOCKOUT_MINUTES} minutos por múltiples intentos fallidos.` }
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: newAttempts }
    })
    return { error: `Contraseña incorrecta. Le quedan ${remaining} intentos.` }
  }
}

export async function recordSuccessfulLogin(email: string) {
  const prisma = getBypassPrisma()
  await prisma.user.updateMany({
    where: { email },
    data: { failedLoginAttempts: 0, lockedUntil: null }
  })
}
