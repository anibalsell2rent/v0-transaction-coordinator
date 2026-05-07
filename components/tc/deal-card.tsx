'use client'

import { cn } from '@/lib/utils'
import { MapPin, Calendar, FileX, User } from 'lucide-react'
import { HealthScoreRing } from './health-score-ring'
import { formatCurrency, getDaysUntilClosing, getStageName } from '@/lib/tc-mock-data'
import type { Deal } from '@/lib/tc-types'

interface DealCardProps {
  deal: Deal
  onClick?: () => void
  compact?: boolean
}

export function DealCard({ deal, onClick, compact = false }: DealCardProps) {
  const daysUntil = getDaysUntilClosing(deal.closingDate)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closing':
      case 'closing_scheduled':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'clear_to_close':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'deals_title_remediation':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'loan_processing':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'inspection_scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'contract_assigned':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'rounded-lg border border-border bg-card p-3 shadow-sm',
          'hover:bg-muted/30 hover:shadow-md transition-all cursor-pointer'
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <HealthScoreRing score={deal.healthScore} size="sm" />
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate">{deal.name}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{deal.city}, {deal.state}</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-semibold text-amber-600 tabular-nums">
              {formatCurrency(deal.revenue)}
            </div>
            <div className="text-xs text-muted-foreground">
              {daysUntil}d
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-sm',
        'hover:bg-muted/30 hover:shadow-md transition-all cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <HealthScoreRing score={deal.healthScore} size="md" />
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground">{deal.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{deal.location}</span>
            </div>
          </div>
        </div>
        <span className={cn(
          'px-2 py-1 text-xs font-medium rounded-md border shrink-0',
          getStageColor(deal.stage)
        )}>
          {getStageName(deal.stage)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Closing:</span>
          <span className={cn(
            'font-medium',
            daysUntil <= 7 ? 'text-red-600' : daysUntil <= 14 ? 'text-amber-600' : 'text-foreground'
          )}>
            {daysUntil}d
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{deal.tcName.split(' ').slice(0, 2).join(' ')}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {deal.missingDocs > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              <FileX className="h-3 w-3" />
              {deal.missingDocs} missing
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              All docs received
            </span>
          )}
        </div>
        <div className="font-semibold text-amber-600 tabular-nums">
          {formatCurrency(deal.revenue)}
        </div>
      </div>

      {deal.blockerDescription && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-1">
            {deal.blockerDescription}
          </p>
        </div>
      )}

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Milestones</span>
          <span className="tabular-nums">{deal.milestonesComplete}/{deal.milestonesTotal}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(deal.milestonesComplete / deal.milestonesTotal) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
