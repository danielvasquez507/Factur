import { CompanyDashboard } from "@/components/dashboard/company-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TenantDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const { id } = await params

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-6">
        <Button variant="ghost" render={<Link href="/dashboard" />} nativeButton={false} className="text-zinc-400 hover:text-white -ml-4 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel Global
        </Button>
      </div>
      <CompanyDashboard tenantId={id} />
    </div>
  )
}
