"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateInvoiceDesign } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, Palette, LayoutTemplate } from "lucide-react"
import { toast } from "sonner"

type DesignFormProps = {
  initialTemplate: string
  initialColor: string
  company?: any
}

export function InvoiceDesignForm({ initialTemplate, initialColor, company }: DesignFormProps) {
  const router = useRouter()
  const [template, setTemplate] = useState(initialTemplate)
  const [color, setColor] = useState(initialColor)
  const [isLoading, setIsLoading] = useState(false)

  const templates = [
    { id: "modern", name: "Moderna", description: "Diseño limpio y espacioso con banner de color" },
    { id: "classic", name: "Clásica", description: "Formato tradicional y compacto" },
    { id: "minimal", name: "Minimalista", description: "Estilo limpio con mucho espacio en blanco" },
    { id: "corporate", name: "Corporativa", description: "Aspecto formal tipo carta comercial" }
  ]

  const colors = [
    { id: "blue", name: "Azul Corporativo", hex: "bg-blue-500", textHex: "text-blue-600", bgLightHex: "bg-blue-500/10" },
    { id: "emerald", name: "Verde Esmeralda", hex: "bg-emerald-500", textHex: "text-emerald-600", bgLightHex: "bg-emerald-500/10" },
    { id: "slate", name: "Gris Oscuro", hex: "bg-slate-700", textHex: "text-slate-800", bgLightHex: "bg-slate-700/10" },
    { id: "red", name: "Rojo Carmesí", hex: "bg-red-500", textHex: "text-red-600", bgLightHex: "bg-red-500/10" },
    { id: "orange", name: "Naranja Atardecer", hex: "bg-orange-500", textHex: "text-orange-600", bgLightHex: "bg-orange-500/10" },
    { id: "amber", name: "Ámbar Cálido", hex: "bg-amber-500", textHex: "text-amber-600", bgLightHex: "bg-amber-500/10" },
    { id: "purple", name: "Púrpura Real", hex: "bg-purple-500", textHex: "text-purple-600", bgLightHex: "bg-purple-500/10" },
    { id: "pink", name: "Rosa Vibrante", hex: "bg-pink-500", textHex: "text-pink-600", bgLightHex: "bg-pink-500/10" },
    { id: "rose", name: "Rosa Suave", hex: "bg-rose-500", textHex: "text-rose-600", bgLightHex: "bg-rose-500/10" },
  ]

  const handleSave = async () => {
    setIsLoading(true)
    
    const res = await updateInvoiceDesign(template, color)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Diseño actualizado correctamente")
      router.refresh()
    }
    
    setIsLoading(false)
  }

  const selectedColor = colors.find(c => c.id === color) || colors[0];

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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              {/* ... modern template content ... */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className={`w-12 h-12 rounded-lg ${selectedColor.hex} mb-2 shadow-sm flex items-center justify-center text-[8px] font-bold text-white text-center p-1 leading-tight overflow-hidden`}>
                    {company?.name ? company.name.substring(0, 8).toUpperCase() : "LOGO"}
                  </div>
                  <div className="text-xs font-bold text-zinc-800">{company?.name || "Empresa Demo"}</div>
                  <div className="text-[9px] text-zinc-500">{company?.taxId || "RUC: 123456789"}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black uppercase mb-1 ${selectedColor.textHex}`}>FACTURA</div>
                  <div className="text-[10px] text-zinc-600 font-medium">FAC-0001</div>
                  <div className="text-[8px] text-zinc-400">Fecha: Hoy</div>
                </div>
              </div>
              
              <div className="w-full bg-zinc-100 rounded-lg p-3 mb-4 flex justify-between">
                <div>
                  <div className="text-[9px] font-bold text-zinc-500 mb-1">FACTURAR A:</div>
                  <div className="text-[10px] font-semibold text-zinc-800">Cliente Demo S.A.</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-zinc-500 mb-1">RUC/NIT:</div>
                  <div className="text-[10px] font-semibold text-zinc-800">999999999-9</div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className={`w-full h-6 rounded-md flex items-center px-2 gap-2 ${selectedColor.bgLightHex}`}>
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
                  <div className="text-[9px] font-bold text-zinc-500 mb-1">TOTAL</div>
                  <div className={`px-2 py-1 rounded text-white text-[10px] font-bold ${selectedColor.hex}`}>
                    $ 1,500.00
                  </div>
                </div>
              </div>
            </div>
          ) : template === "classic" ? (
            // PLANTILLA CLASICA (Centrada / Tabular estricta)
            <div className="w-full h-full flex flex-col border-[0.5px] border-zinc-300 p-4 bg-white">
              <div className="flex flex-col items-center mb-6 text-center border-b-[0.5px] border-zinc-300 pb-4">
                <div className={`w-10 h-10 rounded ${selectedColor.hex} mb-2 shadow-sm flex items-center justify-center text-[7px] font-bold text-white leading-tight overflow-hidden p-1`}>
                  {company?.name ? company.name.substring(0, 8).toUpperCase() : "LOGO"}
                </div>
                <div className={`text-lg font-serif font-black uppercase mb-1 ${selectedColor.textHex}`}>FACTURA COMERCIAL</div>
                <div className="text-xs font-bold text-zinc-800">{company?.name || "Empresa Demo"}</div>
              </div>
              
              <div className="flex justify-between mb-4 text-xs">
                <div>
                  <div className="text-[9px] font-bold text-zinc-600 mb-1">CLIENTE:</div>
                  <div className="text-[10px] font-semibold text-zinc-800">Cliente Demo S.A.</div>
                  <div className="text-[9px] text-zinc-500">RUC: 999999999-9</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-zinc-600 mb-1">FACTURA Nº:</div>
                  <div className="text-[10px] font-semibold text-zinc-800 mb-1">FAC-0001</div>
                </div>
              </div>

              <div className="flex-1 flex flex-col border-[0.5px] border-zinc-300 mt-2">
                <div className={`w-full h-6 flex items-center px-2 gap-2 border-b-[0.5px] border-zinc-300 ${selectedColor.hex} text-white`}>
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
                  <div className="text-[10px] font-bold text-zinc-800">TOTAL</div>
                  <div className={`px-3 py-1 rounded-sm text-white text-[11px] font-bold ${selectedColor.hex}`}>
                    $ 1,500.00
                  </div>
                </div>
              </div>
            </div>
          ) : template === "minimal" ? (
            // PLANTILLA MINIMALISTA (Mucho espacio, líneas finas)
            <div className="w-full h-full flex flex-col p-6 bg-white">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-10 h-10 rounded ${selectedColor.hex} flex items-center justify-center text-[7px] font-bold text-white`}>
                  {company?.name ? company.name.substring(0, 6).toUpperCase() : "LOGO"}
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-zinc-400 uppercase tracking-widest mb-1">Factura</div>
                  <div className={`text-sm font-bold ${selectedColor.textHex}`}>FAC-0001</div>
                </div>
              </div>
              <div className="h-[1px] bg-zinc-200 mb-6" />
              <div className="flex justify-between mb-8">
                <div>
                  <div className="text-[7px] text-zinc-400 uppercase tracking-wider mb-1">Cliente</div>
                  <div className="text-[10px] font-semibold text-zinc-800">Cliente Demo S.A.</div>
                </div>
                <div className="text-right">
                  <div className="text-[7px] text-zinc-400 uppercase tracking-wider mb-1">Emisión</div>
                  <div className="text-[9px] text-zinc-700">Hoy</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex py-1.5 border-b border-zinc-200">
                  <div className="w-1/2 h-1.5 bg-zinc-200 rounded" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                </div>
                <div className="flex py-1.5 border-b border-zinc-100">
                  <div className="w-2/5 h-1.5 bg-zinc-200 rounded" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                </div>
                <div className="flex py-1.5 border-b border-zinc-100">
                  <div className="w-1/3 h-1.5 bg-zinc-200 rounded" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                  <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                </div>
              </div>
              <div className="flex justify-end mt-3 pt-2 border-t-2 border-zinc-800">
                <div className="text-right">
                  <div className="text-[7px] text-zinc-400 uppercase tracking-wider">Total</div>
                  <div className={`text-sm font-bold ${selectedColor.textHex}`}>$ 1,500.00</div>
                </div>
              </div>
            </div>
          ) : (
            // PLANTILLA CORPORATIVA (Formal tipo carta)
            <div className="w-full h-full flex flex-col p-4 bg-white">
              <div className={`border-b-2 pb-2 mb-1 ${selectedColor.bgLightHex.replace('/10', '')}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`w-10 h-10 rounded ${selectedColor.hex} flex items-center justify-center text-[7px] font-bold text-white`}>
                      {company?.name ? company.name.substring(0, 6).toUpperCase() : "LOGO"}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-800 mt-1">{company?.name || "Empresa Demo"}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-white text-[7px] font-bold ${selectedColor.hex}`}>FAC-0001</div>
                </div>
              </div>
              <div className="h-[1px] bg-zinc-200 mb-3" />
              <div className={`text-[10px] font-bold uppercase tracking-wide mb-3 ${selectedColor.textHex}`}>
                Factura Comercial
              </div>
              <div className="flex gap-2 mb-4">
                <div className={`flex-1 ${selectedColor.bgLightHex} p-2 rounded`}>
                  <div className={`text-[6px] font-bold uppercase tracking-wider mb-1 ${selectedColor.textHex}`}>Facturado a</div>
                  <div className="text-[8px] font-semibold text-zinc-800">Cliente Demo S.A.</div>
                </div>
                <div className={`flex-1 ${selectedColor.bgLightHex} p-2 rounded text-right`}>
                  <div className={`text-[6px] font-bold uppercase tracking-wider mb-1 ${selectedColor.textHex}`}>Emisión</div>
                  <div className="text-[8px] font-semibold text-zinc-800">Hoy</div>
                </div>
              </div>
              <div className={`flex py-1 px-1.5 rounded mb-1 ${selectedColor.bgLightHex}`}>
                <div className="w-1/2 h-1.5 bg-white/60 rounded" />
                <div className="w-1/6 h-1.5 bg-white/60 rounded ml-auto" />
                <div className="w-1/6 h-1.5 bg-white/60 rounded ml-auto" />
                <div className="w-1/6 h-1.5 bg-white/60 rounded ml-auto" />
              </div>
              <div className="flex py-1 px-1.5 border-b border-zinc-100">
                <div className="w-2/5 h-1.5 bg-zinc-200 rounded" />
                <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
              </div>
              <div className="flex-1 flex py-1 px-1.5 border-b border-zinc-100">
                <div className="w-1/3 h-1.5 bg-zinc-200 rounded" />
                <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
                <div className="w-1/6 h-1.5 bg-zinc-200 rounded ml-auto" />
              </div>
              <div className="flex justify-end mt-2">
                <div className={`px-3 py-1.5 rounded text-white text-[9px] font-bold ${selectedColor.hex}`}>
                  Total: $ 1,500.00
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
