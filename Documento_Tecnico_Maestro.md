# Documento Técnico Maestro - FacturDV

Este documento describe el estado técnico actual del proyecto FacturDV, su arquitectura principal, reglas estrictas de desarrollo y un **prompt detallado** diseñado para que cualquier IA asistente pueda retomar el proyecto instantáneamente y sin generar errores estructurales.

---

## 1. Estado Actual del Sistema

El sistema es una plataforma de **Facturación Multi-Tenant** totalmente funcional, desarrollada sobre un stack moderno:

- **Framework:** Next.js 15 (App Router, React 19).
- **Base de Datos:** PostgreSQL.
- **ORM:** Prisma Client.
- **Seguridad (Crítica):** Row Level Security (RLS) aplicado directamente a nivel de base de datos en PostgreSQL.
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

## 3. PROMPT DE CONTINUACIÓN PARA IA

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

5. IDIOMA Y RESPUESTAS:
Todas tus respuestas y explicaciones de código hacia mí deben ser en Español. Sé conciso y no elimines código existente que no tenga relación directa con la solicitud actual.

Entiende este contexto y confírmame que estás listo para la primera tarea.
```

---
*Fin del Documento Maestro. Este documento debe actualizarse si ocurren cambios mayores en la arquitectura.*
