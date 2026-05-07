'use client'

import { cn } from '@/lib/utils'
import { formatCurrency, getStageName } from '@/lib/tc-mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Deal } from '@/lib/tc-types'

interface RevenueForecastTableProps {
  deals: Deal[]
  onDealClick?: (deal: Deal) => void
}

interface ForecastSection {
  title: string
  deals: Deal[]
  totalGross: number
  totalNet: number
}

export function RevenueForecastTable({ deals, onDealClick }: RevenueForecastTableProps) {
  const now = new Date(2026, 4, 3) // May 3, 2026

  const thisMonth = deals.filter(deal => {
    const d = new Date(deal.closingDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const nextMonth = deals.filter(deal => {
    const d = new Date(deal.closingDate)
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return d.getMonth() === next.getMonth() && d.getFullYear() === next.getFullYear()
  })

  const twoMonths = deals.filter(deal => {
    const d = new Date(deal.closingDate)
    const twoM = new Date(now.getFullYear(), now.getMonth() + 2, 1)
    return d.getMonth() === twoM.getMonth() && d.getFullYear() === twoM.getFullYear()
  })

  const sections: ForecastSection[] = [
    {
      title: 'This Month - Estimated to Close',
      deals: thisMonth,
      totalGross: thisMonth.reduce((sum, d) => sum + d.revenue, 0),
      totalNet: thisMonth.reduce((sum, d) => sum + d.revenue * 0.7, 0),
    },
    {
      title: 'Next Month - Estimated to Close',
      deals: nextMonth,
      totalGross: nextMonth.reduce((sum, d) => sum + d.revenue, 0),
      totalNet: nextMonth.reduce((sum, d) => sum + d.revenue * 0.7, 0),
    },
    {
      title: 'In 2 Months - Estimated to Close',
      deals: twoMonths,
      totalGross: twoMonths.reduce((sum, d) => sum + d.revenue, 0),
      totalNet: twoMonths.reduce((sum, d) => sum + d.revenue * 0.7, 0),
    },
  ]

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <div key={idx} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-primary text-primary-foreground">
            <h3 className="font-semibold">{section.title}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[130px]">Est. Close Date</TableHead>
                <TableHead>Deal Name</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-center">Closing %</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">S2R Gross</TableHead>
                <TableHead className="text-right bg-amber-50">S2R Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No closings scheduled for this period
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {section.deals.map(deal => (
                    <TableRow
                      key={deal.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onDealClick?.(deal)}
                    >
                      <TableCell className="font-medium tabular-nums">
                        {formatDate(deal.closingDate)}
                      </TableCell>
                      <TableCell className="font-medium">{deal.name}</TableCell>
                      <TableCell>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-md',
                          deal.stage === 'closing' || deal.stage === 'closing_scheduled' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : deal.stage === 'deals_title_remediation'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {getStageName(deal.stage)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          'tabular-nums font-medium',
                          deal.closingProbability >= 75 ? 'text-emerald-600' :
                          deal.closingProbability >= 50 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {deal.closingProbability}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {deal.partnerName || '-'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(deal.revenue)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-amber-700 bg-amber-50/50">
                        {formatCurrency(deal.revenue * 0.7)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={5} className="text-right">
                      Grand Total
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(section.totalGross)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-amber-700 bg-amber-50/50">
                      {formatCurrency(section.totalNet)}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
