# Documento Técnico Maestro - FacturDV

Este documento describe el estado técnico actual del proyecto FacturDV, su arquitectura principal, reglas estrictas de desarrollo y un **prompt detallado** diseñado para que cualquier IA asistente pueda retomar el proyecto instantáneamente y sin generar errores estructurales.

---

## 1. Estado Actual del Sistema

El sistema es una plataforma de **Facturación Multi-Tenant** totalmente funcional, desarrollada sobre un stack moderno:

- **Framework:** Next.js 15 (App Router, React 19).
- **Base de Datos:** PostgreSQL.
- **ORM:** Prisma Client.
- **Seguridad (Crítica):** Row Level Security (RLS) aplicado directamente a nivel de base de datos en PostgreSQL, más capas de defensa: validación UUID, rate limiting in-memory, cookies seguras, security headers y Zod reforzado.
- **Autenticación:** Autenticación basada en sesiones (NextAuth / lógica custom) que vincula un `userId` y obtiene su respectivo `companyId`.
- **UI & Estilos:** Tailwind CSS, Radix UI primitives (shadcn-like) y Lucide React.
- **Generación de PDFs:** `@react-pdf/renderer` renderizado en servidor (Server-Side) en el endpoint `/api/invoices/[id]/pdf`.

### Funcionalidades Completadas:
1. **Multi-Tenant (Aislamiento):** Las empresas operan de manera 100% aislada; la capa de base de datos prohíbe consultas cruzadas gracias a RLS.
2. **Facturación y Catálogo:** Catálogo de clientes y servicios. Facturación vinculada a estos catálogos.
3. **Reportes:** Dashboard analítico con reportes financieros de ITBMS y Top Clientes exportables.
4. **Diseño de PDFs Dinámicos:** Múltiples plantillas (Clásica y Moderna) con mapas de colores inyectados (slate, blue, emerald, purple, rose, amber).
5. **Opciones de Pago:** Configuración estructurada guardada como JSON en `Company.paymentDetails` para procesar transferencias ACH, Yappy y Efectivo automáticamente en los PDFs.
6. **Super Admin:** Panel de control de administrador con un `bypass_rls` seguro para ver métricas globales de toda la plataforma.
7. **Seguridad en capas:** Rate limiting en login y PDF API, validación UUID en RLS, cookies seguras con expiración de 24h, security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), Zod reforzado en settings, y .env protegido con permisos 600.

---

## 2. Reglas Arquitectónicas (MANDATORIAS)

### A. Middleware de Base de Datos (Row Level Security)
**NUNCA** utilices una instancia global estándar de `prisma` para hacer consultas sobre modelos Multi-Tenant (como `Invoice`, `Client`, `Service`). 
Debes usar obligatoriamente las siguientes utilidades proveídas en `src/lib/prisma.ts`:

- `getTenantPrisma(companyId: string)`: Inyecta el contexto RLS. Obligatorio para el 99% de las consultas dentro de la app (Endpoints y Server Actions regulares).
- `getBypassPrisma()`: Exclusivo para Super Admins y rutinas de sistema (Jobs/Crons) que requieran saltarse el aislamiento. Utiliza un flag PostgreSQL local.

### B. Opciones de Pago (Estructura JSON)
El campo `paymentDetails` en el modelo `Company` es de tipo `String` en Prisma, pero **almacena un JSON estructurado**. Siempre debes parsearlo con un bloque `try/catch` para evitar fallos si un usuario antiguo guardó texto plano.

### C. Server Actions y Client Components
- Se respeta estrictamente la división de RSC (React Server Components). Todo estado e interactividad va en Client Components marcados con `"use client"`. 
- Las mutaciones de base de datos se hacen a través de **Server Actions** ubicados en la carpeta `src/actions/`.

---

## 3. Seguridad Implementada

### A. Validación de UUID en getTenantPrisma
`getTenantPrisma(companyId)` valida que `companyId` sea un UUID v4 real antes de inyectarlo en el contexto RLS. Si no lo es, lanza `Error("companyId inválido: no es un UUID válido")`. Esto evita inyección de valores arbitrarios en `app.current_tenant`.
- **Archivo:** `src/lib/prisma.ts`

### B. Sesión JWT con expiración y cookies seguras
- **maxAge:** 24 horas de inactividad (`session.maxAge`).
- **Cookies:** `httpOnly: true`, `sameSite: "lax"`, `secure: true` en producción, nombre `__Secure-next-auth.session-token` en producción.
- **Archivo:** `src/lib/auth.ts`

### C. Rate Limiting (En Memoria)
Sistema simple de rate limiting in-memory con limpieza automática cada 60 segundos. No requiere dependencias externas ni Redis.

| Endpoint | Límite | Ventana | Archivo |
|---|---|---|---|
| Login (`authorize`) | 5 intentos | 15 min | `src/lib/auth.ts` |
| PDF API (`GET /api/invoices/[id]/pdf`) | 30 solicitudes | 15 min | `src/app/api/invoices/[id]/pdf/route.ts` |

