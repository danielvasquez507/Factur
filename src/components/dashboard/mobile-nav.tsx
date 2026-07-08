"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Receipt, Users, Layers, Briefcase, UserIcon, Bell, LogOut, Monitor, Moon, Sparkles, Check, Settings } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const superAdminItems = [
  { label: "Panel", icon: LayoutDashboard, href: "/" },
  { label: "Usuarios", icon: UserIcon, href: "/usuarios" },
  { label: "Empresas", icon: Briefcase, href: "/empresas" },
  { label: "Solicitudes", icon: Bell, href: "/solicitudes" },
]

const userItems = [
  { label: "Panel", icon: LayoutDashboard, href: "/" },
  { label: "Facturas", icon: Receipt, href: "/facturas" },
  { label: "Servicios", icon: Layers, href: "/servicios" },
  { label: "Clientes", icon: Users, href: "/clientes" },
]

interface MobileBottomNavProps {
  userRole: string
  pendingRequestsCount?: number
}

export function MobileBottomNav({ userRole, pendingRequestsCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname()
  const items = userRole === "SUPER_ADMIN" ? superAdminItems : userItems

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="flex items-center px-2 py-2 rounded-2xl bg-zinc-900/85 backdrop-blur-xl border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.25)] overflow-x-auto overflow-y-hidden scrollbar-none">
        <div className="flex items-center gap-0.5 mx-auto">
          {items.map((item) => {
            const active = isActive(item.href)
            const showBadge = item.label === "Solicitudes" && pendingRequestsCount > 0
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 shrink-0",
                  active
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <div className={cn(
                  "relative transition-all duration-200",
                  active && "-translate-y-0.5"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    active ? "text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "text-zinc-500"
                  )} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-lg">
                      {pendingRequestsCount > 9 ? "9+" : pendingRequestsCount}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200 whitespace-nowrap",
                  active ? "text-blue-400" : "text-zinc-500"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

import { DeveloperCredits } from "./developer-credits"

export function AutoHideHeader({
  userName,
  userEmail,
  userRole,
  companies,
  activeTenantId,
  activeCompanyRole,
}: {
  userName?: string | null
  userEmail?: string | null
  userRole?: string
  companies: any[]
  activeTenantId: string | null
  activeCompanyRole?: string | null
}) {
  const [visible, setVisible] = useState(true)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), 20000)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50 md:hidden w-9 h-9 rounded-full bg-zinc-800/60 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-zinc-700/60 transition-all active:scale-95"
      >
        <span className="text-sm font-black tracking-tighter text-white drop-shadow-sm">
          Factur<span className="text-blue-500">.</span>
        </span>
      </button>
    )
  }

  return (
    <div key="header" className="fixed top-0 left-0 right-0 z-50 md:hidden animate-slide-down">
      <div className="bg-zinc-900/90 backdrop-blur-xl border-b border-white/5 px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="w-10" />

          <Link href="/" className="text-center">
            <h1 className="text-xl font-black tracking-tighter text-white drop-shadow-sm">
              Factur<span className="text-blue-500">.</span>
            </h1>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="text-zinc-400 w-10 h-10">
                  <UserIcon className="w-5 h-5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border-white/10 text-white mr-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{userName}</p>
                    <p className="text-xs leading-none text-zinc-400">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-white/10 focus:bg-white/10 p-0"
                render={
                  <Link href="/perfil" className="flex items-center w-full px-2 py-1.5">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                }
              />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Apariencia</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-zinc-900 border-white/10 text-white">
                    <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Oscuro</span>
                      {theme === "dark" && <Check className="ml-auto w-3.5 h-3.5 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("login")} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Aurora</span>
                      {theme === "login" && <Check className="ml-auto w-3.5 h-3.5 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="bg-white/10" />
              
              {userRole !== "SUPER_ADMIN" && activeCompanyRole === "OWNER" && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-white/10 focus:bg-white/10 p-0"
                  render={
                    <Link href="/configuracion" className="flex items-center w-full px-2 py-1.5 text-blue-400">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  }
                />
              )}

              {userRole !== "SUPER_ADMIN" && companies.length > 0 && (
                <div className="px-2 py-2 mt-1 border-t border-white/5">
                  <p className="text-[11px] text-zinc-500 px-2 mb-1.5 font-medium uppercase tracking-wider">Empresas</p>
                  <div className="space-y-0.5">
                    {companies.map((c) => {
                      const isActive = c.id === activeTenantId
                      return (
                        <a
                          key={c.id}
                          href={isActive ? "#" : `/api/switch-company/${c.id}`}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-primary/15 text-primary border border-primary/20"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            isActive ? "bg-primary" : "bg-zinc-600"
                          )} />
                          <span className="flex-1 truncate">{c.name}</span>
                          {isActive && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Activo</span>
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
              <DropdownMenuSeparator className="bg-white/10" />
              <DeveloperCredits />
              <DropdownMenuItem
                onClick={async () => {
                  const toastId = toast.loading("Cerrando sesión...")
                  await signOut({ callbackUrl: "/" })
                  toast.dismiss(toastId)
                }}
                className="cursor-pointer text-red-500 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
