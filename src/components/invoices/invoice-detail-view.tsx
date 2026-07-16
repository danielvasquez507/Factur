"use client"

import { useState, useTransition, useEffect } from "react"
import { Maximize2, X, Printer, Palette, LayoutTemplate, CheckCircle2, Loader2, RotateCcw, ZoomIn, CircleDot, ChevronDown, Coins, Smartphone, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InvoiceShareActions } from "@/components/invoices/invoice-share-actions"
import { updateCompanyInvoiceStyle } from "@/actions/companies"
import dynamic from "next/dynamic"

// Import PDFCanvasViewer dynamically with ssr false
const PDFCanvasViewer = dynamic(
  () => import("./pdf-canvas-viewer"),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center text-zinc-400 bg-white border border-zinc-200"><Loader2 className="w-8 h-8 animate-spin" /></div> }
)
import { InvoicePDF } from "./invoice-pdf"

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

const templates = [
  { id: "modern", name: "Moderna" },
  { id: "classic", name: "Clásica" },
  { id: "minimal", name: "Minimalista" },
  { id: "corporate", name: "Corporativa" },
]

function TemplateSelector({ template: initialTemplate, color: initialColor, primaryColor, onApply }: any) {
  const [template, setTemplate] = useState(initialTemplate)
  const [color, setColor] = useState(initialColor)

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
              onClick={() => setTemplate(t.id)}
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
              onClick={() => setColor(c.id)}
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
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={() => onApply(template, color)}
          className="w-full sm:w-auto font-semibold"
          style={{ backgroundColor: primaryColor }}
        >
          Aplicar Cambios
        </Button>
      </div>
    </div>
  )
}

export function InvoiceDetailView({
  invoice,
  company,
  publicLink = "",
}: {
  invoice: any
  company: any
  publicLink?: string
}) {
  const [templateOpen, setTemplateOpen] = useState(false)
  const [template, setTemplate] = useState(company.invoiceTemplate || "modern")
  const [color, setColor] = useState(company.invoiceColor || "slate")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [isPending, startTransition] = useTransition()
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fix body scroll when maximized
  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMaximized])

  // Temporarily override company settings for live preview
  const previewCompany = { ...company, invoiceTemplate: template, invoiceColor: color }

  const handleApplyChanges = (newTemplate: string, newColor: string) => {
    setTemplate(newTemplate)
    setColor(newColor)
    setTemplateOpen(false)
    startTransition(async () => {
      const fd = new FormData()
      fd.set("invoiceTemplate", newTemplate)
      fd.set("invoiceColor", newColor)
      await updateCompanyInvoiceStyle(fd)
    })
  }

  const invNum = String(invoice.invoiceNumber).padStart(6, "0")
  const primaryColor = colorMap[color] || colorMap.slate

  return (
    <>
      <InvoiceShareActions
        invoiceId={invoice.id}
        publicLink={publicLink}
        clientEmail={invoice.client.email}
        invNum={invNum}
        companyName={company.name}
        companyRuc={company.ruc}
        companyDv={company.dv}
        companyAddress={company.address}
        template={template}
        color={color}
      >
        <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
          <DialogTrigger render={<Button
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
          </Button>} />
          <DialogContent 
            style={{ 
              borderColor: `${primaryColor}33`, 
              boxShadow: `0 0 50px ${primaryColor}1a` 
            }} 
            className="w-[95vw] max-w-lg bg-zinc-950/90 backdrop-blur-2xl border text-white p-6 rounded-3xl max-h-[85vh] overflow-y-auto"
          >
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Personalizar Factura
              </DialogTitle>
            </DialogHeader>
            <TemplateSelector
              template={template}
              color={color}
              primaryColor={primaryColor}
              onApply={handleApplyChanges}
            />
          </DialogContent>
        </Dialog>
        {template !== "modern" && (
          <span className="text-xs text-zinc-500 ml-auto">
            {templates.find(t => t.id === template)?.name} · {colorNames[color] || color}
          </span>
        )}
      </InvoiceShareActions>

      <div className={cn(
        "transition-all duration-300 w-full relative group",
        isMaximized ? "fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4" : "aspect-[1/1.414]"
      )}>
        {/* Maximize Button */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsMaximized(!isMaximized)}
          className={cn(
            "absolute z-10 rounded-full bg-black/50 hover:bg-black/80 text-white border-white/20 transition-all opacity-0 group-hover:opacity-100",
            isMaximized ? "top-4 right-4" : "top-2 right-2"
          )}
        >
          {isMaximized ? <X className="w-5 h-5" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        {isMounted && (
          <div className={cn(
            "w-full h-full relative overflow-hidden flex flex-col items-center justify-center",
            isMaximized ? "max-w-[1200px]" : "rounded-none"
          )}>
            <PDFCanvasViewer document={<InvoicePDF invoice={invoice} company={previewCompany} orientation={orientation} />} />
          </div>
        )}
      </div>
    </>
  )
}
