"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toggleCompanyStatus } from "@/actions/companies"
import { AssignUserDialog } from "./assign-user-dialog"

export function CompanyTable({ companies, users = [] }: { companies: any[], users?: any[] }) {
  const [assignCompany, setAssignCompany] = useState<{id: string, name: string} | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  
  const handleToggleStatus = async (id: string) => {
    setTogglingId(id)
    await toggleCompanyStatus(id)
    setTogglingId(null)
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Sin empresas registradas</h3>
        <p className="text-zinc-400 text-sm max-w-sm">No se ha encontrado ninguna empresa en el sistema. Añade una para comenzar.</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-md">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Nombre</TableHead>
            <TableHead className="text-zinc-400 font-medium">Slug</TableHead>
            <TableHead className="text-zinc-400 font-medium">Estado</TableHead>
            <TableHead className="text-zinc-400 font-medium">RUC</TableHead>
            <TableHead className="text-zinc-400 font-medium">Usuarios Asignados</TableHead>
            <TableHead className="text-zinc-400 font-medium text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="border-white/10 hover:bg-white/5 transition-colors">
              <TableCell className="font-medium text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                </div>
                {company.name}
              </TableCell>
              <TableCell className="text-zinc-400">{company.slug}</TableCell>
              <TableCell>
                <Badge variant={company.isActive ? "default" : "secondary"} className={company.isActive ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" : ""}>
                  {company.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-400">{company.ruc || "-"}</TableCell>
              <TableCell>
                {company.userCompanies && company.userCompanies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {company.userCompanies.map((uc: any) => (
                      <span key={uc.user.email} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20" title={uc.user.email}>
                        {uc.user.name || uc.user.email.split('@')[0]}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-zinc-500 text-xs italic">No tiene</span>
                )}
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
                        className="focus:bg-white/10 cursor-pointer p-0"
                        render={
                          <Link href={`/dashboard/companies/${company.id}`} className="flex w-full px-2 py-1.5">
                            Ver Detalles
                          </Link>
                        }
                      />
                      <DropdownMenuItem 
                        className="focus:bg-white/10 cursor-pointer"
                        onClick={() => setAssignCompany({ id: company.id, name: company.name })}
                      >
                        Asignar Usuarios
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`cursor-pointer ${company.isActive ? "focus:bg-red-500/20 focus:text-red-400 text-red-400" : "focus:bg-green-500/20 focus:text-green-400 text-green-400"}`}
                        onClick={() => handleToggleStatus(company.id)}
                        disabled={togglingId === company.id}
                      >
                        {togglingId === company.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {company.isActive ? "Desactivar" : "Activar"}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {assignCompany && (
        <AssignUserDialog 
          open={!!assignCompany} 
          onOpenChange={(open) => !open && setAssignCompany(null)}
          company={assignCompany}
          users={users}
        />
      )}
    </div>
  )
}