- **Implementación:** `src/lib/rate-limit.ts`

### D. Validación Zod Reforzada en Settings
Los campos del formulario de configuración de empresa ahora tienen validación estricta:
- `name`: string 2-100 caracteres.
- `ruc`: solo números, 1-12 dígitos (formato panameño).
- `dv`: solo números, 1-2 dígitos.
- `address`: máximo 500 caracteres.
- `paymentDetails`: máximo 2000 caracteres.
- **Archivo:** `src/actions/settings.ts`

### E. Security Headers (next.config.ts)
Headers aplicados a todas las rutas via `async headers()`:

| Header | Valor |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=()` |

- **Archivo:** `next.config.ts`

### F. Protección del archivo .env
El archivo `.env` tiene permisos `600` (solo lectura/escritura para el owner del proceso).

---

## 4. PROMPT DE CONTINUACIÓN PARA IA

Copia y pega el siguiente Prompt en tu nueva sesión con una IA asistente (como Claude, Gemini o ChatGPT) para que adquiera todo el contexto instantáneamente:

```text
Actúa como un Ingeniero Cloud y Desarrollador Full Stack Senior experto en Next.js 15, Prisma y PostgreSQL. 
Vamos a continuar trabajando en un sistema llamado "FacturDV", el cual es una plataforma SaaS de facturación electrónica Multi-Tenant. 

Tus instrucciones absolutas son las siguientes:

1. ARQUITECTURA MULTI-TENANT Y RLS:
La base de datos (PostgreSQL) tiene activado Row Level Security. Por lo tanto, NUNCA utilices un cliente global de Prisma (ej. `prisma.invoice.findMany()`) directamente en los Server Actions comunes. 
Siempre debes obtener el cliente autorizado utilizando `const prisma = await getTenantPrisma(companyId)` que importas desde `@/lib/prisma`.
Si requieres hacer una consulta administrativa que trascienda tenants (solo para el panel de Super Admin), debes usar `const prisma = await getBypassPrisma()`.

2. COMPONENTES DE UI:
Usamos TailwindCSS y componentes estilo Radix UI. Mantén los diseños altamente profesionales, modo oscuro predominante, bordes sutiles y usa Lucide-react para la iconografía.

3. PDF ENGINE:
La generación de PDFs ocurre en `/api/invoices/[id]/pdf` utilizando `@react-pdf/renderer`. El PDF inyecta dinámicamente un esquema de color (guardado en `Company.invoiceColor`) y una plantilla elegida (`classic` o `modern`). Si debes modificar el PDF, ten en cuenta las limitantes de CSS de react-pdf y asegúrate de cargar cualquier logo externo pasándolo por una función resolveImageUrl local.

4. MÉTODOS DE PAGO:
Las opciones de pago (Yappy, ACH, Efectivo) no son tablas relacionales, sino un objeto JSON guardado en el string `Company.paymentDetails`. Si modificas esa lógica, siempre parsea el JSON defensivamente.

5. SEGURIDAD (HOMELAB):
El sistema tiene las siguientes capas de seguridad implementadas:
   - **RLS (Row Level Security):** Aislamiento total entre tenants a nivel de base de datos PostgreSQL.
   - **Validación de UUID en `getTenantPrisma`:** Rechaza companyId que no sean UUID v4.
   - **Sesión JWT:** Expira a las 24h, cookies httpOnly + sameSite=lax + secure en producción.
   - **Rate Limiting:** 5 intentos/login y 30 solicitudes/PDF por IP en ventana de 15 minutos (en memoria, sin Redis).
   - **Zod reforzado:** Validación de RUC/DV/longitudes en formularios de settings.
   - **Security Headers:** X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
   - **.env protegido:** Permisos 600 en archivo de entorno.

6. IDIOMA Y RESPUESTAS:
Todas tus respuestas y explicaciones de código hacia mí deben ser en Español. Sé conciso y no elimines código existente que no tenga relación directa con la solicitud actual.

7. STACK COMPLETO:
   - **Framework:** Next.js 15 (App Router, React 19, Turbopack)
   - **ORM:** Prisma v7 + PostgreSQL 16 (RLS habilitado)
   - **Auth:** NextAuth v5 beta (Credentials + JWT)
   - **UI:** TailwindCSS v4, Radix UI, Lucide React, shadcn/ui
   - **PDF:** @react-pdf/renderer v4
   - **Package Manager:** pnpm (NO npm)
   - **Contenedores:** Docker Compose (PostgreSQL + Redis)
   - **Rate Limiting:** In-memory (src/lib/rate-limit.ts)

Entiende este contexto y confírmame que estás listo para la primera tarea.
```

---
*Fin del Documento Maestro. Este documento debe actualizarse si ocurren cambios mayores en la arquitectura.*
