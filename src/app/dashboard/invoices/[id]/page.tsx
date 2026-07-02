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
  const whatsappMsg = `Hola, te comparto la factura INV-${invNum}. Puedes descargarla de forma segura aquí: ${publicLink}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`
  
  const emailMsg = `Hola,\n\nTe compartimos el enlace para descargar tu factura INV-${invNum}:\n\n${publicLink}\n\nGracias por tu preferencia.`
  const emailUrl = `mailto:${invoice.client.email || ""}?subject=Factura INV-${invNum} - ${invoice.company.name}&body=${encodeURIComponent(emailMsg)}`

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
              Factura INV-{String(invoice.invoiceNumber).padStart(6, '0')}
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

      {invoice.company.invoiceTemplate === 'classic' ? (
        <Card className="bg-white text-black rounded-sm border-zinc-200 shadow-xl overflow-hidden max-w-[800px] mx-auto p-8 font-serif">
          {/* Cabecera Clásica Centrada */}
          <div className="flex flex-col items-center mb-8 border-b border-zinc-300 pb-6">
            {invoice.company.logoUrl ? (
              <img src={invoice.company.logoUrl} alt="Logo" className="h-16 object-contain mb-4" />
            ) : (
              <div className="text-2xl font-black mb-2">{invoice.company.name}</div>
            )}
            <h2 className={`text-2xl font-bold uppercase tracking-widest ${invoice.company.invoiceColor === 'blue' ? 'text-blue-900' : invoice.company.invoiceColor === 'emerald' ? 'text-emerald-900' : 'text-slate-900'}`}>
              Factura Comercial
            </h2>
            <div className="text-zinc-500 mt-2 text-sm">
              {invoice.company.ruc && <span>RUC: {invoice.company.ruc} {invoice.company.dv && `DV: ${invoice.company.dv}`} | </span>}
              <span>N° INV-{String(invoice.invoiceNumber).padStart(6, '0')}</span>
            </div>
          </div>

          {/* Fechas y Cliente */}
          <div className="flex justify-between items-start mb-8 text-sm">
            <div>
              <h3 className="font-bold uppercase text-zinc-600 mb-1">Facturado a:</h3>
              <p className="font-bold text-lg">{invoice.client.name}</p>
              <p className="text-zinc-600">{invoice.client.email}</p>
              {invoice.client.phone && <p className="text-zinc-600">{invoice.client.phone}</p>}
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-bold text-zinc-600 uppercase">Fecha de Emisión: </span>
                <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              {invoice.dueDate && (
                <div>
                  <span className="font-bold text-zinc-600 uppercase">Vencimiento: </span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabla Clásica */}
          <div className="mb-8">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className={`border-b-2 border-zinc-300 ${invoice.company.invoiceColor === 'blue' ? 'text-blue-900' : invoice.company.invoiceColor === 'emerald' ? 'text-emerald-900' : 'text-slate-900'}`}>
                  <th className="py-2 font-bold uppercase">Descripción</th>
                  <th className="py-2 font-bold uppercase text-right">Cant.</th>
                  <th className="py-2 font-bold uppercase text-right">Precio Unit.</th>
                  <th className="py-2 font-bold uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {invoice.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-3">
                      <span className="font-medium">{item.description}</span>
                      {item.service && <span className="block text-xs text-zinc-500">Ref: {item.service.name}</span>}
                    </td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                    <td className="py-3 text-right font-medium">${Number(item.lineTotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales Clásicos */}
          <div className="flex justify-end border-t-2 border-zinc-300 pt-4 mb-8">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>${Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>ITBMS (7%)</span>
                <span>${Number(invoice.taxAmount).toFixed(2)}</span>
              </div>
              <div className={`flex justify-between font-bold text-lg pt-2 border-t border-zinc-200 ${invoice.company.invoiceColor === 'blue' ? 'text-blue-900' : invoice.company.invoiceColor === 'emerald' ? 'text-emerald-900' : 'text-slate-900'}`}>
                <span>Total USD</span>
                <span>${Number(invoice.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {invoice.notes && (
            <div className="border-t border-zinc-200 pt-4 text-sm text-zinc-600">
              <h3 className="font-bold uppercase mb-1">Notas / Términos</h3>
              <p className="whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="bg-zinc-950 border-white/10 shadow-2xl overflow-hidden max-w-[800px] mx-auto">
          {/* Cabecera Moderna */}
          <div className="bg-white/5 p-8 border-b border-white/10 flex justify-between items-start">
            <div>
              {invoice.company.logoUrl ? (
                <img src={invoice.company.logoUrl} alt="Logo" className="h-12 object-contain mb-4 rounded-md bg-white/10 p-1" />
              ) : (
                <h2 className="text-2xl font-bold text-white mb-2">{invoice.company.name}</h2>
              )}
              {invoice.company.ruc && <p className="text-zinc-400 text-sm mt-1">RUC: {invoice.company.ruc}</p>}
            </div>
            <div className="text-right">
              <h1 className={`text-3xl font-black uppercase tracking-tighter mb-4 ${invoice.company.invoiceColor === 'blue' ? 'text-blue-500' : invoice.company.invoiceColor === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`}>
                INVOICE
              </h1>
              <div className="text-sm text-zinc-400">Fecha de Emisión</div>
              <div className="font-medium text-white mb-2">{new Date(invoice.issueDate).toLocaleDateString()}</div>
              
              {invoice.dueDate && (
                <div>
                  <div className="text-sm text-zinc-400">Vencimiento</div>
                  <div className="font-medium text-white">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between bg-black/20">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Facturado a:</h3>
              <p className="text-lg font-medium text-white">{invoice.client.name}</p>
              <p className="text-zinc-400">{invoice.client.email}</p>
              {invoice.client.phone && <p className="text-zinc-400">{invoice.client.phone}</p>}
            </div>
            <div className="text-right mt-4 sm:mt-0">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">N° de Factura:</h3>
              <p className="text-xl font-mono text-white">INV-{String(invoice.invoiceNumber).padStart(6, '0')}</p>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className={`border-b border-white/10 ${invoice.company.invoiceColor === 'blue' ? 'bg-blue-500/10' : invoice.company.invoiceColor === 'emerald' ? 'bg-emerald-500/10' : 'bg-slate-500/10'}`}>
                <tr>
                  <th className="py-3 px-8 text-xs font-medium text-zinc-300 uppercase tracking-wider">Descripción</th>
                  <th className="py-3 px-4 text-xs font-medium text-zinc-300 uppercase tracking-wider text-right">Cant.</th>
                  <th className="py-3 px-4 text-xs font-medium text-zinc-300 uppercase tracking-wider text-right">Precio Unit.</th>
                  <th className="py-3 px-8 text-xs font-medium text-zinc-300 uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoice.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 px-8 text-sm text-white">
                      {item.description}
                      {item.service && <span className="block text-xs text-zinc-500 mt-1">Ref: {item.service.name}</span>}
                    </td>
                    <td className="py-4 px-4 text-sm text-zinc-300 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-sm text-zinc-300 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                    <td className="py-4 px-8 text-sm font-medium text-white text-right">${Number(item.lineTotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white/5 p-8 border-t border-white/10 flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>${Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>ITBMS (7%)</span>
                <span>${Number(invoice.taxAmount).toFixed(2)}</span>
              </div>
              <div className={`flex justify-between font-bold text-xl pt-3 border-t border-white/10 ${invoice.company.invoiceColor === 'blue' ? 'text-blue-400' : invoice.company.invoiceColor === 'emerald' ? 'text-emerald-400' : 'text-slate-300'}`}>
                <span>Total USD</span>
                <span>${Number(invoice.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="p-8 border-t border-white/10 bg-black/40">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Notas / Términos:</h3>
              <p className="text-zinc-400 text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
