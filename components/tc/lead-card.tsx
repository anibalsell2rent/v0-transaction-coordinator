'use client'

import { cn } from '@/lib/utils'
import { MapPin, Clock, FileX, User, AlertTriangle } from 'lucide-react'
import { HealthScoreRing } from './health-score-ring'
import { formatCurrency, getStageName } from '@/lib/tc-mock-data'
import type { Lead } from '@/lib/tc-types'

interface LeadCardProps {
  lead: Lead
  onClick?: () => void
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const missingDocs = lead.docsRequired - lead.docsReceived
  const docPercentage = (lead.docsReceived / lead.docsRequired) * 100

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'analyze_qualify':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'title_remediation':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
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
          <HealthScoreRing score={lead.healthScore} size="md" />
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground">{lead.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{lead.location}</span>
            </div>
          </div>
        </div>
        <span className={cn(
          'px-2 py-1 text-xs font-medium rounded-md border shrink-0',
          getStageColor(lead.stage)
        )}>
          {getStageName(lead.stage)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">In stage:</span>
          <span className={cn(
            'font-medium',
            lead.daysInStage > 7 ? 'text-amber-600' : 'text-foreground'
          )}>
            {lead.daysInStage}d
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{lead.tcName.split(' ').slice(0, 2).join(' ')}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {missingDocs > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              <FileX className="h-3 w-3" />
              {missingDocs} docs missing
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              All docs received
            </span>
          )}
        </div>
        <div className="font-semibold text-amber-600 tabular-nums">
          {formatCurrency(lead.revenuePotential)}
        </div>
      </div>

      {lead.issueDescription && (
        <div className="mt-3 flex items-start gap-2 p-2 rounded-md bg-red-50 border border-red-100">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{lead.issueDescription}</p>
        </div>
      )}

      {lead.flags.length > 0 && !lead.issueDescription && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {lead.flags.join(' • ')}
          </p>
        </div>
      )}

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Documents</span>
          <span className="tabular-nums">{lead.docsReceived}/{lead.docsRequired}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              docPercentage >= 80 ? 'bg-emerald-500' : docPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
            )}
            style={{ width: `${docPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
