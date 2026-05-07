'use client'

import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { HealthScoreRing } from './health-score-ring'
import { formatCurrency, getDaysUntilClosing, getStageName } from '@/lib/tc-mock-data'
import {
  MapPin,
  Calendar,
  User,
  FileX,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import type { Deal } from '@/lib/tc-types'

interface DealDrawerProps {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealDrawer({ deal, open, onOpenChange }: DealDrawerProps) {
  if (!deal) return null

  const daysUntil = getDaysUntilClosing(deal.closingDate)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closing':
      case 'closing_scheduled':
        return 'bg-emerald-100 text-emerald-700'
      case 'clear_to_close':
        return 'bg-blue-100 text-blue-700'
      case 'deals_title_remediation':
        return 'bg-red-100 text-red-700'
      case 'loan_processing':
        return 'bg-amber-100 text-amber-700'
      case 'inspection_scheduled':
        return 'bg-purple-100 text-purple-700'
      case 'contract_assigned':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // Mock milestones for display
  const milestones = [
    { name: 'PSA Signed', complete: true },
    { name: 'Title Pre-Check', complete: deal.milestonesComplete >= 2 },
    { name: 'Loan Quote', complete: deal.milestonesComplete >= 4 },
    { name: 'Inspection', complete: deal.milestonesComplete >= 6 },
    { name: 'Loan Payoffs', complete: deal.milestonesComplete >= 8 },
    { name: 'ID Verification', complete: deal.milestonesComplete >= 10 },
    { name: 'Clear to Close', complete: deal.milestonesComplete >= 14 },
    { name: 'Closing Scheduled', complete: deal.milestonesComplete >= 15 },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-4">
            <HealthScoreRing score={deal.healthScore} size="lg" />
            <div>
              <SheetTitle className="text-xl">{deal.name}</SheetTitle>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{deal.location}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status & Revenue */}
          <div className="flex items-center justify-between">
            <span className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg',
              getStageColor(deal.stage)
            )}>
              {getStageName(deal.stage)}
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600 tabular-nums">
                {formatCurrency(deal.revenue)}
              </div>
              <div className="text-xs text-muted-foreground">Est. Revenue</div>
            </div>
          </div>

          <Separator />

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Closing Date</div>
                <div className={cn(
                  'font-medium',
                  daysUntil <= 7 ? 'text-red-600' : daysUntil <= 14 ? 'text-amber-600' : 'text-foreground'
                )}>
                  {new Date(deal.closingDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({daysUntil}d)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">TC Assigned</div>
                <div className="font-medium">{deal.tcName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileX className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Missing Docs</div>
                <div className={cn(
                  'font-medium',
                  deal.missingDocs > 0 ? 'text-red-600' : 'text-emerald-600'
                )}>
                  {deal.missingDocs > 0 ? `${deal.missingDocs} missing` : 'All received'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Closing Probability</div>
                <div className={cn(
                  'font-medium',
                  deal.closingProbability >= 75 ? 'text-emerald-600' :
                  deal.closingProbability >= 50 ? 'text-amber-600' : 'text-red-600'
                )}>
                  {deal.closingProbability}%
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Partner Info */}
          {deal.partnerName && (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-3">Title Company</h4>
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <div className="font-medium">{deal.partnerName}</div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      <span>(813) 555-0142</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>contact@title.com</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last contact: {deal.lastContactDays} days ago
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Blocker */}
          {deal.blockerDescription && (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Current Blocker
                </h4>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm text-amber-800">{deal.blockerDescription}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">Milestones</h4>
              <span className="text-xs text-muted-foreground tabular-nums">
                {deal.milestonesComplete}/{deal.milestonesTotal} complete
              </span>
            </div>
            <div className="space-y-2">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md',
                    milestone.complete ? 'bg-emerald-50' : 'bg-muted/50'
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      'h-4 w-4',
                      milestone.complete ? 'text-emerald-600' : 'text-muted-foreground'
                    )}
                  />
                  <span className={cn(
                    'text-sm',
                    milestone.complete ? 'text-emerald-700' : 'text-muted-foreground'
                  )}>
                    {milestone.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" variant="default">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Deal
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
