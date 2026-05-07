'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/tc-mock-data'
import type { Deal } from '@/lib/tc-types'

interface ClosingCalendarProps {
  deals: Deal[]
  onDealClick?: (deal: Deal) => void
}

export function ClosingCalendar({ deals, onDealClick }: ClosingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)) // May 2026

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date(2026, 4, 1)) // Reset to May 2026 for demo
  }

  // Get deals for a specific day
  const getDealsForDay = (day: number) => {
    return deals.filter(deal => {
      const dealDate = new Date(deal.closingDate)
      return (
        dealDate.getDate() === day &&
        dealDate.getMonth() === currentDate.getMonth() &&
        dealDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  // Calculate monthly totals
  const monthlyDeals = deals.filter(deal => {
    const dealDate = new Date(deal.closingDate)
    return (
      dealDate.getMonth() === currentDate.getMonth() &&
      dealDate.getFullYear() === currentDate.getFullYear()
    )
  })
  const monthlyRevenue = monthlyDeals.reduce((sum, deal) => sum + deal.revenue, 0)

  const getClosingPillStyle = (deal: Deal) => {
    if (deal.healthScore >= 70) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    } else if (deal.healthScore >= 40) {
      return 'bg-amber-100 text-amber-800 border-amber-200'
    }
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{monthName}</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{formatCurrency(monthlyRevenue)}</span>
            {' '}across {monthlyDeals.length} closing{monthlyDeals.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {days.map(day => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground border-b border-border bg-muted/20">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/10" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayDeals = getDealsForDay(day)
          const isToday = day === 3 && currentDate.getMonth() === 4 && currentDate.getFullYear() === 2026 // May 3, 2026

          return (
            <div
              key={day}
              className={cn(
                'min-h-[100px] border-b border-r border-border p-1',
                isToday && 'bg-primary/5'
              )}
            >
              <div className={cn(
                'text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full',
                isToday && 'bg-primary text-primary-foreground'
              )}>
                {day}
              </div>
              <div className="space-y-1">
                {dayDeals.slice(0, 2).map(deal => (
                  <button
                    key={deal.id}
                    onClick={() => onDealClick?.(deal)}
                    className={cn(
                      'w-full text-left px-1.5 py-1 rounded text-xs font-medium truncate border',
                      'hover:opacity-80 transition-opacity cursor-pointer',
                      getClosingPillStyle(deal)
                    )}
                  >
                    {deal.name.split(' ')[0]} - {formatCurrency(deal.revenue)}
                  </button>
                ))}
                {dayDeals.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayDeals.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Empty cells to fill the last row */}
        {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
          <div key={`empty-end-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/10" />
        ))}
      </div>
    </div>
  )
}
