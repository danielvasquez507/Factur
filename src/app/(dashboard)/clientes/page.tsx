import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getClients } from "@/actions/clients"
import { getServices } from "@/actions/services"
import { Card, CardContent } from "@/components/ui/card"
import { ClientTable } from "@/components/clients/client-table"
import { ClientDialog } from "@/components/clients/client-dialog"
import { ServiceTable } from "@/components/services/service-table"
import { ServiceDialog } from "@/components/services/service-dialog"
import { getActiveTenantId } from "@/actions/tenant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Layers } from "lucide-react"

export default async function ClientsPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) {
    return <div className="p-6 text-zinc-400">Por favor, selecciona una empresa en la barra superior para ver los clientes.</div>
  }

  const [clients, rawServices] = await Promise.all([
    getClients(),
    getServices()
  ])

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
          <h1 className="text-3xl font-bold tracking-tight text-white">Directorio</h1>
          <p className="text-zinc-400">Gestiona tus clientes y el catálogo de servicios.</p>
        </div>
      </div>

      <Tabs defaultValue="clientes" className="w-full">
        <TabsList className="bg-black/40 border border-white/5 backdrop-blur-xl mb-6 p-0 rounded-2xl flex w-max max-w-full overflow-x-auto gap-1 shadow-2xl no-scrollbar h-auto">
          <TabsTrigger value="clientes" className="relative group flex-1 sm:flex-none items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-active:bg-blue-600 data-active:text-white data-active:shadow-[0_4px_20px_rgba(37,99,235,0.4)] text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border-none h-auto">
            <Users className="w-4 h-4 mr-2.5 opacity-80 group-data-active:opacity-100" />
            Clientes
            <span className="ml-2.5 text-[10px] tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/5 text-white shadow-inner group-data-active:bg-white/20">{clients.length}</span>
          </TabsTrigger>
          <TabsTrigger value="servicios" className="relative group flex-1 sm:flex-none items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-active:bg-blue-600 data-active:text-white data-active:shadow-[0_4px_20px_rgba(37,99,235,0.4)] text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border-none h-auto">
            <Layers className="w-4 h-4 mr-2.5 opacity-80 group-data-active:opacity-100" />
            Servicios
            <span className="ml-2.5 text-[10px] tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/5 text-white shadow-inner group-data-active:bg-white/20">{services.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clientes" className="mt-0 space-y-4">
          <div className="flex justify-end">
            <ClientDialog />
          </div>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
            <CardContent className="p-0">
              <ClientTable clients={clients} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="servicios" className="mt-0 space-y-4">
          <div className="flex justify-end">
            <ServiceDialog />
          </div>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
            <CardContent className="p-0">
              <ServiceTable services={services} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
