import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import { incrementRateLimit } from "@/lib/rate-limit"
import jwt from "jsonwebtoken"
import { renderToStream } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoices/invoice-pdf"
import React from "react"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const searchParams = req.nextUrl.searchParams
  const token = searchParams.get("token")

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown"
  const rl = incrementRateLimit(ip, 30, 15 * 60 * 1000)
  if (!rl.success) {
    return new NextResponse("Demasiadas solicitudes. Intente más tarde.", {
      status: 429,
      headers: { "Retry-After": "900" },
    })
  }

  let authorizedCompanyId: string | null = null

  // Autorización: Vía Token JWT (Público temporal) o Vía Sesión (Privado)
  if (token) {
    try {
      const secret = process.env.AUTH_SECRET || "facturdv_fallback_secret"
      const decoded = jwt.verify(token, secret) as { invoiceId: string, companyId: string }
      if (decoded.invoiceId !== id) {
        return new NextResponse("Token no válido para esta factura", { status: 403 })
      }
      authorizedCompanyId = decoded.companyId
    } catch (e) {
      return new NextResponse("Token expirado o inválido", { status: 403 })
    }
  } else {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("No autorizado. Inicie sesión o utilice un enlace seguro.", { status: 401 })
    }
    
    const prisma = getBypassPrisma()
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: { companyId: true }
    })
    
    if (!invoice) return new NextResponse("Factura no encontrada", { status: 404 })
    
    if (session.user.role === "SUPER_ADMIN") {
      authorizedCompanyId = invoice.companyId
    } else {
      const userCompany = await prisma.userCompany.findUnique({
        where: { userId_companyId: { userId: session.user.id, companyId: invoice.companyId } }
      })
      if (!userCompany) return new NextResponse("No autorizado para esta empresa", { status: 403 })
      authorizedCompanyId = invoice.companyId
    }
  }

  if (!authorizedCompanyId) {
    return new NextResponse("Autorización fallida", { status: 403 })
  }

  const prisma = getBypassPrisma()
  const fullInvoice = await prisma.invoice.findUnique({
    where: { id, companyId: authorizedCompanyId },
    include: {
      client: true,
      items: true,
      company: true,
    }
  })

  if (!fullInvoice) return new NextResponse("Factura no encontrada", { status: 404 })

  const template = searchParams.get("template") || fullInvoice.company.invoiceTemplate || "modern"
  const color = searchParams.get("color") || fullInvoice.company.invoiceColor || "slate"

  try {
    const pdfStream = await renderToStream(React.createElement(InvoicePDF, { invoice: fullInvoice, company: { ...fullInvoice.company, invoiceTemplate: template, invoiceColor: color } }) as any)

    // El stream retornado por react-pdf es un stream de NodeJS, lo envolvemos en un ReadableStream de web para NextResponse
    const webStream = new ReadableStream({
      start(controller) {
        pdfStream.on('data', (chunk) => controller.enqueue(chunk))
        pdfStream.on('end', () => controller.close())
        pdfStream.on('error', (err) => controller.error(err))
      }
    })

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Factura_${fullInvoice.invoiceNumber}.pdf"`,
      }
    })
  } catch (error) {
    console.error("Error rendering PDF:", error)
    return new NextResponse("Error generando el PDF", { status: 500 })
  }
}
