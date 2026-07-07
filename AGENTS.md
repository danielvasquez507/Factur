# Reglas Globales

## Idioma
- Siempre responder en español. Todas las respuestas, comentarios y mensajes deben estar en español.
- El código, nombres de variables y documentación técnica pueden permanecer en inglés.
- Esta regla aplica a todos los agentes, skills y al asistente principal.

## Contexto del Proyecto
- SaaS multi-tenant "Factur DV" (Next.js 15, Prisma, PostgreSQL)
- `getTenantPrisma(companyId)` para consultas tenant-scoped
- `getBypassPrisma()` solo para Super Admin
- UI oscura con TailwindCSS + Radix UI + Lucide icons
- PDFs con `@react-pdf/renderer`, 4 plantillas
- PNPM exclusivamente
- Servidor corre en `http://localhost:3000`
