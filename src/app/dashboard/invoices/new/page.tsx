import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { getServices } from "@/actions/services"
import { getClients } from "@/actions/clients"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewInvoicePage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) redirect("/dashboard")
  
  // Obtenemos los clientes del tenant de forma segura
  const clients = await getClients()

  const rawServices = await getServices()
  const services = rawServices.map(s => ({
    ...s,
    defaultPrice: Number(s.defaultPrice)
  }))

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/invoices" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a Facturas
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">Generar Factura Manual</h1>
        <p className="text-zinc-400 mt-2">Crea una nueva factura seleccionando un cliente y agregando conceptos del catálogo o personalizados.</p>
      </div>

      <InvoiceForm clients={clients} services={services} />
    </div>
  )
}
