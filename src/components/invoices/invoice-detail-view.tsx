"use client"

import { useState, useTransition, useRef, useCallback, useEffect } from "react"
import { format } from "date-fns"
import { Maximize2, X, Printer, Palette, LayoutTemplate, CheckCircle2, Loader2, RotateCcw, ZoomIn, CircleDot, ChevronDown, Coins, Smartphone, Landmark } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateInvoiceStatus } from "@/actions/invoices"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InvoiceShareActions } from "@/components/invoices/invoice-share-actions"
import { updateCompanyInvoiceStyle } from "@/actions/companies"

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

function formatCurrency(val: number | string) {
  return `$${Number(val).toFixed(2)}`
}

function getPaymentOptions(company: any) {
  try {
    if (company.paymentDetails) {
      const parsed = JSON.parse(company.paymentDetails)
      if (typeof parsed === "object") return parsed
    }
  } catch {}
  return null
}

// --- MODERN TEMPLATE ---
function ModernTemplate({ invoice, company, invNum, primaryColor }: any) {
  const paymentOpts = getPaymentOptions(company)
  return (
    <div className="bg-white text-zinc-900">
      <div className="h-28 px-8 pt-8 flex justify-between items-start" style={{ backgroundColor: primaryColor }}>
        <div className="w-3/5">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-14 object-contain" />
          ) : (
            <div className="text-3xl font-bold text-white tracking-tight">{company.name}</div>
          )}
          {company.ruc && <div className="text-xs text-white/80 mt-2">RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ""}</div>}
        </div>
        <div className="w-2/5 text-right">
          <div className="text-[10px] text-white/80 uppercase tracking-wider mb-1">Factura N°</div>
          <div className="text-2xl font-bold text-white">FAC-{invNum}</div>
        </div>
      </div>
      <div className="px-8 mt-6 flex justify-between">
        <div className="w-[45%]">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Facturado A</div>
          <div className="font-bold text-lg text-zinc-900">{invoice.client.name}</div>
          {invoice.client.email && <div className="text-sm text-zinc-500">{invoice.client.email}</div>}
          {invoice.client.phone && <div className="text-sm text-zinc-500">{invoice.client.phone}</div>}
        </div>
        <div className="w-[45%] bg-zinc-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">Emisión</span>
            <span className="text-sm font-semibold">{format(new Date(invoice.issueDate), "dd/MM/yyyy")}</span>
          </div>
          {invoice.dueDate && (
            <div className="flex justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">Vencimiento</span>
              <span className="text-sm font-semibold">{format(new Date(invoice.dueDate), "dd/MM/yyyy")}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-8 mt-6">
        <div className="flex px-4 py-3 rounded-lg mb-1" style={{ backgroundColor: primaryColor }}>
          <div className="text-xs font-bold text-white uppercase tracking-wider w-[50%]">Descripción</div>
          <div className="text-xs font-bold text-white uppercase tracking-wider w-[15%] text-center">Cant.</div>
          <div className="text-xs font-bold text-white uppercase tracking-wider w-[15%] text-right">Precio Unit.</div>
          <div className="text-xs font-bold text-white uppercase tracking-wider w-[20%] text-right">Total</div>
        </div>
        {invoice.items.map((item: any, i: number) => (
          <div key={item.id} className="flex px-4 py-3 border-b border-zinc-100" style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
            <div className="w-[50%] pr-3">
              <div className="text-sm font-semibold text-zinc-900">{item.description}</div>
              {item.service && <div className="text-[11px] text-zinc-400 mt-0.5">Ref: {item.service.name}</div>}
            </div>
            <div className="w-[15%] text-sm text-zinc-600 text-center self-center">{item.quantity}</div>
            <div className="w-[15%] text-sm text-zinc-600 text-right self-center">{formatCurrency(item.unitPrice)}</div>
            <div className="w-[20%] text-sm font-bold text-right self-center" style={{ color: primaryColor }}>{formatCurrency(item.lineTotal || item.total)}</div>
          </div>
        ))}
      </div>
      <div className="px-8 mt-4 flex justify-end">
        <div className="w-[45%] bg-zinc-50 p-5 rounded-lg">
          <div className="flex justify-between py-2">
            <span className="text-sm text-zinc-500">Subtotal</span>
            <span className="text-sm font-semibold text-zinc-900">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-zinc-500">ITBMS (7%)</span>
            <span className="text-sm font-semibold text-zinc-900">{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between pt-3 mt-2 font-bold text-base" style={{ borderTopWidth: 2, borderTopColor: primaryColor }}>
            <span style={{ color: primaryColor }}>Total USD</span>
            <span style={{ color: primaryColor }}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>
      {(invoice.notes || company.paymentDetails) && (
        <div className="px-8 mt-6 pb-8">
          {invoice.notes && (
            <div className="border-l-4 p-4 mb-4" style={{ borderLeftColor: primaryColor, backgroundColor: "#f4f4f5" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Notas / Términos</div>
              <p className="text-sm text-zinc-600 leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          {company.paymentDetails && (
            <div className="border-l-4 p-4" style={{ borderLeftColor: primaryColor, backgroundColor: "#f4f4f5" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Opciones de Pago</div>
              <RenderPaymentOptions paymentOpts={paymentOpts} company={company} />
            </div>
          )}
        </div>
      )}
      <div className="h-5" style={{ backgroundColor: primaryColor, opacity: 0.8 }} />
    </div>
  )
}

// --- CLASSIC TEMPLATE ---
function ClassicTemplate({ invoice, company, invNum, primaryColor }: any) {
  const paymentOpts = getPaymentOptions(company)
  return (
    <div className="bg-white text-zinc-900 p-10">
      <div className="flex justify-between items-center mb-10 pb-5" style={{ borderBottomWidth: 1, borderBottomColor: "#e4e4e7" }}>
        <div className="w-1/2">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-16 object-contain" />
          ) : (
            <div className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>{company.name}</div>
          )}
        </div>
        <div className="w-1/2 text-right">
          <div className="text-sm font-bold text-zinc-900 mb-1">{company.name}</div>
          {company.ruc && <div className="text-[11px] text-zinc-400">RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ""}</div>}
          {company.phone && <div className="text-[11px] text-zinc-400">Tel: {company.phone}</div>}
        </div>
      </div>
      <div className="flex justify-between mb-8">
        <div className="w-[45%]">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Facturado A:</div>
          <div className="font-bold text-base text-zinc-900">{invoice.client.name}</div>
          {invoice.client.email && <div className="text-sm text-zinc-500">{invoice.client.email}</div>}
          {invoice.client.phone && <div className="text-sm text-zinc-500">{invoice.client.phone}</div>}
        </div>
        <div className="w-[45%] text-right">
          <div className="flex justify-end mb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 mr-4 w-24 text-right">Factura N°:</span>
            <span className="text-sm font-bold w-24 text-right" style={{ color: primaryColor }}>FAC-{invNum}</span>
          </div>
          <div className="flex justify-end mb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 mr-4 w-24 text-right">Emisión:</span>
            <span className="text-sm w-24 text-right">{format(new Date(invoice.issueDate), "dd/MM/yyyy")}</span>
          </div>
          {invoice.dueDate && (
            <div className="flex justify-end">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 mr-4 w-24 text-right">Vencimiento:</span>
              <span className="text-sm w-24 text-right">{format(new Date(invoice.dueDate), "dd/MM/yyyy")}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex border-b-2 pb-2 mb-2" style={{ borderBottomColor: primaryColor }}>
        <div className="text-xs font-bold uppercase tracking-wider w-[50%]" style={{ color: primaryColor }}>Descripción</div>
        <div className="text-xs font-bold uppercase tracking-wider w-[15%] text-center" style={{ color: primaryColor }}>Cant.</div>
        <div className="text-xs font-bold uppercase tracking-wider w-[15%] text-right" style={{ color: primaryColor }}>Precio Unit.</div>
        <div className="text-xs font-bold uppercase tracking-wider w-[20%] text-right" style={{ color: primaryColor }}>Total</div>
      </div>
      {invoice.items.map((item: any) => (
        <div key={item.id} className="flex py-3 border-b border-zinc-100">
          <div className="w-[50%] pr-3">
            <div className="text-sm font-semibold text-zinc-900">{item.description}</div>
            {item.service && <div className="text-[11px] text-zinc-400 mt-0.5">Ref: {item.service.name}</div>}
          </div>
          <div className="w-[15%] text-sm text-zinc-600 text-center self-center">{item.quantity}</div>
          <div className="w-[15%] text-sm text-zinc-600 text-right self-center">{formatCurrency(item.unitPrice)}</div>
          <div className="w-[20%] text-sm font-bold text-right self-center">{formatCurrency(item.lineTotal || item.total)}</div>
        </div>
      ))}
      <div className="w-[40%] ml-auto mt-5 pt-3" style={{ borderTopWidth: 1, borderTopColor: "#e4e4e7" }}>
        <div className="flex justify-between py-1">
          <span className="text-sm text-zinc-500">Subtotal</span>
          <span className="text-sm font-semibold">{formatCurrency(invoice.subtotal)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-sm text-zinc-500">ITBMS (7%)</span>
          <span className="text-sm font-semibold">{formatCurrency(invoice.taxAmount)}</span>
        </div>
        <div className="flex justify-between pt-3 mt-2 font-bold text-base" style={{ borderTopWidth: 2, borderTopColor: primaryColor }}>
          <span style={{ color: primaryColor }}>Total USD</span>
          <span style={{ color: primaryColor }}>{formatCurrency(invoice.total)}</span>
        </div>
      </div>
      <div className="flex mt-10 gap-6">
        {invoice.notes && (
          <div className="flex-1 pt-3" style={{ borderTopWidth: 2, borderTopColor: "#f4f4f5" }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Notas / Términos</div>
            <p className="text-sm text-zinc-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
        {company.paymentDetails && (
          <div className="flex-1 pt-3" style={{ borderTopWidth: 2, borderTopColor: "#f4f4f5" }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Opciones de Pago</div>
            <RenderPaymentOptions paymentOpts={paymentOpts} company={company} />
          </div>
        )}
      </div>
      <div className="mt-10 pt-3 text-center" style={{ borderTopWidth: 1, borderTopColor: "#e4e4e7" }}>
        <div className="text-[11px] text-zinc-400 tracking-wider">{company.name} • Gracias por su preferencia</div>
      </div>
    </div>
  )
}

// --- MINIMAL TEMPLATE ---
function MinimalTemplate({ invoice, company, invNum, primaryColor }: any) {
  const paymentOpts = getPaymentOptions(company)
  return (
    <div className="bg-white text-zinc-900 p-12">
      <div className="flex justify-between mb-12">
        <div>
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="h-12 object-contain" />
          ) : (
            <div className="text-xl font-bold tracking-tight text-zinc-900">{company.name}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Factura</div>
          <div className="text-lg font-bold" style={{ color: primaryColor }}>FAC-{invNum}</div>
        </div>
      </div>
      <div className="h-px bg-zinc-200 mb-8" />
      <div className="flex justify-between mb-10">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Cliente</div>
          <div className="font-bold text-zinc-900">{invoice.client.name}</div>
          {invoice.client.email && <div className="text-sm text-zinc-500">{invoice.client.email}</div>}
          {invoice.client.phone && <div className="text-sm text-zinc-500">{invoice.client.phone}</div>}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Emisión</div>
          <div className="text-sm font-bold text-zinc-900">{format(new Date(invoice.issueDate), "dd/MM/yyyy")}</div>
          {invoice.dueDate && <div className="text-sm text-zinc-500 mt-1">Vence: {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</div>}
        </div>
      </div>
      <div className="flex border-b border-zinc-300 pb-2 mb-1">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider w-[50%]">Descripción</div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider w-[15%] text-center">Cant</div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider w-[15%] text-right">Precio</div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider w-[20%] text-right">Total</div>
      </div>
      {invoice.items.map((item: any) => (
        <div key={item.id} className="flex py-3 border-b border-zinc-100">
          <div className="w-[50%] pr-3">
            <div className="text-sm font-semibold text-zinc-900">{item.description}</div>
          </div>
          <div className="w-[15%] text-sm text-zinc-600 text-center self-center">{item.quantity}</div>
          <div className="w-[15%] text-sm text-zinc-600 text-right self-center">{formatCurrency(item.unitPrice)}</div>
          <div className="w-[20%] text-sm font-bold text-zinc-900 text-right self-center">{formatCurrency(item.lineTotal || item.total)}</div>
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <div className="w-44">
          <div className="flex justify-between py-1">
            <span className="text-sm text-zinc-500">Subtotal</span>
            <span className="text-sm text-zinc-900">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-zinc-500">ITBMS (7%)</span>
            <span className="text-sm text-zinc-900">{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 mt-1 font-bold text-base" style={{ borderTopWidth: 2, borderTopColor: "#18181b" }}>
            <span className="text-zinc-900">Total USD</span>
            <span style={{ color: primaryColor }}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>
      <div className="mt-10">
        {invoice.notes && (
          <div className="mb-4">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Notas</div>
            <p className="text-sm text-zinc-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
        {company.paymentDetails && (
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Métodos de Pago</div>
            <RenderPaymentOptions paymentOpts={paymentOpts} company={company} />
          </div>
        )}
      </div>
      <div className="mt-12 pt-3 text-center" style={{ borderTopWidth: 1, borderTopColor: "#e4e4e7" }}>
        <div className="text-[11px] text-zinc-400">
          {company.ruc ? `RUC: ${company.ruc}${company.dv ? ` DV: ${company.dv}` : ""}${company.phone ? "  ·  " : ""}` : ""}{company.phone || ""}
        </div>
      </div>
    </div>
  )
}

// --- CORPORATE TEMPLATE ---
function CorporateTemplate({ invoice, company, invNum, primaryColor }: any) {
  const paymentOpts = getPaymentOptions(company)
  return (
    <div className="bg-white text-zinc-900 p-10">
      <div className="pb-4 mb-1" style={{ borderBottomWidth: 3, borderBottomColor: primaryColor }}>
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-14 object-contain" />
            ) : null}
            <div>
              <div className="text-xl font-bold tracking-tight text-zinc-900">{company.name}</div>
              {company.ruc && <div className="text-[11px] text-zinc-500">RUC: {company.ruc}{company.dv ? `-${company.dv}` : ""}</div>}
              {company.phone && <div className="text-[11px] text-zinc-500">Tel: {company.phone}</div>}
              {company.address && <div className="text-[11px] text-zinc-500">{company.address}</div>}
            </div>
          </div>
          <div className="px-4 py-2 rounded-sm" style={{ backgroundColor: primaryColor }}>
            <div className="text-sm font-bold text-white uppercase tracking-wider">FAC-{invNum}</div>
          </div>
        </div>
      </div>
      <div className="h-px bg-zinc-200 mb-6" />
      <div className="text-base font-bold uppercase tracking-wider mb-6" style={{ color: primaryColor }}>
        Factura Comercial
      </div>
      <div className="flex justify-between mb-8 gap-4">
        <div className="flex-1 bg-zinc-50 p-4 rounded">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Facturado a</div>
          <div className="font-bold text-zinc-900">{invoice.client.name}</div>
          {invoice.client.email && <div className="text-sm text-zinc-500">{invoice.client.email}</div>}
          {invoice.client.phone && <div className="text-sm text-zinc-500">{invoice.client.phone}</div>}
        </div>
        <div className="flex-1 bg-zinc-50 p-4 rounded text-right">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Emisión</div>
            <div className="font-bold text-zinc-900">{format(new Date(invoice.issueDate), "dd/MM/yyyy")}</div>
          </div>
          {invoice.dueDate && (
            <div className="mt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Vencimiento</div>
              <div className="font-bold text-zinc-900">{format(new Date(invoice.dueDate), "dd/MM/yyyy")}</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex py-2 px-3 rounded-sm mb-1" style={{ backgroundColor: primaryColor }}>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider w-[50%]">Descripción</div>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider w-[12%] text-center">Cant.</div>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider w-[15%] text-right">P. Unit.</div>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider w-[10%] text-right">ITBMS</div>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider w-[13%] text-right">Total</div>
      </div>
      {invoice.items.map((item: any, i: number) => (
        <div key={item.id} className="flex py-2 px-3 border-b border-zinc-100" style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
          <div className="w-[50%] pr-3">
            <div className="text-sm font-semibold text-zinc-900">{item.description}</div>
            {item.service && <div className="text-[11px] text-zinc-400">Ref: {item.service.name}</div>}
          </div>
          <div className="w-[12%] text-sm text-zinc-600 text-center self-center">{item.quantity}</div>
          <div className="w-[15%] text-sm text-zinc-600 text-right self-center">{formatCurrency(item.unitPrice)}</div>
          <div className="w-[10%] text-sm text-zinc-600 text-right self-center">{item.applyTax ? formatCurrency(item.taxAmount || 0) : "$0.00"}</div>
          <div className="w-[13%] text-sm font-bold text-right self-center">{formatCurrency(item.lineTotal || item.total)}</div>
        </div>
      ))}
      <div className="flex justify-end mt-6">
        <div className="w-64 space-y-2">
          <div className="flex justify-between py-1">
            <span className="text-sm text-zinc-500">Subtotal</span>
            <span className="text-sm font-semibold text-zinc-900">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-zinc-500">ITBMS (7%)</span>
            <span className="text-sm font-semibold text-zinc-900">{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between py-2 px-3 mt-2 rounded-sm font-bold text-sm" style={{ backgroundColor: "#f8f8f8", borderTopWidth: 2, borderTopColor: primaryColor }}>
            <span style={{ color: primaryColor }}>Total USD</span>
            <span style={{ color: primaryColor }}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        {invoice.notes && (
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Notas</div>
            <p className="text-sm text-zinc-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
        {company.paymentDetails && (
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Métodos de Pago</div>
            <RenderPaymentOptions paymentOpts={paymentOpts} company={company} />
          </div>
        )}
      </div>
      <div className="mt-8 -mx-10 -mb-10 py-2 text-center" style={{ backgroundColor: primaryColor }}>
        <div className="text-[11px] text-white tracking-wider">
          {company.name}{company.ruc ? `  ·  RUC: ${company.ruc}${company.dv ? `-${company.dv}` : ""}` : ""}
        </div>
      </div>
    </div>
  )
}

function RenderPaymentOptions({ paymentOpts, company }: any) {
  if (!paymentOpts) {
    if (!company.paymentDetails) return null
    return <p className="text-sm text-zinc-600">{company.paymentDetails}</p>
  }
  return (
    <div className="text-sm text-zinc-600 space-y-2 mt-2">
      {paymentOpts.cash && (
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Efectivo</span>
        </div>
      )}
      {paymentOpts.yappy?.enabled && (
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Yappy</span>
        </div>
      )}
      {paymentOpts.ach?.enabled && (
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Transferencia ACH</span>
        </div>
      )}
    </div>
  )
}

function InvoiceContent({ invoice, company, invNum, template, primaryColor }: any) {
  switch (template) {
    case "classic":
      return <ClassicTemplate invoice={invoice} company={company} invNum={invNum} primaryColor={primaryColor} />
    case "minimal":
      return <MinimalTemplate invoice={invoice} company={company} invNum={invNum} primaryColor={primaryColor} />
    case "corporate":
      return <CorporateTemplate invoice={invoice} company={company} invNum={invNum} primaryColor={primaryColor} />
    default:
      return <ModernTemplate invoice={invoice} company={company} invNum={invNum} primaryColor={primaryColor} />
  }
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

function A4PreviewWrapper({ children, orientation = "portrait" }: { children: React.ReactNode, orientation?: "portrait" | "landscape" }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [baseScale, setBaseScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const touchRef = useRef<{ dist: number } | null>(null)
  
  const targetWidth = orientation === "landscape" ? 1123 : 794
  const defaultHeight = orientation === "landscape" ? 794 : 1123
  
  const [contentHeight, setContentHeight] = useState(defaultHeight)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const updateDimensions = () => {
      const parentWidth = containerRef.current?.clientWidth || 0
      const currentHeight = contentRef.current?.clientHeight || defaultHeight

      let currentScale = 1
      if (parentWidth < targetWidth && parentWidth > 0) {
        currentScale = parentWidth / targetWidth
      }

      setBaseScale(currentScale)
      setContentHeight(currentHeight)
    }

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })

    resizeObserver.observe(containerRef.current)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    updateDimensions()
    return () => resizeObserver.disconnect()
  }, [targetWidth, defaultHeight])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      setZoom(z => Math.max(0.5, Math.min(4, z + (e.deltaY > 0 ? -0.05 : 0.05))))
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
         e.touches[0].clientX - e.touches[1].clientX,
         e.touches[0].clientY - e.touches[1].clientY
      )
      touchRef.current = { dist }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    try {
      if (e.touches.length === 2 && touchRef.current && touchRef.current.dist) {
        const dist = Math.hypot(
           e.touches[0].clientX - e.touches[1].clientX,
           e.touches[0].clientY - e.touches[1].clientY
        )
        setZoom(z => Math.max(0.5, Math.min(4, z + (dist - touchRef.current!.dist) * 0.005)))
        touchRef.current = { dist }
      }
    } catch (err) {
      console.warn("Touch zoom error ignored", err)
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    touchRef.current = null
  }, [])

  const finalScale = baseScale * zoom

  return (
    <div className="w-full flex flex-col gap-2 relative">
      {/* Floating zoom indicator and reset */}
      {zoom !== 1 && (
        <div 
          className="absolute top-2 right-2 z-10 bg-zinc-900/90 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm border border-white/10 shadow-lg cursor-pointer hover:bg-zinc-800 transition-colors"
          onClick={() => setZoom(1)}
        >
          {Math.round(zoom * 100)}% - Restablecer
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="w-full overflow-auto rounded-xl border border-zinc-200/10 shadow-inner hide-scrollbar"
        style={{ maxHeight: '80vh' }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex justify-center min-w-full"
          style={{ 
            minWidth: `${targetWidth * finalScale}px`,
            height: `${contentHeight * finalScale}px`,
          }}
        >
          <div 
            style={{
              width: `${targetWidth * finalScale}px`,
              height: `${contentHeight * finalScale}px`,
              position: 'relative'
            }}
          >
            <div 
              ref={contentRef} 
              style={{ 
                transform: `scale(${finalScale})`, 
                transformOrigin: 'top left',
                width: `${targetWidth}px`,
                position: 'absolute',
                top: 0,
                left: 0
              }} 
              className="shrink-0 transition-transform duration-75"
            >
              {children}
            </div>
          </div>
        </div>
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

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate)
    startTransition(async () => {
      const fd = new FormData()
      fd.set("invoiceTemplate", newTemplate)
      fd.set("invoiceColor", color)
      await updateCompanyInvoiceStyle(fd)
    })
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    startTransition(async () => {
      const fd = new FormData()
      fd.set("invoiceTemplate", template)
      fd.set("invoiceColor", newColor)
      await updateCompanyInvoiceStyle(fd)
    })
  }

  const invNum = String(invoice.invoiceNumber).padStart(6, "0")
  const primaryColor = colorMap[color] || colorMap.slate

  const content = (
    <InvoiceContent
      invoice={invoice}
      company={company}
      invNum={invNum}
      template={template}
      primaryColor={primaryColor}
    />
  )

  return (
    <>
      <InvoiceShareActions
        invoiceId={invoice.id}
        publicLink={publicLink}
        clientEmail={invoice.client.email}
        invNum={invNum}
        companyName={company.name}
        template={template}
        color={color}
      >
        <Button
          variant="outline"
          onClick={() => setOrientation(o => o === "portrait" ? "landscape" : "portrait")}
          className="group bg-amber-500/10 backdrop-blur border-amber-500/30 hover:bg-amber-500 hover:text-white text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] rounded-full transition-all duration-300 h-10 px-4 py-2 sm:h-9 flex justify-center"
        >
          <RotateCcw className="w-4 h-4 mr-2 shrink-0" />
          <span>{orientation === "portrait" ? "Horizontal" : "Vertical"}</span>
        </Button>
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
              onTemplateChange={handleTemplateChange}
              onColorChange={handleColorChange}
            />
          </DialogContent>
        </Dialog>
        {template !== "modern" && (
          <span className="text-xs text-zinc-500 ml-auto">
            {templates.find(t => t.id === template)?.name} · {colorNames[color] || color}
          </span>
        )}
      </InvoiceShareActions>

      <div className="pb-4 w-full">
        <A4PreviewWrapper orientation={orientation}>
          <Card 
            className="bg-white border-zinc-200 shadow-2xl overflow-hidden shrink-0 h-auto self-start"
            style={{ 
              width: orientation === "landscape" ? "1123px" : "794px", 
              minHeight: orientation === "landscape" ? "794px" : "1123px" 
            }}
          >
            {content}
          </Card>
        </A4PreviewWrapper>
      </div>
      
      <div className="flex items-center justify-center gap-1.5 mt-2 mb-8 text-xs text-zinc-400 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-fit mx-auto">
        <ZoomIn className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
        <span>Puedes hacer zoom deslizando la rueda del ratón (Ctrl + Scroll) o pellizcando la pantalla en móviles.</span>
      </div>
    </>
  )
}
