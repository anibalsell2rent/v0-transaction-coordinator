'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, ChevronDown, ChevronRight, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AidaInsight } from '@/lib/tc-types'

interface AidaPanelProps {
  insights: AidaInsight[]
  onDraftEmail?: (insight: AidaInsight) => void
  onViewDetail?: (insight: AidaInsight) => void
}

export function AidaPanel({ insights, onDraftEmail, onViewDetail }: AidaPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const getSeverityStyles = (severity: AidaInsight['severity']) => {
    switch (severity) {
      case 'urgent':
        return {
          border: 'border-l-red-500',
          bg: 'bg-red-50/50',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-700',
        }
      case 'warning':
        return {
          border: 'border-l-amber-500',
          bg: 'bg-amber-50/50',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700',
        }
      case 'success':
        return {
          border: 'border-l-emerald-500',
          bg: 'bg-emerald-50/50',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-700',
        }
    }
  }

  const urgentCount = insights.filter(i => i.severity === 'urgent').length
  const warningCount = insights.filter(i => i.severity === 'warning').length

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center gap-3 border-b border-emerald-100 hover:bg-emerald-100/50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-foreground" />
        )}
        <div className="h-7 w-7 rounded-md bg-[var(--s2r-green)] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-emerald-900" />
        </div>
        <span className="font-semibold text-foreground">AIDA</span>
        <span className="text-sm text-muted-foreground">
          {insights.length} alert{insights.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2 ml-auto">
          {urgentCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
              {urgentCount} urgent
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
              {warningCount} warning
            </span>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {insights.map((insight) => {
            const styles = getSeverityStyles(insight.severity)
            const Icon = styles.icon

            return (
              <div
                key={insight.id}
                className={cn(
                  'rounded-lg border border-border bg-card p-4 border-l-4',
                  styles.border
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', styles.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full uppercase', styles.badge)}>
                        {insight.severity}
                      </span>
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          if (insight.primaryAction.type === 'draft_email') {
                            onDraftEmail?.(insight)
                          } else {
                            onViewDetail?.(insight)
                          }
                        }}
                      >
                        {insight.primaryAction.label}
                      </Button>
                      {insight.secondaryAction && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            if (insight.secondaryAction?.type === 'view_detail') {
                              onViewDetail?.(insight)
                            } else {
                              onDraftEmail?.(insight)
                            }
                          }}
                        >
                          {insight.secondaryAction.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
