import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getContractById } from "@/actions/contracts"
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"
import { getActiveTenantId } from "@/actions/tenant"
import { ContractDetailView } from "@/components/contracts/contract-detail-view"
import { generateContractPublicLink } from "@/actions/contracts"
import { BackButton } from "@/components/ui/back-button"

export default async function ContractPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ companyId?: string }> }) {
  const session = await auth()
  const params = await props.params
  const searchParams = await props.searchParams
  const companyId = searchParams.companyId
  const activeTenantId = companyId || await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) redirect("/")

  const contract = await getContractById(params.id, activeTenantId)
  if (!contract) return notFound()

  const prisma = getTenantPrisma(activeTenantId)
  const company = await prisma.company.findUnique({
    where: { id: activeTenantId }
  })
  
  if (!company) return notFound()

  const bypassPrisma = getBypassPrisma()
  const ownerRelation = await bypassPrisma.userCompany.findFirst({
    where: { companyId: activeTenantId, roleInCompany: "OWNER" },
    include: { user: { select: { name: true } } }
  })
  const ownerName = ownerRelation?.user?.name || company.name

  const serializableContract = {
    ...contract,
    clientService: contract.clientService ? {
      ...contract.clientService,
      agreedPrice: contract.clientService.agreedPrice.toString(),
      taxRate: contract.clientService.taxRate.toString(),
      service: contract.clientService.service ? {
        ...contract.clientService.service,
        defaultPrice: contract.clientService.service.defaultPrice.toString(),
      } : null
    } : null,
    client: contract.client ? {
      ...contract.client,
      clientServices: contract.client.clientServices ? contract.client.clientServices.map(cs => ({
        ...cs,
        agreedPrice: cs.agreedPrice.toString(),
        taxRate: cs.taxRate.toString(),
        service: cs.service ? {
          ...cs.service,
          defaultPrice: cs.service.defaultPrice.toString(),
        } : null
      })) : []
    } : contract.client
  }
  const linkRes = await generateContractPublicLink(contract.id)
  const publicLink = linkRes.url || ""

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BackButton label="Volver a contratos" />
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              {contract.title}
            </h1>
          </div>
        </div>
      </div>

      <ContractDetailView contract={serializedContract} company={company} ownerName={ownerName} publicLink={publicLink} />
    </div>
  )
}
