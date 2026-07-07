"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, FileText, DollarSign, Loader2 } from "lucide-react"
import { updateService } from "@/actions/services"

export function EditServiceDialog({ service, open, onOpenChange }: { service: any, open: boolean, onOpenChange: (open: boolean) => void }) {
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
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Editar Servicio</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Actualiza los datos del servicio en el catálogo
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form key={service?.id || 'empty'} onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 text-xs text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor={`name-${service?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nombre</Label>
              <div className="relative">
                <Package className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`name-${service?.id}`} name="name" defaultValue={service?.name || ''} required className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`desc-${service?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Descripción</Label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`desc-${service?.id}`} name="description" defaultValue={service?.description || ""} placeholder="Opcional" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`price-${service?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Precio Base</Label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`price-${service?.id}`} name="defaultPrice" type="number" step="0.01" min="0" defaultValue={service?.defaultPrice || 0} required className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
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
