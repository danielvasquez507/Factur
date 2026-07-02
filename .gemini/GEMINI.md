# FacturDV — Reglas del Proyecto

## Identidad del Proyecto
- **Nombre**: FacturDV — Sistema de Facturación SaaS Multi-Empresa
- **Tipo**: Aplicación web SaaS multi-tenant, self-hosted con Docker
- **Público objetivo**: Microempresas de servicios recurrentes (transporte escolar, suscripciones)
- **Región**: Panamá (moneda USD/PAB, impuesto ITBMS 7%)

---

## Stack Tecnológico Obligatorio

| Capa | Tecnología | Versión Mínima |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Lenguaje | TypeScript (strict mode) | 5.x |
| Base de Datos | PostgreSQL | 16.x |
| ORM | Prisma | 6.x |
| Autenticación | NextAuth.js (Auth.js) | v5 |
| Estilos | TailwindCSS | 4.x |
| Componentes UI | shadcn/ui (Radix UI) | latest |
| Generación PDF | @react-pdf/renderer | latest |
| Colas / Workers | BullMQ + Redis | latest |
| Validación | Zod | latest |
| Contenedores | Docker + Docker Compose | latest |

> **PROHIBIDO**: No usar Express.js, Sequelize, Mongoose, Material UI, Bootstrap, jsPDF, Puppeteer para PDF, ni node-cron directamente.

---

## Arquitectura Multi-Tenant

- **Estrategia**: Discriminator column (`company_id`) + Row-Level Security (RLS) de PostgreSQL.
- **Regla crítica**: TODA tabla con datos de inquilino DEBE incluir la columna `company_id` de tipo UUID.
- **RLS**: Cada tabla con `company_id` DEBE tener una política RLS habilitada.
- **Middleware**: Cada request autenticado DEBE ejecutar `SET app.current_company_id` antes de cualquier query.
- **Defensa en profundidad**: Validar `company_id` tanto en RLS (DB) como en la capa de aplicación (Prisma middleware).

---

## Convenciones de Código

### TypeScript
- `strict: true` en `tsconfig.json` — sin excepciones.
- Usar `type` para objetos simples, `interface` para contratos extensibles.
- Todos los componentes: `React.FC` está **PROHIBIDO**. Usar `function Component(props: Props)`.
- Exportaciones nombradas (`export function`) — no `export default` excepto en `page.tsx` y `layout.tsx` (requerido por Next.js).
- Enums: Usar `as const` satisfies pattern en lugar de `enum` de TypeScript.

### Nombres
- **Archivos de componentes**: `kebab-case.tsx` (ej. `client-form.tsx`).
- **Archivos de utilidades**: `kebab-case.ts` (ej. `format-currency.ts`).
- **Componentes React**: `PascalCase` (ej. `ClientForm`).
- **Funciones/variables**: `camelCase`.
- **Constantes**: `UPPER_SNAKE_CASE`.
- **Tablas DB (Prisma)**: `PascalCase` en schema, mapear a `snake_case` con `@@map`.
- **Columnas DB**: `snake_case` siempre.

### Estructura de Archivos
```
src/
├── app/           # Rutas Next.js (App Router)
│   ├── (auth)/    # Grupo: rutas públicas (login)
│   ├── (dashboard)/ # Grupo: rutas protegidas (admin empresa)
│   ├── (super-admin)/ # Grupo: rutas Super Admin
│   └── api/       # API Routes
├── components/    # Componentes React reutilizables
│   ├── ui/        # shadcn/ui base
│   ├── layout/    # Sidebar, Header, MobileNav
│   ├── forms/     # Formularios por entidad
│   └── tables/    # Tablas de datos
├── lib/           # Utilidades y configuración
│   ├── prisma.ts  # Singleton Prisma Client
│   ├── auth.ts    # Configuración NextAuth
│   ├── rls.ts     # Helper para RLS
│   └── validators/ # Schemas Zod
├── hooks/         # Custom hooks
├── types/         # Tipos TypeScript compartidos
├── pdf/           # Templates y generador PDF
└── workers/       # BullMQ workers
```

---

## Diseño y UI

### Mobile-First (OBLIGATORIO)
- **Diseñar primero para móvil**, luego escalar a desktop con breakpoints.
- Touch targets mínimo **48x48px** (botones, inputs, links).
- Texto base mínimo **16px** para evitar zoom automático en iOS.
- Formularios: inputs **full-width** en móvil, grid en desktop.

