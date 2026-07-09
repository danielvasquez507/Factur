import { getBypassPrisma } from './src/lib/prisma'

async function main() {
  const prisma = getBypassPrisma()
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: 'eliam',
        mode: 'insensitive'
      }
    }
  })

  console.log("Found users:", users.map(u => u.name))

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: false }
    })
    console.log(`Updated user ${user.name} to onboardingCompleted: false`)
  }
}

main().catch(console.error)
