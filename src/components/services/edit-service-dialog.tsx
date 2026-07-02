"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateService } from "@/actions/services"

export function EditServiceDialog({ service, open, onOpenChange }: { service: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Restablecer error al abrir/cerrar
  useEffect(() => {
    if (open) {
      setError("")
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const result = await updateService(service.id, formData)

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
          <DialogTitle>Editar Servicio o Producto</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Actualiza los datos del servicio en el catálogo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`name-${service?.id}`} className="text-zinc-300">Nombre del Servicio</Label>
            <Input id={`name-${service?.id}`} name="name" defaultValue={service?.name} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`desc-${service?.id}`} className="text-zinc-300">Descripción (Opcional)</Label>
            <Input id={`desc-${service?.id}`} name="description" defaultValue={service?.description || ""} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`price-${service?.id}`} className="text-zinc-300">Precio Base (USD)</Label>
            <Input id={`price-${service?.id}`} name="defaultPrice" type="number" step="0.01" min="0" defaultValue={service?.defaultPrice} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
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
