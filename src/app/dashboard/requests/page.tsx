import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPendingRequests, getHistoricalRequests } from "@/actions/requests"
import { Card, CardContent } from "@/components/ui/card"
import { RequestTable } from "@/components/requests/request-table"
import Link from "next/link"

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await auth()

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const { tab } = await searchParams
  const isHistory = tab === "history"

  const requests = isHistory ? await getHistoricalRequests() : await getPendingRequests()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitudes de Cambio</h1>
          <p className="text-zinc-400 mt-1">
            Revisa y aprueba los cambios sensibles solicitados por los administradores de las empresas.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <Link 
          href="/dashboard/requests" 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!isHistory ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          Pendientes
        </Link>
        <Link 
          href="/dashboard/requests?tab=history" 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isHistory ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          Historial
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardContent className="p-0">
          <RequestTable requests={requests} isHistory={isHistory} />
        </CardContent>
      </Card>
    </div>
  )
}
