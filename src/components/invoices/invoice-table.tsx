"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { buttonVariants } from "@/components/ui/button"
import { cn, formatDate } from "@/lib/utils"
import Link from "next/link"
import { FileText } from "lucide-react"

export function InvoiceTable({ invoices }: { invoices: any[] }) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No hay facturas emitidas</h3>
        <p className="text-zinc-400 max-w-sm mb-6">Aún no se ha generado ninguna factura para esta empresa.</p>
        <Link href="/facturas/new" className={cn(buttonVariants({ variant: "outline" }), "bg-white text-black hover:bg-zinc-200")}>
          Generar la primera
        </Link>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-b-md">
      <Table className="w-full" containerClassName="overflow-hidden">
        <TableHeader className="bg-white/5">
          <TableRow className="border-0 border-b border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Factura</TableHead>
            <TableHead className="text-zinc-400 font-medium max-sm:hidden">Emisión</TableHead>
            <TableHead className="text-zinc-400 font-medium">Cliente</TableHead>
            <TableHead className="text-right text-zinc-400 font-medium">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow 
              key={inv.id} 
              className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 cursor-pointer transition-all duration-200" 
              onClick={() => window.location.href = `/facturas/${inv.id}`}
            >
              <TableCell className="py-2.5">
                <div className="font-semibold text-white text-sm">FAC-{String(inv.invoiceNumber).padStart(6, '0')}</div>
                <div className="text-[11px] text-zinc-500 sm:hidden mt-0.5">{formatDate(inv.issueDate)}</div>
              </TableCell>
              <TableCell className="text-zinc-400 py-2.5 max-sm:hidden text-sm">{formatDate(inv.issueDate)}</TableCell>
              <TableCell className="py-2.5">
                <div className="text-zinc-300 font-medium truncate max-w-[120px] sm:max-w-[200px] text-sm">{inv.client.name}</div>
              </TableCell>
              <TableCell className="text-right text-zinc-300 font-semibold py-2.5 text-sm">${Number(inv.total).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
