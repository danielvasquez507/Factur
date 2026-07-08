"use client"

import { useTransition } from "react"
import { updateInvoiceStatus } from "@/actions/invoices"
import { toast } from "sonner"
import { Loader2, CircleDot, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function InvoiceStatusSelector({ invoiceId, currentStatus }: { invoiceId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, newStatus)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Estado actualizado")
      }
    })
  }

  const statusMap: Record<string, string> = {
    ISSUED: "Emitida",
    PAID: "Cobrada",
    CANCELLED: "Anulada",
    DRAFT: "Borrador"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(buttonVariants({ variant: "outline" }), "group bg-blue-500/10 backdrop-blur border-blue-500/30 hover:bg-blue-500 hover:text-white text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-full transition-all duration-300 h-9 px-4 py-2 flex justify-center items-center")}
      >
        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CircleDot className="w-4 h-4 mr-2 shrink-0" />}
        <span className="capitalize">{statusMap[currentStatus] || "Borrador"}</span>
        <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-zinc-900 border-white/10 text-white rounded-xl">
        <DropdownMenuItem onClick={() => handleStatusChange("ISSUED")} className="focus:bg-white/10 cursor-pointer">
          Emitida
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("PAID")} className="focus:bg-white/10 cursor-pointer text-emerald-400 focus:text-emerald-400">
          Cobrada
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("CANCELLED")} className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400">
          Anulada
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
