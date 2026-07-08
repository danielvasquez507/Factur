"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditClientDialog } from "./edit-client-dialog"

export function EditClientButton({ client }: { client: any }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300 gap-2"
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:inline">Editar</span>
      </Button>

      <EditClientDialog 
        client={client}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
