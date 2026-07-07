import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { CompanyProfileForm } from "@/components/settings/company-profile-form"

export default async function SettingsPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!activeTenantId) {
    return <div className="p-6">Por favor, selecciona una empresa en la barra superior.</div>
  }

  const prisma = getTenantPrisma(activeTenantId)
  const company = await prisma.company.findUnique({
    where: { id: activeTenantId }
  })

  if (!company) {
    return <div className="p-6">Empresa no encontrada.</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Empresa</h1>
        <p className="text-zinc-400 mt-1">
          Administra la información comercial de {company.name}
        </p>
      </div>
      
      <CompanyProfileForm company={company} userRole={session?.user?.role} />
    </div>
  )
}
