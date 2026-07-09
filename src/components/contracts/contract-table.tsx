"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusLabel: Record<string, string> = {
  DRAFT: "Borrador",
  ACTIVE: "Activo",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
}

const statusColor: Record<string, string> = {
  DRAFT: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  EXPIRED: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CANCELLED: "bg-red-500/20 text-red-500 border-red-500/30",
}

export function ContractTable({ contracts }: { contracts: any[] }) {
  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-zinc-400 mb-2">No hay contratos registrados</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-b-md">
      <Table className="w-full" containerClassName="overflow-x-auto">
        <TableHeader className="bg-white/5">
          <TableRow className="border-0 border-b border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium h-10 px-2 py-2.5">Título del Contrato</TableHead>
            <TableHead className="text-zinc-400 font-medium max-sm:hidden h-10 px-2 py-2.5">Cliente</TableHead>
            <TableHead className="text-zinc-400 font-medium max-sm:hidden h-10 px-2 py-2.5">Servicio</TableHead>
            <TableHead className="text-right text-zinc-400 font-medium h-10 px-2 py-2.5">Inicio</TableHead>
            <TableHead className="text-center text-zinc-400 font-medium h-10 px-2 py-2.5">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-0">
          {contracts.map((contract) => (
            <TableRow 
              key={contract.id} 
              className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 cursor-pointer transition-all duration-200"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('a')) return;
                window.location.href = `/contratos/${contract.id}`;
              }}
            >
              <TableCell className="py-2.5 px-2">
                <div className="font-semibold text-white text-sm truncate max-w-[150px] sm:max-w-[250px]">{contract.title}</div>
              </TableCell>
              <TableCell className="py-2.5 px-2 max-sm:hidden">
                <div className="text-zinc-300 font-medium truncate max-w-[120px] sm:max-w-[200px] text-sm">{contract.client?.name || "N/A"}</div>
              </TableCell>
              <TableCell className="py-2.5 px-2 max-sm:hidden">
                <div className="text-zinc-400 truncate max-w-[120px] sm:max-w-[200px] text-sm">
                  {contract.clientService ? contract.clientService.service.name : <span className="italic text-zinc-500">General</span>}
                </div>
              </TableCell>
              <TableCell className="py-2.5 px-2 text-right text-zinc-300 font-semibold text-sm">
                {formatDate(contract.startDate)}
              </TableCell>
              <TableCell className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex h-8 w-8 p-0 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-white/10 text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" render={<Link href={`/contratos/${contract.id}`} />}>
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" render={<Link href={`/contratos/${contract.id}/edit`} />}>
                      Editar contrato
                    </DropdownMenuItem>
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
