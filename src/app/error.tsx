"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center text-center space-y-4 max-w-md p-6 bg-zinc-900/50 rounded-2xl border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold">Algo salió mal</h2>
        <p className="text-sm text-zinc-400">
          Ocurrió un error inesperado al cargar esta pantalla.
        </p>
        <Button 
          onClick={() => reset()}
          className="mt-4 bg-white text-black hover:bg-zinc-200"
        >
          Intentar de nuevo
        </Button>
      </div>
    </div>
  )
}
