import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInvoices } from "@/actions/invoices"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Plus, Search, FileText } from "lucide-react"
import { InvoiceTable } from "@/components/invoices/invoice-table"

export default async function InvoicesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Facturas</h1>
          <p className="text-zinc-400 mt-2">Gestiona el historial de facturación de esta empresa.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices/design" className={cn(buttonVariants({ variant: "outline" }), "bg-black/50 border-white/10 hover:bg-white/5 text-white gap-2 transition-all")}>
            <FileText className="w-4 h-4" />
            Diseño de Plantilla
          </Link>
          <Link href="/dashboard/invoices/new" className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all shadow-lg shadow-blue-900/20")}>
            <Plus className="w-4 h-4" />
            Generar Factura
          </Link>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
          <div>
            <CardTitle className="text-xl text-white">Historial</CardTitle>
            <CardDescription className="text-zinc-400">Listado de todas las facturas emitidas</CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md px-3 py-2 w-64 text-sm">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar factura o cliente..." 
              className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-600"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  )
}
