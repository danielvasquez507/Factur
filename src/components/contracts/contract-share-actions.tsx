"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Send, Mail, Link as LinkIcon, Check } from "lucide-react"

type Props = {
  contractId: string
  clientEmail: string | null
  contractTitle: string
  companyName: string
  companyRuc?: string | null
  companyDv?: string | null
  companyAddress?: string | null
  template?: string
  color?: string
  orientation?: string
  children?: React.ReactNode
}

export function ContractShareActions({ contractId, clientEmail, contractTitle, companyName, companyRuc, companyDv, companyAddress, template, color, orientation, children }: Props) {
  const [copied, setCopied] = useState(false)
  const [publicLink, setPublicLink] = useState(`/api/contracts/${contractId}/pdf`)

  useEffect(() => {
    setPublicLink(`${window.location.origin}/api/contracts/${contractId}/pdf`)
  }, [contractId])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement("input")
      input.value = publicLink
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    window.open(publicLink, '_blank')
  }

  const pdfUrl = `/api/contracts/${contractId}/pdf${template || color || orientation ? `?${template ? `template=${template}` : ''}${template && color ? '&' : ''}${color ? `color=${color}` : ''}${(template || color) && orientation ? '&' : ''}${orientation ? `orientation=${orientation}` : ''}&download=true` : '?download=true'}`

  const companyInfo = `${companyName}\n${companyRuc ? `RUC: ${companyRuc}${companyDv ? ` DV: ${companyDv}` : ''}` : ''}\n${companyAddress ? `${companyAddress}` : ''}`.trim()

  const whatsappMsg = `*DOCUMENTO LEGAL - ${contractTitle.toUpperCase()}*\n\nEstimado cliente, reciba un cordial saludo de *${companyName}*.\n\nAdjuntamos el enlace directo y seguro para la revisión y descarga de su contrato en formato PDF:\n\n👉 *Verlo Aquí:* ${publicLink}\n\n*Datos del Emisor:*\n${companyInfo}\n\nGracias por su confianza.`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`

  const emailMsg = `Estimado cliente,\n\nReciba un cordial saludo de parte de ${companyName}.\n\nPor este medio le compartimos el enlace directo para la revisión y descarga de su contrato "${contractTitle}" en formato PDF:\n\n👉 Verlo Aquí: ${publicLink}\n\nAtentamente,\n\n${companyInfo}\n\nGracias por su confianza.`
  const emailUrl = `mailto:${clientEmail || ""}?subject=Contrato: ${contractTitle} - ${companyName}&body=${encodeURIComponent(emailMsg)}`

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-4">
      <Button
        variant="outline"
        className="group bg-zinc-900/80 backdrop-blur border-white/10 hover:bg-white hover:text-black text-white shadow-xl rounded-full transition-all duration-300 h-10 px-4 py-2 sm:h-9"
        render={<a href={pdfUrl} target="_blank" />}
        nativeButton={false}
      >
        <Download className="w-4 h-4 mr-2 text-zinc-400 group-hover:text-black transition-colors" />
        <span>PDF</span>
      </Button>
      <Button
        variant="outline"
        className="group bg-[#25D366]/10 backdrop-blur border-[#25D366]/30 hover:bg-[#25D366] text-[#25D366] hover:text-white shadow-[0_0_15px_rgba(37,211,102,0.1)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] rounded-full transition-all duration-300 h-10 px-4 py-2 sm:h-9"
        render={<a href={whatsappUrl} target="_blank" />}
        nativeButton={false}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4 mr-2">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span>WhatsApp</span>
      </Button>
      <Button
        variant="outline"
        className="group bg-blue-500/10 backdrop-blur border-blue-500/30 hover:bg-blue-500 hover:text-white text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-full transition-all duration-300 h-10 px-4 py-2 sm:h-9"
        render={<a href={emailUrl} />}
        nativeButton={false}
      >
        <Mail className="w-4 h-4 mr-2" />
        <span>Email</span>
      </Button>
      <Button
        variant="outline"
        className="group bg-zinc-900/80 backdrop-blur border-white/10 hover:bg-zinc-800 hover:border-white/20 text-zinc-300 hover:text-white shadow-xl rounded-full transition-all duration-300 h-10 px-4 py-2 sm:h-9"
        onClick={copyLink}
      >
        {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <LinkIcon className="w-4 h-4 mr-2 text-zinc-400 group-hover:text-white transition-colors" />}
        {copied ? <span className="text-emerald-400">Copiado</span> : <span>Enlace</span>}
      </Button>
      {children}
    </div>
  )
}
