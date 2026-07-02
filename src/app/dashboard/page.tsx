import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CompanyDashboard } from "@/components/dashboard/company-dashboard"
import { SuperAdminDashboard } from "@/components/dashboard/super-admin-dashboard"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {session.user.role === "SUPER_ADMIN" ? (
        <SuperAdminDashboard />
      ) : (
        <CompanyDashboard />
      )}
    </div>
  )
}
