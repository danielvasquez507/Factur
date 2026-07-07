"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Lock, Loader2, CheckCircle2 } from "lucide-react"
import { changePassword } from "@/actions/profile"

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      setError("Las nuevas contraseñas no coinciden")
      setLoading(false)
      return
    }

    const res = await changePassword(formData)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white transition-colors" title="Cambiar Contraseña" />
        }
      >
        <KeyRound className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Cambiar Contraseña</DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-400 font-medium">¡Contraseña actualizada!</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3.5">
              {error && (
                <div className="p-2.5 text-xs text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Contraseña Actual</Label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="currentPassword" name="currentPassword" type="password" required className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="newPassword" name="newPassword" type="password" required minLength={6} className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Confirmar</Label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-blue-900/20 border-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Contraseña"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
