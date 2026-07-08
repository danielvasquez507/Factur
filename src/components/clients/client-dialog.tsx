"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Smartphone, Mail, Phone, MapPin, Users, Plus, Loader2 } from "lucide-react"
import { createClient } from "@/actions/clients"

export function ClientDialog({ trigger, companyId }: { trigger?: ReactElement, companyId?: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    if (companyId) formData.set("companyId", companyId)
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
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white h-8 px-3 gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Nuevo Cliente
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Añadir Cliente</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Registra un nuevo cliente para tu empresa
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
              <Label htmlFor="name" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nombre</Label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id="name" name="name" required placeholder="Ej. Juan Pérez" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="celular" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Celular <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Smartphone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id="celular" name="celular" type="tel" maxLength={8} pattern="\d{8}" required placeholder="61234567" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Correo</Label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="email" type="email" name="email" placeholder="Opcional" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Teléfono</Label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="phone" name="phone" type="tel" maxLength={8} pattern="\d{8}" placeholder="Opcional" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="direccion" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Dirección</Label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id="direccion" name="direccion" placeholder="Opcional" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="authorizedPersons" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Personas Autorizadas</Label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id="authorizedPersons" name="authorizedPersons" placeholder="María, José..." className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">Nombres separados por comas. Estas personas podrán aprobar facturas o trabajos.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-blue-900/20 border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cliente"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
