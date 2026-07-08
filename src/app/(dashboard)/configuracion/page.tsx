import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId, getActiveCompanyRole } from "@/actions/tenant"
import { CompanyProfileForm } from "@/components/settings/company-profile-form"

export default async function SettingsPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()
  const activeCompanyRole = await getActiveCompanyRole()

  if (!activeTenantId || !session?.user) {
    return <div className="p-6">Por favor, selecciona una empresa en la barra superior.</div>
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN"
  const isOwner = activeCompanyRole === "OWNER"

  if (!isSuperAdmin && !isOwner) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-zinc-950/40 border border-red-500/20 text-red-400 rounded-xl mt-8">
        <h2 className="text-lg font-bold mb-2">Acceso No Autorizado</h2>
        <p className="text-sm">Solo el Propietario (Owner) de la empresa tiene permisos para editar la configuración comercial.</p>
      </div>
    )
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
