import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getBypassPrisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) redirect("/login")

  if (session.user.role !== "SUPER_ADMIN") {
    const prisma = getBypassPrisma()
    const userCompany = await prisma.userCompany.findFirst({
      where: { userId: session.user.id, companyId: id },
      select: { id: true }
    })
    if (!userCompany) redirect("/panel")
  }

  const cookieStore = await cookies()
  cookieStore.set("factur_current_tenant", id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect("/panel")
}
