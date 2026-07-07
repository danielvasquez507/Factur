import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getClients } from "@/actions/clients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientTable } from "@/components/clients/client-table"
import { ClientDialog } from "@/components/clients/client-dialog"
import { getActiveTenantId } from "@/actions/tenant"
import { Users, CirclePlus } from "lucide-react"

export default async function ClientsPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) {
    return <div className="p-6 text-zinc-400">Por favor, selecciona una empresa en la barra superior para ver los clientes.</div>
  }

  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">Clientes</h1>
          <span className="text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">{clients.length}</span>
        </div>
        <ClientDialog />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md [--card-spacing:0px]">
        <CardContent className="p-0">
          <ClientTable clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
