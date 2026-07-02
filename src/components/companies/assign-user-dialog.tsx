"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
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
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Asignar Administrador</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Asigna un usuario a la empresa <span className="text-white font-medium">{company.name}</span>. 
            El usuario tendrá acceso para gestionar esta empresa.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-zinc-300">Seleccionar Usuario</Label>
              <Select name="userId" required>
                <SelectTrigger className="w-full bg-black/50 border-white/10 text-white">
                  <SelectValue placeholder="Elige un usuario..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white">
                  {users.length === 0 ? (
                    <div className="p-2 text-sm text-zinc-500 text-center">No hay usuarios disponibles</div>
                  ) : (
                    users.map(u => (
                      <SelectItem key={u.id} value={u.id} className="focus:bg-white/10 cursor-pointer">
                        {u.name || u.email} <span className="text-zinc-500 ml-1">({u.email})</span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400 hover:text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || users.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Asignar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
