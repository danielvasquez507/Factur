import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/dashboard/top-nav"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider } from "@/components/dashboard/sidebar-provider"
import { MobileBottomNav, AutoHideHeader } from "@/components/dashboard/mobile-nav"
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

  // Auto-select first company if no tenant cookie is set
  if (!activeTenantId && companies.length > 0) {
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
      <SidebarProvider>
        {/* Solo mostrar la navegación si tiene un tenant activo o es SUPER_ADMIN */}
        {(activeTenantId || session.user.role === "SUPER_ADMIN") && (
          <Sidebar userRole={session.user.role} pendingRequestsCount={pendingRequestsCount} activeCompanyRole={activeCompanyRole} />
        )}
        <div className="flex flex-col flex-1 overflow-hidden">
          <AutoHideHeader
            userName={session.user.name}
            userEmail={session.user.email}
            userRole={session.user.role}
            companies={companies}
            activeTenantId={activeTenantId}
            activeCompanyRole={activeCompanyRole}
          />
          <TopNav user={session.user} activeCompanyRole={activeCompanyRole} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative pt-16 md:pt-0 pb-28 md:pb-8">
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
        {(activeTenantId || session.user.role === "SUPER_ADMIN") && (
          <MobileBottomNav userRole={session.user.role} pendingRequestsCount={pendingRequestsCount} />
        )}
      </SidebarProvider>
    </div>
  )
}
