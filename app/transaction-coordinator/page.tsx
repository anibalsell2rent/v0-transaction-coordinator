'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  ChevronRight,
  Building2,
  Users,
} from 'lucide-react'

import { KPICard } from '@/components/tc/kpi-card'
import { AidaPanel } from '@/components/tc/aida-panel'
import { DealCard } from '@/components/tc/deal-card'
import { LeadCard } from '@/components/tc/lead-card'
import { ClosingCalendar } from '@/components/tc/closing-calendar'
import { RevenueForecastTable } from '@/components/tc/revenue-forecast-table'
import { PartnerDirectoryModal } from '@/components/tc/partner-directory-modal'
import { DealDrawer } from '@/components/tc/deal-drawer'

import {
  tcTeamMembers,
  leads,
  deals,
  aidaInsights,
  vendors,
  formatCurrency,
} from '@/lib/tc-mock-data'
import type { Deal } from '@/lib/tc-types'

type TimeFilter = 'week' | 'month' | 'quarter' | 'ytd'
type TabType = 'leads' | 'deals'

export default function TransactionCoordinatorPage() {
  const [selectedTC, setSelectedTC] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [activeTab, setActiveTab] = useState<TabType>('deals')
  const [partnerDirectoryOpen, setPartnerDirectoryOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [dealDrawerOpen, setDealDrawerOpen] = useState(false)

  // Filter data by TC
  const filteredLeads = useMemo(() => {
    if (selectedTC === 'all') return leads
    return leads.filter(l => l.tcId === selectedTC)
  }, [selectedTC])

  const filteredDeals = useMemo(() => {
    if (selectedTC === 'all') return deals
    return deals.filter(d => d.tcId === selectedTC)
  }, [selectedTC])

  // Sort deals by health score (most at risk first) for Risk Radar
  const riskSortedDeals = useMemo(() => {
    return [...filteredDeals].sort((a, b) => a.healthScore - b.healthScore)
  }, [filteredDeals])

  // KPIs for Leads tab
  const leadsKPIs = useMemo(() => {
    const analyzeQualify = filteredLeads.filter(l => l.stage === 'analyze_qualify')
    const titleRemediation = filteredLeads.filter(l => l.stage === 'title_remediation')
    const totalMissingDocs = filteredLeads.reduce((sum, l) => sum + (l.docsRequired - l.docsReceived), 0)
    const avgDaysInAQ = analyzeQualify.length > 0
      ? Math.round(analyzeQualify.reduce((sum, l) => sum + l.daysInStage, 0) / analyzeQualify.length)
      : 0
    const readyToConvert = filteredLeads.filter(l => l.docsReceived >= l.docsRequired && l.healthScore >= 70)
    const estConversion = filteredLeads.filter(l => l.healthScore >= 60).length

    return [
      { label: 'Active Leads', value: filteredLeads.length, subtext: 'A&Q + Title Remediation' },
      { label: 'In Title Remediation', value: titleRemediation.length, subtext: 'Flagged with issues' },
      { label: 'Avg Days in A&Q', value: avgDaysInAQ, subtext: 'Velocity indicator' },
      { label: 'Docs Missing', value: totalMissingDocs, subtext: 'Total across all leads' },
      { label: 'Ready to Convert', value: readyToConvert.length, subtext: 'All milestones green' },
      { label: 'Est. Conversion', value: estConversion, subtext: 'This month' },
    ]
  }, [filteredLeads])

  // KPIs for Deals tab
  const dealsKPIs = useMemo(() => {
    const now = new Date(2026, 4, 3) // May 3, 2026
    const thisMonth = filteredDeals.filter(d => {
      const closingDate = new Date(d.closingDate)
      return closingDate.getMonth() === now.getMonth() && closingDate.getFullYear() === now.getFullYear()
    })
    const nextMonth = filteredDeals.filter(d => {
      const closingDate = new Date(d.closingDate)
      const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      return closingDate.getMonth() === next.getMonth() && closingDate.getFullYear() === next.getFullYear()
    })
    const atRisk = filteredDeals.filter(d => d.healthScore < 40)
    const totalRevenue = filteredDeals.reduce((sum, d) => sum + d.revenue, 0)
    const avgDaysToClose = filteredDeals.length > 0
      ? Math.round(filteredDeals.reduce((sum, d) => {
          const daysUntil = Math.ceil((new Date(d.closingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          return sum + Math.max(0, daysUntil)
        }, 0) / filteredDeals.length)
      : 0

    return [
      { label: 'Active Closings', value: filteredDeals.length, subtext: 'Total deals in pipeline' },
      { label: 'Closing This Month', value: `${thisMonth.length} / ${formatCurrency(thisMonth.reduce((s, d) => s + d.revenue, 0))}`, subtext: 'Count / Value' },
      { label: 'Closing Next Month', value: `${nextMonth.length} / ${formatCurrency(nextMonth.reduce((s, d) => s + d.revenue, 0))}`, subtext: 'Count / Value' },
      { label: 'At-Risk Deals', value: atRisk.length, subtext: 'Health score < 40' },
      { label: 'Total Pipeline Value', value: formatCurrency(totalRevenue), subtext: 'Est. revenue', highlight: true },
      { label: 'Avg Days to Close', value: avgDaysToClose, subtext: 'Velocity' },
    ]
  }, [filteredDeals])

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setDealDrawerOpen(true)
  }

  const handleAssignToDeal = (vendor: typeof vendors[0], deal: Deal) => {
    // This would trigger a GraphQL mutation in the real implementation
    console.log(`Assigning ${vendor.name} to ${deal.name}`)
    alert(`Assigned ${vendor.name} to ${deal.name}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Transaction Coordinator</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Command Center</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPartnerDirectoryOpen(true)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Partner Directory
              </Button>
              <Select value={selectedTC} onValueChange={setSelectedTC}>
                <SelectTrigger className="w-[200px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select TC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All TCs</SelectItem>
                  {tcTeamMembers.map(tc => (
                    <SelectItem key={tc.id} value={tc.id}>
                      {tc.name} ({tc.activeCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1">
                {(['week', 'month', 'quarter', 'ytd'] as TimeFilter[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      timeFilter === filter
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {filter === 'week' ? 'This Week' :
                     filter === 'month' ? 'This Month' :
                     filter === 'quarter' ? 'This Quarter' : 'YTD'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-foreground">Transaction Coordination</h1>
            <p className="text-sm text-muted-foreground">Real-time closing pipeline and document health</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Tab Toggle */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="leads" className="gap-2">
              Leads
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted">
                {filteredLeads.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="deals" className="gap-2">
              Deals
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted">
                {filteredDeals.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* KPI Scorecards */}
        <div className="grid grid-cols-6 gap-4">
          {(activeTab === 'leads' ? leadsKPIs : dealsKPIs).map((kpi, idx) => (
            <KPICard
              key={idx}
              label={kpi.label}
              value={kpi.value}
              subtext={kpi.subtext}
              highlight={'highlight' in kpi && kpi.highlight}
            />
          ))}
        </div>

        {/* AIDA Panel */}
        <AidaPanel
          insights={aidaInsights}
          onDraftEmail={(insight) => {
            alert(`Drafting email for: ${insight.entityName}`)
          }}
          onViewDetail={(insight) => {
            if (insight.entityType === 'deal') {
              const deal = deals.find(d => d.id === insight.entityId)
              if (deal) handleDealClick(deal)
            }
          }}
        />

        {/* Risk Radar */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Risk Radar</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {riskSortedDeals.slice(0, 8).map(deal => (
                <div key={deal.id} className="w-[260px] shrink-0">
                  <DealCard deal={deal} onClick={() => handleDealClick(deal)} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {activeTab === 'deals' ? (
          <>
            {/* Closing Calendar */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Closing Calendar</h2>
              <ClosingCalendar deals={filteredDeals} onDealClick={handleDealClick} />
            </div>

            {/* Revenue Forecast */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Revenue Forecast</h2>
              <RevenueForecastTable deals={filteredDeals} onDealClick={handleDealClick} />
            </div>

            {/* Deals Pipeline */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Deals Pipeline</h2>
              <div className="grid grid-cols-4 gap-4">
                {['contract_assigned', 'inspection_scheduled', 'loan_processing', 'clear_to_close'].map(stage => {
                  const stageDeals = filteredDeals.filter(d => d.stage === stage || 
                    (stage === 'clear_to_close' && (d.stage === 'closing_scheduled' || d.stage === 'closing')))
                  const stageLabels: Record<string, string> = {
                    contract_assigned: 'Contract Assigned',
                    inspection_scheduled: 'Inspection Scheduled',
                    loan_processing: 'Loan Processing',
                    clear_to_close: 'Clear to Close / Closing',
                  }
                  return (
                    <div key={stage} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">{stageLabels[stage]}</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                          {stageDeals.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {stageDeals.map(deal => (
                          <DealCard key={deal.id} deal={deal} onClick={() => handleDealClick(deal)} />
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                            No deals
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          /* Leads Pipeline */
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Leads Pipeline</h2>
            <div className="grid grid-cols-2 gap-6">
              {['analyze_qualify', 'title_remediation'].map(stage => {
                const stageLeads = filteredLeads.filter(l => l.stage === stage)
                const stageLabels: Record<string, string> = {
                  analyze_qualify: 'Analyze & Qualify',
                  title_remediation: 'Title Remediation',
                }
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">{stageLabels[stage]}</h3>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        stage === 'title_remediation' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      )}>
                        {stageLeads.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {stageLeads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Partner Directory Modal */}
      <PartnerDirectoryModal
        open={partnerDirectoryOpen}
        onOpenChange={setPartnerDirectoryOpen}
        vendors={vendors}
        deals={filteredDeals}
        onAssignToDeal={handleAssignToDeal}
      />

      {/* Deal Drawer */}
      <DealDrawer
        deal={selectedDeal}
        open={dealDrawerOpen}
        onOpenChange={setDealDrawerOpen}
      />
    </div>
  )
}
