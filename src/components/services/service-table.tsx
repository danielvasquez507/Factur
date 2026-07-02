"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Layers, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { EditServiceDialog } from "./edit-service-dialog"

export function ServiceTable({ services }: { services: any[] }) {
  const [editingService, setEditingService] = useState<any>(null)

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Layers className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Catálogo Vacío</h3>
        <p className="text-zinc-400 text-sm max-w-sm">No has registrado ningún servicio o producto todavía.</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative overflow-x-auto rounded-md">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Nombre</TableHead>
              <TableHead className="text-zinc-400 font-medium">Descripción</TableHead>
              <TableHead className="text-zinc-400 font-medium">Precio Base</TableHead>
              <TableHead className="text-zinc-400 font-medium text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  {service.name}
                  {!service.isActive && <Badge variant="secondary" className="ml-2 bg-red-500/10 text-red-400 hover:bg-red-500/20">Inactivo</Badge>}
                </TableCell>
                <TableCell className="text-zinc-400 max-w-xs truncate">
                  {service.description || <span className="text-zinc-600">-</span>}
                </TableCell>
                <TableCell className="text-zinc-300 font-semibold">
                  ${Number(service.defaultPrice).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white shadow-xl shadow-black">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="focus:bg-white/10 cursor-pointer"
                            onClick={() => setEditingService(service)}
                          >
                            Editar Servicio
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer"
                            onClick={async () => {
                              if (confirm("¿Seguro que deseas eliminar este servicio?")) {
                                const { deleteService } = await import("@/actions/services")
                                const res = await deleteService(service.id)
                                if (res?.error) alert(res.error)
                              }
                            }}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditServiceDialog 
        service={editingService} 
        open={!!editingService} 
        onOpenChange={(open) => !open && setEditingService(null)} 
      />
    </>
  )
}
