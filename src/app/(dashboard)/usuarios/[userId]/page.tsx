import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserById } from "@/actions/users"
import { getCompanies } from "@/actions/companies"
import { UserDetailClient } from "@/components/users/user-detail-client"

export default async function UserDetailPage(
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params
  const session = await auth()
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/")

  const user = await getUserById(params.userId)
  if (!user) {
    return <div className="p-6 text-zinc-400">Usuario no encontrado.</div>
  }

  const companies = await getCompanies()

  return <UserDetailClient user={user} companies={companies} />
}
