import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Activity, Globe, Receipt, Package } from "lucide-react"
import { getGlobalMetrics } from "@/actions/dashboard"
import Link from "next/link"

import { GlobalPanel } from "@/components/admin/global-panel"

export async function SuperAdminDashboard() {
  const data = await getGlobalMetrics()
  const { stats, recentCompanies } = data

  const formatCurrency = (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Métricas</h2>
        <p className="text-zinc-400 text-sm">Vista general de todas las instancias y empresas registradas.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-purple-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-purple-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-opacity"></div>
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
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-opacity"></div>
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

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-amber-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-opacity"></div>
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

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-violet-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-violet-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-violet-300 transition-colors">Total Servicios</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3 relative z-10">
            <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-violet-200 drop-shadow-sm">{stats.totalServices}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-cyan-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-cyan-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-opacity"></div>
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

        <Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-emerald-500/50 group !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-opacity"></div>
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
      </div>

      <Card className="bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative group/metrics">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        <CardHeader className="border-b border-white/5 bg-white/[0.02] relative z-10">
          <CardTitle className="text-white flex items-center gap-3 text-lg font-bold">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover/metrics:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow duration-500">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            Rendimiento por Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <div className="divide-y divide-white/5">
            {recentCompanies.length > 0 && (
              <div className="hidden sm:flex items-center justify-between p-4 pb-3 bg-white/[0.01] text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                <div className="w-1/4 pl-2">Empresa</div>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <div className="pl-4">Clientes</div>
                  <div className="pl-4">Servicios</div>
                  <div className="pl-4">Facturas</div>
                  <div className="pl-4">Volumen</div>
                </div>
              </div>
            )}
            {recentCompanies.map(company => (
              <Link href={`/inquilino/${company.id}`} key={company.id} className="py-2.5 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.04] transition-all duration-300 group block relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                
                <div className="flex items-center gap-3 sm:w-1/4 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:shadow-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-blue-500/10 transition-opacity"></div>
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10 ${company.logoWhiteBackground ? "bg-white p-1" : ""}`} />
                    ) : (
                      <Building2 className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors duration-300 relative z-10" />
                    )}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors truncate">{company.name}</p>
                    <p className="text-xs text-zinc-500 group-hover:text-blue-400/80 transition-colors">Ver panel</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 items-center mt-3 sm:mt-0 bg-white/[0.02] sm:bg-transparent rounded-lg p-2 sm:p-0 border border-white/5 sm:border-none">
                  <div className="sm:pl-4 flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Clientes</span>
                    <span className="text-lg sm:text-base font-semibold text-zinc-300 group-hover:text-white transition-colors">{company.clientCount}</span>
                  </div>
                  <div className="sm:pl-4 flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1 flex items-center gap-1"><Package className="w-3 h-3"/> Servicios</span>
                    <span className="text-lg sm:text-base font-semibold text-zinc-300 group-hover:text-white transition-colors">{company.serviceCount}</span>
                  </div>
                  <div className="sm:pl-4 flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1 flex items-center gap-1"><Receipt className="w-3 h-3"/> Facturas</span>
                    <span className="text-lg sm:text-base font-semibold text-zinc-300 group-hover:text-white transition-colors">{company.invoiceCount}</span>
                  </div>
                  <div className="sm:pl-4 flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block sm:hidden mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> Volumen</span>
                    <span className="text-lg sm:text-base font-black text-emerald-400 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all">{formatCurrency(company.volume)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end w-4 sm:w-6 shrink-0 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </Link>
            ))}
            {recentCompanies.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none"></div>
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                  <Building2 className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-zinc-300 font-medium text-lg">No hay empresas registradas</p>
                <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">Las empresas creadas aparecerán aquí con sus métricas clave actualizadas en tiempo real.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <GlobalPanel />
    </div>
  )
}
