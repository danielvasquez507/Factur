import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/dashboard/top-nav"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getUserCompanies, getActiveTenantId } from "@/actions/tenant"

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

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar userRole={session.user.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav user={session.user} companies={companies} activeTenantId={activeTenantId} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[128px] pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
