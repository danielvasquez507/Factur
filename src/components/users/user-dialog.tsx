"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { createUser } from "@/actions/users"

export function UserDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    // Mapear checkbox a rol (en BD sigue siendo COMPANY_ADMIN)
    const isSuperAdmin = formData.get("isSuperAdmin") === "on"
    formData.set("role", isSuperAdmin ? "SUPER_ADMIN" : "COMPANY_ADMIN")

    const res = await createUser(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700 h-9 px-4 py-2 gap-2">
        <Plus className="w-4 h-4" />
        Nuevo Usuario
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Crea un nuevo administrador que luego podrás asignar a una o varias empresas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Nombre</Label>
            <Input id="name" name="name" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Correo Electrónico</Label>
            <Input id="email" name="email" type="email" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Contraseña Temporal</Label>
            <Input id="password" name="password" type="password" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="isSuperAdmin" 
              name="isSuperAdmin" 
              className="w-4 h-4 rounded border-white/20 bg-black/50 text-blue-600 focus:ring-blue-500 focus:ring-offset-black accent-blue-600 cursor-pointer" 
            />
            <Label htmlFor="isSuperAdmin" className="text-zinc-300 font-normal cursor-pointer select-none">
              Es Super Administrador (Acceso Global)
            </Label>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
