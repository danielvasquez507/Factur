import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { InvoiceDesignForm } from "@/components/settings/invoice-design-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function InvoiceDesignPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!activeTenantId) {
    return <div className="p-6">Por favor, selecciona una empresa en la barra superior.</div>
  }

  const prisma = getBypassPrisma()
  const company = await prisma.company.findUnique({
    where: { id: activeTenantId }
  })

  if (!company) {
    return <div className="p-6">Empresa no encontrada.</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" className="text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diseño de Plantilla</h1>
          <p className="text-zinc-400 mt-1">
            Personaliza cómo se verán las facturas generadas para {company.name}
          </p>
        </div>
      </div>
      
      <InvoiceDesignForm 
        initialTemplate={company.invoiceTemplate} 
        initialColor={company.invoiceColor} 
        company={company}
      />
    </div>
  )
}
