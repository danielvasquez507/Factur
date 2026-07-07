import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInvoices } from "@/actions/invoices"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Plus } from "lucide-react"
import { InvoiceTable } from "@/components/invoices/invoice-table"

export default async function InvoicesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">Facturas</h1>
          <span className="text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">{invoices.length}</span>
        </div>
        <Link href="/facturas/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white h-8 px-3 gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Generar Factura
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
        <CardContent className="p-0">
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  )
}
