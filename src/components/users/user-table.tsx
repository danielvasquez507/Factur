"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, ShieldCheck, User } from "lucide-react"
import { EditUserDialog } from "./edit-user-dialog"
import { AssignCompanyDialog } from "./assign-company-dialog"

const roleOptions = [
  { value: "", label: "Todos los roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "COMPANY_ADMIN", label: "Usuario" },
] as const

export function UserTable({ users, companies }: { users: any[], companies: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [assigningUser, setAssigningUser] = useState<string | null>(null)

  const filteredUsers = useMemo(() => {
    let result = users

    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((user) => {
        const nameMatch = user.name?.toLowerCase().includes(q)
        const emailMatch = user.email?.toLowerCase().includes(q)
        const companyMatch = user.userCompanies?.some((uc: any) =>
          uc.company?.name?.toLowerCase().includes(q)
        )
        return nameMatch || emailMatch || companyMatch
      })
    }

    return result
  }, [users, search, roleFilter])

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
    <div>
      <div className="flex items-center gap-3 bg-black/30 border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md px-3 py-2 flex-1 text-sm">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o empresa..."
            className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-600 text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val ?? "")}>
          <SelectTrigger className="w-40 bg-black/50 border-white/10 text-zinc-300 text-sm">
            <SelectValue placeholder="Todos los roles">
              {(value: string | null) => value ? roleOptions.find(o => o.value === value)?.label : "Todos los roles"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-white/10 text-white">
            {roleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} label={opt.label} className="hover:bg-white/10 focus:bg-white/10">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table className="w-full" containerClassName="overflow-hidden">
        <TableHeader className="bg-white/5">
            <TableRow className="border-0 border-b border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Usuario</TableHead>
              <TableHead className="text-zinc-400 font-medium">Rol</TableHead>
              <TableHead className="text-zinc-400 font-medium">Empresas Asignadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-0">
                <TableCell colSpan={3} className="text-center text-zinc-500 py-12">
                  Ningún usuario coincide con la búsqueda.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 cursor-pointer transition-all duration-200"
                  onClick={() => router.push(`/usuarios/${user.id}`)}
                >
                  <TableCell className="py-2.5">
                    <span className="text-white font-medium text-sm">{user.name}</span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    {user.role === "SUPER_ADMIN" ? (
                      <span className="flex items-center gap-1.5 text-blue-400" title="Super Admin">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm hidden md:inline">Super Admin</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-zinc-400" title="Usuario">
                        <User className="w-4 h-4" />
                        <span className="text-xs hidden md:inline">Usuario</span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 whitespace-normal max-w-[240px]">
                    {user.role === "SUPER_ADMIN" ? (
                      <span className="text-xs text-blue-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Acceso Total</span>
                    ) : user.userCompanies.length === 0 ? (
                      <span className="text-xs text-zinc-500 italic">Sin empresas</span>
                    ) : (
                      <div className="flex items-center gap-1 flex-nowrap">
                        {user.userCompanies.slice(0, 2).map((uc: any) => (
                          <span key={uc.id} className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-1.5 py-0.5 text-[10px] text-zinc-300 font-medium min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shrink-0" />
                            <span className="truncate max-w-[60px]">{uc.company.name}</span>
                          </span>
                        ))}
                        {user.userCompanies.length > 2 && (
                          <span
                            className="inline-flex items-center justify-center shrink-0 w-5 h-4 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-zinc-500 font-semibold cursor-help"
                            title={user.userCompanies.slice(2).map((uc: any) => uc.company.name).join(", ")}
                          >
                            +{user.userCompanies.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => { if (!open) setEditingUser(null) }}
      />

      <AssignCompanyDialog
        userId={assigningUser || ""}
        companies={companies}
        open={!!assigningUser}
        onOpenChange={(open) => { if (!open) setAssigningUser(null) }}
      />
    </div>
  )
}
