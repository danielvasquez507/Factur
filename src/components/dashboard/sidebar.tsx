"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, FileText, Settings, Briefcase, ChevronRight, Bell, Layers, Receipt } from "lucide-react"

interface SidebarProps {
  userRole: string
  pendingRequestsCount?: number
}

export function Sidebar({ userRole, pendingRequestsCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  
  const routes = [
    {
      label: "Inicio",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
      roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
    },
    {
      label: "Facturas",
      icon: Receipt,
      href: "/dashboard/invoices",
      active: pathname.startsWith("/dashboard/invoices"),
      roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
    },
    {
      label: "Clientes",
      icon: Users,
      href: "/dashboard/clients",
      active: pathname.startsWith("/dashboard/clients"),
      roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
    },
    {
      label: "Servicios",
      icon: Layers,
      href: "/dashboard/services",
      active: pathname.startsWith("/dashboard/services"),
      roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
    },
    {
      label: "Empresas",
      icon: Briefcase,
      href: "/dashboard/companies",
      active: pathname.startsWith("/dashboard/companies"),
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Usuarios",
      icon: Users,
      href: "/dashboard/users",
      active: pathname.startsWith("/dashboard/users"),
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Solicitudes",
      icon: Bell,
      href: "/dashboard/requests",
      active: pathname.startsWith("/dashboard/requests"),
      roles: ["SUPER_ADMIN"],
      badge: pendingRequestsCount,
    },
    {
      label: "Mi Empresa",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname.startsWith("/dashboard/settings"),
      roles: ["COMPANY_ADMIN"],
    },
  ]

  const visibleRoutes = routes.filter((route) => route.roles.includes(userRole))

  return (
    <aside className="w-64 border-r border-border bg-background/80 backdrop-blur-xl hidden md:flex flex-col z-20">
      <div className="h-14 flex items-center border-b border-border px-6">
        <h2 className="text-2xl font-black tracking-tighter text-foreground drop-shadow-sm">
          Factur<span className="text-primary">.</span>
        </h2>
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
  )
}
