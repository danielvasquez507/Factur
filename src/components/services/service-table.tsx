"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Layers, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { EditServiceDialog } from "./edit-service-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function ServiceTable({ services }: { services: any[] }) {
  const [editingService, setEditingService] = useState<any>(null)
  const [deletingService, setDeletingService] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingService) return
    setDeleting(true)
    const { deleteService } = await import("@/actions/services")
    const res = await deleteService(deletingService.id)
    setDeleting(false)
    setDeletingService(null)
    if (res?.error) toast.error(res.error)
    else toast.success("Servicio eliminado exitosamente")
  }

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
        <Table className="w-full" containerClassName="overflow-x-auto">
          <TableHeader className="bg-white/5">
            <TableRow className="border-0 border-b border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Nombre</TableHead>
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Descripción</TableHead>
              <TableHead className="text-zinc-400 font-medium">Precio Base</TableHead>
              <TableHead className="text-zinc-400 font-medium text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow 
                key={service.id} 
                className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 transition-all duration-200"
              >
                <TableCell className="py-2.5">
                  <div className="font-medium text-white flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-zinc-500 max-sm:hidden" />
                    <span className="truncate max-w-[140px] sm:max-w-none">{service.name}</span>
                    {!service.isActive && <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-1 py-0 text-[10px]">Inactivo</Badge>}
                  </div>
                  <div className="text-[11px] text-zinc-500 sm:hidden mt-0.5 truncate max-w-[150px]">
                    {service.description || "Sin descripción"}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 max-w-xs truncate py-2.5 max-sm:hidden text-sm">
                  {service.description || <span className="text-zinc-600">-</span>}
                </TableCell>
                <TableCell className="text-zinc-300 font-semibold py-2.5 text-sm">
                  ${Number(service.defaultPrice).toFixed(2)}
                </TableCell>
                <TableCell className="text-right py-2.5">
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
                            className="focus:bg-red-500/20 focus:text-red-500 text-red-500 cursor-pointer"
                            onClick={() => setDeletingService(service)}
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

      <ConfirmDialog
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        title="Eliminar servicio"
        description={`¿Estás seguro de eliminar ${deletingService?.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
