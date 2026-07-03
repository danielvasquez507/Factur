import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/dashboard/top-nav"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getUserCompanies, getActiveTenantId } from "@/actions/tenant"
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

  const companies = await getUserCompanies()
  const activeTenantId = await getActiveTenantId()

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
      <Sidebar userRole={session.user.role} pendingRequestsCount={pendingRequestsCount} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav user={session.user} companies={companies} activeTenantId={activeTenantId} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
