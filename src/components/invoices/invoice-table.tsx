"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"

export function InvoiceTable({ invoices }: { invoices: any[] }) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No hay facturas emitidas</h3>
        <p className="text-zinc-400 max-w-sm mb-6">Aún no se ha generado ninguna factura para esta empresa.</p>
        <Link href="/dashboard/invoices/new" className={cn(buttonVariants({ variant: "outline" }), "bg-white text-black hover:bg-zinc-200")}>
          Generar la primera
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ISSUED": return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">Emitida</Badge>
      case "PAID": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Pagada</Badge>
      case "VOID": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Anulada</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="relative overflow-x-auto rounded-b-md">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Factura #</TableHead>
            <TableHead className="text-zinc-400 font-medium">Cliente</TableHead>
            <TableHead className="text-zinc-400 font-medium">Emisión</TableHead>
            <TableHead className="text-zinc-400 font-medium">Total</TableHead>
            <TableHead className="text-zinc-400 font-medium">Estado</TableHead>
            <TableHead className="text-right text-zinc-400 font-medium">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id} className="border-white/10 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => window.location.href = `/dashboard/invoices/${inv.id}`}>
              <TableCell className="font-semibold text-white">INV-{String(inv.invoiceNumber).padStart(6, '0')}</TableCell>
              <TableCell className="text-zinc-300">
                <div className="font-medium text-white">{inv.client.name}</div>
                <div className="text-xs text-zinc-500">{inv.client.email}</div>
              </TableCell>
              <TableCell className="text-zinc-400">{new Date(inv.issueDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-zinc-300 font-semibold">${Number(inv.total).toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(inv.status)}</TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white shadow-xl shadow-black">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => window.location.href = `/dashboard/invoices/${inv.id}`}>
                        Ver Detalle
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-emerald-400 focus:text-emerald-300 focus:bg-emerald-950/30">Marcar Pagada</DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer">Anular</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
