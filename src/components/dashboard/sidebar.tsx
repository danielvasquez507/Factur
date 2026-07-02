"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, FileText, Settings, Briefcase, ChevronRight, Bell, Layers, Receipt } from "lucide-react"

interface SidebarProps {
  userRole: string
}

export function Sidebar({ userRole }: SidebarProps) {
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
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname.startsWith("/dashboard/settings"),
      roles: ["COMPANY_ADMIN"],
    },
  ]

  const visibleRoutes = routes.filter((route) => route.roles.includes(userRole))

  return (
    <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl hidden md:flex flex-col z-20">
      <div className="h-14 flex items-center border-b border-white/10 px-6">
        <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-sm">
          Factur<span className="text-blue-500">.</span>
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleRoutes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                  route.active 
                    ? "bg-blue-500/10 text-blue-400 font-medium" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <route.icon className={cn("w-5 h-5", route.active ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                {route.label}
                {route.active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
