import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookieStore = await cookies()
  cookieStore.set("factur_current_tenant", id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect("/")
}
