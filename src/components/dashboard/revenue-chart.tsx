"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#a1a1aa" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#a1a1aa" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          cursor={{ fill: '#ffffff0a' }}
          contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#60a5fa' }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingresos']}
        />
        <Bar dataKey="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
