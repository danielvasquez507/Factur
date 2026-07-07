---
name: facturdv-ui-patterns
description: 'Úsalo cuando construyas componentes de UI, páginas, layouts, o modifiques estilos. Keywords: TailwindCSS, Radix UI, dark mode, componente, layout, shadcn, Card, Dialog, DropdownMenu, Badge, responsive, Lucide, icon'
---

# UI Patterns para FacturDV

## Stack visual
- **TailwindCSS**: Estilos utilitarios. Modo oscuro con clase `dark`.
- **Radix UI**: Primitivas headless vía shadcn/ui.
- **Lucide React**: Íconos. Importar desde `lucide-react`.
- **Dark mode**: Fondo base `bg-zinc-950` o `bg-black/40`, texto `text-white`/`text-zinc-400`, bordes `border-white/10`.

## Patrones comunes

### Card con hover effect (usado en dashboard)
```tsx
<Card className="relative overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl transition-all hover:-translate-y-1 hover:border-purple-500/50 group !p-0">
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
  <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 relative z-10">
    <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-purple-300">Título</CardTitle>
    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
      <IconName className="w-5 h-5" />
    </div>
  </CardHeader>
  <CardContent className="p-4 pt-3 relative z-10">
    <div className="text-3xl xl:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200">{value}</div>
  </CardContent>
</Card>
```

### Badge
```tsx
<Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Acceso Global</Badge>
```

### Tabla/Lista con hover
```tsx
<Link href={url} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
  <span className="text-sm font-medium text-white group-hover:text-blue-400">Nombre</span>
</Link>
```

## Responsive
```tsx
<div className="grid gap-4 md:grid-cols-3">
  {/* 1 col en mobile, 3 en md+ */}
</div>
```

## Layout de página
```tsx
<div className="space-y-6">
  {/* Secciones verticales con espacio consistente */}
</div>
```

## Lazy loading de componentes pesados
```typescript
import dynamic from "next/dynamic"
const HeavyChart = dynamic(() => import("@/components/HeavyChart"), { ssr: false })
```

## Convenciones
- Nombres de archivos: `kebab-case.tsx`
- Componentes: `function PascalCase()`
- Props: `interface PascalCaseProps`
- Shadcn/ui en `src/components/ui/`
