"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, ShieldCheck, Lock, Loader2 } from "lucide-react"
import { updateUser } from "@/actions/users"

const PROTECTED_USER_ID = "8c732b08-e938-4b90-ad24-12e8b5c97c1e"

export function EditUserDialog({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isProtected = user?.id === PROTECTED_USER_ID

  useEffect(() => {
    if (open) setError("")
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const isSuperAdmin = isProtected ? true : formData.get("isSuperAdmin") === "on"
    formData.set("role", isSuperAdmin ? "SUPER_ADMIN" : "COMPANY_ADMIN")

    const result = await updateUser(user.id, formData)

    if (result.error) {
      setError(result.error)
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
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Editar Usuario</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Modifica la información o permisos del usuario
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
              <Label htmlFor={`name-${user?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nombre</Label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`name-${user?.id}`} name="name" defaultValue={user?.name || ""} required className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`email-${user?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Correo</Label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`email-${user?.id}`} name="email" type="email" defaultValue={user?.email || ""} required className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <label className={`flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] cursor-pointer group hover:bg-white/[0.05] transition-colors ${isProtected ? "opacity-60 cursor-not-allowed" : ""}`}>
              <div className="relative">
                <input type="checkbox" id={`isSuperAdmin-${user?.id}`} name="isSuperAdmin" defaultChecked={user?.role === "SUPER_ADMIN"} disabled={isProtected} className="peer sr-only" />
                <div className="w-8 h-4.5 rounded-full bg-zinc-700/60 transition-colors peer-checked:bg-blue-600/60 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40" />
                <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-zinc-400 transition-all peer-checked:translate-x-[14px] peer-checked:bg-blue-400 shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  {isProtected ? "Super Administrador (protegido)" : "Super Administrador"}
                </span>
                <p className="text-[10px] text-zinc-600 mt-0.5">
                  {isProtected ? "Esta cuenta no puede cambiar de rol" : "Acceso global a todas las empresas"}
                </p>
              </div>
            </label>

            <div className="space-y-1.5">
              <Label htmlFor={`password-${user?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`password-${user?.id}`} name="password" type="password" placeholder="Dejar en blanco para no cambiar" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-blue-900/20 border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
