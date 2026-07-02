"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateClient } from "@/actions/clients"

export function EditClientDialog({ client, open, onOpenChange }: { client: any, open: boolean, onOpenChange: (open: boolean) => void }) {
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
    const result = await updateClient(client.id, formData)

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
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Actualiza los datos de contacto y personas autorizadas del cliente.
          </DialogDescription>
        </DialogHeader>
        <form key={client?.id || "empty"} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`name-${client?.id}`} className="text-zinc-300">Razón Social / Nombre Completo</Label>
            <Input id={`name-${client?.id}`} name="name" defaultValue={client?.name} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`email-${client?.id}`} className="text-zinc-300">Correo Electrónico (Opcional)</Label>
            <Input id={`email-${client?.id}`} name="email" type="email" defaultValue={client?.email || ""} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`phone-${client?.id}`} className="text-zinc-300">Teléfono (Opcional)</Label>
            <Input id={`phone-${client?.id}`} name="phone" type="tel" defaultValue={client?.phone || ""} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`auth-${client?.id}`} className="text-zinc-300">Personas Autorizadas</Label>
            <Input id={`auth-${client?.id}`} name="authorizedPersons" defaultValue={client?.authorizedPersons?.join(", ") || ""} placeholder="Juan Pérez, Ana Gómez" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
            <p className="text-xs text-zinc-500">Separar por comas (,)</p>
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
