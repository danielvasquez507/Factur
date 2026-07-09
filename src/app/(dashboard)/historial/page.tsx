import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInvoices } from "@/actions/invoices"
import { getContracts } from "@/actions/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceTable } from "@/components/invoices/invoice-table"
import { ContractTable } from "@/components/contracts/contract-table"
import { FileText, Receipt } from "lucide-react"

export default async function HistorialPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [invoices, contracts] = await Promise.all([
    getInvoices(),
    getContracts()
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Historial</h1>
          <p className="text-zinc-400">Revisa todas tus facturas y contratos emitidos.</p>
        </div>
      </div>

      <Tabs defaultValue="facturas" className="w-full">
        <TabsList className="bg-black/40 border border-white/5 backdrop-blur-xl mb-6 p-1.5 rounded-2xl flex w-max max-w-full overflow-x-auto gap-1 shadow-2xl no-scrollbar h-auto">
          <TabsTrigger value="facturas" className="relative group flex-1 sm:flex-none items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-active:bg-blue-600 data-active:text-white data-active:shadow-[0_4px_20px_rgba(37,99,235,0.4)] text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border-none h-auto">
            <Receipt className="w-4 h-4 mr-2.5 opacity-80 group-data-active:opacity-100" />
            Facturas
            <span className="ml-2.5 text-[10px] tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/5 text-white shadow-inner group-data-active:bg-white/20">{invoices.length}</span>
          </TabsTrigger>
          <TabsTrigger value="contratos" className="relative group flex-1 sm:flex-none items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-active:bg-blue-600 data-active:text-white data-active:shadow-[0_4px_20px_rgba(37,99,235,0.4)] text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border-none h-auto">
            <FileText className="w-4 h-4 mr-2.5 opacity-80 group-data-active:opacity-100" />
            Contratos
            <span className="ml-2.5 text-[10px] tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/5 text-white shadow-inner group-data-active:bg-white/20">{contracts.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="facturas" className="mt-0">
          <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
            <CardContent className="p-0">
              <InvoiceTable invoices={invoices} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contratos" className="mt-0">
          <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
            <CardContent className="p-0">
              <ContractTable contracts={contracts} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
