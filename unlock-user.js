const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  await prisma.user.updateMany({
    where: { email: 'eliam.vasquez@gmail.com' },
    data: { failedLoginAttempts: 0, lockedUntil: null }
  })
  console.log('Usuario desbloqueado')
}
main().then(() => prisma.$disconnect())
