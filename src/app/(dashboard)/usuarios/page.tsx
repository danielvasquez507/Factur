import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers } from "@/actions/users"
import { getCompanies } from "@/actions/companies"
import { Card, CardContent } from "@/components/ui/card"
import { UserTable } from "@/components/users/user-table"
import { UserDialog } from "@/components/users/user-dialog"

export default async function UsersPage() {
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/")

  const users = await getUsers()
  const companies = await getCompanies()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Usuarios</h1>
        </div>
        <UserDialog />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl [--card-spacing:0px]">
        <CardContent className="p-0">
          <UserTable users={users} companies={companies} />
        </CardContent>
      </Card>
    </div>
  )
}
