'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
    isPositive: boolean
  }
  highlight?: boolean
}

export function KPICard({ label, value, subtext, trend, highlight }: KPICardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md',
      highlight && 'ring-2 ring-amber-200 bg-amber-50/30'
    )}>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn(
          'text-2xl font-bold tabular-nums',
          highlight ? 'text-amber-700' : 'text-foreground'
        )}>
          {value}
        </span>
        {trend && (
          <span className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            trend.isPositive ? 'text-emerald-600' : 'text-red-600'
          )}>
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      {subtext && (
        <div className="mt-1 text-xs text-muted-foreground">
          {subtext}
        </div>
      )}
    </div>
  )
}
