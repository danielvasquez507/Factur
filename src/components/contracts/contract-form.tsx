"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Loader2, Save, FileText, MoveUp, MoveDown } from "lucide-react"
import { createContract, updateContract } from "@/actions/contracts"

type SectionItem = { id: string; content: string }

export function ContractForm({ clients, clientServices, companyId, defaultClientId, initialData }: {
  clients: any[],
  clientServices: any[],
  companyId?: string,
  defaultClientId?: string,
  initialData?: any
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [clientId, setClientId] = useState(initialData?.clientId || defaultClientId || "")
  const [clientServiceId, setClientServiceId] = useState(initialData?.clientServiceId || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [startDate, setStartDate] = useState(initialData ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "")
  
  const [clauses, setClauses] = useState<SectionItem[]>(initialData?.clauses || [])
  const [responsibilities, setResponsibilities] = useState<SectionItem[]>(initialData?.responsibilities || [])
  const [conditions, setConditions] = useState<SectionItem[]>(initialData?.conditions || [])
  const [exceptions, setExceptions] = useState<SectionItem[]>(initialData?.exceptions || [])

  const filteredServices = useMemo(() => {
    if (!clientId) return []
    return clientServices.filter(cs => cs.clientId === clientId)
  }, [clientId, clientServices])

  // Auto-select first service when client is selected
  useEffect(() => {
    if (clientId && filteredServices.length > 0 && !clientServiceId) {
      setClientServiceId(filteredServices[0].id)
    }
  }, [clientId, filteredServices, clientServiceId])

  // Auto-set title based on selected service
  useEffect(() => {
    if (clientServiceId && !initialData) {
      const selected = filteredServices.find(s => s.id === clientServiceId)
      if (selected) {
        setTitle(prev => {
          if (!prev || prev.startsWith("Contrato de ")) {
            return `Contrato de ${selected.service.name}`
          }
          return prev
        })
      }
    }
  }, [clientServiceId, filteredServices, initialData])

  const handleAdd = (setter: React.Dispatch<React.SetStateAction<SectionItem[]>>) => {
    setter(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), content: "" }])
  }

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<SectionItem[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdate = (setter: React.Dispatch<React.SetStateAction<SectionItem[]>>, index: number, content: string) => {
    setter(prev => {
      const copy = [...prev]
      copy[index].content = content
      return copy
    })
  }

  const moveUp = (setter: React.Dispatch<React.SetStateAction<SectionItem[]>>, index: number) => {
    if (index === 0) return
    setter(prev => {
      const copy = [...prev]
      const temp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const moveDown = (setter: React.Dispatch<React.SetStateAction<SectionItem[]>>, index: number) => {
    setter(prev => {
      if (index === prev.length - 1) return prev
      const copy = [...prev]
      const temp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const renderSection = (titleText: string, items: SectionItem[], setter: React.Dispatch<React.SetStateAction<SectionItem[]>>) => (
    <Card className="bg-black/40 border-white/10 mt-6">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg text-white">{titleText}</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={() => handleAdd(setter)} className="h-8 border-white/10 hover:bg-white/5">
          <Plus className="w-4 h-4 mr-2" /> Agregar Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-zinc-500 italic">No hay ítems en esta sección. No se imprimirá en el PDF.</p>
        )}
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5">
            <div className="flex flex-col gap-1 pt-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={() => moveUp(setter, idx)} disabled={idx === 0}>
                <MoveUp className="w-3 h-3" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={() => moveDown(setter, idx)} disabled={idx === items.length - 1}>
                <MoveDown className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex-1">
              <Textarea
                value={item.content}
                onChange={(e) => handleUpdate(setter, idx, e.target.value)}
                placeholder={`Detalle del ítem ${idx + 1}...`}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-500 min-h-[80px]"
              />
            </div>
            <Button type="button" variant="destructive" size="icon" onClick={() => handleRemove(setter, idx)} className="h-10 w-10 shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId) return setError("Seleccione un cliente")
    if (!clientServiceId) return setError("Debe vincular un servicio")
    if (!title) return setError("El título es obligatorio")

    setLoading(true)
    setError("")

    const payload = {
      clientId,
      clientServiceId,
      title,
      description,
      startDate,
      endDate: endDate || null,
      status: "DRAFT" as any,
      clauses,
      responsibilities,
      conditions,
      exceptions,
      pdfTemplate: initialData?.pdfTemplate || "professional",
      pdfColor: initialData?.pdfColor || "slate"
    }

    let res;
    if (initialData?.id) {
      res = await updateContract(initialData.id, payload, companyId)
    } else {
      res = await createContract(payload, companyId)
    }

    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push(`/contratos/${initialData?.id || res.contractId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white">Datos Principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Cliente *</Label>
              <Select value={clientId} onValueChange={(val) => { setClientId(val); setClientServiceId(""); }}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                  <SelectValue placeholder="Seleccione cliente">
                    {clientId ? clients.find(c => c.id === clientId)?.name || clientId : "Seleccione cliente"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300 max-h-60">
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id} className="focus:bg-white/10">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300">Servicio Vinculado *</Label>
              {!clientId ? (
                <div className="text-sm text-zinc-500 italic p-3 bg-white/5 rounded-md border border-white/10">Seleccione cliente primero</div>
              ) : filteredServices.length === 0 ? (
                <div className="text-sm text-red-400 p-3 bg-red-500/10 rounded-md border border-red-500/20">Cliente sin servicios asignados</div>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                  {filteredServices.map(cs => (
                    <button
                      key={cs.id}
                      type="button"
                      onClick={() => setClientServiceId(cs.id)}
                      className={`text-left p-3 rounded-lg border transition-all ${clientServiceId === cs.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-100' : 'bg-black/50 border-white/10 text-zinc-300 hover:bg-white/5'}`}
                    >
                      <div className="font-medium">{cs.service.name}</div>
                      <div className="text-xs opacity-70 mt-1">Precio acordado: ${Number(cs.agreedPrice).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Título del Contrato *</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Ej. Contrato de Prestación de Servicios Profesionales" 
                className="bg-black/50 border-white/10 text-white"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white">Vigencia y Detalles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Fecha de Inicio *</Label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Fecha de Fin (Opcional)</Label>
                <Input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-black/50 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Descripción Interna (Opcional)</Label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notas internas (no aparecerá en el PDF)..."
                className="bg-black/50 border-white/10 text-white min-h-[110px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2 pt-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-400" />
          Secciones del Documento
        </h2>
        <p className="text-zinc-400">Configure los términos legales. Las secciones vacías serán ignoradas al generar el PDF.</p>
      </div>

      {renderSection("1. Cláusulas y Disposiciones Generales", clauses, setClauses)}
      {renderSection("2. Responsabilidades del Cliente", responsibilities, setResponsibilities)}
      {renderSection("3. Condiciones Comerciales", conditions, setConditions)}
      {renderSection("4. Excepciones y Limitaciones", exceptions, setExceptions)}

      <div className="flex justify-end gap-4 pt-8">
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-white/10 hover:bg-white/5 text-zinc-300">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 px-8">
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {initialData ? "Guardar Cambios" : "Guardar y Generar PDF"}
        </Button>
      </div>
    </form>
  )
}
