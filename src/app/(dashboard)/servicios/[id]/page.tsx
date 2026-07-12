import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServiceById } from "@/actions/services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"
import { EditServiceButton } from "@/components/services/edit-service-button"
import { Layers, DollarSign, Building2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function ServiceDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const service = await getServiceById(params.id)
  if (!service) {
    return <div className="p-6 text-zinc-400">Servicio no encontrado.</div>
  }

  return (
    <div className="space-y-6">
      <BackButton label="Volver" />

      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-white">{service.name}</h1>
        <EditServiceButton service={service} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Información</CardTitle>
            <Layers className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Nombre:</span>
                <span className="text-white font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Descripción:</span>
                <span className="text-white font-medium">{service.description || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Creado:</span>
                <span className="text-white font-medium">{formatDate(service.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Precio</CardTitle>
            <DollarSign className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">${Number(service.defaultPrice).toFixed(2)}</div>
            <p className="text-xs text-zinc-500 mt-1">Precio base del servicio</p>
          </CardContent>
        </Card>

        {service.company && (
          <Card className="bg-black/40 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Empresa</CardTitle>
              <Building2 className="w-4 h-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              {session.user.role === "SUPER_ADMIN" ? (
                <Link href={`/empresas/${service.company.id}`} className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                  {service.company.name}
                </Link>
              ) : (
                <div className="text-xl font-bold text-white">{service.company.name}</div>
              )}
              <p className="text-xs text-zinc-500 mt-1">Empresa propietaria</p>
            </CardContent>
          </Card>
        )}
      </div>

      <p className="text-xs text-zinc-600 text-center">Servicio creado el {formatDate(service.createdAt)}</p>
    </div>
  )
}
