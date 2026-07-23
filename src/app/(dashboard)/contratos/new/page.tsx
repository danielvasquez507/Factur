import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { getClients } from "@/actions/clients"
import { ContractForm } from "@/components/contracts/contract-form"
import { BackButton } from "@/components/ui/back-button"

export default async function NewContractPage(props: { searchParams: Promise<{ companyId?: string, clientId?: string }> }) {
  const session = await auth()
  const searchParams = await props.searchParams
  const companyId = searchParams.companyId
  const clientId = searchParams.clientId
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) redirect("/")

  const clients = await getClients(companyId)
  
  const prisma = getTenantPrisma(activeTenantId)
  
  const company = await prisma.company.findUnique({
    where: { id: activeTenantId },
    select: { contractSections: true, defaultContractTitle: true }
  })
  
  // Fetch all assigned services for all clients in this company to pass to the form
  const clientServices = await prisma.clientService.findMany({
    where: { companyId: activeTenantId, isActive: true },
    include: { service: true }
  })

  // Serialize decimals
  const serializedClientServices = clientServices.map(cs => ({
    ...cs,
    agreedPrice: Number(cs.agreedPrice),
    taxRate: Number(cs.taxRate),
    service: {
      ...cs.service,
      defaultPrice: Number(cs.service.defaultPrice)
    }
  }))

  return (
    <div className="space-y-6">
      <div>
        <BackButton label="Volver" />
        <h1 className="text-3xl font-bold tracking-tight text-white">Generar Contrato</h1>
      </div>

      <ContractForm 
        clients={clients} 
        clientServices={serializedClientServices} 
        companyId={companyId} 
        defaultClientId={clientId}
        contractSections={(company?.contractSections as string[]) || undefined}
        defaultTitle={company?.defaultContractTitle || "Contrato "}
      />
    </div>
  )
}
