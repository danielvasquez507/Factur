"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Smartphone, Mail, Phone, MapPin, Users, Loader2 } from "lucide-react"
import { updateClient } from "@/actions/clients"

export function EditClientDialog({ client, open, onOpenChange, companyType }: { client: any, open: boolean, onOpenChange: (open: boolean) => void, companyType?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isActive, setIsActive] = useState(client?.isActive ?? true)
  const [metadata, setMetadata] = useState<any>({})

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (client) {
      setIsActive(client.isActive)
      if (client.metadata) {
        try {
          setMetadata(typeof client.metadata === "string" ? JSON.parse(client.metadata) : client.metadata)
        } catch (e) {
          setMetadata({})
        }
      } else {
        setMetadata({})
      }
    }
  }, [client])

  useEffect(() => {
    if (open) setError("")
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    if (companyType === "TRANSPORTE_ESCOLAR") {
      formData.set("metadata", JSON.stringify(metadata))
    }
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
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Editar Cliente</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Actualiza los datos del cliente
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form key={client?.id || "empty"} onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 text-xs text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor={`name-${client?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nombre</Label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`name-${client?.id}`} name="name" defaultValue={client?.name || ""} required className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`celular-${client?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Celular <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Smartphone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`celular-${client?.id}`} name="celular" type="tel" title="Ej: 61234567, 6123-4567, +507 6123 4567" required defaultValue={client?.celular || ""} placeholder="Ej: 61234567, 6123-4567, +507 6123 4567" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Formatos: 61234567, 6123-4567, 6123 4567, +507 61234567</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`email-${client?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Correo</Label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id={`email-${client?.id}`} name="email" type="email" defaultValue={client?.email || ""} className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`phone-${client?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Teléfono</Label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id={`phone-${client?.id}`} name="phone" type="tel" maxLength={8} pattern="^(6\d{7}|[1-57-9]\d{6})$" title="8 dígitos si empieza en 6, de lo contrario 7 dígitos (no puede iniciar con 0)" defaultValue={client?.phone || ""} className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`direccion-${client?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Dirección</Label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`direccion-${client?.id}`} name="direccion" defaultValue={client?.direccion || ""} placeholder="Calle Principal, Edificio #123" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>



            <input type="hidden" name="isActive" value={client?.isActive !== false ? "true" : "false"} />

            {companyType === "TRANSPORTE_ESCOLAR" && (
              <div className="pt-2 pb-1 border-t border-white/5 space-y-3.5">
                <Label className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Datos del Alumno (Transporte Escolar)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-zinc-400">Acudiente</Label>
                    <Input name="acudiente" value={metadata.acudiente || ""} onChange={handleMetadataChange} placeholder="Nombre del acudiente" className="bg-black/40 border-white/[0.07] text-zinc-200 h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-zinc-400">Alumno</Label>
                    <Input name="alumno" value={metadata.alumno || ""} onChange={handleMetadataChange} placeholder="Nombre del alumno" className="bg-black/40 border-white/[0.07] text-zinc-200 h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-zinc-400">Maestro(a)</Label>
                    <Input name="maestro" value={metadata.maestro || ""} onChange={handleMetadataChange} placeholder="Ej: Maestro Juan" className="bg-black/40 border-white/[0.07] text-zinc-200 h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-zinc-400">Grado</Label>
                    <Input name="grado" value={metadata.grado || ""} onChange={handleMetadataChange} placeholder="Ej: 5to Grado" className="bg-black/40 border-white/[0.07] text-zinc-200 h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-zinc-400">Escuela</Label>
                    <Input name="escuela" value={metadata.escuela || ""} onChange={handleMetadataChange} placeholder="Nombre de la escuela" className="bg-black/40 border-white/[0.07] text-zinc-200 h-8 text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-zinc-400">Seguro</Label>
                    <Input name="seguro" value={metadata.seguro || ""} onChange={handleMetadataChange} placeholder="Póliza de seguro" className="bg-black/40 border-white/[0.07] text-zinc-200 h-8 text-xs" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor={`auth-${client?.id}`} className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Personas Autorizadas</Label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id={`auth-${client?.id}`} name="authorizedPersons" defaultValue={Array.isArray(client?.authorizedPersons) ? client.authorizedPersons.join(", ") : (typeof client?.authorizedPersons === "string" ? (() => { try { const p = JSON.parse(client.authorizedPersons); return Array.isArray(p) ? p.join(", ") : client.authorizedPersons } catch(e) { return client.authorizedPersons } })() : "")} placeholder="Juan Pérez, Ana Gómez" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">Separar por comas (,)</p>
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
