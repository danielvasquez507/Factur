import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getServices } from "@/actions/services"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceTable } from "@/components/services/service-table"
import { ServiceDialog } from "@/components/services/service-dialog"
import { getActiveTenantId } from "@/actions/tenant"

export default async function ServicesPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) {
    return <div className="p-6 text-zinc-400">Por favor, selecciona una empresa en la barra superior para ver los servicios.</div>
  }

  const rawServices = await getServices()
  const services = rawServices.map(s => ({
    ...s,
    defaultPrice: s.defaultPrice.toString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Servicios</h1>
          <p className="text-zinc-400 mt-1">
            Gestiona los servicios y productos que ofreces
          </p>
        </div>
        <ServiceDialog />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardContent className="p-0">
          <ServiceTable services={services} />
        </CardContent>
      </Card>
    </div>
  )
}
