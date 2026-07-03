"use server"

import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const userSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["SUPER_ADMIN", "COMPANY_ADMIN"]).default("COMPANY_ADMIN"),
})

const updateUserSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  role: z.enum(["SUPER_ADMIN", "COMPANY_ADMIN"]),
  password: z.string().optional(),
})

export async function getUsers() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Unauthorized")

  const prisma = getBypassPrisma()
  return await prisma.user.findMany({
    include: {
      userCompanies: {
        include: { company: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function createUser(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "COMPANY_ADMIN",
  }

  const result = userSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0]?.message }

  const prisma = getBypassPrisma()
  
  const exists = await prisma.user.findUnique({ where: { email: result.data.email } })
  if (exists) return { error: "El correo ya está en uso" }

  const passwordHash = await bcrypt.hash(result.data.password, 10)

  try {
    await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        passwordHash,
        role: result.data.role,
        isActive: true,
      }
    })
    
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { error: "Error al crear el usuario" }
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password") || undefined,
  }

  const result = updateUserSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0]?.message }

  const prisma = getBypassPrisma()

  const dataToUpdate: any = {
    name: result.data.name,
    email: result.data.email,
    role: result.data.role,
  }

  if (result.data.password) {
    dataToUpdate.passwordHash = await bcrypt.hash(result.data.password, 10)
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    })
    
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { error: "Error al actualizar el usuario" }
  }
}

export async function deleteUser(userId: string) {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") return { error: "No autorizado" }

  const prisma = getBypassPrisma()

  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { error: "No se puede eliminar (probablemente tenga relaciones)" }
  }
}

export async function assignUserToCompany(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") return { error: "No autorizado" }

  const userId = formData.get("userId") as string
  const companyId = formData.get("companyId") as string

  if (!userId || !companyId) return { error: "Datos faltantes" }

  const prisma = getBypassPrisma()

  try {
    const exists = await prisma.userCompany.findUnique({
      where: {
        userId_companyId: { userId, companyId }
      }
    })

    if (exists) return { error: "El usuario ya está asignado a esta empresa" }

    await prisma.userCompany.create({
      data: {
        userId,
        companyId,
        roleInCompany: "OWNER"
      }
    })
    
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { error: "Error al asignar la empresa" }
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  currentPassword: z.string().optional().or(z.literal("")),
})

export async function updateMyProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") || undefined,
    currentPassword: formData.get("currentPassword") || undefined,
  }

  const result = updateProfileSchema.safeParse(rawData)
  if (!result.success) return { error: result.error.errors[0]?.message }

  const prisma = getBypassPrisma()
  const userId = session.user.id

  // Obtener el usuario completo para verificar la contraseña actual
  const currentUser = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!currentUser) return { error: "Usuario no encontrado" }

  // Check if email belongs to someone else
  const emailExists = await prisma.user.findFirst({
    where: { 
      email: result.data.email,
      id: { not: userId }
    }
  })
  if (emailExists) return { error: "El correo ya está en uso por otro usuario" }

  const dataToUpdate: any = {
    name: result.data.name,
    email: result.data.email,
  }

  if (result.data.password) {
    if (!result.data.currentPassword) {
      return { error: "Debes ingresar tu contraseña actual" }
    }
    const isValid = await bcrypt.compare(result.data.currentPassword, currentUser.passwordHash)
    if (!isValid) {
      return { error: "La contraseña actual es incorrecta" }
    }
    dataToUpdate.passwordHash = await bcrypt.hash(result.data.password, 10)
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    })
    
    // Al cambiar estos datos, es posible que sea necesario un relogueo si NextAuth usa token.
    return { success: true, message: "Perfil actualizado exitosamente. Si cambiaste tu correo o contraseña, podrías necesitar iniciar sesión nuevamente." }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "Error al actualizar tu perfil" }
  }
}
