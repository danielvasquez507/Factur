"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { updateMyProfile } from "@/actions/users"
import { signOut } from "next-auth/react"

export function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password && password !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" })
      setLoading(false)
      return
    }
    
    const res = await updateMyProfile(formData)
    
    if (res.error) {
      setMessage({ text: res.error, type: "error" })
    } else if (res.message) {
      setMessage({ text: res.message, type: "success" })
      // Si el usuario cambió la contraseña o el correo, podría desloguearse en algunas configuraciones de NextAuth.
      // Damos la opción de reingresar, pero por ahora solo mostramos el mensaje.
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
          {message && (
            <div className={`p-3 mt-4 text-sm rounded-md border ${message.type === 'error' ? 'text-red-400 bg-red-950/50 border-red-900/50' : 'text-green-400 bg-green-950/50 border-green-900/50'}`}>
              {message.text}
            </div>
          )}
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
            <h4 className="text-sm font-medium text-white mb-4">Cambiar Contraseña (Opcional)</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Nueva Contraseña</Label>
                <Input id="password" name="password" type="password" placeholder="Déjalo en blanco para no cambiarla" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
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
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Perfil"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
