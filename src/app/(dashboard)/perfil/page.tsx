import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBypassPrisma } from "@/lib/prisma"
import { ProfileView } from "@/components/profile/profile-view"
import { getActiveTenantId } from "@/actions/tenant"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const prisma = getBypassPrisma()
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true,
      userCompanies: {
        select: {
          roleInCompany: true,
          company: {
            select: { id: true, name: true, logoUrl: true, isActive: true }
          }
        }
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  const activeCompanyId = await getActiveTenantId()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-zinc-400 mt-1">
          Administra tu información personal, apariencia y preferencias del sistema.
        </p>
      </div>

      <ProfileView user={user} activeCompanyId={activeCompanyId} />
    </div>
  )
}
