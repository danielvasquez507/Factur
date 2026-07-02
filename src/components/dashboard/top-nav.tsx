"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, User } from "lucide-react"
import { CompanySelector } from "./company-selector"

// Eliminado ChangePasswordDialog ya que ahora usamos el módulo Mi Perfil

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface TopNavProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
  }
  companies: any[]
  activeTenantId: string | null
}

export function TopNav({ user, companies, activeTenantId }: TopNavProps) {
  return (
    <header className="h-14 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
          <Menu className="w-5 h-5" />
        </Button>
        <CompanySelector companies={companies} activeTenantId={activeTenantId} />
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <User className="w-4 h-4 text-zinc-400" />
                <span className="hidden sm:inline font-medium">{user.name || user.email}</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-zinc-200">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                  <p className="text-xs leading-none text-zinc-400">{user.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-white/10 focus:bg-white/10 p-0"
              render={
                <Link href="/dashboard/profile" className="flex items-center w-full px-2 py-1.5">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </Link>
              }
            />
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="cursor-pointer text-red-400 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
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
