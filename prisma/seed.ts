import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, max: 5 })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // ── Usuario Super Admin ──
  const passwordHash = await bcrypt.hash("3.3.3.DEVR-24", 12)

  const adminUser = await prisma.user.create({
    data: {
      name: "Daniel Vásquez",
      email: "info.danielvasquez@gmail.com",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      maxCompanies: 10,
    },
  })
  console.log(`  ✓ Usuario: ${adminUser.email}`)

  // ── Empresa ──
  const company = await prisma.company.create({
    data: {
      name: "Factur DV",
      slug: "factur-dv",
      ruc: "123456789",
      dv: "001",
      phone: "+507 6000-0000",
      address: "Ciudad de Panamá, Panamá",
      invoiceTemplate: "modern",
      invoiceColor: "blue",
      paymentDetails: JSON.stringify({
        bank: "Banco General",
        accountType: "Corriente",
        accountNumber: "04-1234-5678",
        titular: "Factur DV S.A.",
      }),
      nextInvoiceNumber: 1,
      isActive: true,
    },
  })
  console.log(`  ✓ Empresa: ${company.name}`)

  // ── Vincular admin a la empresa ──
  await prisma.userCompany.create({
    data: {
      userId: adminUser.id,
      companyId: company.id,
      roleInCompany: "OWNER",
    },
  })
  console.log("  ✓ Admin vinculado a empresa")

  // ── Servicios ──
  const servicesData = [
    { name: "Soporte Técnico Mensual", description: "Mantenimiento y soporte técnico de equipos", defaultPrice: 150.00 },
    { name: "Desarrollo Web", description: "Diseño y desarrollo de sitios web", defaultPrice: 500.00 },
    { name: "Hosting Premium", description: "Alojamiento web con SSL y backups", defaultPrice: 25.00 },
    { name: "Consultoría TI", description: "Asesoría en infraestructura tecnológica", defaultPrice: 200.00 },
    { name: "Seguridad Informática", description: "Auditoría y monitoreo de seguridad", defaultPrice: 300.00 },
    { name: "Marketing Digital", description: "Gestión de redes sociales y campañas", defaultPrice: 350.00 },
  ]

  const services = []
  for (const svc of servicesData) {
    const service = await prisma.service.create({
      data: {
        companyId: company.id,
        name: svc.name,
        description: svc.description,
        defaultPrice: svc.defaultPrice,
        isActive: true,
      },
    })
    services.push(service)
  }
  console.log(`  ✓ ${services.length} servicios creados`)

  // ── Clientes ──
  const clientsData = [
    { name: "Carlos Mendoza", celular: "6000-1001", email: "carlos@ejemplo.com", phone: "200-1001", direccion: "Calle 50, Edificio Omega", authorizedPersons: ["María Mendoza"] },
    { name: "Ana Rodríguez", celular: "6000-1002", email: "ana@ejemplo.com", phone: "200-1002", direccion: "Vía España, Torre Global" },
    { name: "Pedro Sánchez", celular: "6000-1003", email: "pedro@ejemplo.com", phone: "200-1003" },
    { name: "Lucía Fernández", celular: "6000-1004", email: "lucia@ejemplo.com", direccion: "San Francisco, Calle 53" },
    { name: "Roberto Gómez", celular: "6000-1005", phone: "200-1005", authorizedPersons: ["Laura Gómez", "Diego Gómez"] },
    { name: "María Castillo", celular: "6000-1006", email: "maria@ejemplo.com", phone: "200-1006", direccion: "Costa del Este, Av. Principal" },
    { name: "José Martínez", celular: "6000-1007", email: "jose@ejemplo.com" },
    { name: "Elena Torres", celular: "6000-1008", direccion: "Bella Vista, Calle 47" },
    { name: "Diego Rivera", celular: "6000-1009", email: "diego@ejemplo.com", phone: "200-1009", authorizedPersons: ["Sofía Rivera"] },
    { name: "Sofía Vargas", celular: "6000-1010", email: "sofia@ejemplo.com", direccion: "El Cangrejo, Calle D" },
  ]

  const clients = []
  for (const c of clientsData) {
    const client = await prisma.client.create({
      data: {
        companyId: company.id,
        name: c.name,
        celular: c.celular,
        email: c.email || null,
        phone: c.phone || null,
        direccion: c.direccion || null,
        authorizedPersons: c.authorizedPersons || [],
        isActive: true,
      },
    })
    clients.push(client)
  }
  console.log(`  ✓ ${clients.length} clientes creados`)

  // ── Asignar servicios a algunos clientes ──
  const assignments = [
    { clientIdx: 0, serviceIdx: 0, price: 150.00, applyTax: true, frequency: "MONTHLY" },
    { clientIdx: 0, serviceIdx: 2, price: 25.00, applyTax: false, frequency: "MONTHLY" },
    { clientIdx: 1, serviceIdx: 1, price: 450.00, applyTax: true, frequency: "MANUAL" },
    { clientIdx: 2, serviceIdx: 0, price: 130.00, applyTax: true, frequency: "MONTHLY" },
    { clientIdx: 3, serviceIdx: 3, price: 250.00, applyTax: true, frequency: "MANUAL" },
    { clientIdx: 4, serviceIdx: 4, price: 300.00, applyTax: true, frequency: "MONTHLY" },
    { clientIdx: 5, serviceIdx: 5, price: 350.00, applyTax: false, frequency: "MONTHLY" },
    { clientIdx: 5, serviceIdx: 0, price: 150.00, applyTax: true, frequency: "MONTHLY" },
    { clientIdx: 6, serviceIdx: 2, price: 25.00, applyTax: false, frequency: "MONTHLY" },
    { clientIdx: 8, serviceIdx: 1, price: 500.00, applyTax: true, frequency: "MANUAL" },
  ]

  let assignCount = 0
  for (const a of assignments) {
    await prisma.clientService.create({
      data: {
        clientId: clients[a.clientIdx].id,
        serviceId: services[a.serviceIdx].id,
        companyId: company.id,
        agreedPrice: a.price,
        applyTax: a.applyTax,
        taxRate: 0.07,
        billingFrequency: a.frequency as any,
        nextBillingDate: a.frequency === "MONTHLY" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : null,
        isActive: true,
      },
    })
    assignCount++
  }
  console.log(`  ✓ ${assignCount} servicios asignados a clientes`)

  // ── Usuarios adicionales (Eliam, Zuriel) ──
  await seedAdditionalUsers(prisma)

  console.log("✅ Seed completado exitosamente!")
}

