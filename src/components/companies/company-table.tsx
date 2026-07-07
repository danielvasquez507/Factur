"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2 } from "lucide-react"

export function CompanyTable({ companies, users = [] }: { companies: any[], users?: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [userFilter, setUserFilter] = useState("")

  const userOptions = useMemo(() => {
    return (users || [])
      .map((u: any) => [u.id, u.name || u.email] as [string, string])
      .sort((a: [string, string], b: [string, string]) => a[1].localeCompare(b[1]))
  }, [users])

  const filteredCompanies = useMemo(() => {
    let result = companies

    if (userFilter) {
      result = result.filter((c) =>
        c.userCompanies?.some((uc: any) => uc.user.id === userFilter)
      )
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((c) => c.name?.toLowerCase().includes(q))
    }

    return result
  }, [companies, search, userFilter])

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
    <div>
      <div className="flex items-center gap-3 bg-black/30 border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md px-3 py-2 flex-1 text-sm">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de empresa..."
            className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-600 text-sm"
          />
        </div>
        <Select value={userFilter} onValueChange={(val) => setUserFilter(val ?? "")}>
          <SelectTrigger className="w-44 bg-black/50 border-white/10 text-zinc-300 text-sm">
            <SelectValue placeholder="Todos los usuarios">
              {(value: string | null) => value ? userOptions.find(o => o[0] === value)?.[1] : "Todos los usuarios"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-white/10 text-white">
            <SelectItem key="" value="" label="Todos los usuarios" className="hover:bg-white/10 focus:bg-white/10">
              Todos los usuarios
            </SelectItem>
            {userOptions.map(([id, name]) => (
              <SelectItem key={id} value={id} label={name} className="hover:bg-white/10 focus:bg-white/10">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table containerClassName="overflow-hidden">
        <TableHeader className="bg-white/5">
          <TableRow className="border-0 border-b border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-zinc-400 font-medium">Empresa</TableHead>
            <TableHead className="text-zinc-400 font-medium">Usuarios Asignados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow className="border-0">
              <TableCell colSpan={2} className="text-center text-zinc-500 py-12">
                Ninguna empresa coincide con la búsqueda.
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow
                key={company.id}
                className="border-0 border-b border-white/[0.03] hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent hover:border-l-2 hover:border-l-blue-500/50 cursor-pointer transition-all duration-200"
                onClick={() => router.push(`/empresas/${company.id}`)}
              >
                <TableCell className="py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${company.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className="text-white font-medium text-sm">{company.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5 whitespace-normal max-w-[200px]">
                  {company.userCompanies && company.userCompanies.length > 0 ? (
                    <div className="flex items-center gap-1 flex-nowrap">
                      {company.userCompanies.slice(0, 2).map((uc: any) => (
                        <span
                          key={uc.id}
                          className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-0.5 text-[11px] text-zinc-300 font-medium"
                          title={uc.user.email}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70 shrink-0" />
                          <span className="max-w-[140px] truncate">{uc.user.name || uc.user.email.split('@')[0]}</span>
                        </span>
                      ))}
                      {company.userCompanies.length > 2 && (
                        <span
                          className="inline-flex items-center justify-center shrink-0 w-5 h-4 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-zinc-500 font-semibold cursor-help"
                          title={company.userCompanies.slice(2).map((uc: any) => uc.user.name).join(", ")}
                        >
                          +{company.userCompanies.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">Sin usuarios</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
