"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Loader2, Save } from "lucide-react"
import { createManualInvoice } from "@/actions/invoices"
import { ServiceDialog } from "@/components/services/service-dialog"

export function InvoiceForm({ clients, services, companyId, defaultClientId, clientServices = [] }: { clients: any[], services: any[], companyId?: string, defaultClientId?: string, clientServices?: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [clientId, setClientId] = useState(defaultClientId || "")
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  const initialItems = clientServices.length > 0
    ? clientServices.map((cs: any) => ({
        serviceId: cs.serviceId,
        description: cs.service?.name || "",
        quantity: 1,
        unitPrice: Number(cs.agreedPrice),
        applyTax: cs.applyTax,
        taxRate: Number(cs.taxRate),
      }))
    : [{
        serviceId: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        applyTax: false,
        taxRate: 0.07,
      }]

  const [items, setItems] = useState<any[]>(initialItems)

  const handleAddItem = () => {
    setItems([...items, { serviceId: "", description: "", quantity: 1, unitPrice: 0, applyTax: false, taxRate: 0.07 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value
    
    if (field === "serviceId" && value) {
      const svc = services.find(s => s.id === value)
      if (svc) {
        newItems[index].unitPrice = Number(svc.defaultPrice)
        newItems[index].description = svc.name
      }
    }
    
    setItems(newItems)
  }

  const calcTotals = () => {
    let sub = 0
    let tax = 0
    items.forEach(item => {
      const lineSub = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
      const lineTax = item.applyTax ? lineSub * item.taxRate : 0
      sub += lineSub
      tax += lineTax
    })
    return { subtotal: sub, tax, total: sub + tax }
  }

  const totals = calcTotals()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId) return setError("Seleccione un cliente")
    if (items.length === 0) return setError("Agregue al menos un ítem")
    
    setLoading(true)
    setError("")

    const payload = {
      clientId,
      issueDate,
      dueDate,
      notes,
      items: items.map(it => ({
        ...it,
        serviceId: it.serviceId || null
      }))
    }

    const res = await createManualInvoice(payload, companyId)
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push(`/facturas/${res.invoiceId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-md text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl">Detalles del Cliente y Fechas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Cliente</Label>
              <Select value={clientId} onValueChange={(val) => setClientId(val ?? "")}>
                <SelectTrigger className="bg-black/50 border-white/10 text-zinc-100 focus:ring-blue-500 overflow-hidden text-ellipsis">
                  <SelectValue placeholder="Seleccionar cliente...">
                    {clientId ? clients.find(c => c.id === clientId)?.name : "Seleccionar cliente..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white">
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id} className="hover:bg-white/10 focus:bg-white/10">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Fecha de Emisión</Label>
                <Input type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)} className="bg-black/50 border-white/10 [color-scheme:dark] focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Fecha de Vencimiento (Opcional)</Label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-black/50 border-white/10 [color-scheme:dark] focus-visible:ring-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Impuestos (7%):</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </CardContent>

        </Card>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Ítems a Facturar</CardTitle>
          <div className="flex gap-2">
            <ServiceDialog companyId={companyId} />
            <Button type="button" variant="outline" onClick={handleAddItem} className="bg-white/5 border-white/10 hover:bg-white/10 text-white p-2 h-9 w-9" title="Agregar Línea">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                <Select value={item.serviceId} onValueChange={(val) => updateItem(index, "serviceId", val)}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-zinc-100 focus:ring-blue-500 overflow-hidden text-ellipsis w-full h-8">
                    <SelectValue placeholder="Seleccionar servicio...">
                      {item.serviceId 
                        ? services.find(s => s.id === item.serviceId)?.name 
                        : "Seleccionar servicio..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-white">
                    {services.map(s => (
                      <SelectItem key={s.id} value={s.id} className="hover:bg-white/10 focus:bg-white/10">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    min="1" 
                    required 
                    value={item.quantity === "" ? "" : item.quantity} 
                    onChange={(e) => updateItem(index, "quantity", e.target.value === "" ? "" : parseInt(e.target.value, 10))} 
                    className="bg-black/50 border-white/10 focus-visible:ring-blue-500 w-16 h-8" 
                  />

                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    readOnly
                    value={item.unitPrice} 
                    className="bg-black/50 border-white/10 focus-visible:ring-blue-500 cursor-not-allowed opacity-70 w-24 h-8" 
                  />

                  <div className="flex items-center gap-1.5">
                    <Checkbox 
                      checked={item.applyTax} 
                      onCheckedChange={(checked) => updateItem(index, "applyTax", !!checked)} 
                      className="border-white/20 data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-xs text-zinc-400">ITBMS</span>
                  </div>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    disabled={items.length === 1}
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-300 hover:bg-red-950/50 h-8 w-8 disabled:opacity-30 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <Label className="text-zinc-300">Notas / Términos</Label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Gracias por su preferencia..."
        />
      </div>

      <Button type="submit" disabled={loading || items.length === 0 || items.some(item => !item.serviceId)} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 h-11 text-base">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Generar Factura
      </Button>
    </form>
  )
}
