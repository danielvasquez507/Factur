import { getBypassPrisma } from "./src/lib/prisma"

async function main() {
  const prisma = getBypassPrisma()
  const users = await prisma.user.findMany({ include: { userCompanies: { include: { company: true } } } })
  for (const u of users) {
    for (const uc of u.userCompanies) {
      console.log(`User ${u.email} -> Company ${uc.company.name}, Logo: ${uc.company.logoUrl ? "YES ("+uc.company.logoUrl.length+")" : "NO"}`)
    }
  }
}
main()
