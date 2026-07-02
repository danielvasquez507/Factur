"use client"

import dynamic from "next/dynamic"

export const RevenueChart = dynamic(
  () => import("@/components/dashboard/revenue-chart").then(mod => mod.RevenueChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center animate-pulse bg-white/5 rounded-xl">
        <p className="text-zinc-500 text-sm">Cargando gráfico...</p>
      </div>
    )
  }
)
