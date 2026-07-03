import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInvoiceDetails, generateInvoicePublicLink } from "@/actions/invoices"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Printer, Send, Download, Mail } from "lucide-react"

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
  const whatsappMsg = `Hola, te comparto la factura FAC-${invNum}. Puedes descargarla de forma segura aquí: ${publicLink}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`
  
  const emailMsg = `Hola,\n\nTe compartimos el enlace para descargar tu factura FAC-${invNum}:\n\n${publicLink}\n\nGracias por tu preferencia.`
  const emailUrl = `mailto:${invoice.client.email || ""}?subject=Factura FAC-${invNum} - ${invoice.company.name}&body=${encodeURIComponent(emailMsg)}`

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ISSUED": return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Emitida</Badge>
      case "PAID": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Pagada</Badge>
      case "VOID": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Anulada</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/invoices" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Facturas
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Factura FAC-{invNum}
            </h1>
            {getStatusBadge(invoice.status)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white" 
            render={<Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank" />}
            nativeButton={false}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 transition-colors" 
            render={<Link href={whatsappUrl} target="_blank" />}
            nativeButton={false}
          >
            <Send className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20" 
            render={<Link href={emailUrl} />}
            nativeButton={false}
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar por Email
          </Button>
        </div>
      </div>

      <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden max-w-[800px] mx-auto h-[800px]">
        <iframe 
          src={`/api/invoices/${invoice.id}/pdf`} 
          className="w-full h-full border-0" 
          title="Vista previa del documento PDF"
        />
      </Card>
    </div>
  )
}
