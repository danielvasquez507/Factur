"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, MoreHorizontal, Building2, ShieldAlert } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { AssignCompanyDialog } from "./assign-company-dialog"
import { EditUserDialog } from "./edit-user-dialog"

export function UserTable({ users, companies }: { users: any[], companies: any[] }) {
  const [editingUser, setEditingUser] = useState<any>(null)

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No hay usuarios</h3>
        <p className="text-zinc-400 max-w-sm mb-6">Aún no se ha registrado ningún administrador de empresa.</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-b-md">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Usuario</TableHead>
            <TableHead className="text-zinc-400 font-medium">Rol</TableHead>
            <TableHead className="text-zinc-400 font-medium">Estado</TableHead>
            <TableHead className="text-zinc-400 font-medium">Empresas Asignadas</TableHead>
            <TableHead className="text-right text-zinc-400 font-medium">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors group">
              <TableCell className="text-zinc-300">
                <div className="font-medium text-white">{user.name}</div>
                <div className="text-xs text-zinc-500">{user.email}</div>
              </TableCell>
              <TableCell>
                {user.role === "SUPER_ADMIN" ? (
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">Super Admin</Badge>
                ) : (
                  <Badge variant="outline" className="border-zinc-500/30 text-zinc-400 bg-zinc-500/10">Usuario</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.isActive ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Activo</Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Inactivo</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.role === "SUPER_ADMIN" ? (
                  <span className="text-sm text-blue-400 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Acceso Total</span>
                ) : user.userCompanies.length === 0 ? (
                  <span className="text-sm text-zinc-500 italic">Sin empresas</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {user.userCompanies.map((uc: any) => (
                      <Badge key={uc.id} variant="outline" className="border-white/10 text-zinc-300 gap-1 font-normal">
                        <Building2 className="w-3 h-3" />
                        {uc.company.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white shadow-xl shadow-black p-1 w-48">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="focus:bg-white/10 cursor-pointer"
                        onClick={() => setEditingUser(user)}
                      >
                        Editar Usuario
                      </DropdownMenuItem>
                      {user.role !== "SUPER_ADMIN" && <AssignCompanyDialog userId={user.id} companies={companies} />}
                      <DropdownMenuItem 
                        className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer"
                        onClick={async () => {
                          if (confirm("¿Seguro que deseas eliminar a este usuario?")) {
                            const { deleteUser } = await import("@/actions/users")
                            const res = await deleteUser(user.id)
                            if (res?.error) alert(res.error)
                          }
                        }}
                      >
                        Eliminar Usuario
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <EditUserDialog 
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />
    </div>
  )
}
