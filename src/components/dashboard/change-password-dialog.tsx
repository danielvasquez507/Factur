"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Loader2 } from "lucide-react"
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
    
    // Validación rápida en cliente
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
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="py-6 text-center text-emerald-400">
            ¡Contraseña actualizada exitosamente!
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input 
                id="currentPassword" 
                name="currentPassword" 
                type="password" 
                required 
                className="bg-black/50 border-white/10 focus-visible:ring-blue-500" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input 
                id="newPassword" 
                name="newPassword" 
                type="password" 
                required 
                minLength={6}
                className="bg-black/50 border-white/10 focus-visible:ring-blue-500" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                minLength={6}
                className="bg-black/50 border-white/10 focus-visible:ring-blue-500" 
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Actualizar Contraseña
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
