"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Edit2, KeyRound, X } from "lucide-react"
import { updateMyProfile } from "@/actions/users"
import { toast } from "sonner"

export function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password || currentPassword) {
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
    }
    
    const res = await updateMyProfile(formData)
    
    if (res.error) {
      toast.error(res.error)
    } else if (res.message) {
      toast.success(res.message)
      const form = e.target as HTMLFormElement
      if (form.currentPassword) form.currentPassword.value = ""
      if (form.password) form.password.value = ""
      if (form.confirmPassword) form.confirmPassword.value = ""
      setIsEditing(false)
      setIsChangingPassword(false)
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">Datos Personales</CardTitle>
            <CardDescription className="text-zinc-400 mt-1">
              Información de tu cuenta y credenciales de acceso.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-400 text-xs uppercase tracking-wider">Nombre Completo</Label>
              {isEditing ? (
                <Input id="name" name="name" defaultValue={user.name || ""} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
              ) : (
                <div className="text-white font-medium text-lg">{user.name || "Sin nombre"}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider">Correo Electrónico</Label>
              {isEditing ? (
                <Input id="email" name="email" type="email" defaultValue={user.email || ""} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
              ) : (
                <div className="text-zinc-300">{user.email || "Sin correo"}</div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            {!isChangingPassword ? (
              <Button type="button" variant="outline" onClick={() => { setIsChangingPassword(true); setIsEditing(true); }} className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white">
                <KeyRound className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </Button>
            ) : (
              <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-400" />
                    Cambiar Contraseña
                  </h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsChangingPassword(false)} className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-zinc-300">Contraseña Actual</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" placeholder="Requerida para autorizar el cambio" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-300">Nueva Contraseña</Label>
                    <Input id="password" name="password" type="password" placeholder="Ingresa la nueva contraseña" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-zinc-300">Confirmar Nueva Contraseña</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repite la nueva contraseña" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="pb-6 flex items-center gap-3 border-t border-white/10 pt-6">
            <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setIsChangingPassword(false); }} className="flex-1 sm:flex-none bg-transparent border-white/10 hover:bg-white/10 text-zinc-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Cambios"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  )
}

