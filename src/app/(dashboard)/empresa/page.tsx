import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { MyCompanyView } from "@/components/company/my-company-view"

export default async function EmpresaPage() {
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
            select: { 
              id: true, 
              name: true, 
              logoUrl: true, 
              logoWhiteBackground: true,
              isActive: true,
              contractSections: true,
              defaultContractTitle: true
            }
          }
        }
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  const activeCompanyId = await getActiveTenantId()
  const activeCompany = user.userCompanies.find(uc => uc.company.id === activeCompanyId)?.company

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empresa</h1>
        <p className="text-zinc-400 mt-1">
          Gestiona las empresas a las que tienes acceso y configura sus datos globales.
        </p>
      </div>

      <MyCompanyView 
        user={user} 
        userRole={user.role}
        activeCompanyId={activeCompanyId} 
        activeCompany={activeCompany} 
      />
    </div>
  )
}
