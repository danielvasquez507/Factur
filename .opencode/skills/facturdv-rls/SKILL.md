---
name: facturdv-rls
description: 'Úsalo cuando trabajes con Prisma, queries a BD, RLS policies, Server Actions, o cualquier acceso a datos. Úsalo también al crear nuevas tablas en schema.prisma. Keywords: getTenantPrisma, getBypassPrisma, Prisma, RLS, multi-tenant, row level security, companyId, tenant'
---

# RLS Multi-Tenant para FacturDV

## Reglas de oro
- **NUNCA** uses `prisma` global/cliente directo. Siempre usa `getTenantPrisma(companyId)` para queries scoped.
- `getBypassPrisma()` solo para Super Admin y operaciones administrativas globales.
- El `companyId` debe venir de la sesión del usuario autenticado, **nunca** del input del cliente sin validar.

## Referencia rápida
```typescript
import { getTenantPrisma, getBypassPrisma } from "@/lib/prisma"

// Tenant-scoped (Company Admin)
const prisma = await getTenantPrisma(companyId)
const invoices = await prisma.invoice.findMany({ where: { companyId } })

// Bypass RLS (Super Admin)
const bypass = await getBypassPrisma()
const allCompanies = await bypass.company.findMany()
```

## Validación UUID
```typescript
import { z } from "zod"
const uuidSchema = z.string().uuid()
uuidSchema.parse(companyId) // lanza error si no es UUID válido
```

## Patrón de Server Action segura
```typescript
"use server"
import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"

export async function getCompanyData() {
  const session = await auth()
  if (!session?.user?.companyId) throw new Error("No autorizado")
  const prisma = await getTenantPrisma(session.user.companyId)
  // ...
}
```

## Estructura de tablas
Cada tabla tenant-scoped tiene `companyId` y RLS policy `(company_id = auth.user_id()::uuid)`. Las tablas globales (solo Super Admin) no tienen `companyId`.
