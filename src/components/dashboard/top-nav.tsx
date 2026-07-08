"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User, Monitor, Sparkles, Moon, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface TopNavProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
  }
  activeCompanyRole?: string | null
}

export function TopNav({ user, activeCompanyRole }: TopNavProps) {
  const { setTheme, theme } = useTheme()

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl hidden md:flex items-center justify-end px-4 lg:px-6 z-20">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 flex items-center justify-center p-0">
                <User className="h-4 w-4 text-zinc-400" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-56 bg-background border-border text-foreground" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-white/10 focus:bg-white/10 p-0"
              render={
                <Link href="/perfil" className="flex items-center w-full px-2 py-1.5">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </Link>
              }
            />
            {activeCompanyRole === "OWNER" && (
              <DropdownMenuItem
                className="cursor-pointer hover:bg-white/10 focus:bg-white/10 p-0"
                render={
                  <Link href="/configuracion" className="flex items-center w-full px-2 py-1.5 text-purple-400">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración (Logo y más)</span>
                  </Link>
                }
              />
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer hover:bg-muted focus:bg-muted">
                <Monitor className="mr-2 h-4 w-4" />
                <span>Apariencia</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background border-border text-foreground">
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-muted focus:bg-muted">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Oscuro</span>
                    {theme === "dark" && <span className="ml-auto text-xs opacity-50">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("login")} className="cursor-pointer hover:bg-muted focus:bg-muted">
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Aurora</span>
                    {theme === "login" && <span className="ml-auto text-xs opacity-50">✓</span>}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="border-border" />
            <DropdownMenuItem 
              onClick={async () => {
                const toastId = toast.loading("Cerrando sesión...")
                await signOut({ callbackUrl: '/' })
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
    </header>
  )
}
