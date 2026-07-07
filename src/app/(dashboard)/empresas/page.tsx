import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCompanies } from "@/actions/companies"
import { getUsers } from "@/actions/users"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyTable } from "@/components/companies/company-table"
import { CompanyDialog } from "@/components/companies/company-dialog"

export default async function CompaniesPage() {
  const session = await auth()

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/")
  }

  const companies = await getCompanies()
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-zinc-400 mt-1">
            Gestiona los tenants (empresas) del sistema Factur
          </p>
        </div>
        <CompanyDialog />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
        <CardContent className="p-0">
          <CompanyTable companies={companies} users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
