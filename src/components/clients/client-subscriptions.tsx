"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Check, X, Unlink } from "lucide-react"
import { useRouter } from "next/navigation"
import { unlinkClientService } from "@/actions/subscriptions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

export function ClientSubscriptions({ subscriptions, clientId }: { subscriptions: any[], clientId: string }) {
  const router = useRouter()
  const [unlinking, setUnlinking] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Sin servicios asignados</h3>
        <p className="text-zinc-400 text-sm max-w-sm">Asigna un servicio del catálogo para definir qué le facturarás a este cliente.</p>
      </div>
    )
  }

  const totalCost = subscriptions.reduce((sum, sub) => sum + Number(sub.agreedPrice), 0)

  const handleUnlink = async () => {
    if (!unlinking) return
    setLoading(true)
    const res = await unlinkClientService(unlinking.id, clientId)
    setLoading(false)
    setUnlinking(null)
    if (res.error) toast.error(res.error)
    else toast.success("Servicio desvinculado exitosamente")
  }

  return (
    <>
      <div className="relative overflow-x-auto rounded-md">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Servicio</TableHead>
              <TableHead className="text-zinc-400 font-medium">Precio</TableHead>
              <TableHead className="text-zinc-400 font-medium">ITBMS 7%</TableHead>
              <TableHead className="text-zinc-400 font-medium text-right w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow 
                key={sub.id} 
                className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => router.push(`/servicios/${sub.serviceId}`)}
              >
                <TableCell className="font-medium text-white">{sub.service.name}</TableCell>
                <TableCell className="text-zinc-300 font-semibold">${Number(sub.agreedPrice).toFixed(2)}</TableCell>
                <TableCell className="text-zinc-400">
                  {sub.applyTax ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-600" />
                  )}
                </TableCell>
                <TableCell className="text-right w-10" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    title="Desvincular servicio"
                    onClick={() => setUnlinking(sub)}
                  >
                    <Unlink className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-white/10 bg-white/5">
              <TableCell className="font-semibold text-white">Total</TableCell>
              <TableCell className="text-white font-bold">${totalCost.toFixed(2)}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!unlinking} onOpenChange={(open) => !open && setUnlinking(null)}>
        <AlertDialogContent className="bg-zinc-950 border-white/10 text-white backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              ¿Desvincular servicio?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Se desvinculará <strong className="text-white">"{unlinking?.service?.name}"</strong> de este cliente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleUnlink}
              disabled={loading}
            >
              {loading ? "Desvinculando..." : "Sí, desvincular"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
