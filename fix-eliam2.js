const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { name: { contains: 'eliam', mode: 'insensitive' } }
  })
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: false }
    })
    console.log('Updated user:', user.name)
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
