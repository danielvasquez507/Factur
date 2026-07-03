import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Activity, Globe, FileText, Receipt, Package } from "lucide-react"
import { getGlobalMetrics } from "@/actions/dashboard"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"

import { RevenueChart } from "@/components/dashboard/lazy-revenue-chart"
import { GlobalPanel } from "@/components/admin/global-panel"

export async function SuperAdminDashboard() {
  const data = await getGlobalMetrics()
  const { stats, recentCompanies } = data

  const formatCurrency = (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`

  return (
    <div className="space-y-6">
      <GlobalPanel />

      <div className="mb-6">
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">Acceso Global</Badge>
        <h2 className="text-2xl font-bold text-white">Métricas de Plataforma</h2>
        <p className="text-zinc-400 text-sm">Vista general de todas las instancias y empresas registradas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-purple-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-purple-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-purple-300 transition-colors">Empresas (Tenants)</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 drop-shadow-sm">{stats.totalCompanies}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-blue-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-blue-300 transition-colors">Usuarios Totales</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 drop-shadow-sm">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-emerald-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors">Volumen Global Facturado</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-200 drop-shadow-sm flex items-center flex-wrap gap-x-1"><span className="shrink-0">{formatCurrency(stats.globalVolume).replace(' USD', '')}</span><span className="text-base lg:text-lg font-bold text-emerald-500/70 mt-1">USD</span></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-amber-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-amber-300 transition-colors">Total Clientes B2B</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-200 drop-shadow-sm">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-pink-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-pink-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-pink-300 transition-colors">Total Servicios</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)] group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200 drop-shadow-sm">{stats.totalServices}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-cyan-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-cyan-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-cyan-300 transition-colors">Total Facturas</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-sm">{stats.totalInvoicesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-zinc-400" />
            Métricas por Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {recentCompanies.length > 0 && (
              <div className="hidden sm:flex items-center justify-between p-4 pb-3 border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-500">
                <div className="w-1/4">Empresa</div>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <div className="border-l border-white/10 pl-4">Clientes</div>
                  <div className="border-l border-white/10 pl-4">Servicios</div>
                  <div className="border-l border-white/10 pl-4">Facturas</div>
                  <div className="border-l border-white/10 pl-4">Volumen</div>
                </div>
                <div className="w-[100px]"></div>
              </div>
            )}
            {recentCompanies.map(company => (
              <Link href={`/dashboard/tenant/${company.id}`} key={company.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors group block">
                <div className="flex items-center gap-3 sm:w-1/4 shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5 text-zinc-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">{company.name}</p>
                </div>
                
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 items-center mt-2 sm:mt-0">
                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1">Clientes</span>
                    <span className="text-sm font-medium text-white">{company.clientCount}</span>
                  </div>
                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1">Servicios</span>
                    <span className="text-sm font-medium text-white">{company.serviceCount}</span>
                  </div>
                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1">Facturas</span>
                    <span className="text-sm font-medium text-white">{company.invoiceCount}</span>
                  </div>
                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1">Volumen</span>
                    <span className="text-sm font-bold text-emerald-400">{formatCurrency(company.volume)}</span>
                  </div>
                </div>

                <div className="text-zinc-500 text-xs flex items-center justify-end gap-1 group-hover:text-blue-400 sm:w-[100px] shrink-0 mt-2 sm:mt-0">
                  Ver Detalles &rarr;
                </div>
              </Link>
            ))}
            {recentCompanies.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No hay empresas registradas</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
