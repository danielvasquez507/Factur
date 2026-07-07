"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Globe, FileText, Hash, Plus, Loader2 } from "lucide-react"
import { createCompany } from "@/actions/companies"

export function CompanyDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const result = await createCompany(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white h-8 px-3 gap-1.5">
        <Plus className="w-3.5 h-3.5" />
        Nueva Empresa
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-zinc-950/95 border-white/[0.08] text-white backdrop-blur-xl shadow-2xl p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 rounded-t-xl" />
        <div className="p-5">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Añadir Empresa</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Crea un nuevo tenant en el sistema
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 text-xs text-red-500 bg-red-950/40 rounded-lg border border-red-900/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Nombre</Label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id="name" name="name" required placeholder="Ej. Empresa S.A." className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Slug</Label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input id="slug" name="slug" required placeholder="ej-empresa-sa" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">Solo minúsculas, números y guiones. Se usa para las URLs públicas.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ruc" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">RUC</Label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="ruc" name="ruc" placeholder="Opcional" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dv" className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">DV</Label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="dv" name="dv" placeholder="Opcional" className="bg-black/40 border-white/[0.07] text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-blue-500/50 pl-8 h-9" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-blue-900/20 border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Empresa"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
