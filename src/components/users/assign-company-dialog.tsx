"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link, Loader2 } from "lucide-react"
import { assignUserToCompany } from "@/actions/users"

export function AssignCompanyDialog({ userId, companies }: { userId: string, companies: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [companyId, setCompanyId] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!companyId) {
      setError("Debes seleccionar una empresa")
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("companyId", companyId)

    const res = await assignUserToCompany(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-white/10 focus:bg-white/10 outline-none flex items-center gap-2 cursor-pointer">
        <Link className="w-4 h-4" />
        Vincular Empresa
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>Vincular Empresa</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Asigna este usuario como Administrador a una empresa existente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-md border border-red-900/50">{error}</div>}
          <div className="space-y-2">
            <Label className="text-zinc-300">Seleccionar Empresa</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className="bg-black/50 border-white/10 focus:ring-blue-500 text-zinc-100">
                <SelectValue placeholder="Empresas..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id} className="hover:bg-white/10 focus:bg-white/10">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Vincular"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
