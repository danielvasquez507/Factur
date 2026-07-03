"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function DynamicBackground() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentTheme = theme === 'system' ? resolvedTheme : theme

  if (currentTheme === "login") {
    return (
      <>
        {/* Dynamic Ambient Background */}
        <div className="fixed top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none -z-10" style={{ animationDuration: '8s' }}></div>
        <div className="fixed -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none -z-10" style={{ animationDuration: '10s' }}></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-purple-500/10 rounded-[100%] rotate-45 mix-blend-screen filter blur-[80px] pointer-events-none -z-10"></div>
        {/* Grid Pattern Overlay */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
      </>
    )
  }

  // Dark/Full Black theme background
  if (currentTheme === "dark") {
    return (
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[128px] pointer-events-none -z-10"></div>
    )
  }

  // Light theme background
  return (
    <div className="fixed inset-0 bg-slate-50 -z-10 pointer-events-none"></div>
  )
}
