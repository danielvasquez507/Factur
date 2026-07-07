"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building2, Link, Loader2, AlertTriangle, User } from "lucide-react"
import { assignUserToCompany } from "@/actions/users"
import { toast } from "sonner"

export function AssignCompanyDialog({ userId, companies, excludeCompanyIds = [], open, onOpenChange }: {
  userId: string
  companies: any[]
  excludeCompanyIds?: string[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? (onOpenChange ?? setInternalOpen) : setInternalOpen
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [conflict, setConflict] = useState<{ currentOwnerName: string; currentOwnerId: string } | null>(null)

  const availableCompanies = companies.filter((c: any) => c.isActive && !excludeCompanyIds.includes(c.id))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!companyId) {
      setError("Debes seleccionar una empresa")
      return
    }

    setLoading(true)
    setError("")
    setConflict(null)

    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("companyId", companyId)

    const res = await assignUserToCompany(formData)

    if (res?.conflict) {
      setConflict({
        currentOwnerName: res.currentOwnerName!,
        currentOwnerId: res.currentOwnerId!
      })
      setLoading(false)
    } else if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      setIsOpen(false)
      toast.success("Empresa asignada exitosamente")
    }
  }

  const handleForceAssign = async () => {
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("companyId", companyId)
    formData.append("force", "true")

    const res = await assignUserToCompany(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      setConflict(null)
      setIsOpen(false)
      toast.success("Empresa reasignada exitosamente")
    }
  }

  const handleCancelConflict = () => {
    setConflict(null)
    setCompanyId("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { setIsOpen(val); if (!val) { setConflict(null); setCompanyId("") } }}>
      {!isControlled && (
        <DialogTrigger className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-white/10 focus:bg-white/10 outline-none flex items-center gap-2 cursor-pointer">
          <Link className="w-4 h-4" />
          Vincular Empresa
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          {conflict ? (
            <>
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-semibold text-white">Empresa ya asignada</DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                      Esta empresa ya tiene un propietario asignado
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-amber-300/80">
                  <span className="text-amber-300 font-medium">{conflict.currentOwnerName}</span> ya es propietario de esta empresa. Si reasignas, se eliminará su vínculo.
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 font-medium truncate">Propietario actual</p>
                    <p className="text-[11px] text-zinc-500 truncate">{conflict.currentOwnerName}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelConflict}
                    disabled={loading}
                    className="flex-1 h-9 border-white/[0.07] bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/10 text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleForceAssign}
                    disabled={loading}
                    className="flex-1 h-9 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-sm shadow-lg shadow-amber-900/20 border-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reasignar"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-semibold text-white">Vincular Empresa</DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                      Asigna una empresa a este usuario
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-2.5 text-xs text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Empresa</Label>
                  <Select value={companyId} onValueChange={(val) => setCompanyId(val ?? "")}>
                    <SelectTrigger className="w-full bg-black/40 border-white/[0.07] text-zinc-200 focus-visible:border-blue-500/50 h-9">
                      <SelectValue placeholder="Seleccionar empresa...">
                        {(value: string | null) => value ? availableCompanies.find(c => c.id === value)?.name : "Seleccionar empresa..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white min-w-[280px]">
                      {availableCompanies.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-zinc-500 text-center">No hay empresas disponibles</div>
                      ) : (
                        availableCompanies.map(c => (
                          <SelectItem key={c.id} value={c.id} label={c.name} className="hover:bg-white/10 focus:bg-white/10">{c.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-blue-900/20 border-0">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vincular"}
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
