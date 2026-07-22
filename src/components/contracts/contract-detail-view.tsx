"use client"

import { useState, useTransition, useRef, useCallback, useEffect } from "react"
import { format } from "date-fns"
import { Maximize2, X, Printer, Palette, LayoutTemplate, CheckCircle2, Loader2, RotateCcw, ZoomIn, ZoomOut, Maximize, CircleDot, ChevronDown, Download, FileText, Save } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateContract } from "@/actions/contracts"
import { ContractShareActions } from "@/components/contracts/contract-share-actions"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const colorMap: Record<string, string> = {
  blue: "#2563eb",
  emerald: "#059669",
  slate: "#475569",
  red: "#dc2626",
  orange: "#ea580c",
  purple: "#9333ea",
  amber: "#d97706",
  teal: "#0d9488",
  indigo: "#4f46e5",
}

const buttonThemeMap: Record<string, { bg: string, border: string, hoverBg: string, text: string, shadow: string }> = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", hoverBg: "hover:bg-blue-500", text: "text-blue-400", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", hoverBg: "hover:bg-emerald-500", text: "text-emerald-400", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]" },
  slate: { bg: "bg-slate-500/10", border: "border-slate-500/30", hoverBg: "hover:bg-slate-500", text: "text-slate-400", shadow: "shadow-[0_0_15px_rgba(100,116,139,0.1)] hover:shadow-[0_0_20px_rgba(100,116,139,0.4)]" },
  red: { bg: "bg-red-500/10", border: "border-red-500/30", hoverBg: "hover:bg-red-500", text: "text-red-400", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", hoverBg: "hover:bg-orange-500", text: "text-orange-400", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", hoverBg: "hover:bg-amber-500", text: "text-amber-400", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", hoverBg: "hover:bg-purple-500", text: "text-purple-400", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", hoverBg: "hover:bg-teal-500", text: "text-teal-400", shadow: "shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", hoverBg: "hover:bg-indigo-500", text: "text-indigo-400", shadow: "shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]" },
}

const templates = [
  { id: "modern", name: "Moderna" },
  { id: "classic", name: "Clásica" },
  { id: "professional", name: "Profesional" },
]

