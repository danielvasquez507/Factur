"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, Settings, Briefcase, ChevronRight, Bell, Layers, Receipt, X } from "lucide-react"
import { useSidebar } from "./sidebar-provider"

interface SidebarProps {
  userRole: string
  pendingRequestsCount?: number
  activeCompanyRole?: string | null
}

export function Sidebar({ userRole, pendingRequestsCount = 0, activeCompanyRole }: SidebarProps) {
  const pathname = usePathname()
  const { open, setOpen } = useSidebar()
  
  const routes = [
    {
      label: "Panel",
      icon: LayoutDashboard,
      href: "/panel",
      active: pathname === "/panel",
      roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
    },
    {
      label: "Usuarios",
      icon: Users,
      href: "/usuarios",
      active: pathname.startsWith("/usuarios"),
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Empresas",
      icon: Briefcase,
      href: "/empresas",
      active: pathname.startsWith("/empresas"),
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Solicitudes",
      icon: Bell,
      href: "/solicitudes",
      active: pathname.startsWith("/solicitudes"),
      roles: ["SUPER_ADMIN"],
      badge: pendingRequestsCount,
    },
    {
      label: "Facturas",
      icon: Receipt,
      href: "/facturas",
      active: pathname.startsWith("/facturas"),
      roles: ["COMPANY_ADMIN"],
    },
    {
      label: "Servicios",
      icon: Layers,
      href: "/servicios",
      active: pathname.startsWith("/servicios"),
      roles: ["COMPANY_ADMIN"],
    },
    {
      label: "Clientes",
      icon: Users,
      href: "/clientes",
      active: pathname.startsWith("/clientes"),
      roles: ["COMPANY_ADMIN"],
    },
    {
      label: "Mi Empresa",
      icon: Settings,
      href: "/configuracion",
      active: pathname.startsWith("/configuracion"),
      roles: ["COMPANY_ADMIN"],
    },
  ]

  const visibleRoutes = routes.filter((route) => {
    if (route.href === "/configuracion" && activeCompanyRole !== "OWNER") {
      return false
    }
    return route.roles.includes(userRole)
  })

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background/95 backdrop-blur-xl transform transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center justify-between border-b border-border px-6">
          <Link href="/perfil" onClick={() => setOpen(false)}>
            <h2 className="text-2xl font-black tracking-tighter text-foreground drop-shadow-sm hover:opacity-80 transition-opacity">
              Factur<span className="text-blue-500">.</span>
            </h2>
          </Link>
          <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {visibleRoutes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                    route.active 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <route.icon className={cn("w-5 h-5", route.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="font-medium flex-1">{route.label}</span>
                  {route.badge !== undefined && route.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                      {route.badge}
                    </span>
                  )}
                  {route.active && !route.badge && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside className="w-64 border-r border-border bg-background/80 backdrop-blur-xl hidden md:flex flex-col z-20">
        <div className="h-14 flex items-center border-b border-border px-6">
          <Link href="/perfil">
            <h2 className="text-2xl font-black tracking-tighter text-foreground drop-shadow-sm hover:opacity-80 transition-opacity">
              Factur<span className="text-blue-500">.</span>
            </h2>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {visibleRoutes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                    route.active 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <route.icon className={cn("w-5 h-5", route.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="font-medium flex-1">{route.label}</span>
                  {route.badge !== undefined && route.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                      {route.badge}
                    </span>
                  )}
                  {route.active && !route.badge && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
