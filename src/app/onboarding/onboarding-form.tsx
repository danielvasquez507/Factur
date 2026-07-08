"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboarding } from "@/actions/onboarding"
import { Loader2, Upload, Lock, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const router = useRouter()

  const [compressedLogo, setCompressedLogo] = useState<File | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("El logo no debe pesar más de 8MB")
        e.target.value = ""
        return
      }

      const reader = new FileReader()
      reader.onloadend = (event) => {
        const img = new Image()
        img.onload = () => {
          // Resize if needed and compress
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL("image/webp", 0.8)
          setLogoPreview(dataUrl)

          // Convert dataURL back to File for formData without using fetch
          const [header, base64] = dataUrl.split(',')
          const mimeString = header.split(':')[1].split(';')[0]
          const byteString = atob(base64)
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          const blob = new Blob([ab], { type: mimeString })
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), { type: "image/webp" })
          
          setCompressedLogo(newFile)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      setLogoPreview(null)
      setCompressedLogo(null)
    }
  }

  const formAction = (formData: FormData) => {
    setError("")
    if (compressedLogo) {
      formData.set("logo", compressedLogo)
    }
    startTransition(async () => {
      const result = await completeOnboarding(formData)
      if (result.error) {
        setError(result.error)
      } else {
        window.location.href = "/"
      }
    })
  }

  return (
    <form action={formAction} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-2 text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold">Paso 1: Seguridad (Obligatorio)</h2>
        </div>
        
        <div className="space-y-2">
          <Label className="text-zinc-400">Nueva Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              type="password" 
              name="password" 
              required 
              minLength={6}
              className="pl-9 bg-zinc-950/50 border-white/10 text-white" 
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-zinc-400">Confirmar Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              type="password" 
              name="confirmPassword" 
              required 
              minLength={6}
              className="pl-9 bg-zinc-950/50 border-white/10 text-white" 
              placeholder="Vuelve a escribir la contraseña"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-2 text-white">
          <Upload className="w-5 h-5 text-purple-400" />
          <h2 className="font-semibold">Paso 2: Logo de Empresa (Opcional)</h2>
        </div>
        
        <div className="space-y-3">
          <Label className="text-zinc-400 text-sm block">Sube el logo que aparecerá en tus facturas.</Label>
          
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-white/20 bg-zinc-950/50 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
              ) : (
                <Upload className="w-6 h-6 text-zinc-600" />
              )}
            </div>
            
            <div className="flex-1">
              <Input 
                type="file" 
                name="logo" 
                accept="image/*"
                onChange={handleLogoChange}
                className="bg-zinc-950/50 border-white/10 text-zinc-300 file:bg-white/10 file:text-white file:border-0 file:rounded-md file:px-3 file:mr-3 hover:file:bg-white/20 transition-colors cursor-pointer" 
              />
              <p className="text-[10px] text-zinc-500 mt-1">Máx 8MB (se optimizará al subir). Formatos: PNG, JPG, SVG.</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-white text-black hover:bg-zinc-200 h-11 text-base font-semibold"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Guardando y accediendo...
          </>
        ) : (
          "Guardar y Continuar"
        )}
      </Button>
    </form>
  )
}
