import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkIsolation() {
  const companies = await prisma.company.findMany({
    include: { clients: true, invoices: true, services: true }
  })
  
  console.log("=== REPORTE DE EMPRESAS Y SUS DATOS ===")
  for (const c of companies) {
    console.log(`\nEmpresa: ${c.name} (ID: ${c.id})`)
    console.log(`- Clientes: ${c.clients.length}`)
    c.clients.forEach(client => console.log(`  * ${client.name}`))
    console.log(`- Servicios: ${c.services.length}`)
    console.log(`- Facturas: ${c.invoices.length}`)
  }
}

checkIsolation()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
