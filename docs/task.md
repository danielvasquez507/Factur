# Tareas: Panel Global, Facturación Automatizada y Reportes

## 1. Opciones de Pago (Cambios en Base de Datos)
- [x] Actualizar `schema.prisma` agregando `paymentDetails String?` al modelo `Company`.
- [x] Ejecutar `npx prisma db push` para aplicar los cambios.
- [x] Actualizar el formulario de edición de la Empresa para incluir las instrucciones de pago.
- [x] Modificar la plantilla PDF de la Factura para imprimir las instrucciones de pago en el pie de página.

## 2. Panel Global para Super Admin
- [x] Crear acciones de servidor (Server Actions) con `getBypassPrisma()` para traer todos los registros.
- [x] Construir la interfaz del Panel Global con un Filtro por Empresa (Tenant).
- [x] Construir la Tabla Global de Clientes.
- [x] Construir la Tabla Global de Servicios.
- [x] Construir la Tabla Global de Facturas.

## 3. Facturación Automatizada (Selección de Servicios)
- [x] Modificar `InvoiceForm` para usar un `<Select>` o `<Combobox>` del catálogo de servicios.
- [x] Autocompletar el precio del ítem cuando el usuario seleccione un servicio.
- [x] Agregar un botón "Crear Nuevo Servicio" directamente en la pantalla de la factura.

## 4. Módulo de Reportes y Dashboards
- [x] Crear la página `/dashboard/reports`.
- [x] Implementar la Tabla de Impuestos (Subtotal, ITBMS, Total) exportable a CSV.
- [x] Implementar la Vista de "Top Clientes" (Mayor volumen de compra).

## 5. Mejora de Opciones de Pago Estructuradas (Solicitud Adicional)
- [x] Modificar el formulario de Empresa para incluir checkboxes: Yappy, Efectivo, ACH.
- [x] Capturar sub-campos (Número Yappy, Banco ACH, Cta ACH, etc).
- [x] Formatear o JSONificar los datos para guardarlos en `paymentDetails`.
- [x] Actualizar el PDF para leer este formato estructurado y mostrarlo.

## 6. Vista Detalle de Factura
- [x] Mostrar vista previa del PDF en la página de detalles de la factura.
