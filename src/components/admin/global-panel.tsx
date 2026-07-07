"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, FileText, Package, Loader2, Search, ExternalLink, Eye } from "lucide-react"
import { getGlobalCompanies, getGlobalClients, getGlobalServices, getGlobalInvoices } from "@/actions/admin"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const MAX_VISIBLE = 6

export function GlobalPanel() {
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const [compData, cliData, servData, invData] = await Promise.all([
          getGlobalCompanies(),
          getGlobalClients(),
          getGlobalServices(),
          getGlobalInvoices()
        ])
        setCompanies(compData)
        setClients(cliData)
        setServices(servData)
        setInvoices(invData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredByTenant = (items: any[], tenantKey: string) =>
    selectedTenant === "all" ? items : items.filter((i: any) => i[tenantKey]?.id === selectedTenant)

  const filteredInvoices = useMemo(() => {
    const byTenant = filteredByTenant(invoices, "company")
    if (!searchQuery) return byTenant
    const q = searchQuery.toLowerCase()
    return byTenant.filter(inv =>
      String(inv.invoiceNumber).includes(q) ||
      inv.client?.name?.toLowerCase().includes(q) ||
      inv.company?.name?.toLowerCase().includes(q)
    )
  }, [invoices, selectedTenant, searchQuery])

  const filteredClients = useMemo(() => {
    const byTenant = filteredByTenant(clients, "company")
    if (!searchQuery) return byTenant
    const q = searchQuery.toLowerCase()
    return byTenant.filter(cli =>
      cli.name?.toLowerCase().includes(q) ||
      cli.email?.toLowerCase().includes(q) ||
      cli.company?.name?.toLowerCase().includes(q)
    )
  }, [clients, selectedTenant, searchQuery])

  const filteredServices = useMemo(() => {
    const byTenant = filteredByTenant(services, "company")
    if (!searchQuery) return byTenant
    const q = searchQuery.toLowerCase()
    return byTenant.filter(srv =>
      srv.name?.toLowerCase().includes(q) ||
      srv.company?.name?.toLowerCase().includes(q)
    )
  }, [services, selectedTenant, searchQuery])

  if (loading) {
    return (
      <Card className="bg-zinc-950/80 border-white/10 mb-6">
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader className="flex flex-col gap-3 pb-4 border-b border-white/10">
        <div className="flex flex-col gap-3">
          <CardTitle className="text-xl font-bold text-white">
            Panel de Control Global
          </CardTitle>
          <Select value={selectedTenant} onValueChange={(val) => setSelectedTenant(val ?? "all")}>
            <SelectTrigger className="!w-full bg-black/50 border-white/10 text-white h-9">
              <Building2 className="w-4 h-4 text-zinc-500 shrink-0" />
              <SelectValue placeholder="Filtrar por Empresa" className="w-full">
                {selectedTenant === "all" ? "Todas las Empresas" : companies.find(c => c.id === selectedTenant)?.name || selectedTenant}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="bg-zinc-950 border-white/10 text-white w-full">
              <SelectItem value="all">Todas las Empresas</SelectItem>
              {companies.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Buscar por nombre, empresa, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border-white/10 text-white pl-9 h-9 text-sm placeholder:text-zinc-600"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="invoices" className="w-full" onValueChange={() => setSearchQuery("")}>
          <div className="px-4 pt-4">
            <TabsList className="bg-black/40 border border-white/10 w-full sm:w-auto">
              <TabsTrigger value="invoices" className="flex-1 sm:flex-none data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-xs sm:text-sm">
                <FileText className="w-3.5 h-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Facturas</span>
                <span className="sm:hidden">Fac</span>
                <span className="ml-1">({filteredInvoices.length})</span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex-1 sm:flex-none data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-xs sm:text-sm">
                <Users className="w-3.5 h-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Clientes</span>
                <span className="sm:hidden">Cli</span>
                <span className="ml-1">({filteredClients.length})</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex-1 sm:flex-none data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 text-xs sm:text-sm">
                <Package className="w-3.5 h-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Servicios</span>
                <span className="sm:hidden">Ser</span>
                <span className="ml-1">({filteredServices.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices" className="p-0 m-0">
            <div className="divide-y divide-white/5">
              {filteredInvoices.length === 0 && (
                <div className="px-4 py-8 text-center text-zinc-500 text-sm">No hay facturas registradas.</div>
              )}
              {filteredInvoices.slice(0, MAX_VISIBLE).map(inv => (
                <Link
                  key={inv.id}
                  href={`/facturas/${inv.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        FAC-{String(inv.invoiceNumber).padStart(6, '0')}
                      </span>
                      <span className="text-xs text-purple-400 truncate">{inv.company?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>{inv.client?.name}</span>
                      <span>•</span>
                      <span>{formatDate(inv.issueDate)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white">${Number(inv.total).toFixed(2)}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                </Link>
              ))}
              {filteredInvoices.length > MAX_VISIBLE && (
                <Link href="/facturas" className="block px-4 py-3 text-center text-sm text-purple-400 hover:text-purple-300 hover:bg-white/5 transition-colors font-medium">
                  Ver todas las facturas ({filteredInvoices.length - MAX_VISIBLE} más)
                </Link>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="p-0 m-0">
            <div className="divide-y divide-white/5">
              {filteredClients.length === 0 && (
                <div className="px-4 py-8 text-center text-zinc-500 text-sm">No hay clientes registrados.</div>
              )}
              {filteredClients.slice(0, MAX_VISIBLE).map(cli => (
                <Link
                  key={cli.id}
                  href={`/clientes/${cli.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{cli.name}</span>
                      <span className="text-xs text-blue-400 truncate">{cli.company?.name}</span>
                    </div>
                    <div className="text-xs text-zinc-500 truncate">{cli.email || cli.phone || "-"}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                </Link>
              ))}
              {filteredClients.length > MAX_VISIBLE && (
                <Link href="/clientes" className="block px-4 py-3 text-center text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors font-medium">
                  Ver todos los clientes ({filteredClients.length - MAX_VISIBLE} más)
                </Link>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services" className="p-0 m-0">
            <div className="divide-y divide-white/5">
              {filteredServices.length === 0 && (
                <div className="px-4 py-8 text-center text-zinc-500 text-sm">No hay servicios registrados.</div>
              )}
              {filteredServices.slice(0, MAX_VISIBLE).map(srv => (
                <Link
                  key={srv.id}
                  href={`/servicios/${srv.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{srv.name}</span>
                      <span className="text-xs text-emerald-400 truncate">{srv.company?.name}</span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      ${Number(srv.defaultPrice).toFixed(2)} / mes
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                </Link>
              ))}
              {filteredServices.length > MAX_VISIBLE && (
                <Link href="/servicios" className="block px-4 py-3 text-center text-sm text-emerald-400 hover:text-emerald-300 hover:bg-white/5 transition-colors font-medium">
                  Ver todos los servicios ({filteredServices.length - MAX_VISIBLE} más)
                </Link>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
