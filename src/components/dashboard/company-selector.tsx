"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2 } from "lucide-react"
import { setActiveTenant } from "@/actions/tenant"

interface CompanySelectorProps {
  companies: any[]
  activeTenantId: string | null
}

export function CompanySelector({ companies, activeTenantId }: CompanySelectorProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Si no hay tenant activo, auto-seleccionar el primero
    if (companies.length > 0 && !activeTenantId) {
        handleSelect(companies[0].id)
    }
  }, [companies, activeTenantId])

  const handleSelect = async (companyId: string) => {
      await setActiveTenant(companyId)
      router.refresh()
  }

  if (!mounted) return <div className="h-9 w-[200px] bg-white/5 rounded-md animate-pulse"></div>
  
  if (companies.length === 0) {
      return (
          <div className="h-9 px-3 flex items-center gap-2 text-sm text-zinc-500 bg-white/5 rounded-md border border-white/10">
              <Building2 className="w-4 h-4" />
              Sin empresas
          </div>
      )
  }

  const currentCompany = companies.find(c => c.id === activeTenantId) || companies[0]
  const validTenantId = currentCompany?.id || ""

  return (
    <div className="flex items-center gap-2">
      <Select value={validTenantId} onValueChange={(val) => handleSelect(val ?? "")}>
        <SelectTrigger className="w-[180px] sm:w-[220px] bg-black/50 border-white/10 text-zinc-200 h-9 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-4 h-4 shrink-0 text-zinc-500" />
            <span className="truncate">
              {currentCompany ? currentCompany.name : <SelectValue placeholder="Seleccionar empresa" />}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 text-white">
          {companies.map(company => (
            <SelectItem key={company.id} value={company.id} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
