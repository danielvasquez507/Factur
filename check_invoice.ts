import { getBypassPrisma } from './src/lib/prisma'
async function main() {
  const prisma = getBypassPrisma()
  const inv = await prisma.invoice.findUnique({
    where: { id: 'c9978651-fb27-4081-a66e-81673d3ed364' },
    include: { company: true }
  })
  console.log(inv)
}
main().catch(console.error)
