import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCompanyById } from "@/actions/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, FileText, LayoutDashboard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const { id } = await params
  const company = await getCompanyById(id)

  if (!company) {
    redirect("/dashboard/companies")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/companies" className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Información General</CardTitle>
            <Building2 className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Slug:</span>
                <span className="text-white font-medium">{company.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">RUC:</span>
                <span className="text-white font-medium">{company.ruc || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">DV:</span>
                <span className="text-white font-medium">{company.dv || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Creada:</span>
                <span className="text-white font-medium">{new Date(company.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Volumen</CardTitle>
            <FileText className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">${Number(company.volume).toLocaleString('es-PA', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-zinc-500 mt-1">
              Volumen total facturado
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
              <span className="text-zinc-500">Facturas emitidas:</span>
              <span className="text-white font-medium">{company._count.invoices}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Catálogos</CardTitle>
            <LayoutDashboard className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-white">{company._count.clients}</div>
                <p className="text-xs text-zinc-500 mt-1">Clientes registrados</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{company._count.services}</div>
                <p className="text-xs text-zinc-500 mt-1">Servicios registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Usuarios Asignados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10">
                <TableHead className="text-zinc-400 font-medium pl-6">Nombre</TableHead>
                <TableHead className="text-zinc-400 font-medium">Correo Electrónico</TableHead>
                <TableHead className="text-zinc-400 font-medium">Rol en Sistema</TableHead>
                <TableHead className="text-zinc-400 font-medium">Rol en Empresa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.userCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                    No hay usuarios asignados a esta empresa
                  </TableCell>
                </TableRow>
              ) : (
                company.userCompanies.map((uc) => (
                  <TableRow key={uc.userId} className="border-white/10">
                    <TableCell className="font-medium text-white pl-6">{uc.user.name || "-"}</TableCell>
                    <TableCell className="text-zinc-300">{uc.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-zinc-300 border-white/20">
                        {uc.user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {uc.roleInCompany}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
