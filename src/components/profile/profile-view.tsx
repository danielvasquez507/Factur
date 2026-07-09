"use client"

import { useTheme } from "next-themes"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sparkles, LogOut, Settings, Building2 } from "lucide-react"
import Link from "next/link"
import { DeveloperCredits } from "@/components/dashboard/developer-credits"
import { ProfileForm } from "./profile-form"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function ProfileView({ user, activeCompanyId }: { user: any, activeCompanyId?: string | null }) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda: Datos del Usuario */}
      <div className="lg:col-span-2 space-y-8">
        <ProfileForm user={user} />

        <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Mis Empresas
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Empresas a las que tienes acceso y tu rol en ellas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.userCompanies?.length === 0 ? (
              <p className="text-sm text-zinc-500">No perteneces a ninguna empresa.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {user.userCompanies?.map((uc: any) => (
                  <div key={uc.company.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between hover:bg-white/10 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {uc.company.logoUrl ? (
                          <img src={uc.company.logoUrl} alt={uc.company.name} className="w-10 h-10 object-contain rounded-md" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {uc.company.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            {uc.company.name}
                            {activeCompanyId === uc.company.id && (
                              <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 text-[9px] px-1.5 py-0">
                                Activa
                              </Badge>
                            )}
                          </h4>
                          {uc.roleInCompany === "OWNER" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                              Propietario
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {uc.roleInCompany === "OWNER" && (
                      <Link href={`/configuracion`} className="mt-4">
                        <Button variant="outline" size="sm" className="w-full h-8 bg-transparent border-white/10 hover:bg-white/10 text-zinc-300">
                          <Settings className="w-3.5 h-3.5 mr-2" />
                          Configuración
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Apariencia y Sistema */}
      <div className="space-y-8">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Apariencia
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Personaliza el tema visual de la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={() => setTheme("dark")}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                mounted && theme === "dark" 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4" />
                <span className="font-medium">Oscuro</span>
              </div>
              {mounted && theme === "dark" && <span className="text-xs font-bold">Activo</span>}
            </button>
            <button
              onClick={() => setTheme("login")}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                mounted && theme === "login" 
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-100" 
                  : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-purple-300">Aurora</span>
              </div>
              {mounted && theme === "login" && <span className="text-xs font-bold text-purple-400">Activo</span>}
            </button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-red-400">Zona de Peligro</CardTitle>
            <CardDescription className="text-zinc-400">
              Cierra tu sesión de forma segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 transition-colors"
              onClick={async () => {
                const toastId = toast.loading("Cerrando sesión...")
                await signOut({ callbackUrl: '/' })
                toast.dismiss(toastId)
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>

        <DeveloperCredits variant="card" />
      </div>
    </div>
  )
}
