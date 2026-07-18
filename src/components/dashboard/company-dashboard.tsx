import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign } from "lucide-react"
import { getCompanyMetrics } from "@/actions/dashboard"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { RevenueChart } from "@/components/dashboard/lazy-revenue-chart"

export async function CompanyDashboard({ tenantId }: { tenantId?: string }) {
  const data = await getCompanyMetrics(tenantId)
  
  if ('noTenant' in data && data.noTenant) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 mb-4">
          <Users className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Bienvenido a Factur DV</h2>
        <p className="text-zinc-400 max-w-md">
          Tu cuenta ha sido creada exitosamente, pero aún no tienes una empresa asignada. 
          Contacta con el administrador del sistema para que te asigne a una empresa.
        </p>
      </div>
    )
  }

  const { companyName, stats, chartData, recentInvoices } = data

  const formatCurrency = (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`

  return (
    <div className="space-y-6">
      {tenantId ? (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Métricas: {companyName}</h2>
          <p className="text-zinc-400 text-sm">Vista aislada de empresa (Super Admin)</p>
        </div>
      ) : (
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">{companyName}</h1>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-purple-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-purple-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-purple-300 transition-colors">Clientes Activos</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 drop-shadow-sm">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-blue-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-blue-300 transition-colors">Servicios</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 drop-shadow-sm">{stats.totalServices}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-emerald-500/50 group !p-0 col-span-2 md:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors" title="Facturación">Facturas Emitidas</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-200 drop-shadow-sm flex items-center flex-wrap gap-x-1"><span className="shrink-0">{formatCurrency(stats.incomeThisMonth).replace(' USD', '')}</span><span className="text-base lg:text-lg font-bold text-emerald-500/70 mt-1">USD</span></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-full bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white" title="Facturación">Facturas emitidas (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-full bg-black/40 border-white/10 backdrop-blur-md overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">Facturas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {recentInvoices.map(invoice => (
                <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white leading-none">{invoice.client.name}</p>
                    <p className="text-xs text-zinc-500">FAC-{String(invoice.invoiceNumber).padStart(6, '0')} • {format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(invoice.total)}</p>
                  </div>
                </div>
              ))}
              {recentInvoices.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">No hay facturas recientes</div>
              )}
            </div>
            {recentInvoices.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center">
                <Link href="/facturas" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Ver todas las facturas</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
