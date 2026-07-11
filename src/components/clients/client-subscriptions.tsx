"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function ClientSubscriptions({ subscriptions }: { subscriptions: any[] }) {
  const router = useRouter()
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Sin servicios asignados</h3>
        <p className="text-zinc-400 text-sm max-w-sm">Asigna un servicio del catálogo para definir qué le facturarás a este cliente.</p>
      </div>
    )
  }

  const totalCost = subscriptions.reduce((sum, sub) => sum + Number(sub.agreedPrice), 0)

  return (
    <div className="relative overflow-x-auto rounded-md">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Servicio</TableHead>
            <TableHead className="text-zinc-400 font-medium">Precio</TableHead>
            <TableHead className="text-zinc-400 font-medium">ITBMS 7%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow 
              key={sub.id} 
              className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => router.push(`/servicios/${sub.serviceId}`)}
            >
              <TableCell className="font-medium text-white">{sub.service.name}</TableCell>
              <TableCell className="text-zinc-300 font-semibold">${Number(sub.agreedPrice).toFixed(2)}</TableCell>
              <TableCell className="text-zinc-400">
                {sub.applyTax ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <X className="w-4 h-4 text-zinc-600" />
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2 border-white/10 bg-white/5">
            <TableCell className="font-semibold text-white">Total</TableCell>
            <TableCell className="text-white font-bold">${totalCost.toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
