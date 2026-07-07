import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBypassPrisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const prisma = getBypassPrisma()
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-zinc-400 mt-1">
          Administra tu información personal y credenciales de acceso.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