async function seedAdditionalUsers(prisma: PrismaClient) {
  const bcrypt = await import("bcryptjs")
  const DEFAULT_PASS = "123456"

  // ── 1. ELIAM VASQUEZ ──
  const eliamPass = await bcrypt.hash(DEFAULT_PASS, 12)

  const eliamUser = await prisma.user.upsert({
    where: { email: "eliam.vasquez@gmail.com" },
    update: {},
    create: {
      name: "Eliam Vásquez", email: "eliam.vasquez@gmail.com",
      passwordHash: eliamPass, role: "COMPANY_ADMIN", isActive: true, maxCompanies: 3,
    },
  })

  const eliamAviation = await prisma.company.upsert({
    where: { slug: "eliam-aviation" }, update: {},
    create: {
      name: "Eliam Aviation", slug: "eliam-aviation", ruc: "987654321", dv: "002",
      phone: "+507 6000-2001", address: "Aeropuerto Internacional, Hangar 5",
      invoiceTemplate: "corporate", invoiceColor: "blue", nextInvoiceNumber: 1, isActive: true,
    },
  })
  await prisma.userCompany.upsert({
    where: { userId_companyId: { userId: eliamUser.id, companyId: eliamAviation.id } },
    update: {}, create: { userId: eliamUser.id, companyId: eliamAviation.id, roleInCompany: "OWNER" },
  })

  const eliamAcademia = await prisma.company.upsert({
    where: { slug: "academia-eliam" }, update: {},
    create: {
      name: "Academia Eliam", slug: "academia-eliam", ruc: "987654322", dv: "003",
      phone: "+507 6000-2002", address: "Vía Porras, Edificio Educativo, Local 3",
      invoiceTemplate: "modern", invoiceColor: "amber", nextInvoiceNumber: 1, isActive: true,
    },
  })
  await prisma.userCompany.upsert({
    where: { userId_companyId: { userId: eliamUser.id, companyId: eliamAcademia.id } },
    update: {}, create: { userId: eliamUser.id, companyId: eliamAcademia.id, roleInCompany: "OWNER" },
  })

  // ── 2. ZURIEL VASQUEZ ──
  const zurielPass = await bcrypt.hash(DEFAULT_PASS, 12)

  const zurielUser = await prisma.user.upsert({
    where: { email: "zuriel.vasquez@gmail.com" },
    update: {},
    create: {
      name: "Zuriel Vásquez", email: "zuriel.vasquez@gmail.com",
      passwordHash: zurielPass, role: "COMPANY_ADMIN", isActive: true, maxCompanies: 3,
    },
  })

  const zurielFashion = await prisma.company.upsert({
    where: { slug: "zuriel-fashion" }, update: {},
    create: {
      name: "Zuriel Fashion", slug: "zuriel-fashion", ruc: "987654323", dv: "004",
      phone: "+507 6000-3001", address: "Calle Centro Comercial, Local 12",
      invoiceTemplate: "modern", invoiceColor: "rose", nextInvoiceNumber: 1, isActive: true,
    },
  })
  await prisma.userCompany.upsert({
    where: { userId_companyId: { userId: zurielUser.id, companyId: zurielFashion.id } },
    update: {}, create: { userId: zurielUser.id, companyId: zurielFashion.id, roleInCompany: "OWNER" },
  })

  const zurielBus = await prisma.company.upsert({
    where: { slug: "zuriel-bus" }, update: {},
    create: {
      name: "Zuriel Bus", slug: "zuriel-bus", ruc: "987654324", dv: "005",
      phone: "+507 6000-3002", address: "Vía España, Terminal de Buses",
      invoiceTemplate: "classic", invoiceColor: "blue", nextInvoiceNumber: 1, isActive: true,
    },
  })
  await prisma.userCompany.upsert({
    where: { userId_companyId: { userId: zurielUser.id, companyId: zurielBus.id } },
    update: {}, create: { userId: zurielUser.id, companyId: zurielBus.id, roleInCompany: "OWNER" },
  })

  // ── Servicios por empresa ──
  const aviationSvcs = await Promise.all([
    prisma.service.create({ data: { companyId: eliamAviation.id, name: "Vuelo Nacional", description: "Vuelo privado dentro del país", defaultPrice: 850.00, isActive: true } }),
    prisma.service.create({ data: { companyId: eliamAviation.id, name: "Vuelo Internacional", description: "Vuelo privado a destino internacional", defaultPrice: 3500.00, isActive: true } }),
    prisma.service.create({ data: { companyId: eliamAviation.id, name: "Mantenimiento de Aeronaves", description: "Revisión y mantenimiento preventivo", defaultPrice: 1200.00, isActive: true } }),
    prisma.service.create({ data: { companyId: eliamAviation.id, name: "Tour Aéreo", description: "Tour turístico en avioneta", defaultPrice: 250.00, isActive: true } }),
  ])

  const academiaSvcs = await Promise.all([
    prisma.service.create({ data: { companyId: eliamAcademia.id, name: "Clase de Matemáticas", description: "Tutoría personalizada de matemáticas", defaultPrice: 40.00, isActive: true } }),
    prisma.service.create({ data: { companyId: eliamAcademia.id, name: "Clase de Español", description: "Refuerzo en lengua española", defaultPrice: 35.00, isActive: true } }),
    prisma.service.create({ data: { companyId: eliamAcademia.id, name: "Clase de Inglés", description: "Curso de inglés básico a avanzado", defaultPrice: 50.00, isActive: true } }),
    prisma.service.create({ data: { companyId: eliamAcademia.id, name: "Ayuda con Tareas", description: "Acompañamiento en tareas escolares", defaultPrice: 25.00, isActive: true } }),
  ])

  const fashionSvcs = await Promise.all([
    prisma.service.create({ data: { companyId: zurielFashion.id, name: "Camiseta Premium", description: "Camiseta de algodón premium", defaultPrice: 35.00, isActive: true } }),
    prisma.service.create({ data: { companyId: zurielFashion.id, name: "Zapatillas Deportivas", description: "Zapatillas originales importadas", defaultPrice: 120.00, isActive: true } }),
    prisma.service.create({ data: { companyId: zurielFashion.id, name: "Jeans", description: "Jeans de última moda", defaultPrice: 65.00, isActive: true } }),
    prisma.service.create({ data: { companyId: zurielFashion.id, name: "Conjunto Deportivo", description: "Short + camiseta deportiva", defaultPrice: 80.00, isActive: true } }),
  ])

  const busSvcs = await Promise.all([
    prisma.service.create({ data: { companyId: zurielBus.id, name: "Ruta Escolar", description: "Transporte ida y vuelta a la escuela", defaultPrice: 120.00, isActive: true } }),
    prisma.service.create({ data: { companyId: zurielBus.id, name: "Traslado a Actividades", description: "Llevar y recoger de actividades extracurriculares", defaultPrice: 60.00, isActive: true } }),
    prisma.service.create({ data: { companyId: zurielBus.id, name: "Ruta Quincenal", description: "Pago quincenal de ruta escolar fija", defaultPrice: 200.00, isActive: true } }),
    prisma.service.create({ data: { companyId: zurielBus.id, name: "Traslado Express", description: "Traslado único a cualquier destino en la ciudad", defaultPrice: 25.00, isActive: true } }),
  ])

  // ── Clientes y asignaciones ──
  const configs: Array<{
    companyId: string; svcs: typeof aviationSvcs;
    clients: Array<{ name: string; celular: string; email?: string; phone?: string; direccion?: string; authorizedPersons?: string[]; assign: Array<{ idx: number; price: number; freq: string }> }>
  }> = [
    { companyId: eliamAviation.id, svcs: aviationSvcs, clients: [
      { name: "Ricardo Ávila", celular: "6000-4001", email: "ricardo@ejemplo.com", phone: "200-4001", direccion: "Costa del Este, Torre Financiera", assign: [{ idx: 0, price: 850.00, freq: "MANUAL" }, { idx: 3, price: 250.00, freq: "MANUAL" }] },
      { name: "Claudia Moreno", celular: "6000-4002", email: "claudia@ejemplo.com", direccion: "Punta Pacífica, Edificio Mar", authorizedPersons: ["Luis Moreno"], assign: [{ idx: 1, price: 3200.00, freq: "MANUAL" }, { idx: 2, price: 1200.00, freq: "MONTHLY" }] },
    ]},
    { companyId: eliamAcademia.id, svcs: academiaSvcs, clients: [
      { name: "Sra. Maritza López", celular: "6000-5001", email: "maritza@ejemplo.com", direccion: "Bella Vista, Calle 50", authorizedPersons: ["Carlos López (hijo)"], assign: [{ idx: 0, price: 40.00, freq: "WEEKLY" }, { idx: 3, price: 25.00, freq: "DAILY" }] },
      { name: "Sr. Fernando Ruiz", celular: "6000-5002", email: "fernando@ejemplo.com", phone: "200-5002", direccion: "El Cangrejo, Calle D", authorizedPersons: ["Valentina Ruiz (hija)", "Santiago Ruiz (hijo)"], assign: [{ idx: 1, price: 35.00, freq: "WEEKLY" }, { idx: 2, price: 50.00, freq: "WEEKLY" }] },
    ]},
    { companyId: zurielFashion.id, svcs: fashionSvcs, clients: [
      { name: "Tienda Sport Plus", celular: "6000-6001", email: "sportplus@ejemplo.com", phone: "200-6001", direccion: "Multiplaza, Local 5", assign: [{ idx: 1, price: 110.00, freq: "MANUAL" }, { idx: 3, price: 75.00, freq: "MANUAL" }] },
      { name: "Boutique Elegance", celular: "6000-6002", email: "elegance@ejemplo.com", direccion: "Calle 50, Edificio Comercial 2B", authorizedPersons: ["María G. (gerente)"], assign: [{ idx: 0, price: 35.00, freq: "BIWEEKLY" }, { idx: 2, price: 60.00, freq: "BIWEEKLY" }] },
    ]},
    { companyId: zurielBus.id, svcs: busSvcs, clients: [
      { name: "Colegio Bilingüe Panama", celular: "6000-7001", email: "admin@colegiopanama.com", phone: "200-7001", direccion: "Vía España, Campus Educativo", authorizedPersons: ["Director Juan Pérez", "Secretaría Ana"], assign: [{ idx: 0, price: 120.00, freq: "MONTHLY" }, { idx: 2, price: 200.00, freq: "BIWEEKLY" }] },
      { name: "Sra. Patricia de León", celular: "6000-7002", email: "patricia@ejemplo.com", direccion: "San Francisco, Calle 44", authorizedPersons: ["Andrés de León (hijo)", "Camila de León (hija)"], assign: [{ idx: 0, price: 120.00, freq: "MONTHLY" }, { idx: 1, price: 60.00, freq: "MONTHLY" }] },
    ]},
  ]

  for (const cfg of configs) {
    for (const c of cfg.clients) {
      const client = await prisma.client.create({
        data: {
          companyId: cfg.companyId, name: c.name, celular: c.celular,
          email: c.email || null, phone: c.phone || null, direccion: c.direccion || null,
          authorizedPersons: c.authorizedPersons || [], isActive: true,
        },
      })
      for (const a of c.assign) {
        const nextDate = a.freq === "MONTHLY" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : null
        await prisma.clientService.create({
          data: {
            clientId: client.id, serviceId: cfg.svcs[a.idx].id, companyId: cfg.companyId,
            agreedPrice: a.price, applyTax: true, taxRate: 0.07,
            billingFrequency: a.freq as any, nextBillingDate: nextDate, isActive: true,
          },
        })
      }
    }
  }

  console.log("  ✓ Eliam Vásquez (eliam.vasquez@gmail.com / 123456) → Eliam Aviation + Academia Eliam")
  console.log("  ✓ Zuriel Vásquez (zuriel.vasquez@gmail.com / 123456) → Zuriel Fashion + Zuriel Bus")
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
