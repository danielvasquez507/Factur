"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  History, 
  Users, 
  UserCircle,
  Building2,
  FileSignature
} from "lucide-react"

interface DockNavProps {
  userRole?: string
  pendingRequestsCount?: number
}

export function DockNav({ userRole, pendingRequestsCount = 0 }: DockNavProps) {
  const pathname = usePathname()
  const isSuperAdmin = userRole === "SUPER_ADMIN"

  const regularItems = [
    { href: "/", label: "Panel", icon: LayoutDashboard },
    { href: "/historial", label: "Historial", icon: History },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/perfil", label: "Perfil", icon: UserCircle },
  ]

  const adminItems = [
    { href: "/", label: "Panel", icon: LayoutDashboard },
    { href: "/usuarios", label: "Usuarios", icon: Users },
    { href: "/empresas", label: "Empresas", icon: Building2 },
    { 
      href: "/solicitudes", 
      label: "Solicitudes", 
      icon: FileSignature,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null
    },
  ]

  const items = isSuperAdmin ? adminItems : regularItems

  // Dividimos a la mitad para poner el logo en el medio
  const leftItems = items.slice(0, 2)
  const rightItems = items.slice(2, 4)

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <nav className="flex items-center gap-2 p-2 bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full relative">
        
        {/* Left Items */}
        {leftItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "relative group flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all duration-300",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mb-1 transition-all duration-300",
                isActive ? "text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "text-zinc-400 group-hover:text-zinc-200"
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive ? "text-blue-400 opacity-100" : "text-zinc-500 opacity-70 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Center Logo */}
        <div className="flex items-center justify-center w-14 h-14 mx-1">
          <div className="w-12 h-12 rounded-xl bg-[#0e122e] flex items-center justify-center shadow-[0_0_20px_rgba(14,18,46,0.6)] border-2 border-white/10 cursor-default">
            <span className="text-white font-black text-2xl tracking-tighter drop-shadow-md">F<span className="text-blue-500">.</span></span>
          </div>
        </div>

        {/* Right Items */}
        {rightItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "relative group flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all duration-300",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div className="relative">
                <item.icon className={cn(
                  "w-5 h-5 mb-1 transition-all duration-300",
                  isActive ? "text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "text-zinc-400 group-hover:text-zinc-200"
                )} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-lg">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive ? "text-blue-400 opacity-100" : "text-zinc-500 opacity-70 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
