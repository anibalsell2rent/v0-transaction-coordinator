// TC System Types - DTOs for GraphQL integration

export type TCStage = 
  | 'analyze_qualify'
  | 'title_remediation'
  | 'contract_assigned'
  | 'inspection_scheduled'
  | 'loan_processing'
  | 'clear_to_close'
  | 'closing_scheduled'
  | 'deals_title_remediation'
  | 'closing'

export type VendorType = 
  | 'title_company'
  | 'lender'
  | 'inspector'
  | 'hoa_management'
  | 'attorney'

export type AlertSeverity = 'urgent' | 'warning' | 'success'

export interface TCTeamMember {
  id: string
  name: string
  initials: string
  activeCount: number
}

export interface Lead {
  id: string
  name: string
  location: string
  city: string
  state: string
  stage: TCStage
  daysInStage: number
  docsReceived: number
  docsRequired: number
  tcId: string
  tcName: string
  flags: string[]
  revenuePotential: number
  healthScore: number
  issueDescription?: string
}

export interface Deal {
  id: string
  name: string
  location: string
  city: string
  state: string
  stage: TCStage
  closingDate: Date
  revenue: number
  healthScore: number
  tcId: string
  tcName: string
  missingDocs: number
  lastContact: string
  lastContactDays: number
  milestonesComplete: number
  milestonesTotal: number
  blockerDescription?: string
  closingProbability: number
  partnerName?: string
}

export interface AidaInsight {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  entityType: 'deal' | 'lead'
  entityId: string
  entityName: string
  primaryAction: {
    label: string
    type: 'draft_email' | 'view_detail'
  }
  secondaryAction?: {
    label: string
    type: 'draft_email' | 'view_detail'
  }
}

export interface Vendor {
  id: string
  name: string
  type: VendorType
  states: string[]
  contactName: string
  contactEmail: string
  contactPhone: string
  avgTurnaround: string
  rating: number
  notes?: string
}

export interface KPICard {
  label: string
  value: string | number
  subtext?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
    isPositive: boolean
  }
}

export interface CalendarClosing {
  id: string
  dealId: string
  name: string
  date: Date
  revenue: number
  status: 'on_track' | 'at_risk' | 'critical'
}
