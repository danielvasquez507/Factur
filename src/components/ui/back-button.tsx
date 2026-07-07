"use client"

import { ArrowLeft } from "lucide-react"

export function BackButton({ label }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  )
}
