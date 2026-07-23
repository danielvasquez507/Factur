"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"
import { getActiveTenantId } from "@/actions/tenant"
import { saveCompanyLogo } from "@/lib/filestore"

export async function completeOnboarding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "No autorizado" }
  }

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const logo = formData.get("logo") as File | null

  if (!password || password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" }
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden" }
  }

  const prisma = getBypassPrisma()
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true }
    })

    if (user?.passwordHash) {
      const isSameAsOld = await bcrypt.compare(password, user.passwordHash)
      if (isSameAsOld) {
        return { error: "La nueva contraseña no puede ser igual a la anterior" }
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    let logoUrl = null
    if (logo && logo.size > 0) {
      logoUrl = await saveCompanyLogo(logo)
    }

    // Actualizar usuario
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash,
        onboardingCompleted: true
      }
    })

    // Actualizar logo de la empresa actual o la primera empresa del usuario si subió uno
    if (logoUrl) {
      let targetCompanyId = await getActiveTenantId()
      
      if (!targetCompanyId) {
        const userCompany = await prisma.userCompany.findFirst({
          where: { userId: session.user.id },
          select: { companyId: true }
        })
        targetCompanyId = userCompany?.companyId || null
      }

      if (targetCompanyId) {
        await prisma.company.update({
          where: { id: targetCompanyId },
          data: { logoUrl }
        })
      }
    }

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error en onboarding:", error)
    return { error: "Ocurrió un error al guardar los datos" }
  }
}
