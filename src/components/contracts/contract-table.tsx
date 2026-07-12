"use client"

import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
            <TableHead className="text-zinc-400 font-medium h-10 px-2 py-2.5">Contrato</TableHead>
            <TableHead className="text-zinc-400 font-medium h-10 px-2 py-2.5 max-sm:hidden">Fecha</TableHead>
            <TableHead className="text-zinc-400 font-medium h-10 px-2 py-2.5">Cliente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-0">
          {contracts.map((contract) => (
            <TableRow 
              key={contract.id} 
              className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 cursor-pointer transition-all duration-200"
              onClick={() => {
                window.location.href = `/contratos/${contract.id}`;
              }}
            >
              <TableCell className="py-2.5 px-2">
                <div className="font-semibold text-white text-sm truncate max-w-[200px] sm:max-w-[300px]">{contract.title}</div>
                <div className="text-[11px] text-zinc-500 sm:hidden mt-0.5">{formatDate(contract.startDate)}</div>
              </TableCell>
              <TableCell className="py-2.5 px-2 max-sm:hidden text-zinc-400 text-sm">{formatDate(contract.startDate)}</TableCell>
              <TableCell className="py-2.5 px-2">
                <div className="text-zinc-300 font-medium truncate max-w-[150px] sm:max-w-[200px] text-sm">{contract.client?.name || "N/A"}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
