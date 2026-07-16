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

  const serializedContract = {
    ...contract,
    startDate: contract.startDate.toISOString(),
    endDate: contract.endDate ? contract.endDate.toISOString() : null,
    createdAt: contract.createdAt.toISOString(),
    updatedAt: contract.updatedAt.toISOString(),
    clientService: contract.clientService ? {
      ...contract.clientService,
      agreedPrice: Number(contract.clientService.agreedPrice),
      taxRate: Number(contract.clientService.taxRate),
      service: {
        ...contract.clientService.service,
        defaultPrice: Number(contract.clientService.service.defaultPrice)
      }
    } : null
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
