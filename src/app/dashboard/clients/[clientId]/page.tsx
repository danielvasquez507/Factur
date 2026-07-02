import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { getServices } from "@/actions/services"
import { getClientSubscriptions } from "@/actions/subscriptions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientSubscriptions } from "@/components/clients/client-subscriptions"
import { AssignServiceDialog } from "@/components/clients/assign-service-dialog"
import { ArrowLeft, User, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default async function ClientDetailsPage(
  props: { params: Promise<{ clientId: string }> }
) {
  const params = await props.params;
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) redirect("/dashboard/clients")

  const prisma = getTenantPrisma(activeTenantId)
  const client = await prisma.client.findUnique({
    where: { id: params.clientId }
  })

  if (!client) {
    return <div className="p-6 text-zinc-400">Cliente no encontrado.</div>
  }

  const services = await getServices()
  const subscriptions = await getClientSubscriptions(client.id)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/clients" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a Clientes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{client.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
              {client.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {client.email}</span>}
              {client.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.phone}</span>}
            </div>
          </div>
          <AssignServiceDialog clientId={client.id} services={services} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Servicios Asignados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClientSubscriptions subscriptions={subscriptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
