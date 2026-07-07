"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { removeUserFromCompany } from "@/actions/users"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function UnlinkCompanyButton({ userId, companyId, companyName }: { userId: string, companyId: string, companyName: string }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await removeUserFromCompany(userId, companyId)
    setLoading(false)
    setShowConfirm(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="px-3 py-2 rounded-md text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        title="Desvincular empresa"
      >
        <X className="w-4 h-4" />
      </button>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Desvincular empresa"
        description={`¿Estás seguro de desvincular ${companyName} de este usuario?`}
        confirmLabel="Desvincular"
        variant="danger"
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  )
}
