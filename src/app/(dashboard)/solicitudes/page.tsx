import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPendingRequests, getHistoricalRequests } from "@/actions/requests"
import { Card, CardContent } from "@/components/ui/card"
import { RequestTable } from "@/components/requests/request-table"
import Link from "next/link"

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await auth()

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/")
  }

  const { tab } = await searchParams
  const isHistory = tab === "history"

  const requests = isHistory ? await getHistoricalRequests() : await getPendingRequests()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Solicitudes</h1>
        </div>
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
          <Link 
            href="/solicitudes" 
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isHistory ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            Pendientes
          </Link>
          <Link 
            href="/solicitudes?tab=history" 
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isHistory ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            Historial
          </Link>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
        <CardContent className="p-0">
          <RequestTable requests={requests} isHistory={isHistory} />
        </CardContent>
      </Card>
    </div>
  )
}
