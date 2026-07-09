import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getContracts } from "@/actions/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { ContractTable } from "@/components/contracts/contract-table"

export default async function ContractsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  if (session.user.role === "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const contracts = await getContracts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Contratos</h1>
          <p className="text-zinc-400">Gestiona los contratos de los servicios asignados a tus clientes</p>
        </div>
        <Link href="/contratos/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Contrato
          </Button>
        </Link>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardContent className="p-0">
          {contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No hay contratos</h3>
              <p className="text-zinc-400 max-w-sm mb-8">Comienza a documentar formalmente los servicios asignados a tus clientes.</p>
              <Link href="/contratos/new">
                <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer contrato
                </Button>
              </Link>
            </div>
          ) : (
            <ContractTable contracts={contracts} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
