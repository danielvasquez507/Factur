"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, CalendarClock } from "lucide-react"
import { formatDate } from "@/lib/utils"
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

  const getFreqLabel = (freq: string) => {
    switch (freq) {
      case "MONTHLY": return "Mensual"
      case "BIWEEKLY": return "Quincenal"
      case "WEEKLY": return "Semanal"
      case "DAILY": return "Diario"
      case "MANUAL": return "Manual"
      default: return freq
    }
  }

  return (
    <div className="relative overflow-x-auto rounded-md">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Servicio</TableHead>
            <TableHead className="text-zinc-400 font-medium">Precio Pactado</TableHead>
            <TableHead className="text-zinc-400 font-medium">Impuestos</TableHead>
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
                {sub.applyTax ? `ITBMS (${Number((Number(sub.taxRate) * 100).toFixed(2))}%)` : <span className="text-zinc-600">Exento</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
