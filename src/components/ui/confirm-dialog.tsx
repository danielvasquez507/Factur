"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className={`h-1.5 w-full rounded-t-xl ${isDanger ? "bg-gradient-to-r from-red-600 via-red-500 to-red-600" : "bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600"}`} />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDanger ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                {isDanger ? (
                  <Trash2 className="w-4 h-4 text-red-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">{title}</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 h-9 border-white/[0.07] bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/10 text-sm"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 h-9 text-sm font-medium shadow-lg border-0 ${
                isDanger
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-900/20"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-blue-900/20"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
