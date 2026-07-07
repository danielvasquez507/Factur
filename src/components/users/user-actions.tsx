"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteUser } from "@/actions/users"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

const PROTECTED_USER_ID = "8c732b08-e938-4b90-ad24-12e8b5c97c1e"

export function DeleteUserButton({ user }: { user: any }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  if (user.id === PROTECTED_USER_ID) return null

  return (
    <>
      <Button
        variant="outline"
        className="border-red-900/30 text-red-500 hover:bg-red-500/10 hover:text-red-300 text-xs h-7 px-2.5 gap-1.5"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={deleting}
      >
        {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Eliminar
      </Button>

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
    </>
  )
}
