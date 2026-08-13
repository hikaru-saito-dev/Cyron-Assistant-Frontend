'use client'
import { cn } from '@/lib/utils'
import React, { useRef } from 'react'
import { ClippedAreaChart } from '@/components/ui/advanced-stats-utils/charts'
import { TimelineAnimation } from '@/components/ui/advanced-stats-utils/timeline-animation'
import { ArrowUpRight, ArrowDownRight, Server, Bot, CreditCard, Zap } from 'lucide-react'

interface AdvancedStatsProps {
  totalServers?: number
  botActive?: number
  paidServers?: number
  adoptionRate?: number
  isLoading?: boolean
}

export default function AdvancedStats({
  totalServers = 0,
  botActive = 0,
  paidServers = 0,
  adoptionRate = 0,
  isLoading = false,
}: AdvancedStatsProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  const offlineServers = totalServers - botActive
  const freeServers = totalServers - paidServers

  const kpis = [
    {
      label: 'Total Servers',
      value: isLoading ? '—' : String(totalServers),
      change: botActive > 0 ? `${botActive} with bot` : 'No bots yet',
      status: botActive > 0 ? 'up' : 'down',
      icon: Server,
      subtext: 'Discord servers connected',
    },
    {
      label: 'Bot Active',
      value: isLoading ? '—' : String(botActive),
      change: `${adoptionRate}% coverage`,
      status: adoptionRate >= 50 ? 'up' : 'down',
      icon: Zap,
      subtext: `${offlineServers} server${offlineServers !== 1 ? 's' : ''} without bot`,
    },
    {
      label: 'Paid Servers',
      value: isLoading ? '—' : String(paidServers),
      change: paidServers > 0 ? `${Math.round((paidServers / (totalServers || 1)) * 100)}% on paid plan` : 'Upgrade available',
      status: paidServers > 0 ? 'up' : 'down',
      icon: CreditCard,
      subtext: `${freeServers} on free tier`,
    },
    {
      label: 'Adoption Rate',
      value: isLoading ? '—' : `${adoptionRate}%`,
      change: adoptionRate >= 80 ? 'Excellent' : adoptionRate >= 50 ? 'Good' : 'Needs attention',
      status: adoptionRate >= 50 ? 'up' : 'down',
      icon: Bot,
      subtext: 'Bot installed / total servers',
    },
  ]

  return (
    <section
      ref={timelineRef}
      className="flex flex-col gap-8 py-8 bg-black md:px-0 px-5"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <TimelineAnimation
            animationNum={1}
            timelineRef={timelineRef}
            className="lg:col-span-2 p-8 rounded-3xl bg-zinc-900 border border-zinc-700"
          >
            <ClippedAreaChart
              totalServers={totalServers}
              botActive={botActive}
              paidServers={paidServers}
              adoptionRate={adoptionRate}
              isLoading={isLoading}
            />
          </TimelineAnimation>

          {/* Breakdown Section */}
          <div>
            <div className="flex flex-col gap-4 h-full">
              {/* Bot Adoption Progress */}
              <TimelineAnimation
                animationNum={2}
                timelineRef={timelineRef}
                className="p-6 rounded-3xl bg-zinc-100 text-black flex flex-col justify-between shadow-lg flex-1"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    Bot Adoption Goal
                  </p>
                  <h4 className="text-xl font-bold tracking-tight">
                    Server Coverage
                  </h4>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-semibold tracking-tighter">
                      {isLoading ? '—' : `${adoptionRate}%`}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 mb-1">
                      Target: 100%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-700"
                      style={{ width: `${isLoading ? 0 : Math.min(adoptionRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    {isLoading ? '…' : `${botActive} of ${totalServers} servers have the bot installed`}
                  </p>
                </div>
              </TimelineAnimation>

              {/* Paid vs Free breakdown */}
              <TimelineAnimation
                animationNum={3}
                timelineRef={timelineRef}
                className="p-6 rounded-3xl bg-zinc-900 border border-zinc-700 flex-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <CreditCard className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-bold text-zinc-100">Plan Breakdown</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Free tier</span>
                    <span className="text-sm font-bold text-zinc-200">
                      {isLoading ? '—' : freeServers}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-400 rounded-full"
                      style={{ width: `${isLoading || !totalServers ? 0 : Math.round((freeServers / totalServers) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-zinc-400">Paid plans</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {isLoading ? '—' : paidServers}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${isLoading || !totalServers ? 0 : Math.round((paidServers / totalServers) * 100)}%` }}
                    />
                  </div>
                </div>
              </TimelineAnimation>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <TimelineAnimation
                animationNum={4 + index}
                timelineRef={timelineRef}
                key={kpi.label}
                className={cn(
                  'p-6 rounded-2xl border bg-zinc-900 border-zinc-700 transition-all duration-300',
                  kpi.status === 'up'
                    ? 'hover:border-emerald-500 hover:bg-emerald-950'
                    : 'hover:border-rose-500 hover:bg-rose-950'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {kpi.label}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded',
                      kpi.status === 'up'
                        ? 'text-emerald-400 bg-emerald-950'
                        : 'text-rose-400 bg-rose-950'
                    )}
                  >
                    {kpi.status === 'up'
                      ? <ArrowUpRight className="w-3 h-3" />
                      : <ArrowDownRight className="w-3 h-3" />
                    }
                  </span>
                </div>
                <p className="text-2xl font-black text-zinc-100 tracking-tighter mb-1">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-zinc-500">{kpi.subtext}</p>
                <p className={cn(
                  'text-[11px] font-semibold mt-1',
                  kpi.status === 'up' ? 'text-emerald-400' : 'text-rose-400'
                )}>
                  {kpi.change}
                </p>
              </TimelineAnimation>
            )
          })}
        </div>
      </div>
    </section>
  )
}
