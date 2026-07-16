"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import { updateCompanySettings } from "@/actions/settings"
import { Checkbox } from "@/components/ui/checkbox"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CompanyProfileForm({ company, userRole }: { company: any, userRole?: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logoPreview, setLogoPreview] = useState(company.logoUrl || null)
  
  // Payment Options State
  let initialPayment = {
    cash: false,
    yappy: { enabled: false, phone: "" },
    ach: { enabled: false, owner: "", bank: "", accountType: "Ahorros", accountNumber: "" }
  }
  try {
    if (company.paymentDetails) {
      initialPayment = { ...initialPayment, ...JSON.parse(company.paymentDetails) }
    }
  } catch(e) {}
  const [paymentOpts, setPaymentOpts] = useState(initialPayment)
  
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingData, setPendingData] = useState<FormData | null>(null)
  const [changedFields, setChangedFields] = useState<string[]>([])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const requiresApproval = []
    
    const newName = formData.get("name") as string
    if (newName && newName !== company.name && company.name) requiresApproval.push("Nombre Comercial")
    
    const newRuc = formData.get("ruc") as string
    if (newRuc && newRuc !== (company.ruc || "") && company.ruc) requiresApproval.push("R.U.C.")
    
    const newDv = formData.get("dv") as string
    if (newDv && newDv !== (company.dv || "") && company.dv) requiresApproval.push("D.V.")
    
    const logoFile = formData.get("logo") as File | null
    if (logoFile && logoFile.size > 0 && company.logoUrl) requiresApproval.push("Logo de la Empresa")
    
    if (requiresApproval.length > 0) {
      setChangedFields(requiresApproval)
      setPendingData(formData)
      setConfirmOpen(true)
      return
    }
    
    await executeUpdate(formData)
  }

  const executeUpdate = async (formData: FormData) => {
    setLoading(true)
    setMessage("")
    setConfirmOpen(false)
    
    const res = await updateCompanySettings(formData)
    
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else if (res.success) {
      setMessage(res.pendingRequests ? "Cambios guardados. Los campos sensibles requieren aprobación del Super Admin." : "Cambios guardados correctamente.")
    }
    
    setLoading(false)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
    }
  }

  return (
    <form key={company.id} onSubmit={handleSubmit} className="space-y-8">
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Perfil de Facturación</CardTitle>
          <CardDescription className="text-zinc-400">
            Los cambios en el Nombre Comercial y el Logo pueden requerir aprobación del Super Admin.
          </CardDescription>
          {message && (
            <div className={`p-3 mt-4 text-sm rounded-md border ${message.startsWith('Error') ? 'text-red-500 bg-red-950/50 border-red-900/50' : 'text-green-400 bg-green-950/50 border-green-900/50'}`}>
              {message}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group flex items-center justify-center">
                {logoPreview ? (
                   <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                   <span className="text-zinc-500 text-sm">Sin Logo</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Label htmlFor="logo" className="cursor-pointer text-white flex flex-col items-center gap-1">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs">Subir Logo *</span>
                  </Label>
                  <Input type="file" id="logo" name="logo" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Nombre Comercial *</Label>
                <Input id="name" name="name" defaultValue={company.name} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruc" className="text-zinc-300">R.U.C. *</Label>
                  <Input id="ruc" name="ruc" defaultValue={company.ruc || ""} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dv" className="text-zinc-300">D.V. *</Label>
                  <Input id="dv" name="dv" defaultValue={company.dv || ""} maxLength={2} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-zinc-300">Dirección Física</Label>
                <Input id="address" name="address" defaultValue={company.address || ""} className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slogan" className="text-zinc-300">Eslogan de la Empresa</Label>
                <Input id="slogan" name="slogan" defaultValue={company.slogan || ""} placeholder="Escribe un eslogan o frase para tu empresa" className="bg-black/50 border-white/10 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
                <Label className="text-lg font-semibold text-white">Métodos de Pago Aceptados</Label>
                <input type="hidden" name="paymentDetails" value={JSON.stringify(paymentOpts)} />
                
                <div className="space-y-4">
                  {/* EFECTIVO */}
                  <div className="space-y-3 p-4 bg-white/5 rounded-md border border-white/10">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pay-cash" checked={paymentOpts.cash} onCheckedChange={(c) => setPaymentOpts({...paymentOpts, cash: !!c})} />
                      <Label htmlFor="pay-cash" className="text-zinc-300 cursor-pointer font-medium">Efectivo</Label>
                    </div>
                  </div>

                  {/* YAPPY */}
                  <div className="space-y-3 p-4 bg-white/5 rounded-md border border-white/10">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pay-yappy" checked={paymentOpts.yappy.enabled} onCheckedChange={(c) => setPaymentOpts({...paymentOpts, yappy: {...paymentOpts.yappy, enabled: !!c}})} />
                      <Label htmlFor="pay-yappy" className="text-zinc-300 cursor-pointer font-medium">Yappy</Label>
                    </div>
                  </div>

                  {/* ACH */}
                  <div className="space-y-3 p-4 bg-white/5 rounded-md border border-white/10">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pay-ach" checked={paymentOpts.ach.enabled} onCheckedChange={(c) => setPaymentOpts({...paymentOpts, ach: {...paymentOpts.ach, enabled: !!c}})} />
                      <Label htmlFor="pay-ach" className="text-zinc-300 cursor-pointer font-medium">Transferencia ACH</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pb-6">
          <p className="text-xs text-zinc-500">
            * Si estos campos ya cuentan con un valor registrado, su modificación generará una solicitud que deberá ser aprobada por un Super Administrador.
          </p>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Guardar Configuración"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar Actualización</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Estás modificando campos sensibles. Los siguientes cambios serán enviados como una solicitud de aprobación al Super Administrador:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc pl-6 text-sm text-zinc-300 py-4">
            {changedFields.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setConfirmOpen(false)} className="text-zinc-400 hover:text-white">Cancelar</Button>
            <Button type="button" onClick={() => pendingData && executeUpdate(pendingData)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
