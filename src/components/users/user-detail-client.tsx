"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Building2, Pencil, Link2, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditUserDialog } from "./edit-user-dialog"
import { AssignCompanyDialog } from "./assign-company-dialog"
import { UnlinkCompanyButton } from "./unlink-company-button"
import { deleteUser, unlockUser } from "@/actions/users"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatDate } from "@/lib/utils"
import { LockOpen } from "lucide-react"

export function UserDetailClient({ user, companies }: { user: any; companies: any[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const activeUserCompanies = user.userCompanies?.filter((uc: any) => uc.company?.isActive) ?? []
  const excludeCompanyIds = user.userCompanies?.map((uc: any) => uc.companyId) ?? []

  const handleDelete = async () => {
    setDeleting(true)
    const res = await deleteUser(user.id)
    setDeleting(false)
    setShowDeleteConfirm(false)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Usuario eliminado exitosamente")
      router.push("/usuarios")
    }
  }

  const handleUnlock = async () => {
    setUnlocking(true)
    const res = await unlockUser(user.id)
    setUnlocking(false)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Cuenta desbloqueada exitosamente")
    }
  }

  const isLocked = user.lockedUntil && new Date(user.lockedUntil) > new Date()

  return (
    <div className="space-y-6">
      <BackButton label="Volver" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{user.name}</h1>
      </div>

      {/* Información del Usuario */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Información del Usuario
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="ml-auto w-7 h-7 rounded-md border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors"
              title="Editar usuario"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <User className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Nombre</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Correo Electrónico</p>
                <p className="text-white font-medium break-all">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Shield className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Rol</p>
                <div className="mt-0.5">
                  {user.role === "SUPER_ADMIN" ? (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">Super Admin</Badge>
                  ) : (
                    <Badge variant="outline" className="border-zinc-500/30 text-zinc-400 bg-zinc-500/10">Usuario</Badge>
                  )}
                </div>
              </div>
            </div>
            {isLocked && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 col-span-1 sm:col-span-2 lg:col-span-3">
                <div className="flex-1">
                  <p className="text-sm text-red-400 font-medium">Cuenta bloqueada temporalmente</p>
                  <p className="text-xs text-red-500/80">
                    Bloqueada hasta: {formatDate(user.lockedUntil)}
                  </p>
                </div>
                <Button 
                  onClick={handleUnlock} 
                  disabled={unlocking}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {unlocking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LockOpen className="w-4 h-4 mr-2" />}
                  Desbloquear
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Empresas Asignadas */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Empresas Asignadas
            {user.role !== "SUPER_ADMIN" && (
              <button
                type="button"
                onClick={() => setAssigning(true)}
                className="ml-auto w-7 h-7 rounded-md border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors"
                title="Vincular empresa"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.role === "SUPER_ADMIN" ? (
            <p className="text-sm text-blue-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Acceso global a todas las empresas
            </p>
          ) : activeUserCompanies.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">Sin empresas asignadas</p>
          ) : (
            <div className="space-y-2">
              {activeUserCompanies.map((uc: any) => (
                <div key={uc.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div>
                      <Link href={`/empresas/${uc.company.id}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                        {uc.company.name}
                      </Link>
                      <p className="text-xs text-zinc-500">
                        {uc.roleInCompany === "OWNER" ? "Propietario" : "Administrador"}
                      </p>
                    </div>
                  </div>
                  <UnlinkCompanyButton userId={user.id} companyId={uc.companyId} companyName={uc.company.name} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-4 pt-2">
        <p className="text-xs text-zinc-600">Usuario creado el {formatDate(user.createdAt)}</p>
        {user.email !== "info.danielvasquez@gmail.com" && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="text-xs text-red-500/70 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Eliminar usuario
          </button>
        )}
      </div>

      <EditUserDialog
        user={user}
        open={editing}
        onOpenChange={(open) => {
          setEditing(false)
          if (!open) router.refresh()
        }}
      />

      <AssignCompanyDialog
        userId={user.id}
        companies={companies}
        excludeCompanyIds={excludeCompanyIds}
        open={assigning}
        onOpenChange={(open) => {
          setAssigning(false)
          if (!open) router.refresh()
        }}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Eliminar usuario"
        description={`¿Estás seguro de eliminar a ${user.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
