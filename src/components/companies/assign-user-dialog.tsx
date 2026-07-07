"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import { assignUserToCompany } from "@/actions/users"

interface AssignUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: {
    id: string
    name: string
  }
  users: any[]
}

export function AssignUserDialog({ open, onOpenChange, company, users }: AssignUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append("companyId", company.id)
    
    const res = await assignUserToCompany(formData)
    
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Asignar Administrador</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Asigna un usuario a <span className="text-zinc-300 font-medium">{company.name}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {error && (
            <div className="mb-3.5 p-2.5 text-xs text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Usuario</Label>
              <Select name="userId" required>
                <SelectTrigger className="w-full bg-black/40 border-white/[0.07] text-zinc-200 focus-visible:border-blue-500/50 h-9">
                  <SelectValue placeholder="Elige un usuario..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white">
                  {users.length === 0 ? (
                    <div className="p-2 text-sm text-zinc-500 text-center">No hay usuarios disponibles</div>
                  ) : (
                    users.map(u => (
                      <SelectItem key={u.id} value={u.id} label={u.name || u.email} className="focus:bg-white/10 cursor-pointer">
                        {u.name || u.email} <span className="text-zinc-500 ml-1">({u.email})</span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" disabled={loading || users.length === 0} className="w-full h-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-blue-900/20 border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Asignar"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
