import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getActiveTenantId } from "@/actions/tenant"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"
import { getTaxReport, getTopClientsReport } from "@/actions/reports"

export default async function ReportsPage() {
  const session = await auth()
  const activeTenantId = await getActiveTenantId()

  if (!session?.user) redirect("/login")
  if (!activeTenantId) {
    return <div className="p-6 text-zinc-400">Por favor, selecciona una empresa en la barra superior para ver los reportes.</div>
  }

  // Traemos la data inicial desde el servidor
  const taxData = await getTaxReport()
  const topClientsData = await getTopClientsReport()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-zinc-400 mt-1">
          Análisis financiero y métricas de tu empresa
        </p>
      </div>

      <ReportsDashboard initialTaxData={taxData} initialTopClients={topClientsData} />
    </div>
  )
}
