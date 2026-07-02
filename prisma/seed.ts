import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'info.danielvasquez@gmail.com'
  const password = '3.3.3.DEVR-24'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12)
    
    await prisma.user.create({
      data: {
        name: 'Daniel Vasquez',
        email,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
        maxCompanies: 999
      }
    })
    
    console.log('Super Admin user created successfully.')
  } else {
    console.log('Super Admin user already exists.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
