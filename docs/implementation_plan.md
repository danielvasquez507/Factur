# Plan de Implementación: Mejoras en Facturación y Panel Super Admin

## Objetivo
Ampliar las capacidades del Super Administrador para tener visibilidad global, automatizar la creación de facturas vinculada al catálogo de servicios e incorporar opciones de pago e historial.

## Proposed Changes

### 1. Panel Global para Super Admin (NUEVO)
Actualmente el aislamiento de datos (Multitenancy) impide que un usuario vea registros mezclados de varias empresas. Para que el **Super Admin** pueda auditar todo el sistema:
- **Nuevas Vistas Globales:** Modificar el Super Admin Dashboard para incluir tablas maestras de:
  - Todas las empresas (ya existente).
  - Todas las facturas globales.
  - Todos los clientes globales.
  - Todos los servicios globales.
- **Filtro por Tenant:** Agregar un menú desplegable (Select) en el panel superior que permita al Super Admin filtrar estas vistas globales por una empresa específica o ver "Todas".
- **Bypass de RLS:** Estas vistas utilizarán `getBypassPrisma()` para saltarse el aislamiento y traer la información de toda la base de datos de manera segura.

### 2. Refactorización de `InvoiceForm` (Selección de Servicios)
- **Eliminar campos de texto manuales** para descripción de ítems.
- **Implementar un `Select` o `Combobox`** que liste todos los `Service` activos de la empresa.
- Al seleccionar un servicio, autocompletar el precio por defecto y descripción.
- Añadir un botón **"Nuevo Servicio"** dentro del formulario que abra un modal rápido para crear un servicio sin salir de la factura.

### 3. Opciones de Pago en Facturas
- **Actualizar el Esquema de Base de Datos (`schema.prisma`):**
  - Añadir un campo `paymentDetails String?` al modelo `Company` (Ej: "Banca en Línea: Banco General CTA 03-XX-XX-X...").
- **Actualizar Formularios:**
  - Permitir a los usuarios editar `paymentDetails` en "Mi Empresa".
- **Generación de PDF (`invoice-pdf.tsx`):**
  - Si la empresa tiene `paymentDetails`, renderizarlos en la parte inferior de la factura (Footer / Notas).

### 4. Módulo de Reportes (Dashboards y Exportación)
- Crear una nueva ruta `/dashboard/reports` o agregar pestañas al Dashboard Principal.
- **Reporte de Impuestos (ITBMS/IVA):**
  - Tabla resumen que calcule el Subtotal, ITBMS cobrado y Total de las facturas en un rango de fechas.
  - Botón para descargar como archivo `.csv` (Excel).
- **Reporte de Clientes Frecuentes:**
  - Consulta agrupando facturas por cliente para determinar los que generan mayor volumen de compras.

## User Review Required

> [!WARNING]
> Esto requerirá una pequeña actualización en la base de datos (Prisma Migration) para guardar las Opciones de Pago en la Empresa.

He agregado el Panel Global de Super Admin como la prioridad #1. ¿Apruebas este plan para comenzar a codificar?
