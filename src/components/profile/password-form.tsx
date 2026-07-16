"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react"
import { updateMyPassword } from "@/actions/users"
import { toast } from "sonner"

export function PasswordForm() {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!currentPassword) {
      toast.error("Debes ingresar tu contraseña actual para cambiarla")
      setLoading(false)
      return
    }
    if (!password) {
      toast.error("Debes ingresar una nueva contraseña")
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden")
      setLoading(false)
      return
    }
    
    const res = await updateMyPassword(formData)
    
    if (res?.error) {
      toast.error(res.error)
    } else if (res?.message) {
      toast.success(res.message)
      const form = e.target as HTMLFormElement
      form.reset()
      setIsEditing(false)
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-400" />
              Seguridad
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-1">
              Actualiza tu contraseña de acceso.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
              <KeyRound className="w-4 h-4 mr-2" />
              Cambiar
            </Button>
          )}
        </CardHeader>
        
        {isEditing && (
          <>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-zinc-300">Contraseña Actual</Label>
                <div className="relative">
                  <Input id="currentPassword" name="currentPassword" type={showCurrent ? "text" : "password"} placeholder="Requerida para autorizar el cambio" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500 pr-10" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Nueva Contraseña</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showNew ? "text" : "password"} placeholder="Ingresa la nueva contraseña" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500 pr-10" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirmar Nueva Contraseña</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repite la nueva contraseña" required className="bg-black/50 border-white/10 focus-visible:ring-blue-500 pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pb-6 flex items-center gap-3 border-t border-white/10 pt-6">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none bg-transparent border-white/10 hover:bg-white/10 text-zinc-300">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Contraseña"}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </form>
  )
}
