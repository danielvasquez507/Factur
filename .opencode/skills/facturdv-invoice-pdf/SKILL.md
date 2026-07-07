---
name: facturdv-invoice-pdf
description: 'Úsalo cuando crees o modifiques generación de PDFs, plantillas classic/modern, rutas API de invoice PDF, o estilos con @react-pdf/renderer. Keywords: invoice-pdf, react-pdf, PDF, invoice template, classic, modern, invoiceColor, @react-pdf/renderer, Document, Page, pdf route'
---

# Generación de PDFs en FacturDV

## Stack
- `@react-pdf/renderer` para renderizado del lado servidor
- Rutas API en `src/app/api/invoices/[companyId]/[invoiceId]/route.ts`
- Plantillas en `src/components/invoice/`

## Reglas
1. **Dos plantillas**: `classic` y `modern`. Se seleccionan con `company.invoiceTemplate`.
2. **Color dinámico**: `company.invoiceColor` (string hex, ej: `"#3B82F6"`) se aplica a headers, bordes, acentos.
3. **Sin CSS filter**: `@react-pdf/renderer` **no soporta** `filter`, `backdrop-filter`, `box-shadow`, `gradient` complejo. Usa colores sólidos y borders.
4. **Fuentes**: Registradas globalmente. No agregues fonts sin verificar `src/app/api/invoices/[companyId]/...` primero.
5. **Decimal→Number**: Los valores Decimal de Prisma deben convertirse a Number antes de pasarlos al componente PDF.

## Conversión segura de invoice
```typescript
// En la Server Action o ruta API
function toPlainInvoice(invoice: Prisma.InvoiceGetPayload<{...}>) {
  return {
    ...invoice,
    total: Number(invoice.total),
    subtotal: Number(invoice.subtotal),
    taxTotal: Number(invoice.taxTotal),
    // ... otros campos Decimal
  }
}
```

## PaymentDetails parsing
```typescript
let paymentDetails: Record<string, unknown> = {}
try {
  paymentDetails = JSON.parse(company.paymentDetails || "{}")
} catch { /* ignorar */ }
```
