import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { getServices } from "@/actions/services"
import { getClientSubscriptions } from "@/actions/subscriptions"
import { getClientInvoices } from "@/actions/clients"
import { getClientContracts } from "@/actions/contracts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { ClickableTableRow } from "@/components/ui/clickable-table-row"
import { ClientSubscriptions } from "@/components/clients/client-subscriptions"
import { AssignServiceDialog } from "@/components/clients/assign-service-dialog"
import { EditClientButton } from "@/components/clients/edit-client-button"
import { Smartphone, Mail, Phone, MapPin, UserCheck, Receipt, CirclePlus, Link2, Layers, FileText } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

const statusLabel: Record<string, string> = {
  ISSUED: "Emitida",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
  OVERDUE: "Vencida",
}

const statusColor: Record<string, string> = {
  ISSUED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PAID: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-500 border-red-500/30",
  OVERDUE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

export default async function ClientDetailsPage(
  props: { params: Promise<{ clientId: string }> }
) {
  const params = await props.params;
  const session = await auth()
  if (!session?.user) redirect("/login")

  let client
  if (session.user.role === "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    client = await prisma.client.findUnique({
      where: { id: params.clientId }
    })
  } else {
    const activeTenantId = await getActiveTenantId()
    if (!activeTenantId) redirect("/clientes")
    const prisma = getTenantPrisma(activeTenantId)
    client = await prisma.client.findUnique({
      where: { id: params.clientId, companyId: activeTenantId }
    })
  }

  if (!client) {
    return <div className="p-6 text-zinc-400">Cliente no encontrado.</div>
  }

  const [services, subscriptions, invoices, contracts] = await Promise.all([
    getServices(),
    getClientSubscriptions(client.id),
    getClientInvoices(client.id),
    getClientContracts(client.id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <BackButton label="Volver" />
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">{client.name}</h1>
          {client.isActive ? (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20">Activo</Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">Inactivo</Badge>
          )}
          <EditClientButton client={client} />
        </div>
      </div>

      {/* Información del Cliente */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Smartphone className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Celular</p>
                <p className="text-white font-medium">{client.celular}</p>
              </div>
            </div>
            {client.email && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Correo</p>
                  <p className="text-white font-medium break-all">{client.email}</p>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Teléfono</p>
                  <p className="text-white font-medium">{client.phone}</p>
                </div>
              </div>
            )}
            {client.direccion && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Dirección</p>
                  <p className="text-white font-medium">{client.direccion}</p>
                </div>
              </div>
            )}
            {client.authorizedPersons && (client.authorizedPersons as string[]).length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 sm:col-span-2 lg:col-span-3">
                <UserCheck className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Personas Autorizadas</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(client.authorizedPersons as string[]).map((person: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-white/10 text-zinc-300 font-normal">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Servicios Asignados */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="text-zinc-300">Servicios Asignados</span>
            <span className="ml-2 text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">{subscriptions.length}</span>
            <span className="ml-2 text-sm font-semibold text-emerald-400">${subscriptions.reduce((sum, s) => sum + Number(s.agreedPrice), 0).toFixed(2)}</span>
            <div className="ml-auto flex items-center gap-1">
              <AssignServiceDialog clientId={client.id} services={services} trigger={
                <button type="button" title="Asignar servicio existente" className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-blue-400 transition-colors">
                  <Link2 className="w-4 h-4" />
                </button>
              } />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ClientSubscriptions subscriptions={subscriptions} />
        </CardContent>
      </Card>

      {/* Botones de Acción Principal */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Link href={`/facturas/new?clientId=${client.id}`} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 h-11 px-8 text-base">
            <Receipt className="w-5 h-5 mr-2" />
            Generar Factura
          </Button>
        </Link>
        <Link href={`/contratos/new?clientId=${client.id}`} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-zinc-300 h-11 px-8 text-base">
            <FileText className="w-5 h-5 mr-2" />
            Generar Contrato
          </Button>
        </Link>
      </div>

      {/* Facturas Emitidas */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            Facturas Emitidas
            <Link href={`/facturas/new?clientId=${client.id}`} title="Nueva factura" className="ml-auto text-zinc-500 hover:text-emerald-400 transition-colors">
              <CirclePlus className="w-5 h-5" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Sin facturas</h3>
              <p className="text-zinc-400 text-sm max-w-sm">Este cliente aún no tiene facturas emitidas.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-md">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/10">
                    <th className="text-zinc-400 font-medium text-left h-10 px-4">N° Factura</th>
                    <th className="text-zinc-400 font-medium text-left h-10 px-4">Fecha</th>
                    <th className="text-zinc-400 font-medium text-left h-10 px-4 hidden sm:table-cell">Vencimiento</th>
                    <th className="text-zinc-400 font-medium text-right h-10 px-4">Total</th>
                    <th className="text-zinc-400 font-medium text-center h-10 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <ClickableTableRow key={inv.id} href={`/facturas/${inv.id}`} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 text-zinc-400">{formatDate(inv.issueDate)}</td>
                      <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">
                        {inv.dueDate ? formatDate(inv.dueDate) : "-"}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold text-right">${inv.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === "PAID" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                          inv.status === "DRAFT" ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20" :
                          "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>
                          {inv.status === "PAID" ? "Pagada" : inv.status === "DRAFT" ? "Borrador" : "Pendiente"}
                        </span>
                      </td>
                    </ClickableTableRow>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Contratos */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Historial de Contratos
            <Link href={`/contratos/new?clientId=${client.id}`} title="Nuevo contrato" className="ml-auto text-zinc-500 hover:text-emerald-400 transition-colors">
              <CirclePlus className="w-5 h-5" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Sin contratos</h3>
              <p className="text-zinc-400 text-sm max-w-sm">Este cliente aún no tiene contratos generados.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-md">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/10">
                    <th className="text-zinc-400 font-medium text-left h-10 px-4">Título</th>
                    <th className="text-zinc-400 font-medium text-left h-10 px-4">Servicio</th>
                    <th className="text-zinc-400 font-medium text-left h-10 px-4 hidden sm:table-cell">Fecha Inicio</th>
                    <th className="text-zinc-400 font-medium text-center h-10 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <ClickableTableRow key={contract.id} href={`/contratos/${contract.id}`} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">
                        {contract.title}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {contract.clientService ? contract.clientService.service.name : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">
                        {formatDate(contract.startDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`${
                          contract.status === "ACTIVE" ? "bg-green-500/20 text-green-400 border-green-500/30" : 
                          contract.status === "DRAFT" ? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" : 
                          contract.status === "EXPIRED" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : 
                          "bg-red-500/20 text-red-400 border-red-500/30"
                        } border text-xs`}>
                          {contract.status === "ACTIVE" ? "Activo" : contract.status === "DRAFT" ? "Borrador" : contract.status === "EXPIRED" ? "Vencido" : "Cancelado"}
                        </Badge>
                      </td>
                    </ClickableTableRow>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
