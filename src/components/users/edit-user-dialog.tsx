"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateUser } from "@/actions/users"

export function EditUserDialog({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) setError("")
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    // Mapear checkbox a rol (en BD sigue siendo COMPANY_ADMIN)
    const isSuperAdmin = formData.get("isSuperAdmin") === "on"
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
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Modifica la información o permisos de este usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`name-${user?.id}`} className="text-zinc-300">Nombre</Label>
            <Input id={`name-${user?.id}`} name="name" defaultValue={user?.name || ""} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`email-${user?.id}`} className="text-zinc-300">Correo Electrónico</Label>
            <Input id={`email-${user?.id}`} name="email" type="email" defaultValue={user?.email || ""} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id={`isSuperAdmin-${user?.id}`} 
              name="isSuperAdmin" 
              defaultChecked={user?.role === "SUPER_ADMIN"}
              className="w-4 h-4 rounded border-white/20 bg-black/50 text-blue-600 focus:ring-blue-500 focus:ring-offset-black accent-blue-600 cursor-pointer" 
            />
            <Label htmlFor={`isSuperAdmin-${user?.id}`} className="text-zinc-300 font-normal cursor-pointer select-none">
              Es Super Administrador (Acceso Global)
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`password-${user?.id}`} className="text-zinc-300">Nueva Contraseña (Opcional)</Label>
            <Input id={`password-${user?.id}`} name="password" type="password" placeholder="Dejar en blanco para no cambiar" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
