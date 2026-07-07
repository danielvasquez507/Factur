import { CompanyDashboard } from "@/components/dashboard/company-dashboard"
import { BackButton } from "@/components/ui/back-button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TenantDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/")
  }

  const { id } = await params

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-6">
        <BackButton label="Volver al Panel Global" />
      </div>
      <CompanyDashboard tenantId={id} />
    </div>
  )
}
