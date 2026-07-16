import { notFound } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export default async function PublicContractPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ token: string }> }) {
  const p = await props.params
  const s = await props.searchParams
  const id = p.id
  const token = s.token

  if (!token) {
    return notFound()
  }

  const pdfUrl = `/api/contracts/${id}/pdf?token=${token}`
  const downloadUrl = `/api/contracts/${id}/pdf?token=${token}&download=true`

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-zinc-950">
          <FileText className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Documento Legal</h1>
          <p className="text-zinc-400 text-sm">
            Su contrato ha sido generado exitosamente y está listo para ser visualizado o descargado.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <a href={downloadUrl} className={buttonVariants({ className: "w-full h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" })}>
            <Download className="w-5 h-5 mr-2" />
            Descargar Contrato
          </a>
          <a href={pdfUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", className: "w-full h-12 text-base font-medium bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700" })}>
            Ver en el navegador
          </a>
        </div>
      </div>
    </div>
  )
}
