"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, MoreHorizontal, Mail, Phone, Smartphone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { EditClientDialog } from "./edit-client-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function ClientTable({ clients }: { clients: any[] }) {
  const router = useRouter()
  const [editingClient, setEditingClient] = useState<any>(null)
  const [deletingClient, setDeletingClient] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingClient) return
    setDeleting(true)
    const { deleteClient } = await import("@/actions/clients")
    const res = await deleteClient(deletingClient.id)
    setDeleting(false)
    setDeletingClient(null)
    if (res?.error) toast.error(res.error)
    else toast.success("Cliente eliminado exitosamente")
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Sin clientes registrados</h3>
        <p className="text-zinc-400 text-sm max-w-sm">Añade tu primer cliente para empezar a asignarle servicios y facturar.</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative overflow-x-auto rounded-md">
        <Table className="w-full" containerClassName="overflow-x-auto">
          <TableHeader className="bg-white/5">
            <TableRow className="border-0 border-b border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Cliente</TableHead>
              <TableHead className="text-zinc-400 font-medium hidden md:table-cell">Contacto</TableHead>
              <TableHead className="text-zinc-400 font-medium hidden md:table-cell">Autorizados</TableHead>
              <TableHead className="text-zinc-400 font-medium text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 cursor-pointer transition-all duration-200"
                onClick={() => router.push(`/clientes/${client.id}`)}
              >
                <TableCell className="font-medium text-white py-2.5">
                  <div className="flex flex-col md:hidden gap-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${client.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span>{client.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-zinc-400 text-sm mt-0.5 pl-4">
                      <Smartphone className="w-3 h-3" />
                      {client.celular || "-"}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${client.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{client.name}</span>
                    {client.isActive ? (
                      <Badge variant="secondary" className="ml-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20">Activo</Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">Inactivo</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 hidden md:table-cell py-2.5">
                  <div className="flex flex-col gap-1 text-sm">
                    {client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</span>}
                    {client.celular && <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {client.celular}</span>}
                    {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>}
                    {!client.email && !client.celular && !client.phone && <span className="text-zinc-600">-</span>}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 hidden md:table-cell py-2.5">
                  {client.authorizedPersons && client.authorizedPersons.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {client.authorizedPersons.map((person: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-white/10 text-zinc-300 font-normal">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-600">Ninguno</span>
                  )}
                </TableCell>
                <TableCell className="text-right py-2.5" onClick={(e) => e.stopPropagation()}>
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
                          onClick={() => setEditingClient(client)}
                        >
                          Editar Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => window.location.href = `/clientes/${client.id}`}>
                          Ver Servicios
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="focus:bg-yellow-500/20 focus:text-yellow-400 text-yellow-400 cursor-pointer"
                          onClick={async () => {
                            const { toggleClientStatus } = await import("@/actions/clients")
                            const res = await toggleClientStatus(client.id, !client.isActive)
                            if (res?.error) toast.error(res.error)
                            else toast.success("Estado actualizado")
                          }}
                        >
                          {client.isActive ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="focus:bg-red-500/20 focus:text-red-500 text-red-500 cursor-pointer"
                          onClick={() => setDeletingClient(client)}
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

      <EditClientDialog 
        client={editingClient}
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
      />

      <ConfirmDialog
        open={!!deletingClient}
        onOpenChange={(open) => !open && setDeletingClient(null)}
        title="Eliminar cliente"
        description={`¿Estás seguro de eliminar a ${deletingClient?.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
