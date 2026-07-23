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



export function ContractForm({ clients, clientServices, companyId, defaultClientId, initialData, contractSections, defaultTitle }: {
  clients: any[],
  clientServices: any[],
  companyId?: string,
  defaultClientId?: string,
  initialData?: any,
  contractSections?: Array<{title: string, content: string}> | string[],
  defaultTitle?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [clientId, setClientId] = useState(initialData?.clientId || defaultClientId || "")
  const [clientServiceId, setClientServiceId] = useState(initialData?.clientServiceId || "")
  const [title, setTitle] = useState(initialData?.title || defaultTitle || "Contrato ")
  const [description, setDescription] = useState(initialData?.description || "")
  const [startDate, setStartDate] = useState(initialData ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "")
  
  const parseInitial = (val: any) => {
    if (!val) return ""
    if (typeof val === 'string') return val
    if (Array.isArray(val)) {
      if (val.length > 0 && typeof val[0] === 'object' && val[0].content) {
        return val.map((v: any) => v.content).join("\n\n")
      }
      return val.join("\n\n")
    }
    return ""
  }

  const getSectionDefault = (titleMatch: string) => {
    if (initialData) return undefined;
    if (!contractSections || !Array.isArray(contractSections)) return "";
    for (const s of contractSections) {
      if (typeof s === 'object' && s.title === titleMatch) return s.content || "";
    }
    return "";
  }

  const [clauses, setClauses] = useState<string>(parseInitial(initialData?.clauses) || getSectionDefault("Cláusulas y Disposiciones Generales"))
  const [responsibilities, setResponsibilities] = useState<string>(parseInitial(initialData?.responsibilities) || getSectionDefault("Responsabilidades del Cliente"))
  const [conditions, setConditions] = useState<string>(parseInitial(initialData?.conditions) || getSectionDefault("Condiciones Comerciales"))
  const [exceptions, setExceptions] = useState<string>(parseInitial(initialData?.exceptions) || getSectionDefault("Causas de Terminación Anticipada"))

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
          if (!prev || prev === defaultTitle || prev.startsWith("Contrato de ")) {
            if (defaultTitle && defaultTitle !== "Contrato ") {
              return defaultTitle;
            }
            return `Contrato de ${selected.service.name}`
          }
          return prev
        })
      }
    }
  }, [clientServiceId, filteredServices, initialData, defaultTitle])



  const renderSection = (titleText: string, value: string, setter: (val: string) => void) => (
    <Card className="bg-black/40 border-white/10 mt-6">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg text-white">{titleText}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => {
            const target = e.target as HTMLTextAreaElement;
            const rawVal = target.value;
            const originalCursor = target.selectionStart;
            let newVal = rawVal;
            
            if (rawVal.trim() === '') {
              newVal = '1. ';
            } else {
              const rawLines = rawVal.split('\n');
              const formattedLines = rawLines.map((line, i) => {
                const cleanLine = line.replace(/^\d+\.\s*/, '');
                return `${i + 1}. ${cleanLine}`;
              });
              newVal = formattedLines.join('\n');
            }

            setter(newVal);

            const addedChars = newVal.length - rawVal.length;
            setTimeout(() => {
              if (rawVal.trim() === '') {
                target.selectionStart = target.selectionEnd = 3;
              } else if (addedChars > 0) {
                target.selectionStart = target.selectionEnd = originalCursor + addedChars;
              } else {
                target.selectionStart = target.selectionEnd = originalCursor;
              }
            }, 0);
          }}
          placeholder={`Escribe aquí el contenido de la sección...`}
          className="bg-black/50 border-white/10 text-white placeholder:text-zinc-500 min-h-[150px]"
        />
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
                id="title"
                value={title} 
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith("Contrato")) {
                    if (val.toLowerCase().startsWith("contrato")) {
                      val = "Contrato" + val.slice(8);
                    } else {
                      val = "Contrato " + val;
                    }
                  }
                  setTitle(val);
                }}
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

      {(() => {
        const activeSections = contractSections && contractSections.length > 0 ? contractSections : [
          "Cláusulas y Disposiciones Generales",
          "Responsabilidades del Cliente",
          "Condiciones Comerciales",
          "Causas de Terminación Anticipada"
        ];
        
        return activeSections.map((sec, idx) => {
          const titleText = typeof sec === 'object' ? sec.title : sec;
          const displayTitle = `${idx + 1}. ${titleText}`;
          if (titleText === "Cláusulas y Disposiciones Generales") return <div key="clauses">{renderSection(displayTitle, clauses, setClauses)}</div>;
          if (titleText === "Responsabilidades del Cliente") return <div key="resp">{renderSection(displayTitle, responsibilities, setResponsibilities)}</div>;
          if (titleText === "Condiciones Comerciales") return <div key="cond">{renderSection(displayTitle, conditions, setConditions)}</div>;
          if (titleText === "Causas de Terminación Anticipada") return <div key="exc">{renderSection(displayTitle, exceptions, setExceptions)}</div>;
          return null;
        });
      })()}

      <div className="flex justify-center pt-10 pb-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[250px] h-12 text-base rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]">
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {initialData ? "Guardar Cambios" : "Generar contrato"}
        </Button>
      </div>
    </form>
  )
}
