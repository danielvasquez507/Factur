import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getTenantPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { getClients } from "@/actions/clients"
import { getContractById } from "@/actions/contracts"
import { ContractForm } from "@/components/contracts/contract-form"
import { BackButton } from "@/components/ui/back-button"

export default async function EditContractPage(
  props: { params: Promise<{ id: string }>, searchParams: Promise<{ companyId?: string }> }
) {
  const session = await auth()
  const params = await props.params
  const searchParams = await props.searchParams
  const companyId = searchParams.companyId
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) redirect("/")

  const contract = await getContractById(params.id, activeTenantId)
  if (!contract) return notFound()

  const clients = await getClients(companyId)
  
  const prisma = getTenantPrisma(activeTenantId)
  const clientServices = await prisma.clientService.findMany({
    where: { companyId: activeTenantId, isActive: true },
    include: { service: true }
  })

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
        <h1 className="text-3xl font-bold tracking-tight text-white">Editar Contrato</h1>
      </div>

      <ContractForm 
        clients={clients} 
        clientServices={serializedClientServices} 
        companyId={activeTenantId} 
        initialData={contract}
      />
    </div>
  )
}
