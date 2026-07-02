"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/actions/clients"

export function ClientDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const result = await createClient(formData)

    if (result.error) {
      setError(result.error)
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
        Nuevo Cliente
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>Añadir Cliente</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Registra un nuevo cliente para tu empresa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Nombre del Cliente</Label>
            <Input id="name" name="name" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" placeholder="Ej. Juan Pérez" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Correo (Opcional)</Label>
              <Input id="email" type="email" name="email" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" placeholder="juan@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Teléfono (Opcional)</Label>
              <Input id="phone" name="phone" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorizedPersons" className="text-zinc-300">Personas Autorizadas</Label>
            <Input id="authorizedPersons" name="authorizedPersons" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" placeholder="María, José..." />
            <p className="text-xs text-zinc-500">Nombres separados por comas. Estas personas podrán aprobar facturas o trabajos.</p>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
