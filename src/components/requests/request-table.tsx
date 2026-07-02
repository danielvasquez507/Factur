"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Bell, Check, X, Loader2, Maximize2 } from "lucide-react"
import { processRequest } from "@/actions/requests"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function RequestTable({ requests, isHistory = false }: { requests: any[], isHistory?: boolean }) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [zoomedImage, setZoomedImage] = useState<{ src: string, title: string } | null>(null)

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(id)
    await processRequest(id, action, action === "REJECT" ? "Rechazado por el administrador" : undefined)
    setProcessingId(null)
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

  return (
    <>
      <div className="relative overflow-x-auto rounded-md">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Empresa</TableHead>
              <TableHead className="text-zinc-400 font-medium">Tipo</TableHead>
              <TableHead className="text-zinc-400 font-medium">Valor Actual</TableHead>
              <TableHead className="text-zinc-400 font-medium">Nuevo Valor</TableHead>
              <TableHead className="text-zinc-400 font-medium">Solicitante</TableHead>
              {isHistory ? (
                <>
                  <TableHead className="text-zinc-400 font-medium">Estado</TableHead>
                  <TableHead className="text-zinc-400 font-medium text-right">Revisado el</TableHead>
                </>
              ) : (
                <TableHead className="text-zinc-400 font-medium text-right">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium text-white">{req.company.name}</TableCell>
                <TableCell className="text-zinc-400">
                  {getFieldTypeName(req.fieldType)}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {req.fieldType === "LOGO" && req.currentValue ? (
                    <div 
                      className="relative w-10 h-10 group cursor-pointer" 
                      onClick={() => setZoomedImage({ src: req.currentValue, title: "Logo Actual" })}
                    >
                      <img src={req.currentValue} alt="Logo Actual" className="w-10 h-10 rounded-md object-cover border border-white/10" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    req.currentValue || "-"
                  )}
                </TableCell>
                <TableCell className="text-zinc-300 font-semibold">
                  {req.fieldType === "LOGO" && req.requestedValue ? (
                    <div 
                      className="relative w-12 h-12 group cursor-pointer"
                      onClick={() => setZoomedImage({ src: req.requestedValue, title: "Nuevo Logo Solicitado" })}
                    >
                      <img src={req.requestedValue} alt="Nuevo Logo" className="w-12 h-12 rounded-md object-cover border-2 border-blue-500/50" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <span className="bg-white/5 px-2 py-1 rounded-md">{req.requestedValue}</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">{req.requestedBy.email}</TableCell>
                {isHistory ? (
                  <>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {req.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm text-right">
                      {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString() : '-'}
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAction(req.id, "APPROVE")}
                      disabled={processingId === req.id}
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                    >
                      {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleAction(req.id, "REJECT")}
                      disabled={processingId === req.id}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                    >
                      {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                )}
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
    </>
  )
}
