import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCompanyById } from "@/actions/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Layers, Phone, UserCheck, FileText, Hash, ScrollText, CirclePlus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { ClientDialog } from "@/components/clients/client-dialog"
import { ServiceDialog } from "@/components/services/service-dialog"

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/")
  }

  const { id } = await params
  const company = await getCompanyById(id)

  if (!company) {
    redirect("/empresas")
  }

  const owner = company.userCompanies?.find((uc: any) => uc.roleInCompany === "OWNER")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        {company.logoUrl && (
          <img 
            src={company.logoUrl} 
            alt={`Logo de ${company.name}`}
            className="h-16 w-auto object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {company.name}
            <Badge variant={company.isActive ? "default" : "secondary"} className={company.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}>
              {company.isActive ? "Activa" : "Inactiva"}
            </Badge>
          </h1>
          <p className="text-zinc-400 mt-1">Detalles y estadísticas de la empresa</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
              <Building2 className="w-5 h-5 text-blue-400" />
              Información
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <ScrollText className="w-3.5 h-3.5 text-zinc-500" />
                  Ruc
                </span>
                <span className="text-white font-mono font-medium">{company.ruc || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-zinc-500" />
                  Dv
                </span>
                <span className="text-white font-mono font-medium">{company.dv || "—"}</span>
              </div>
              {owner && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                    Dueño
                  </span>
                  <Link href={`/usuarios/${owner.user.id}`} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-medium">
                    {owner.user.name}
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
              <FileText className="w-5 h-5 text-emerald-400" />
              Facturación
              <span className="text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">{company._count.invoices}</span>
            </CardTitle>
            <Link href={`/facturas/new?companyId=${id}`} title="Generar factura" className="text-zinc-500 hover:text-emerald-400 transition-colors">
              <CirclePlus className="w-5 h-5" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-emerald-400">${Number(company.volume).toLocaleString('es-PA', { minimumFractionDigits: 2 })}</div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3 block">
                Historial de facturación
              </span>
              {company.recentInvoices.length === 0 ? (
                <p className="text-zinc-600 text-sm text-center py-4">No hay facturas registradas</p>
              ) : (
                <div className="space-y-1">
                  {company.recentInvoices.map((inv: any) => {
                    const statusLabels: Record<string, string> = { ISSUED: "Emitida", PAID: "Pagada", VOID: "Anulada" }
                    const statusColors: Record<string, string> = { ISSUED: "text-yellow-400", PAID: "text-emerald-400", VOID: "text-red-400" }
                    return (
                      <Link
                        key={inv.id}
                        href={`/facturas/${inv.id}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-white font-medium truncate">
                            FAC-{String(inv.invoiceNumber).padStart(6, "0")}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>{formatDate(inv.issueDate)}</span>
                            <span>·</span>
                            <span className="truncate">{inv.client.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-semibold text-white">
                            ${Number(inv.total).toLocaleString('es-PA', { minimumFractionDigits: 2 })}
                          </span>
                          <span className={`text-xs font-medium ${statusColors[inv.status] || "text-zinc-400"}`}>
                            {statusLabels[inv.status] || inv.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            <Users className="w-5 h-5 text-blue-400" />
            Clientes
            <span className="ml-2 text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">{company._count.clients}</span>
            <ClientDialog companyId={id} trigger={
              <button type="button" title="Nuevo cliente" className="ml-auto text-zinc-500 hover:text-blue-400 transition-colors">
                <CirclePlus className="w-5 h-5" />
              </button>
            } />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10">
                <TableHead className="text-zinc-400 font-medium pl-6">Nombre</TableHead>
                <TableHead className="text-zinc-400 font-medium">Celular</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-zinc-500 py-8">
                    No hay clientes registrados
                  </TableCell>
                </TableRow>
              ) : (
                company.clients.map((client: any) => (
                  <TableRow key={client.id} className="border-white/10">
                    <TableCell className="font-medium pl-6">
                      <Link href={`/clientes/${client.id}`} className="text-white hover:text-blue-400 transition-colors">
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-zinc-800/60 flex items-center justify-center">
                          <Phone className="w-3 h-3 text-zinc-400" />
                        </div>
                        {client.celular || "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Servicios */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            <Layers className="w-5 h-5 text-blue-400" />
            Servicios
            <span className="ml-2 text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">{company._count.services}</span>
            <ServiceDialog companyId={id} trigger={
              <button type="button" title="Nuevo servicio" className="ml-auto text-zinc-500 hover:text-blue-400 transition-colors">
                <CirclePlus className="w-5 h-5" />
              </button>
            } />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10">
                <TableHead className="text-zinc-400 font-medium pl-6">Nombre</TableHead>
                <TableHead className="text-zinc-400 font-medium">Precio Base</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-zinc-500 py-8">
                    No hay servicios registrados
                  </TableCell>
                </TableRow>
              ) : (
                company.services.map((service: any) => (
                  <TableRow key={service.id} className="border-white/10">
                    <TableCell className="font-medium pl-6">
                      <Link href={`/servicios/${service.id}`} className="text-white hover:text-blue-400 transition-colors">
                        {service.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-zinc-300 font-semibold">
                      ${Number(service.defaultPrice).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-zinc-600 text-center">Empresa creada el {formatDate(company.createdAt)}</p>
    </div>
  )
}
