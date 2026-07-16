import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInvoiceDetails, generateInvoicePublicLink } from "@/actions/invoices"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { InvoiceDetailView } from "@/components/invoices/invoice-detail-view"
import { InvoiceStatusSelector } from "@/components/invoices/invoice-status-selector"

export default async function InvoiceDetailsPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await auth()

  if (!session?.user) redirect("/login")

  const invoice = await getInvoiceDetails(params.id)

  if (!invoice) {
    return <div className="p-6 text-zinc-400">Factura no encontrada.</div>
  }

  const linkRes = await generateInvoicePublicLink(invoice.id)
  const publicLink = linkRes.url || ""

  const invNum = String(invoice.invoiceNumber).padStart(6, '0')

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ISSUED": return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Emitida</Badge>
      case "PAID": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Pagada</Badge>
      case "VOID": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Anulada</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BackButton label="Volver" />
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              FAC-{invNum}
            </h1>
            {/* <InvoiceStatusSelector invoiceId={invoice.id} currentStatus={invoice.status} /> */}
          </div>
        </div>

      </div>

      <InvoiceDetailView invoice={invoice} company={invoice.company} publicLink={publicLink} />
    </div>
  )
}
