"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { validateLoginAttempt, getRemainingAttempts } from "@/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const preCheck = await validateLoginAttempt(email)
    if (preCheck.error) {
      setError(preCheck.error)
      setLoading(false)
      return
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      const attemptsState = await getRemainingAttempts(email)
      if (attemptsState?.error) {
        setError(attemptsState.error)
      } else {
        setError("Credenciales incorrectas")
      }
      setLoading(false)
    } else {
      window.location.href = "/panel"
    }
  }

  return (
    <div className="border border-white/5 bg-black/60 backdrop-blur-2xl shadow-2xl rounded-xl overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-950/30 rounded-lg border border-red-900/30 text-center animate-in fade-in zoom-in-95 duration-300">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider">Correo electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="tu@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-11 transition-all rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider">Contraseña</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-white/5 border-white/10 text-white pr-10 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-11 transition-all rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 space-y-4">
          <Button 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] text-sm font-semibold rounded-lg shadow-lg shadow-blue-900/20" 
            type="submit" 
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Iniciar sesión"}
          </Button>
          <div className="text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
              Ir al Sitio Web
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