function renderSection(title: string, contentData: any, primaryColor: string) {
  if (!contentData) return null
  
  let content = ""
  if (typeof contentData === "string") {
    content = contentData
  } else if (Array.isArray(contentData)) {
    if (contentData.length > 0 && typeof contentData[0] === 'object' && contentData[0].content) {
      content = contentData.map((i: any) => i.content).join("\n\n")
    } else {
      content = contentData.join("\n\n")
    }
  }

  if (!content.trim()) return null

  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{title}</h3>
      <div className="space-y-1.5 text-[10px] text-zinc-700 text-justify whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function ContractDetailsHTML({ contract, primaryColor }: any) {
  const clientServices = contract.client?.clientServices || []
  if (clientServices.length === 0 && !contract.clientService) return null

  const services = clientServices.length > 0 ? clientServices : (contract.clientService ? [contract.clientService] : [])

  let subtotal = 0
  let totalTax = 0
  services.forEach((s: any) => {
    const price = Number(s.agreedPrice)
    const tax = s.applyTax ? price * Number(s.taxRate) : 0
    subtotal += price
    totalTax += tax
  })
  const total = subtotal + totalTax

  return (
    <div className="bg-zinc-100 p-4 rounded-md mb-6" style={{ borderLeftWidth: 3, borderLeftColor: primaryColor }}>
      <div className="text-[8px] text-zinc-500 uppercase font-bold mb-2">Servicios Contratados</div>
      <div className="space-y-1.5 mb-3">
        {services.map((s: any, i: number) => (
          <div key={s.id || i} className="flex justify-between text-[10px]">
            <span className="text-zinc-900">{s.service?.name || "Servicio"}</span>
            <span className="text-zinc-900 font-medium">${Number(s.agreedPrice).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-300 pt-2 space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-500">Subtotal</span>
          <span className="text-zinc-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-500">ITBMS</span>
          <span className="text-zinc-900">${totalTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-zinc-900">Total</span>
          <span className="text-zinc-900">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function CommonBody({ contract, company, primaryColor, ownerName }: any) {
  const servicesList = contract.client?.clientServices || []
  const servicesDesc = servicesList.length > 0
    ? `los servicios de ${servicesList.map((s: any) => s.service?.name).filter(Boolean).join(", ")}`
    : contract.clientService
      ? `servicios de ${contract.clientService.service.name}`
      : "los servicios descritos a continuación"

  return (
    <>
      <div className="mb-6">
        <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">
          Este documento constituye un acuerdo legal vinculante y formal entre <strong className="text-zinc-900">{company.name}</strong> (en adelante "El Proveedor")
          {company.ruc ? ` con RUC ${company.ruc}${company.dv ? `-${company.dv}` : ""}` : ""} y
          <strong className="text-zinc-900"> {contract.client.name}</strong>{contract.client.email ? ` (${contract.client.email})` : ""} (en adelante "El Cliente"), para la prestación de
          {` ${servicesDesc}`}. Ambas partes reconocen tener la capacidad legal necesaria para celebrar este contrato bajo los términos y condiciones estipulados a continuación.
        </p>
      </div>

      <ContractDetailsHTML contract={contract} primaryColor={primaryColor} />

      {(() => {
        const activeSections = company?.contractSections && Array.isArray(company.contractSections) && company.contractSections.length > 0
          ? company.contractSections
          : [
              "Cláusulas y Disposiciones Generales",
              "Responsabilidades del Cliente",
              "Condiciones Comerciales",
              "Excepciones y Limitaciones"
            ];
            
        return activeSections.map((sec: any, idx: number) => {
          const titleText = typeof sec === 'object' ? sec.title : sec;
          const displayTitle = `${idx + 1}. ${titleText}`;
          if (titleText === "Cláusulas y Disposiciones Generales") return <div key="clauses">{renderSection(displayTitle, contract.clauses, primaryColor)}</div>;
          if (titleText === "Responsabilidades del Cliente") return <div key="resp">{renderSection(displayTitle, contract.responsibilities, primaryColor)}</div>;
          if (titleText === "Condiciones Comerciales") return <div key="cond">{renderSection(displayTitle, contract.conditions, primaryColor)}</div>;
          if (titleText === "Excepciones y Limitaciones") return <div key="exc">{renderSection(displayTitle, contract.exceptions, primaryColor)}</div>;
          return null;
        });
      })()}

      <div className="mt-12 pt-10 flex justify-around border-t border-zinc-200">
        <div className="w-2/5 text-center flex flex-col items-center">
          <p className="font-[cursive] italic text-lg mb-2" style={{ color: primaryColor }}>
            {ownerName || company.name}
          </p>
          <div className="border-t border-zinc-500 w-full mb-1" />
          <p className="text-[11px] font-bold text-zinc-900 mt-0.5">{company.name}</p>
          <p className="text-[7px] text-zinc-400 mt-1">
            Firmado electrónicamente por {ownerName || company.name}{company.ruc ? ` - ${company.ruc}${company.dv ? `-${company.dv}` : ""}` : ""}
          </p>
        </div>
        <div className="w-2/5 text-center flex flex-col items-center">
          <p className="font-[cursive] italic text-lg mb-2 opacity-0 select-none">Firma</p>
          <div className="border-t border-zinc-500 w-full mb-1" />
          <p className="font-bold text-[11px] text-zinc-900">{contract.client.name}</p>
          <p className="text-[9px] text-zinc-500 mt-0.5">Firma del Cliente</p>
        </div>
      </div>
    </>
  )
}

function ProfessionalTemplate({ contract, company, primaryColor, ownerName }: any) {
  return (
    <div className="bg-white p-10 min-h-full font-sans">
      <div className="flex justify-between items-start mb-8 pb-5 border-b-2" style={{ borderBottomColor: primaryColor }}>
        <div className="w-1/2">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-20 object-contain" />
          ) : (
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{company.name}</div>
          )}
        </div>
        <div className="w-1/2 text-right">
          <div className="text-base font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>{contract.title}</div>
          <div className="text-[10px] text-zinc-500">
            Fecha de Inicio: <span suppressHydrationWarning className="font-bold text-zinc-900">{format(new Date(contract.startDate), "dd/MM/yyyy")}</span>
          </div>
          {contract.endDate && (
            <div className="text-[10px] text-zinc-500 mt-0.5">
              Fecha de Vencimiento: <span suppressHydrationWarning className="font-bold text-zinc-900">{format(new Date(contract.endDate), "dd/MM/yyyy")}</span>
            </div>
          )}
        </div>
      </div>
      <CommonBody contract={contract} company={company} primaryColor={primaryColor} ownerName={ownerName} />
    </div>
  )
}

function ModernTemplate({ contract, company, primaryColor, ownerName }: any) {
  return (
    <div className="bg-white p-10 min-h-full font-sans">
      <div className="flex justify-between items-start mb-10 p-5 rounded-lg bg-slate-50 border-l-4" style={{ borderLeftColor: primaryColor }}>
        <div className="w-1/2">
          <div className="text-2xl font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{contract.title}</div>
          <div className="text-[10px] text-zinc-500">
            Vigencia: <span suppressHydrationWarning className="font-bold text-zinc-900">{format(new Date(contract.startDate), "dd/MM/yyyy")}</span>
            <span suppressHydrationWarning>{contract.endDate ? ` al ${format(new Date(contract.endDate), "dd/MM/yyyy")}` : " en adelante"}</span>
          </div>
        </div>
        <div className="w-1/2 text-right">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-16 object-contain ml-auto" />
          ) : (
            <div className="text-xl font-bold" style={{ color: primaryColor }}>{company.name}</div>
          )}
        </div>
      </div>
      <CommonBody contract={contract} company={company} primaryColor={primaryColor} ownerName={ownerName} />
    </div>
  )
}

function ClassicTemplate({ contract, company, primaryColor, ownerName }: any) {
  return (
    <div className="bg-white p-10 min-h-full font-sans">
      <div className="flex flex-col items-center mb-8 pb-5 border-b" style={{ borderBottomColor: primaryColor }}>
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={company.name} className="h-16 object-contain mb-4" />
        ) : (
          <div className="text-xl font-bold mb-4" style={{ color: primaryColor }}>{company.name}</div>
        )}
        <div className="text-lg font-bold uppercase text-center mb-2" style={{ color: primaryColor }}>{contract.title}</div>
        <div className="text-[10px] text-zinc-500 text-center">
          Suscrito el <span suppressHydrationWarning className="font-bold text-zinc-900">{format(new Date(contract.startDate), "dd/MM/yyyy")}</span>
        </div>
      </div>
      <CommonBody contract={contract} company={company} primaryColor={primaryColor} ownerName={ownerName} />
    </div>
  )
}

function ContractContent({ contract, company, template, primaryColor, ownerName }: any) {
  switch (template) {
    case "modern": return <ModernTemplate contract={contract} company={company} primaryColor={primaryColor} ownerName={ownerName} />
    case "classic": return <ClassicTemplate contract={contract} company={company} primaryColor={primaryColor} ownerName={ownerName} />
    case "professional":
    default: return <ProfessionalTemplate contract={contract} company={company} primaryColor={primaryColor} ownerName={ownerName} />
  }
}

function A4PreviewWrapper({ children, orientation = "portrait" }: { children: React.ReactNode, orientation?: "portrait" | "landscape" }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseScale, setBaseScale] = useState(1)
  
  const targetWidth = orientation === "landscape" ? 1123 : 794
  const defaultHeight = orientation === "landscape" ? 794 : 1123
  
  useEffect(() => {
    if (!containerRef.current) return
    const updateDimensions = () => {
      const parentWidth = containerRef.current?.clientWidth || 0
      if (parentWidth < targetWidth && parentWidth > 0) {
        // Dejamos un margen del 5% para que no esté pegado a los bordes
        setBaseScale((parentWidth * 0.95) / targetWidth)
      } else {
        setBaseScale(1)
      }
    }
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(containerRef.current)
    updateDimensions()
    return () => resizeObserver.disconnect()
  }, [targetWidth])

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={true}
        wheel={{ step: 0.1, smoothStep: 0.005 }}
        pinch={{ step: 3 }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl">
              <button 
                onClick={() => zoomIn()} 
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Acercar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={() => zoomOut()} 
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Alejar"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button 
                onClick={() => resetTransform()} 
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Ajustar a pantalla"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
            <TransformComponent 
              wrapperClass="!w-full !h-full" 
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              <div 
                style={{ 
                  width: targetWidth * baseScale, 
                  height: defaultHeight * baseScale 
                }}
                className="flex items-center justify-center shrink-0 my-4"
              >
                <div 
                  style={{ 
                    width: targetWidth, 
                    height: defaultHeight,
                    transform: `scale(${baseScale})`,
                    transformOrigin: 'center center'
                  }}
                  className="shrink-0"
                >
                  {children}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

const colorNames: Record<string, string> = {
  blue: "Azul Corporativo",
  emerald: "Verde Esmeralda",
  slate: "Gris Pizarra",
  red: "Rojo Carmesí",
  orange: "Naranja Atardecer",
  amber: "Ámbar Cálido",
  purple: "Púrpura Real",
  teal: "Verde Azulado",
  indigo: "Índigo Profundo",
}

function TemplateSelector({ template, color, primaryColor, onTemplateChange, onColorChange }: any) {
  const colors = [
    { id: "blue", hex: "bg-blue-500", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.6)]", ring: "ring-blue-500", name: "Azul Corporativo" },
    { id: "emerald", hex: "bg-emerald-500", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.6)]", ring: "ring-emerald-500", name: "Verde Esmeralda" },
    { id: "slate", hex: "bg-slate-700", shadow: "shadow-[0_0_15px_rgba(51,65,85,0.6)]", ring: "ring-slate-500", name: "Gris Pizarra" },
    { id: "red", hex: "bg-red-500", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.6)]", ring: "ring-red-500", name: "Rojo Carmesí" },
    { id: "orange", hex: "bg-orange-500", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.6)]", ring: "ring-orange-500", name: "Naranja Atardecer" },
    { id: "amber", hex: "bg-amber-500", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.6)]", ring: "ring-amber-500", name: "Ámbar Cálido" },
    { id: "purple", hex: "bg-purple-500", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.6)]", ring: "ring-purple-500", name: "Púrpura Real" },
    { id: "teal", hex: "bg-teal-500", shadow: "shadow-[0_0_15px_rgba(20,184,166,0.6)]", ring: "ring-teal-500", name: "Verde Azulado" },
    { id: "indigo", hex: "bg-indigo-500", shadow: "shadow-[0_0_15px_rgba(99,102,241,0.6)]", ring: "ring-indigo-500", name: "Índigo Profundo" },
  ]

  return (
    <div className="space-y-8 py-2">
      <div>
        <div className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <LayoutTemplate style={{ color: primaryColor }} className="w-4 h-4" />
          Diseño de Plantilla
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {templates.map((t: any) => (
            <div
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden group ${
                template === t.id
                  ? "border-transparent"
                  : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-xl"
              }`}
              style={template === t.id ? {
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}1a`,
                boxShadow: `0 0 20px ${primaryColor}26`
              } : {}}
            >
              {template === t.id && (
                <div 
                  className="absolute inset-0 opacity-50" 
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${primaryColor}33, transparent)` }}
                />
              )}
              <div className="flex items-center justify-between relative z-10">
                <div className="font-semibold text-white text-base">{t.name}</div>
                {template === t.id && (
                  <CheckCircle2 
                    className="w-5 h-5 drop-shadow-md" 
                    style={{ color: primaryColor }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <Palette style={{ color: primaryColor }} className="w-4 h-4" />
          Color de Énfasis
        </div>
        <div className="grid grid-cols-4 gap-4">
          {colors.map((c: any) => (
            <div
              key={c.id}
              onClick={() => onColorChange(c.id)}
              className={`group relative p-3 rounded-2xl border flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${
                color === c.id
                  ? `border-white/20 bg-white/10 ${c.shadow}`
                  : "border-transparent bg-transparent hover:bg-white/5"
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${c.hex} transition-all duration-300 ${
                color === c.id ? `ring-2 ring-offset-2 ring-offset-zinc-950 ${c.ring} ${c.shadow} scale-110` : "shadow-md group-hover:scale-110"
              }`} />
              <span className={`text-[10px] sm:text-[11px] font-medium text-center leading-tight transition-colors ${
                color === c.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
              }`}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ContractDetailView({
  contract,
  company,
  ownerName,
  publicLink = ""
}: {
  contract: any
  company: any
  ownerName?: string
  publicLink?: string
}) {
  const [templateOpen, setTemplateOpen] = useState(false)
  const [template, setTemplate] = useState(contract.pdfTemplate || "professional")
  const [color, setColor] = useState(contract.pdfColor || "slate")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [isPending, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)

  const savePreferences = async (newTemplate: string, newColor: string) => {
    setSaving(true)
    try {
      await updateContract(contract.id, {
        ...contract,
        pdfTemplate: newTemplate,
        pdfColor: newColor,
        clientId: contract.clientId,
        clientServiceId: contract.clientServiceId,
        startDate: new Date(contract.startDate).toISOString().split('T')[0],
        endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : null,
      }, company.id)
      toast.success("Diseño guardado")
    } catch (err) {
      toast.error("Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate)
    savePreferences(newTemplate, color)
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    savePreferences(template, newColor)
  }

  const primaryColor = colorMap[color] || colorMap.slate

  return (
    <>
      <ContractShareActions
        contractId={contract.id}
        publicLink={publicLink}
        clientEmail={contract.client?.email || null}
        contractTitle={contract.title}
        companyName={company.name}
        companyRuc={company.ruc}
        companyDv={company.dv}
        companyAddress={company.address}
        template={template}
        color={color}
        orientation={orientation}
      >
        <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
          <DialogTrigger render={
            <Button
              variant="outline"
              className={cn(
                "group backdrop-blur rounded-full transition-all duration-300 h-10 px-4 py-2 sm:h-9",
                buttonThemeMap[color]?.bg || "bg-slate-500/10",
                buttonThemeMap[color]?.border || "border-slate-500/30",
                buttonThemeMap[color]?.hoverBg || "hover:bg-slate-500",
                buttonThemeMap[color]?.text || "text-slate-400",
                buttonThemeMap[color]?.shadow || "shadow-md"
              )}
            >
              <Palette className="w-4 h-4 mr-2" />
              <span>Personalizar</span>
            </Button>
          } />
          <DialogContent
            style={{
              borderColor: `${primaryColor}33`,
              boxShadow: `0 0 50px ${primaryColor}1a`
            }}
            className="w-[95vw] max-w-lg bg-zinc-950/90 backdrop-blur-2xl border text-white p-6 rounded-3xl max-h-[85vh] overflow-y-auto"
          >
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Personalizar Contrato
              </DialogTitle>
            </DialogHeader>
            <TemplateSelector
              template={template}
              color={color}
              primaryColor={primaryColor}
              onTemplateChange={handleTemplateChange}
              onColorChange={handleColorChange}
            />
          </DialogContent>
        </Dialog>
        <span className="text-xs text-zinc-500 ml-auto">
          {templates.find(t => t.id === template)?.name} · {colorNames[color] || color}
        </span>
      </ContractShareActions>

      <div className="transition-all duration-300 w-full relative group aspect-[1/1.414] lg:aspect-auto lg:h-[80vh] overflow-hidden rounded-none">
        <div className="w-full h-full min-h-full relative flex flex-col items-center justify-start rounded-none">
          <A4PreviewWrapper orientation={orientation}>
            <Card
              className="bg-white border-zinc-200 shadow-2xl overflow-hidden shrink-0 h-auto self-start"
              style={{
                width: orientation === "landscape" ? "1123px" : "794px",
                minHeight: orientation === "landscape" ? "794px" : "1123px"
              }}
            >
              <ContractContent
                contract={contract}
                company={company}
                template={template}
                primaryColor={primaryColor}
                ownerName={ownerName}
              />
            </Card>
          </A4PreviewWrapper>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-2 mb-8 text-xs text-zinc-400 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-fit mx-auto">
        <ZoomIn className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
        <span>Puedes hacer zoom deslizando la rueda del ratón (Ctrl + Scroll) o pellizcando la pantalla en móviles.</span>
      </div>
    </>
  )
}