### Estándares Visuales
- **Tema oscuro**: Soporte obligatorio con `class` strategy de TailwindCSS.
- **Transiciones**: Usar `transition-colors duration-200` en elementos interactivos.
- **Estados de carga**: Skeletons (no spinners) para listas y tablas.
- **Toasts**: Para feedback de acciones (crear, editar, eliminar).
- **Modales de confirmación**: Para acciones destructivas (eliminar, cancelar factura).

### Paleta de Colores Sugerida
- Primario: Azul profundo (confianza financiera)
- Acento: Verde (éxito, pagos)
- Peligro: Rojo suave (cancelación, errores)
- Fondo oscuro: `#0a0a0f` / Fondo claro: `#fafafa`

---

## Base de Datos

### Reglas de Modelo de Datos
- **UUIDs**: Todas las claves primarias son UUID v4.
- **Timestamps**: Toda tabla incluye `created_at` y `updated_at`.
- **Soft Delete**: Usar `is_active: Boolean` — nunca `DELETE` físico en tablas referenciadas por facturas.
- **Precisión monetaria**: `Decimal(10, 2)` para montos, `Decimal(4, 4)` para tasas de impuesto.
- **Consecutivo de facturas**: `next_invoice_number` en tabla `companies`, usar `SELECT ... FOR UPDATE` dentro de transacción.

### Migraciones
- Siempre usar `npx prisma migrate dev --name <nombre_descriptivo>`.
- Nunca editar migraciones ya aplicadas.
- Incluir scripts RLS en `prisma/init-rls.sql`.

---

## Facturación

### Reglas Críticas del Motor
- **Sin almacenamiento de PDF**: Solo datos estructurados en DB. PDF se genera al vuelo.
- **Campos vacíos**: Si un campo no tiene valor, la sección se OCULTA completamente en el PDF.
- **Consecutivo ininterrumpido**: Por empresa, sin gaps, protegido con transacción.
- **Cron Job**: Ejecución diaria a medianoche. Evalúa `next_billing_date` vs fecha actual.
- **Idempotencia**: El worker DEBE ser idempotente — si se ejecuta dos veces, no duplica facturas.

### Frecuencias de Facturación
| Frecuencia | Intervalo |
|---|---|
| `DAILY` | +1 día |
| `WEEKLY` | +7 días |
| `BIWEEKLY` | +15 días |
| `MONTHLY` | +1 mes calendario |
| `MANUAL` | Sin automatización |

---

## Seguridad

- **Passwords**: bcrypt con cost factor 12.
- **Sessions**: JWT httpOnly + Secure + SameSite=Strict.
- **Validación**: Zod en cliente Y servidor — nunca confiar solo en frontend.
- **Rate Limiting**: En endpoints de login y API pública de facturas.
- **URLs públicas de PDF**: Token JWT firmado con expiración de 30 días.
- **Variables sensibles**: Solo en `.env`, NUNCA en código fuente ni en commits.
- **CORS**: Restringido al dominio de la aplicación.

---

## Testing

- **Unit tests**: Vitest para funciones de cálculo (impuestos, fechas, totales).
- **E2E**: Playwright para flujos críticos (login → crear factura → descargar PDF).
- **Convención de nombres**: `*.test.ts` para unit, `*.spec.ts` para E2E.

---

## Git

- **Rama principal**: `main`.
- **Ramas de feature**: `feature/<nombre-corto>` (ej. `feature/invoice-pdf`).
- **Commits**: Conventional Commits en español (ej. `feat: agregar generación de PDF`).
- **No commitear**: `.env`, `node_modules/`, `.next/`, `pgdata/`, `redisdata/`.

---

## Docker

- **Servicios**: `app` (Next.js), `worker` (BullMQ), `db` (PostgreSQL), `redis`.
- **Volúmenes persistentes**: `pgdata` y `redisdata`.
- **Health checks**: Obligatorios en todos los servicios.
- **Variables de entorno**: Inyectadas via `.env` file, no hardcodeadas en `docker-compose.yml`.

---

## Soporte de Navegadores
- **Baseline Widely Available**: Usar sin fallback.
- **Baseline Newly Available**: Implementar solo con feature detection y degradación elegante.
- **Polyfills**: Evitar. Si un feature requiere polyfill, rediseñar el enfoque.
