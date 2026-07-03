"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, DollarSign, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsDashboard({ initialTaxData, initialTopClients }: { initialTaxData: any[], initialTopClients: any[] }) {
  
  const formatCurrency = (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  // Calcular totales para los cuadros de mando
  const totalInvoiced = initialTaxData.reduce((acc, inv) => acc + Number(inv.total), 0)
  const totalITBMS = initialTaxData.reduce((acc, inv) => acc + Number(inv.taxAmount), 0)

  // Función para exportar a CSV
  const exportToCSV = () => {
    // Cabeceras
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "N Factura,Cliente,Fecha,Subtotal,ITBMS,Total,Estado\n"
    
    // Filas
    initialTaxData.forEach(row => {
      const invNum = `FAC-${String(row.invoiceNumber).padStart(6, '0')}`
      const client = `"${row.client.name.replace(/"/g, '""')}"`
      const date = new Date(row.issueDate).toLocaleDateString()
      csvContent += `${invNum},${client},${date},${row.subtotal},${row.taxAmount},${row.total},${row.status}\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "reporte_impuestos.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Facturado (Mes)</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalInvoiced)}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total ITBMS Recaudado</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalITBMS)}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Facturas Emitidas</CardTitle>
            <FileIcon className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{initialTaxData.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Análisis Detallado</CardTitle>
          <Button onClick={exportToCSV} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Exportar a CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="taxes" className="w-full">
            <TabsList className="bg-black/40 border border-white/10 mb-4">
              <TabsTrigger value="taxes" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                Resumen ITBMS / IVA
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                Mejores Clientes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="taxes" className="m-0">
              <div className="rounded-md border border-white/10 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Factura</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                      <th className="px-4 py-3 font-medium text-right">ITBMS</th>
                      <th className="px-4 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {initialTaxData.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500">No hay datos para mostrar.</td></tr>}
                    {initialTaxData.map(inv => (
                      <tr key={inv.invoiceNumber} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-white font-medium">FAC-{String(inv.invoiceNumber).padStart(6, '0')}</td>
                        <td className="px-4 py-3 text-zinc-300">{inv.client.name}</td>
                        <td className="px-4 py-3 text-zinc-400">{new Date(inv.issueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right text-zinc-300">{formatCurrency(inv.subtotal)}</td>
                        <td className="px-4 py-3 text-right text-zinc-300">{formatCurrency(inv.taxAmount)}</td>
                        <td className="px-4 py-3 text-right font-bold text-white">{formatCurrency(inv.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="m-0">
              <div className="rounded-md border border-white/10 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Pos.</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">N° Facturas</th>
                      <th className="px-4 py-3 font-medium text-right">Volumen Compras</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {initialTopClients.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">No hay datos para mostrar.</td></tr>}
                    {initialTopClients.map((client, i) => (
                      <tr key={client.clientId} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-zinc-500 font-bold">#{i + 1}</td>
                        <td className="px-4 py-3 text-white font-medium">
                          {client.clientName}
                          {client.clientEmail && <div className="text-xs text-zinc-500 font-normal">{client.clientEmail}</div>}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{client.invoiceCount}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">{formatCurrency(client.totalVolume)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function FileIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
  )
}
