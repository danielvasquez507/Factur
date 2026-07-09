import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DockNav } from "@/components/dashboard/dock-nav"
import { getUserCompanies, getActiveTenantId, getActiveCompanyRole } from "@/actions/tenant"
import { getBypassPrisma } from "@/lib/prisma"
import { DynamicBackground } from "@/components/dashboard/dynamic-background"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const bypassPrisma = getBypassPrisma()
  const dbUser = await bypassPrisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true }
  })

  if (dbUser && !dbUser.onboardingCompleted) {
    redirect('/onboarding')
  }

  const companies = await getUserCompanies()

  const activeTenantId = await getActiveTenantId()
  const activeCompanyRole = await getActiveCompanyRole()

  // Auto-select first company if no tenant cookie is set (except for SUPER_ADMIN)
  if (!activeTenantId && companies.length > 0 && session.user.role !== "SUPER_ADMIN") {
    redirect(`/api/switch-company/${companies[0].id}`)
  }

  let pendingRequestsCount = 0
  if (session.user.role === "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    pendingRequestsCount = await prisma.changeRequest.count({
      where: { status: "PENDING" }
    })
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <DynamicBackground />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative pb-28 md:pb-28">
          <div className="relative z-10">
            {children}
          </div>
        </main>
        
        {/* Dock Navigation */}
        <DockNav userRole={session.user.role} pendingRequestsCount={pendingRequestsCount} />
      </div>
    </div>
  )
}
