"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { updateMyProfile } from "@/actions/users"
import { toast } from "sonner"

export function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  
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
      form.currentPassword.value = ""
      form.password.value = ""
      form.confirmPassword.value = ""
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Datos Personales</CardTitle>
          <CardDescription className="text-zinc-400">
            Actualiza tu nombre de usuario, correo o contraseña de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Nombre Completo</Label>
              <Input id="name" name="name" defaultValue={user.name || ""} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" defaultValue={user.email || ""} required className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-white mb-4">Cambiar Contraseña</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-zinc-300">Contraseña Actual</Label>
                <Input id="currentPassword" name="currentPassword" type="password" placeholder="Requerida si deseas cambiar la contraseña" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
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
        </CardContent>
        <CardFooter className="pb-6">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Actualizar"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

