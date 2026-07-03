"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, FileText, Package, Loader2 } from "lucide-react"
import { getGlobalCompanies, getGlobalClients, getGlobalServices, getGlobalInvoices } from "@/actions/admin"

export function GlobalPanel() {
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>("all")

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

  if (loading) {
    return (
      <Card className="bg-zinc-950/80 border-white/10 mb-6">
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </CardContent>
      </Card>
    )
  }

  const filteredClients = selectedTenant === "all" ? clients : clients.filter(c => c.companyId === selectedTenant)
  const filteredServices = selectedTenant === "all" ? services : services.filter(s => s.companyId === selectedTenant)
  const filteredInvoices = selectedTenant === "all" ? invoices : invoices.filter(i => i.companyId === selectedTenant)

  return (
    <Card className="bg-zinc-950/80 border-white/10 mb-8 shadow-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-purple-400" />
            Panel de Control Global
          </CardTitle>
          <p className="text-sm text-zinc-400 mt-1">Inspección de datos inter-empresas con evasión de RLS</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-zinc-500" />
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-full sm:w-[250px] bg-black/50 border-white/10 text-white">
              <SelectValue placeholder="Filtrar por Empresa" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 text-white">
              <SelectItem value="all">Todas las Empresas</SelectItem>
              {companies.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="invoices" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="bg-black/40 border border-white/10">
              <TabsTrigger value="invoices" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"><FileText className="w-4 h-4 mr-2"/> Facturas ({filteredInvoices.length})</TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"><Users className="w-4 h-4 mr-2"/> Clientes ({filteredClients.length})</TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"><Package className="w-4 h-4 mr-2"/> Servicios ({filteredServices.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices" className="p-4 m-0">
            <div className="rounded-md border border-white/10 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">N° Factura</th>
                    <th className="px-4 py-3 font-medium">Empresa</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No hay facturas registradas.</td></tr>}
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">FAC-{String(inv.invoiceNumber).padStart(6, '0')}</td>
                      <td className="px-4 py-3 text-purple-300">{inv.company?.name}</td>
                      <td className="px-4 py-3">{inv.client?.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-bold">${Number(inv.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="p-4 m-0">
            <div className="rounded-md border border-white/10 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Empresa Perteneciente</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Teléfono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredClients.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">No hay clientes registrados.</td></tr>}
                  {filteredClients.map(cli => (
                    <tr key={cli.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{cli.name}</td>
                      <td className="px-4 py-3 text-purple-300">{cli.company?.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{cli.email || '-'}</td>
                      <td className="px-4 py-3 text-zinc-400">{cli.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="services" className="p-4 m-0">
            <div className="rounded-md border border-white/10 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nombre de Servicio</th>
                    <th className="px-4 py-3 font-medium">Empresa Perteneciente</th>
                    <th className="px-4 py-3 font-medium">Precio Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredServices.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-zinc-500">No hay servicios registrados.</td></tr>}
                  {filteredServices.map(srv => (
                    <tr key={srv.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{srv.name}</td>
                      <td className="px-4 py-3 text-purple-300">{srv.company?.name}</td>
                      <td className="px-4 py-3 text-zinc-400">${Number(srv.defaultPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  )
}

function GlobeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  )
}
