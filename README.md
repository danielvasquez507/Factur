# FacturDV 🚀

FacturDV es una plataforma integral de facturación electrónica diseñada bajo una arquitectura **Multi-Tenant (Múltiples Inquilinos)**. Su propósito principal es permitir a múltiples empresas registrarse, administrar sus catálogos y generar facturas profesionales de forma completamente aislada, segura y eficiente.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 ¿Qué logra esta aplicación?

FacturDV digitaliza y automatiza el flujo financiero de pequeñas y medianas empresas. Al centralizar la administración, la app logra:

1. **Aislamiento Seguro de Datos:** Gracias a *Row Level Security (RLS)* en PostgreSQL, cada empresa solo tiene acceso a su propia información (clientes, servicios, facturas), previniendo fugas de datos.
2. **Generación Dinámica de PDFs:** Convierte transacciones en documentos PDF altamente profesionales, con plantillas personalizables (Clásica y Moderna) y soporte para colores corporativos y logos.
3. **Gestión de Pagos Estructurada:** Integra nativamente métodos de pago modernos como **Yappy**, **ACH** y **Efectivo**, mostrándolos de manera clara en las facturas generadas.
4. **Inteligencia de Negocio:** Provee reportes financieros exportables a CSV (Top clientes, resúmenes de impuestos ITBMS, ingresos mensuales).
5. **Supervisión Global:** Incluye un panel "Super Admin" para visualizar el desempeño agregado de todas las empresas alojadas en el sistema.

---

## 🏗 Arquitectura del Sistema

El siguiente diagrama muestra el flujo de datos y el modelo Multi-Tenant que garantiza la seguridad y escalabilidad de la aplicación:

```mermaid
graph TD
    subgraph Usuarios
        A[Super Admin]
        B[Dueño Empresa 1]
        C[Dueño Empresa 2]
    end

    subgraph "FacturDV (Next.js 15 App)"
        UI[Dashboard Interfaz UI]
        PDF[Generador React-PDF]
        Auth[Autenticación NextAuth]
        Prisma[Prisma ORM Middleware]
    end

    subgraph "PostgreSQL Base de Datos"
        RLS{Row Level Security}
        DB_G[(Datos Globales)]
        DB_T1[(Tenant 1: Clientes/Facturas)]
        DB_T2[(Tenant 2: Clientes/Facturas)]
    end

    A -->|Login| Auth
    B -->|Login| Auth
    C -->|Login| Auth

    Auth -->|Token/Session| UI
    UI -->|Peticiones CRUD| Prisma
    UI -->|Descarga Factura| PDF
    
    Prisma -->|set_config 'app.current_tenant'| RLS
    
    RLS -.->|Admin Bypass| DB_G
    RLS -.->|Tenant=1| DB_T1
    RLS -.->|Tenant=2| DB_T2
```

---

## 🧩 Diagrama de Flujo de Facturación

¿Cómo funciona la creación de una factura?

```mermaid
sequenceDiagram
    participant Usuario
    participant Interfaz
    participant Catálogo
    participant DB
    participant PDF Engine

    Usuario->>Interfaz: 1. Selecciona "Crear Factura"
    Interfaz->>Catálogo: 2. Consulta Clientes y Servicios
    Catálogo-->>Interfaz: 3. Devuelve lista (Tenant aislado)
    Usuario->>Interfaz: 4. Selecciona ítems y métodos de pago (Yappy/ACH)
    Interfaz->>DB: 5. Guarda Factura (JSON Struct)
    DB-->>Interfaz: 6. Factura Creada Exitosamente
    Usuario->>Interfaz: 7. Click en "Descargar PDF"
    Interfaz->>PDF Engine: 8. Pasa datos + Plantilla de Color
    PDF Engine-->>Usuario: 9. Entrega Documento PDF Profesional
```

---

## 🌟 Características Principales

- **Dashboard Analítico:** Gráficos de ingresos e historial reciente.
- **Módulo de Reportes:** Exportación de reportes de impuestos (ITBMS/IVA) en CSV.
- **Catálogos Reutilizables:** Productos y servicios registrados para evitar recapturar información manual.
- **Configuración de Marca:** Personalización de logo, colores y plantilla de factura (Clásica vs Moderna).
- **Control de Estado:** Seguimiento del ciclo de vida de la factura (Emitida, Pagada, Anulada).
- **Responsive Design:** Interfaz adaptada a dispositivos móviles con modo oscuro nativo.

---

## ⚙️ Stack Tecnológico

- **Frontend:** React 19, Next.js 15 (App Router), TailwindCSS, Radix UI.
- **Backend:** Server Actions (Next.js), Prisma ORM.
- **Base de Datos:** PostgreSQL con soporte de RLS.
- **Generación de Documentos:** `@react-pdf/renderer` para renderizado nativo en servidor.
- **Gestor de Paquetes:** `pnpm`.

---

*Desarrollado con altos estándares de calidad, UI moderna y arquitectura robusta enfocada a la nube.*
