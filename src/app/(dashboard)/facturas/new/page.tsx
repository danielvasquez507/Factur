import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { getServices } from "@/actions/services"
import { getClients } from "@/actions/clients"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { BackButton } from "@/components/ui/back-button"

export default async function NewInvoicePage(props: { searchParams: Promise<{ companyId?: string }> }) {
  const session = await auth()
  const searchParams = await props.searchParams
  const companyId = searchParams.companyId
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) redirect("/")
  
  const clients = await getClients(companyId)

  const rawServices = await getServices(companyId)
  const services = rawServices.map(s => ({
    ...s,
    defaultPrice: Number(s.defaultPrice)
  }))

  return (
    <div className="space-y-6">
      <div>
        <BackButton label="Volver" />
        <h1 className="text-3xl font-bold tracking-tight text-white">Generar Factura</h1>
      </div>

      <InvoiceForm clients={clients} services={services} companyId={companyId} />
    </div>
  )
}
