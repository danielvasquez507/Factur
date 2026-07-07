"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Bell, Check, X, Loader2, Maximize2, Building2, FileText, User, Calendar, Hash } from "lucide-react"
import { processRequest } from "@/actions/requests"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

export function RequestTable({ requests, isHistory = false }: { requests: any[], isHistory?: boolean }) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [zoomedImage, setZoomedImage] = useState<{ src: string, title: string } | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(id)
    await processRequest(id, action, action === "REJECT" ? "Rechazado por el administrador" : undefined)
    setProcessingId(null)
    setSelectedRequest(null)
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Bell className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Sin solicitudes {isHistory ? "en el historial" : "pendientes"}</h3>
        <p className="text-zinc-400 text-sm max-w-sm">No hay cambios {isHistory ? "en el registro histórico" : "pendientes por revisar"}.</p>
      </div>
    )
  }

  const getFieldTypeName = (type: string) => {
    switch(type) {
      case "NAME": return "Nombre Comercial"
      case "LOGO": return "Logo de la Empresa"
      case "RUC": return "R.U.C."
      case "DV": return "D.V."
      default: return type
    }
  }

  const RequestDetailDialog = ({ req }: { req: any }) => (
    <DialogContent className="sm:max-w-[500px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-t-xl" />
      <div className="p-5">
        <DialogHeader className="mb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-white">
                {isHistory ? "Detalle de Solicitud" : "Revisar Cambio"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                {req.company.name} • {getFieldTypeName(req.fieldType)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-zinc-400 flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-zinc-500" />
              Empresa
            </span>
            <span className="text-white font-medium text-sm">{req.company.name}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-zinc-400 flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-zinc-500" />
              Campo a Modificar
            </span>
            <span className="text-white font-medium text-sm">{getFieldTypeName(req.fieldType)}</span>
          </div>

          <div className="flex items-start justify-between py-2 border-b border-white/5">
            <span className="text-zinc-400 flex items-center gap-2 text-sm shrink-0">
              <FileText className="w-4 h-4 text-zinc-500" />
              Valor Actual
            </span>
            <div className="text-right ml-4">
              {req.fieldType === "LOGO" && req.currentValue ? (
                <div
                  className="relative w-20 h-20 group cursor-pointer inline-block"
                  onClick={() => setZoomedImage({ src: req.currentValue, title: "Logo Actual" })}
                >
                  <img src={req.currentValue} alt="Logo Actual" className="w-20 h-20 rounded-md object-cover border border-white/10" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <span className="text-white font-mono text-sm break-all">{req.currentValue || "—"}</span>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between py-2 border-b border-white/5">
            <span className="text-zinc-400 flex items-center gap-2 text-sm shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
              Nuevo Valor
            </span>
            <div className="text-right ml-4">
              {req.fieldType === "LOGO" && req.requestedValue ? (
                <div
                  className="relative w-20 h-20 group cursor-pointer inline-block"
                  onClick={() => setZoomedImage({ src: req.requestedValue, title: "Nuevo Logo Solicitado" })}
                >
                  <img src={req.requestedValue} alt="Nuevo Logo" className="w-20 h-20 rounded-md object-cover border-2 border-blue-500/50" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <span className="text-blue-300 font-semibold font-mono text-sm break-all">{req.requestedValue || "—"}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-zinc-400 flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-zinc-500" />
              Solicitante
            </span>
            <span className="text-white font-medium text-sm">{req.requestedBy.name || req.requestedBy.email}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-zinc-400 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-zinc-500" />
              Fecha Creación
            </span>
            <span className="text-white font-medium text-sm">{req.createdAt ? formatDate(req.createdAt) : '—'}</span>
          </div>

          {isHistory && (
            <>
              <div className="flex items-center justify-between py-2 border-t border-white/10 mt-2">
                <span className="text-zinc-400 text-sm">Estado</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                  {req.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-400 text-sm">Fecha de Finalización</span>
                <span className="text-white font-medium text-sm">{req.reviewedAt ? formatDate(req.reviewedAt) : '—'}</span>
              </div>
            </>
          )}
        </div>

        {!isHistory && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
            <Button
              size="sm"
              onClick={() => handleAction(req.id, "APPROVE")}
              disabled={processingId === req.id}
              className="flex-1 h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium text-sm shadow-lg shadow-green-900/20 border-0"
            >
              {processingId === req.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleAction(req.id, "REJECT")}
              disabled={processingId === req.id}
              className="flex-1 h-9 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-sm shadow-lg shadow-red-900/20 border-0"
            >
              {processingId === req.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
              Rechazar
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  )

  return (
    <>
      <div className="relative overflow-x-auto rounded-md">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Empresa</TableHead>
              <TableHead className="sm:hidden text-zinc-400 font-medium">Solicitud</TableHead>
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Tipo</TableHead>
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Valor Actual</TableHead>
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Nuevo Valor</TableHead>
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Solicitante</TableHead>
              <TableHead className="text-zinc-400 font-medium max-sm:hidden">Fecha Creación</TableHead>
              {isHistory ? (
                <>
                  <TableHead className="text-zinc-400 font-medium">Estado</TableHead>
                  <TableHead className="text-zinc-400 font-medium text-right max-sm:hidden">Fecha Finalización</TableHead>
                </>
              ) : (
                <TableHead className="text-zinc-400 font-medium text-right max-sm:hidden">Acciones</TableHead>
              )}
              <TableHead className="sm:hidden w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow
                key={req.id}
                className="border-white/10 hover:bg-white/5 transition-colors sm:cursor-default cursor-pointer"
                onClick={() => setSelectedRequest(req)}
              >
                <TableCell className="font-medium text-white max-sm:hidden">{req.company.name}</TableCell>
                <TableCell className="sm:hidden">
                  <div className="flex flex-col gap-0.5 py-0.5">
                    <span className="text-sm font-medium text-white truncate max-w-[140px]">{req.company.name}</span>
                    <span className="text-xs text-zinc-500">{getFieldTypeName(req.fieldType)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 max-sm:hidden">
                  {getFieldTypeName(req.fieldType)}
                </TableCell>
                <TableCell className="text-zinc-500 max-sm:hidden max-w-[150px] truncate">
                  {req.fieldType === "LOGO" && req.currentValue ? (
                    <div
                      className="relative w-10 h-10 group cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setZoomedImage({ src: req.currentValue, title: "Logo Actual" }) }}
                    >
                      <img src={req.currentValue} alt="Logo Actual" className="w-10 h-10 rounded-md object-cover border border-white/10" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <span className="truncate block">{req.currentValue || "—"}</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-300 font-semibold max-sm:hidden max-w-[150px]">
                  {req.fieldType === "LOGO" && req.requestedValue ? (
                    <div
                      className="relative w-12 h-12 group cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setZoomedImage({ src: req.requestedValue, title: "Nuevo Logo Solicitado" }) }}
                    >
                      <img src={req.requestedValue} alt="Nuevo Logo" className="w-12 h-12 rounded-md object-cover border-2 border-blue-500/50" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <span className="bg-white/5 px-2 py-1 rounded-md truncate block">{req.requestedValue}</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-400 text-sm max-sm:hidden">{req.requestedBy.name || req.requestedBy.email}</TableCell>
                <TableCell className="text-zinc-400 text-sm max-sm:hidden">{req.createdAt ? formatDate(req.createdAt) : '—'}</TableCell>
                {isHistory ? (
                  <>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                        {req.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm text-right max-sm:hidden">
                      {req.reviewedAt ? formatDate(req.reviewedAt) : '—'}
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="text-right max-sm:hidden">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleAction(req.id, "APPROVE") }}
                        disabled={processingId === req.id}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                      >
                        {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => { e.stopPropagation(); handleAction(req.id, "REJECT") }}
                        disabled={processingId === req.id}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                      >
                        {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                      </Button>
                    </div>
                  </TableCell>
                )}
                <TableCell className="sm:hidden">
                  {isHistory ? (
                    <span className={`inline-block w-2 h-2 rounded-full ${req.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'}`} />
                  ) : (
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <DialogContent className="sm:max-w-xl bg-zinc-950 border-white/10 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle>{zoomedImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6 bg-white/5 rounded-xl border border-white/10 mt-4">
            {zoomedImage && (
              <img src={zoomedImage.src} alt={zoomedImage.title} className="max-w-full max-h-[60vh] object-contain rounded-md shadow-2xl" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        {selectedRequest && <RequestDetailDialog req={selectedRequest} />}
      </Dialog>
    </>
  )
}
