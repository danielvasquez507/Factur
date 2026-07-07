import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, max: 5 })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const DEFAULT_PASS = "123456"

async function main() {
  console.log("🌱 Agregando usuarios, empresas y datos adicionales...\n")

  // ── 1. ELIAM VASQUEZ ──
  const eliamPass = await bcrypt.hash(DEFAULT_PASS, 12)

  let eliamUser = await prisma.user.findUnique({ where: { email: "eliam.vasquez@gmail.com" } })
  if (!eliamUser) {
    eliamUser = await prisma.user.create({
      data: {
        name: "Eliam Vásquez",
        email: "eliam.vasquez@gmail.com",
        passwordHash: eliamPass,
        role: "COMPANY_ADMIN",
        isActive: true,
        maxCompanies: 3,
      },
    })
    console.log(`  ✓ Usuario: ${eliamUser.email} / ${DEFAULT_PASS}`)
  } else {
    console.log(`  ∼ Usuario ya existe: ${eliamUser.email}`)
  }

  // ── Empresa: Eliam Aviation ──
  let eliamAviation = await prisma.company.findUnique({ where: { slug: "eliam-aviation" } })
  if (!eliamAviation) {
    eliamAviation = await prisma.company.create({
      data: {
        name: "Eliam Aviation",
        slug: "eliam-aviation",
        ruc: "987654321",
        dv: "002",
        phone: "+507 6000-2001",
        address: "Aeropuerto Internacional, Hangar 5",
        invoiceTemplate: "corporate",
        invoiceColor: "blue",
        nextInvoiceNumber: 1,
        isActive: true,
      },
    })
    await prisma.userCompany.create({
      data: { userId: eliamUser.id, companyId: eliamAviation.id, roleInCompany: "OWNER" },
    })
    console.log(`  ✓ Empresa: ${eliamAviation.name}`)
  } else {
    console.log(`  ∼ Empresa ya existe: ${eliamAviation.name}`)
  }

  // ── Empresa: Academia Eliam ──
  let eliamAcademia = await prisma.company.findUnique({ where: { slug: "academia-eliam" } })
  if (!eliamAcademia) {
    eliamAcademia = await prisma.company.create({
      data: {
        name: "Academia Eliam",
        slug: "academia-eliam",
        ruc: "987654322",
        dv: "003",
        phone: "+507 6000-2002",
        address: "Vía Porras, Edificio Educativo, Local 3",
        invoiceTemplate: "modern",
        invoiceColor: "amber",
        nextInvoiceNumber: 1,
        isActive: true,
      },
    })
    await prisma.userCompany.create({
      data: { userId: eliamUser.id, companyId: eliamAcademia.id, roleInCompany: "OWNER" },
    })
    console.log(`  ✓ Empresa: ${eliamAcademia.name}`)
  } else {
    console.log(`  ∼ Empresa ya existe: ${eliamAcademia.name}`)
  }

  // ── 2. ZURIEL VASQUEZ ──
  const zurielPass = await bcrypt.hash(DEFAULT_PASS, 12)

  let zurielUser = await prisma.user.findUnique({ where: { email: "zuriel.vasquez@gmail.com" } })
  if (!zurielUser) {
    zurielUser = await prisma.user.create({
      data: {
        name: "Zuriel Vásquez",
        email: "zuriel.vasquez@gmail.com",
        passwordHash: zurielPass,
        role: "COMPANY_ADMIN",
        isActive: true,
        maxCompanies: 3,
      },
    })
    console.log(`  ✓ Usuario: ${zurielUser.email} / ${DEFAULT_PASS}`)
  } else {
    console.log(`  ∼ Usuario ya existe: ${zurielUser.email}`)
  }

  // ── Empresa: Zuriel Fashion ──
  let zurielFashion = await prisma.company.findUnique({ where: { slug: "zuriel-fashion" } })
  if (!zurielFashion) {
    zurielFashion = await prisma.company.create({
      data: {
        name: "Zuriel Fashion",
        slug: "zuriel-fashion",
        ruc: "987654323",
        dv: "004",
        phone: "+507 6000-3001",
        address: "Calle Centro Comercial, Local 12",
        invoiceTemplate: "modern",
        invoiceColor: "rose",
        nextInvoiceNumber: 1,
        isActive: true,
      },
    })
    await prisma.userCompany.create({
      data: { userId: zurielUser.id, companyId: zurielFashion.id, roleInCompany: "OWNER" },
    })
    console.log(`  ✓ Empresa: ${zurielFashion.name}`)
  } else {
    console.log(`  ∼ Empresa ya existe: ${zurielFashion.name}`)
  }

  // ── Empresa: Zuriel Bus ──
  let zurielBus = await prisma.company.findUnique({ where: { slug: "zuriel-bus" } })
  if (!zurielBus) {
    zurielBus = await prisma.company.create({
      data: {
        name: "Zuriel Bus",
        slug: "zuriel-bus",
        ruc: "987654324",
        dv: "005",
        phone: "+507 6000-3002",
        address: "Vía España, Terminal de Buses",
        invoiceTemplate: "classic",
        invoiceColor: "blue",
        nextInvoiceNumber: 1,
        isActive: true,
      },
    })
    await prisma.userCompany.create({
      data: { userId: zurielUser.id, companyId: zurielBus.id, roleInCompany: "OWNER" },
    })
    console.log(`  ✓ Empresa: ${zurielBus.name}`)
  } else {
    console.log(`  ∼ Empresa ya existe: ${zurielBus.name}`)
  }

  // ─────────────────────────────────────────────
  // SERVICIOS POR EMPRESA
  // ─────────────────────────────────────────────

  // ── Eliam Aviation ──
  const aviationServices = [
    { name: "Vuelo Nacional", description: "Vuelo privado dentro del país", defaultPrice: 850.00 },
    { name: "Vuelo Internacional", description: "Vuelo privado a destino internacional", defaultPrice: 3500.00 },
    { name: "Mantenimiento de Aeronaves", description: "Revisión y mantenimiento preventivo", defaultPrice: 1200.00 },
    { name: "Tour Aéreo", description: "Tour turístico en avioneta", defaultPrice: 250.00 },
  ]
  const aviationSvcs = []
  for (const svc of aviationServices) {
    aviationSvcs.push(await prisma.service.create({
      data: {
        companyId: eliamAviation.id,
        name: svc.name,
        description: svc.description,
        defaultPrice: svc.defaultPrice,
        isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${aviationSvcs.length} servicios: Eliam Aviation`)

  // ── Academia Eliam ──
  const academiaServices = [
    { name: "Clase de Matemáticas", description: "Tutoría personalizada de matemáticas", defaultPrice: 40.00 },
    { name: "Clase de Español", description: "Refuerzo en lengua española", defaultPrice: 35.00 },
    { name: "Clase de Inglés", description: "Curso de inglés básico a avanzado", defaultPrice: 50.00 },
    { name: "Ayuda con Tareas", description: "Acompañamiento en tareas escolares", defaultPrice: 25.00 },
  ]
  const academiaSvcs = []
  for (const svc of academiaServices) {
    academiaSvcs.push(await prisma.service.create({
      data: {
        companyId: eliamAcademia.id,
        name: svc.name,
        description: svc.description,
        defaultPrice: svc.defaultPrice,
        isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${academiaSvcs.length} servicios: Academia Eliam`)

  // ── Zuriel Fashion ──
  const fashionServices = [
    { name: "Camiseta Premium", description: "Camiseta de algodón premium", defaultPrice: 35.00 },
    { name: "Zapatillas Deportivas", description: "Zapatillas originales importadas", defaultPrice: 120.00 },
    { name: "Jeans", description: "Jeans de última moda", defaultPrice: 65.00 },
    { name: "Conjunto Deportivo", description: "Short + camiseta deportiva", defaultPrice: 80.00 },
  ]
  const fashionSvcs = []
  for (const svc of fashionServices) {
    fashionSvcs.push(await prisma.service.create({
      data: {
        companyId: zurielFashion.id,
        name: svc.name,
        description: svc.description,
        defaultPrice: svc.defaultPrice,
        isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${fashionSvcs.length} servicios: Zuriel Fashion`)

  // ── Zuriel Bus ──
  const busServices = [
    { name: "Ruta Escolar", description: "Transporte ida y vuelta a la escuela", defaultPrice: 120.00 },
    { name: "Traslado a Actividades", description: "Llevar y recoger de actividades extracurriculares", defaultPrice: 60.00 },
    { name: "Ruta Quincenal", description: "Pago quincenal de ruta escolar fija", defaultPrice: 200.00 },
    { name: "Traslado Express", description: "Traslado único a cualquier destino en la ciudad", defaultPrice: 25.00 },
  ]
  const busSvcs = []
  for (const svc of busServices) {
    busSvcs.push(await prisma.service.create({
      data: {
        companyId: zurielBus.id,
        name: svc.name,
        description: svc.description,
        defaultPrice: svc.defaultPrice,
        isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${busSvcs.length} servicios: Zuriel Bus`)

  // ─────────────────────────────────────────────
  // CLIENTES POR EMPRESA (2 cada una)
  // ─────────────────────────────────────────────

  // ── Eliam Aviation ──
  const aviationClients = [
    { name: "Ricardo Ávila", celular: "6000-4001", email: "ricardo@ejemplo.com", phone: "200-4001", direccion: "Costa del Este, Torre Financiera" },
    { name: "Claudia Moreno", celular: "6000-4002", email: "claudia@ejemplo.com", direccion: "Punta Pacífica, Edificio Mar", authorizedPersons: ["Luis Moreno"] },
  ]
  const createdAviationClients = []
  for (const c of aviationClients) {
    createdAviationClients.push(await prisma.client.create({
      data: {
        companyId: eliamAviation.id,
        name: c.name, celular: c.celular, email: c.email || null,
        phone: c.phone || null, direccion: c.direccion || null,
        authorizedPersons: c.authorizedPersons || [], isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${createdAviationClients.length} clientes: Eliam Aviation`)

  // Asignar servicios: cliente 0 → Vuelo Nacional + Tour Aéreo, cliente 1 → Vuelo Internacional + Mantenimiento
  await prisma.clientService.createMany({
    data: [
      { clientId: createdAviationClients[0].id, serviceId: aviationSvcs[0].id, companyId: eliamAviation.id, agreedPrice: 850.00, applyTax: true, taxRate: 0.07, billingFrequency: "MANUAL", isActive: true },
      { clientId: createdAviationClients[0].id, serviceId: aviationSvcs[3].id, companyId: eliamAviation.id, agreedPrice: 250.00, applyTax: false, taxRate: 0.07, billingFrequency: "MANUAL", isActive: true },
      { clientId: createdAviationClients[1].id, serviceId: aviationSvcs[1].id, companyId: eliamAviation.id, agreedPrice: 3200.00, applyTax: true, taxRate: 0.07, billingFrequency: "MANUAL", isActive: true },
      { clientId: createdAviationClients[1].id, serviceId: aviationSvcs[2].id, companyId: eliamAviation.id, agreedPrice: 1200.00, applyTax: true, taxRate: 0.07, billingFrequency: "MONTHLY", isActive: true, nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
    ],
  })
  console.log("  ✓ Servicios asignados: Eliam Aviation")

  // ── Academia Eliam ──
  const academiaClients = [
    { name: "Sra. Maritza López", celular: "6000-5001", email: "maritza@ejemplo.com", direccion: "Bella Vista, Calle 50", authorizedPersons: ["Carlos López (hijo)"] },
    { name: "Sr. Fernando Ruiz", celular: "6000-5002", email: "fernando@ejemplo.com", phone: "200-5002", direccion: "El Cangrejo, Calle D", authorizedPersons: ["Valentina Ruiz (hija)", "Santiago Ruiz (hijo)"] },
  ]
  const createdAcademiaClients = []
  for (const c of academiaClients) {
    createdAcademiaClients.push(await prisma.client.create({
      data: {
        companyId: eliamAcademia.id,
        name: c.name, celular: c.celular, email: c.email || null,
        phone: c.phone || null, direccion: c.direccion || null,
        authorizedPersons: c.authorizedPersons || [], isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${createdAcademiaClients.length} clientes: Academia Eliam`)

  await prisma.clientService.createMany({
    data: [
      { clientId: createdAcademiaClients[0].id, serviceId: academiaSvcs[0].id, companyId: eliamAcademia.id, agreedPrice: 40.00, applyTax: false, taxRate: 0.07, billingFrequency: "WEEKLY", isActive: true },
      { clientId: createdAcademiaClients[0].id, serviceId: academiaSvcs[3].id, companyId: eliamAcademia.id, agreedPrice: 25.00, applyTax: false, taxRate: 0.07, billingFrequency: "DAILY", isActive: true },
      { clientId: createdAcademiaClients[1].id, serviceId: academiaSvcs[1].id, companyId: eliamAcademia.id, agreedPrice: 35.00, applyTax: false, taxRate: 0.07, billingFrequency: "WEEKLY", isActive: true },
      { clientId: createdAcademiaClients[1].id, serviceId: academiaSvcs[2].id, companyId: eliamAcademia.id, agreedPrice: 50.00, applyTax: false, taxRate: 0.07, billingFrequency: "WEEKLY", isActive: true },
    ],
  })
  console.log("  ✓ Servicios asignados: Academia Eliam")

  // ── Zuriel Fashion ──
  const fashionClients = [
    { name: "Tienda Sport Plus", celular: "6000-6001", email: "sportplus@ejemplo.com", phone: "200-6001", direccion: "Multiplaza, Local 5" },
    { name: "Boutique Elegance", celular: "6000-6002", email: "elegance@ejemplo.com", direccion: "Calle 50, Edificio Comercial 2B", authorizedPersons: ["María G. (gerente)"] },
  ]
  const createdFashionClients = []
  for (const c of fashionClients) {
    createdFashionClients.push(await prisma.client.create({
      data: {
        companyId: zurielFashion.id,
        name: c.name, celular: c.celular, email: c.email || null,
        phone: c.phone || null, direccion: c.direccion || null,
        authorizedPersons: c.authorizedPersons || [], isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${createdFashionClients.length} clientes: Zuriel Fashion`)

  await prisma.clientService.createMany({
    data: [
      { clientId: createdFashionClients[0].id, serviceId: fashionSvcs[1].id, companyId: zurielFashion.id, agreedPrice: 110.00, applyTax: true, taxRate: 0.07, billingFrequency: "MANUAL", isActive: true },
      { clientId: createdFashionClients[0].id, serviceId: fashionSvcs[3].id, companyId: zurielFashion.id, agreedPrice: 75.00, applyTax: true, taxRate: 0.07, billingFrequency: "MANUAL", isActive: true },
      { clientId: createdFashionClients[1].id, serviceId: fashionSvcs[0].id, companyId: zurielFashion.id, agreedPrice: 35.00, applyTax: true, taxRate: 0.07, billingFrequency: "BIWEEKLY", isActive: true },
      { clientId: createdFashionClients[1].id, serviceId: fashionSvcs[2].id, companyId: zurielFashion.id, agreedPrice: 60.00, applyTax: true, taxRate: 0.07, billingFrequency: "BIWEEKLY", isActive: true },
    ],
  })
  console.log("  ✓ Servicios asignados: Zuriel Fashion")

  // ── Zuriel Bus ──
  const busClients = [
    { name: "Colegio Bilingüe Panama", celular: "6000-7001", email: "admin@colegiopanama.com", phone: "200-7001", direccion: "Vía España, Campus Educativo", authorizedPersons: ["Director Juan Pérez", "Secretaría Ana"] },
    { name: "Sra. Patricia de León", celular: "6000-7002", email: "patricia@ejemplo.com", direccion: "San Francisco, Calle 44", authorizedPersons: ["Andrés de León (hijo)", "Camila de León (hija)"] },
  ]
  const createdBusClients = []
  for (const c of busClients) {
    createdBusClients.push(await prisma.client.create({
      data: {
        companyId: zurielBus.id,
        name: c.name, celular: c.celular, email: c.email || null,
        phone: c.phone || null, direccion: c.direccion || null,
        authorizedPersons: c.authorizedPersons || [], isActive: true,
      },
    }))
  }
  console.log(`  ✓ ${createdBusClients.length} clientes: Zuriel Bus`)

  await prisma.clientService.createMany({
    data: [
      { clientId: createdBusClients[0].id, serviceId: busSvcs[0].id, companyId: zurielBus.id, agreedPrice: 120.00, applyTax: false, taxRate: 0.07, billingFrequency: "MONTHLY", isActive: true, nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
      { clientId: createdBusClients[0].id, serviceId: busSvcs[2].id, companyId: zurielBus.id, agreedPrice: 200.00, applyTax: false, taxRate: 0.07, billingFrequency: "BIWEEKLY", isActive: true },
      { clientId: createdBusClients[1].id, serviceId: busSvcs[0].id, companyId: zurielBus.id, agreedPrice: 120.00, applyTax: false, taxRate: 0.07, billingFrequency: "MONTHLY", isActive: true, nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
      { clientId: createdBusClients[1].id, serviceId: busSvcs[1].id, companyId: zurielBus.id, agreedPrice: 60.00, applyTax: false, taxRate: 0.07, billingFrequency: "MONTHLY", isActive: true, nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
    ],
  })
  console.log("  ✓ Servicios asignados: Zuriel Bus")

  // ─────────────────────────────────────────────
  console.log("\n✅ Datos adicionales creados exitosamente!")
  console.log("   Usuarios nuevos:")
  console.log("   - Eliam Vásquez  → eliam.vasquez@gmail.com / 123456")
  console.log("   - Zuriel Vásquez → zuriel.vasquez@gmail.com / 123456")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
