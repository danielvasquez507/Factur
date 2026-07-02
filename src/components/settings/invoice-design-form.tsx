"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateInvoiceDesign } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, Palette, LayoutTemplate } from "lucide-react"

type DesignFormProps = {
  initialTemplate: string
  initialColor: string
}

export function InvoiceDesignForm({ initialTemplate, initialColor }: DesignFormProps) {
  const router = useRouter()
  const [template, setTemplate] = useState(initialTemplate)
  const [color, setColor] = useState(initialColor)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const templates = [
    { id: "modern", name: "Moderna", description: "Diseño limpio y espacioso" },
    { id: "classic", name: "Clásica", description: "Formato tradicional y compacto" }
  ]

  const colors = [
    { id: "blue", name: "Azul Corporativo", hex: "bg-blue-500" },
    { id: "emerald", name: "Verde Esmeralda", hex: "bg-emerald-500" },
    { id: "slate", name: "Gris Oscuro", hex: "bg-slate-700" }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    const res = await updateInvoiceDesign(template, color)
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess("Diseño actualizado correctamente")
      router.refresh()
    }
    
    setIsLoading(false)
  }

  return (
    <div className="space-y-8 bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
      {/* Decals */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-colors duration-700"></div>

      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-indigo-400" />
          Diseño de Factura
        </h3>
        <p className="text-sm text-zinc-400">Personaliza la apariencia de tus facturas y PDFs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado izquierdo: Controles */}
        <div className="space-y-6">
          {/* Templates */}
          <div className="space-y-3">
            <Label className="text-zinc-300 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Plantilla
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    template === t.id 
                      ? "border-indigo-500 bg-indigo-500/10" 
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {template === t.id && (
                    <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-indigo-400" />
                  )}
                  <h4 className="font-semibold text-white mb-1">{t.name}</h4>
                  <p className="text-xs text-zinc-400">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Label className="text-zinc-300 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Principal
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {colors.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    color === c.id 
                      ? "border-indigo-500 bg-indigo-500/10" 
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${c.hex} shadow-lg`}></div>
                  <span className="text-xs text-white font-medium text-center">{c.name}</span>
                  {color === c.id && (
                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl opacity-50"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
          {success && <p className="text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">{success}</p>}

          <div className="pt-4 flex justify-start">
            <Button 
              onClick={handleSave} 
              disabled={isLoading || (template === initialTemplate && color === initialColor)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-8"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Guardar Diseño
            </Button>
          </div>
        </div>

        {/* Lado derecho: Previsualización Miniatura */}
        <div className="border border-white/10 rounded-2xl bg-[#f8fafc] p-6 shadow-inner hidden sm:flex flex-col select-none relative overflow-hidden transition-all duration-500 min-h-[350px]">
          {/* Mock Factura Layout */}
          
          {template === "modern" ? (
            // PLANTILLA MODERNA (Cabecera asimétrica)
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className={`w-12 h-12 rounded-lg ${colors.find(c => c.id === color)?.hex} mb-2 shadow-sm flex items-center justify-center text-[8px] font-bold text-white`}>LOGO</div>
                  <div className="w-24 h-3 bg-zinc-300 rounded mb-1"></div>
                  <div className="w-16 h-2 bg-zinc-200 rounded"></div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black uppercase mb-1 ${
                    color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>INVOICE</div>
                  <div className="w-20 h-3 bg-zinc-300 rounded ml-auto mb-1"></div>
                  <div className="w-16 h-2 bg-zinc-200 rounded ml-auto"></div>
                </div>
              </div>
              
              <div className="w-full bg-zinc-100 rounded-lg p-3 mb-4 flex justify-between">
                <div>
                  <div className="w-16 h-2 bg-zinc-300 rounded mb-2"></div>
                  <div className="w-24 h-2 bg-zinc-200 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="w-12 h-2 bg-zinc-300 rounded mb-2 ml-auto"></div>
                  <div className="w-20 h-2 bg-zinc-200 rounded ml-auto"></div>
                </div>
              </div>

              {/* Tabla Simulada Moderna */}
              <div className="flex-1 flex flex-col gap-2">
                <div className={`w-full h-6 rounded-md flex items-center px-2 gap-2 ${
                  color === 'blue' ? 'bg-blue-500/10' : color === 'emerald' ? 'bg-emerald-500/10' : 'bg-slate-700/10'
                }`}>
                  <div className="w-1/2 h-2 bg-zinc-300 rounded"></div>
                  <div className="w-1/4 h-2 bg-zinc-300 rounded"></div>
                  <div className="w-1/4 h-2 bg-zinc-300 rounded"></div>
                </div>
                <div className="w-full h-5 flex items-center px-2 gap-2 border-b border-zinc-100">
                  <div className="w-1/2 h-1.5 bg-zinc-200 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-200 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-200 rounded"></div>
                </div>
                <div className="w-full h-5 flex items-center px-2 gap-2 border-b border-zinc-100">
                  <div className="w-1/2 h-1.5 bg-zinc-200 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-200 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-200 rounded"></div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 pt-3 border-t border-zinc-200">
                <div className="text-right">
                  <div className="w-16 h-2 bg-zinc-300 rounded mb-2 ml-auto"></div>
                  <div className={`w-24 h-4 rounded ml-auto ${
                    color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}></div>
                </div>
              </div>
            </div>
          ) : (
            // PLANTILLA CLASICA (Centrada / Tabular estricta)
            <div className="w-full h-full flex flex-col border-[0.5px] border-zinc-300 p-4 bg-white">
              <div className="flex flex-col items-center mb-6 text-center border-b-[0.5px] border-zinc-300 pb-4">
                <div className={`w-10 h-10 rounded ${colors.find(c => c.id === color)?.hex} mb-2 shadow-sm flex items-center justify-center text-[7px] font-bold text-white`}>LOGO</div>
                <div className={`text-lg font-serif font-black uppercase mb-1 ${
                  color === 'blue' ? 'text-blue-900' : color === 'emerald' ? 'text-emerald-900' : 'text-slate-900'
                }`}>FACTURA COMERCIAL</div>
                <div className="w-24 h-2 bg-zinc-300 rounded mx-auto mb-1"></div>
              </div>
              
              <div className="flex justify-between mb-4 text-xs">
                <div>
                  <div className="w-12 h-2 bg-zinc-400 rounded mb-1"></div>
                  <div className="w-20 h-2 bg-zinc-200 rounded mb-1"></div>
                  <div className="w-24 h-2 bg-zinc-200 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-2 bg-zinc-400 rounded mb-1 ml-auto"></div>
                  <div className="w-20 h-2 bg-zinc-200 rounded mb-1 ml-auto"></div>
                </div>
              </div>

              {/* Tabla Simulada Clásica */}
              <div className="flex-1 flex flex-col border-[0.5px] border-zinc-300 mt-2">
                <div className={`w-full h-6 flex items-center px-2 gap-2 border-b-[0.5px] border-zinc-300 ${
                  color === 'blue' ? 'bg-blue-900 text-white' : color === 'emerald' ? 'bg-emerald-900 text-white' : 'bg-zinc-800 text-white'
                }`}>
                  <div className="w-1/2 h-1.5 bg-white/70 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-white/70 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-white/70 rounded"></div>
                </div>
                <div className="w-full h-5 flex items-center px-2 gap-2 border-b-[0.5px] border-zinc-200">
                  <div className="w-1/2 h-1.5 bg-zinc-300 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-300 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-300 rounded"></div>
                </div>
                <div className="w-full h-5 flex items-center px-2 gap-2">
                  <div className="w-1/2 h-1.5 bg-zinc-300 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-300 rounded"></div>
                  <div className="w-1/4 h-1.5 bg-zinc-300 rounded"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-4">
                <div className="w-24 h-16 border-[0.5px] border-zinc-300 rounded-sm"></div>
                <div className="text-right flex items-center gap-4">
                  <div className="w-16 h-3 bg-zinc-400 rounded"></div>
                  <div className={`w-20 h-5 rounded ${
                    color === 'blue' ? 'bg-blue-900' : color === 'emerald' ? 'bg-emerald-900' : 'bg-zinc-800'
                  }`}></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur text-zinc-500 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-zinc-200">
            Vista Previa
          </div>
        </div>
      </div>
    </div>
  )
}
