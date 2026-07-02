"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { assignServiceToClient } from "@/actions/subscriptions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function AssignServiceDialog({ clientId, services }: { clientId: string, services: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [price, setPrice] = useState<string>("")

  const handleServiceChange = (val: string) => {
    setSelectedService(val)
    const svc = services.find(s => s.id === val)
    if (svc) setPrice(svc.defaultPrice.toString())
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedService) {
      setError("Debes seleccionar un servicio")
      return
    }
    
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    formData.append("clientId", clientId)
    formData.append("serviceId", selectedService)
    
    const result = await assignServiceToClient(formData)

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
        Asignar Servicio
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>Asignar Servicio / Suscripción</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Vincula un servicio del catálogo a este cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label className="text-zinc-300">Servicio del Catálogo</Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger className="bg-black/50 border-white/10 focus:ring-blue-500 text-zinc-100">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                {services.map(s => (
                  <SelectItem key={s.id} value={s.id} className="hover:bg-white/10 focus:bg-white/10">{s.name} (${Number(s.defaultPrice).toFixed(2)})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agreedPrice" className="text-zinc-300">Precio Pactado (USD)</Label>
            <Input id="agreedPrice" name="agreedPrice" type="number" step="0.01" min="0" required value={price} onChange={e => setPrice(e.target.value)} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingFrequency" className="text-zinc-300">Frecuencia de Facturación</Label>
            <Select name="billingFrequency" defaultValue="MONTHLY">
              <SelectTrigger className="bg-black/50 border-white/10 focus:ring-blue-500 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                <SelectItem value="MANUAL" className="hover:bg-white/10 focus:bg-white/10">Manual (Una sola vez)</SelectItem>
                <SelectItem value="MONTHLY" className="hover:bg-white/10 focus:bg-white/10">Mensual</SelectItem>
                <SelectItem value="BIWEEKLY" className="hover:bg-white/10 focus:bg-white/10">Quincenal</SelectItem>
                <SelectItem value="WEEKLY" className="hover:bg-white/10 focus:bg-white/10">Semanal</SelectItem>
                <SelectItem value="DAILY" className="hover:bg-white/10 focus:bg-white/10">Diario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="applyTax" name="applyTax" className="border-white/20 data-[state=checked]:bg-blue-600" />
            <Label htmlFor="applyTax" className="text-zinc-300 cursor-pointer">
              Aplicar ITBMS (7%)
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Asignación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
