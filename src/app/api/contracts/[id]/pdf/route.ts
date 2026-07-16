import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"
import { incrementRateLimit } from "@/lib/rate-limit"
import { renderToStream } from "@react-pdf/renderer"
import { ContractPDF } from "@/components/contracts/contract-pdf"
import React from "react"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const searchParams = req.nextUrl.searchParams
  const isDownload = searchParams.get('download') === 'true'

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

  const session = await auth()
  if (!session?.user) {
    return new NextResponse("No autorizado. Inicie sesión.", { status: 401 })
  }

  const prisma = getBypassPrisma()
  const contract = await prisma.contract.findUnique({
    where: { id },
    select: { companyId: true }
  })

  if (!contract) return new NextResponse("Contrato no encontrado", { status: 404 })

  let authorizedCompanyId: string | null = null

  if (session.user.role === "SUPER_ADMIN") {
    authorizedCompanyId = contract.companyId
  } else {
    const userCompany = await prisma.userCompany.findUnique({
      where: { userId_companyId: { userId: session.user.id, companyId: contract.companyId } }
    })
    if (!userCompany) return new NextResponse("No autorizado para esta empresa", { status: 403 })
    authorizedCompanyId = contract.companyId
  }

  const fullContract = await prisma.contract.findUnique({
    where: { id, companyId: authorizedCompanyId },
    include: {
      client: {
        include: {
          clientServices: {
            include: { service: true }
          }
        }
      },
      clientService: {
        include: { service: true }
      },
      company: true,
    }
  })

  if (!fullContract) return new NextResponse("Contrato no encontrado", { status: 404 })

  const ownerRelation = await prisma.userCompany.findFirst({
    where: { companyId: authorizedCompanyId, roleInCompany: "OWNER" },
    include: { user: { select: { name: true } } }
  })
  const ownerName = ownerRelation?.user?.name || fullContract.company.name

  const orientation = (searchParams.get("orientation") as "portrait" | "landscape") || "portrait"

  try {
    const pdfStream = await renderToStream(React.createElement(ContractPDF, { contract: fullContract, company: fullContract.company, ownerName, orientation }) as any)

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
        "Content-Disposition": `${isDownload ? 'attachment' : 'inline'}; filename="Contrato_${fullContract.title.replace(/\s+/g, '_')}.pdf"`,
      }
    })
  } catch (error) {
    console.error("Error rendering PDF:", error)
    return new NextResponse("Error generando el PDF", { status: 500 })
  }
}
