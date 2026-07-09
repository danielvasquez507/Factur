"use client"

import { useRouter } from "next/navigation"
import React from "react"

export function ClickableTableRow({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  const router = useRouter()
  return (
    <tr onClick={() => router.push(href)} className={`${className || ''} cursor-pointer`}>
      {children}
    </tr>
  )
}
