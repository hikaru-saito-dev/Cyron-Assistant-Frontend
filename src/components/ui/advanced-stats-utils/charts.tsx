'use client'
import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ClippedAreaChartProps {
  totalServers?: number
  botActive?: number
  paidServers?: number
  adoptionRate?: number
  isLoading?: boolean
}

// Demo monthly server growth data — replace with real API time-series when available
const generateMonthlyData = (total: number, botActive: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const currentMonth = now.getMonth()

  return months.slice(0, currentMonth + 1).map((month, i) => {
    const progress = i / Math.max(currentMonth, 1)
    const wave = Math.sin(i * 0.9) * 0.18
    const base = Math.round(total * (0.3 + progress * 0.7 + wave))
    const bots = Math.round(botActive * (0.25 + progress * 0.75 + wave * 0.8))
    return {
      month,
      servers: Math.max(1, base),
      bots: Math.max(0, Math.min(bots, base)),
    }
  })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#18181b',
        border: '1px solid #3f3f46',
        borderRadius: '10px',
        padding: '8px 14px',
        fontSize: '12px',
        color: '#fff',
      }}>
        <p style={{ color: '#a1a1aa', marginBottom: 4, fontSize: 11 }}>{label}</p>
        <p style={{ color: '#fb923c', fontWeight: 700 }}>
          {payload[0]?.value} servers
        </p>
        <p style={{ color: '#71717a', fontSize: 11 }}>
          {payload[1]?.value} bots active
        </p>
      </div>
    )
  }
  return null
}

export function ClippedAreaChart({
  totalServers = 0,
  botActive = 0,
  paidServers = 0,
  adoptionRate = 0,
  isLoading = false,
}: ClippedAreaChartProps) {
  const data = generateMonthlyData(totalServers, botActive)

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
          Server Growth
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-zinc-100">
          {isLoading ? '—' : totalServers} Servers{' '}
          <span className="text-sm font-medium text-orange-400">
            {isLoading ? '' : `${adoptionRate}% bot coverage`}
          </span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          {isLoading ? '' : `${paidServers} paid · ${botActive} bots active`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-6 h-6 border-2 border-white/10 border-t-zinc-300 rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="serverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="botGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#71717a" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#71717a" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#71717a', fontWeight: 400 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />

            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Bot active area (behind) */}
            <Area
              type="monotone"
              dataKey="bots"
              stroke="#52525b"
              strokeWidth={1.5}
              fill="url(#botGradient)"
              dot={false}
              activeDot={false}
            />

            {/* Total servers area (front) */}
            <Area
              type="monotone"
              dataKey="servers"
              stroke="#fb923c"
              strokeWidth={2}
              fill="url(#serverGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#fb923c', stroke: '#18181b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      {!isLoading && (
        <div className="flex gap-5 mt-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 rounded-full bg-orange-400 inline-block" />
            <span className="text-[11px] text-zinc-400">Total servers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 rounded-full bg-zinc-500 inline-block" />
            <span className="text-[11px] text-zinc-400">Bots active</span>
          </div>
        </div>
      )}
    </div>
  )
}
