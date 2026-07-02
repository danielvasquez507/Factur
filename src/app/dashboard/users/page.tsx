import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers } from "@/actions/users"
import { getCompanies } from "@/actions/companies"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import { UserTable } from "@/components/users/user-table"
import { UserDialog } from "@/components/users/user-dialog"

export default async function UsersPage() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/dashboard")

  const users = await getUsers()
  const companies = await getCompanies()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Usuarios Administradores</h1>
          <p className="text-zinc-400 mt-2">Gestiona el acceso de los administradores y vincúlalos a las empresas.</p>
        </div>
        <UserDialog />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
          <div>
            <CardTitle className="text-xl text-white">Directorio de Usuarios</CardTitle>
            <CardDescription className="text-zinc-400">Listado de todos los COMPANY_ADMIN</CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md px-3 py-2 w-64 text-sm">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar usuario..." 
              className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-600"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable users={users} companies={companies} />
        </CardContent>
      </Card>
    </div>
  )
}
