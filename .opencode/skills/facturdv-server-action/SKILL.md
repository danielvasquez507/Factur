---
name: facturdv-server-action
description: 'Úsalo cuando crees o modifiques Server Actions (archivos en src/actions/). Keywords: "use server", Server Action, action, Decimal, serialización, revalidatePath, redirect, Zod, Rate Limit'
---

# Server Actions en FacturDV

## Estructura
Cada Server Action está en `src/actions/<nombre>.ts` y usa el patrón `"use server"`.

## Reglas
1. **Sesión primero**: Siempre obtener `const session = await auth()` al inicio.
2. **CompanyId desde sesión**: `session?.user?.companyId`, nunca del input del cliente sin validar.
3. **Validación con Zod**: Definir schema al inicio del archivo.
4. **Retornar datos planos**: Los Decimal deben convertirse a Number antes de retornar al cliente.

## Patrón estándar
```typescript
"use server"

import { auth } from "@/lib/auth"
import { getTenantPrisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  // ...
})

export async function updateThing(data: FormData) {
  const session = await auth()
  if (!session?.user?.companyId) throw new Error("No autorizado")

  const parsed = schema.parse(Object.fromEntries(data))
  const prisma = await getTenantPrisma(session.user.companyId)

  const result = await prisma.thing.update({
    where: { id: parsed.id },
    data: { name: parsed.name },
  })

  revalidatePath("/dashboard")
  return { ...result, total: Number(result.total) }
}
```

## Rate Limiting (login)
```typescript
import { rateLimit } from "@/lib/rate-limit"
const { success } = await rateLimit(identifier, 5, 15 * 60 * 1000) // 5 intentos / 15 min
if (!success) throw new Error("Demasiados intentos")
```

## Conversión Decimal→Number
| Tipo Prisma | Conversión |
|-------------|------------|
| `Decimal` | `Number(val)` |
| `Decimal[]` | `val.map(Number)` |
| `{ amount: Decimal }` | `{ ...obj, amount: Number(obj.amount) }` |
