"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciales incorrectas")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="border border-white/5 bg-black/60 backdrop-blur-2xl shadow-2xl rounded-xl overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/30 rounded-lg border border-red-900/30 text-center animate-in fade-in zoom-in-95 duration-300">
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
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500 focus-visible:border-blue-500 h-11 transition-all rounded-lg"
            />
          </div>
        </div>
        <div className="pt-8">
          <Button 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] text-sm font-semibold rounded-lg shadow-lg shadow-blue-900/20" 
            type="submit" 
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar a mi cuenta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
