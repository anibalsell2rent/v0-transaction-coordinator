# TC AI - Transaction Coordinator Command Center

## Complete Implementation Prompt for Beacon Integration

---

## 1. PROJECT OVERVIEW

Build a **Transaction Coordinator (TC) Command Center** module for the Beacon platform. This is a new section that sits alongside the existing "Leads Team" tab in the sidebar navigation. It provides Transaction Coordinators with a real-time dashboard to manage their closing pipeline, track document health, and coordinate with vendors.

### Key Features:
1. **TC Command Center** (`/transaction-coordinator`) - Main dashboard with KPIs, AIDA insights, Risk Radar, Closing Calendar, Revenue Forecast, and Pipeline views
2. **Partner Directory** (`/transaction-coordinator/partners`) - Full-page vendor CRM for managing title companies, lenders, inspectors, HOA management, and attorneys
3. **Deal Detail Page** (`/transaction-coordinator/deals/[id]`) - Comprehensive deal view with milestones, documents, and AIDA-powered actions

### Tech Stack:
- Next.js 15.2.4 (App Router)
- Tailwind CSS
- Custom component library (existing Beacon components)
- Mock data initially (GraphQL repository pattern stubbed for future integration)

---

## 2. SIDEBAR NAVIGATION UPDATE

Add "Transaction Coordinator" to the existing sidebar navigation. Find the sidebar component file and add:

```tsx
{
  name: 'Transaction Coordinator',
  href: '/transaction-coordinator',
  icon: ArrowRightLeft, // from lucide-react
}
```

Place it after "Marketing: Deals" and before any settings/user items.

---

## 3. DESIGN SYSTEM

### Colors (match existing Beacon theme):
- **Background**: `#0b1121` (dark navy)
- **Card Background**: `#111827` (slate-900)
- **Primary Blue**: `#2563eb` (blue-600)
- **S2R Green (AIDA)**: `#40FF62`
- **Muted Text**: `#6b7280` (gray-500)
- **Border**: `#1f2937` (gray-800)

### Health Score Color Coding:
- **Green (70-100)**: `#059669` (emerald-600) - On track
- **Amber (40-69)**: `#d97706` (amber-600) - At risk
- **Red (0-39)**: `#dc2626` (red-600) - Critical

### Alert Severity:
- **URGENT**: Red background (`bg-red-100 text-red-700`)
- **WARNING**: Amber background (`bg-amber-100 text-amber-700`)
- **SUCCESS**: Emerald background (`bg-emerald-100 text-emerald-700`)

---

## 4. TYPE DEFINITIONS

Create `lib/tc-types.ts`:

```typescript
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
```

---

## 5. MOCK DATA

Create `lib/tc-mock-data.ts` with the following data:

### TC Team Members (2):
```typescript
export const tcTeamMembers: TCTeamMember[] = [
  { id: 'tc-1', name: 'Adrian Montenegro', initials: 'AM', activeCount: 15 },
  { id: 'tc-2', name: 'Transaction Coordinator #2', initials: 'TC', activeCount: 19 },
]
```

### Leads (5):
| Name | Location | Stage | Days in Stage | Docs | Health | TC | Revenue |
|------|----------|-------|---------------|------|--------|-----|---------|
| Winslow Jones | Sapphire, NC | Analyze & Qualify | 4 | 8/15 | 62 | Adrian | $35,400 |
| Robert Sawyer Johnson | Willow Spring, NC | Analyze & Qualify | 7 | 11/15 | 55 | TC #2 | $12,000 |
| Marcy Fox | Indianapolis, IN | Analyze & Qualify | 2 | 13/15 | 85 | Adrian | $80,700 |
| Celeste Massey | Austin, TX | Title Remediation | 6 | 10/15 | 45 | Adrian | $28,900 |
| Dennis Pruitt | Phoenix, AZ | Title Remediation | 11 | 12/15 | 32 | TC #2 | $41,200 |

**Flags for leads:**
- Winslow Jones: "Title Pre-Check requested, awaiting response (2 days)"
- Robert Sawyer Johnson: "Loan Quote pending", "ID Verification not started"
- Marcy Fox: "House Canary report not downloaded"
- Celeste Massey: Issue - "HOA rental restriction found"
- Dennis Pruitt: Issue - "Lien discovered — $8,400 unpaid HOA dues"

### Deals (10):
| Name | Location | Stage | Closing Date | Revenue | Health | TC | Missing Docs | Probability |
|------|----------|-------|--------------|---------|--------|-----|--------------|-------------|
| Stephen A Krizman | Denver, CO | Closing | May 5, 2026 | $9,798 | 82 | Adrian | 0 | 95% |
| Timothy Cline | Nashville, TN | Title Remediation | May 15, 2026 | $18,900 | 31 | TC #2 | 3 | 50% |
| Clayton Lewis | Tampa, FL | Clear to Close | May 15, 2026 | $12,600 | 74 | Adrian | 1 | 75% |
| Jeff Locke | Seattle, WA | Inspection Scheduled | May 20, 2026 | $20,800 | 45 | Adrian | 2 | 25% |
| Dean J Nance | Atlanta, GA | Loan Processing | May 20, 2026 | $7,500 | 61 | TC #2 | 1 | 25% |
| Sonja Dixson | Charlotte, NC | Closing Scheduled | May 26, 2026 | $8,631 | 78 | Adrian | 0 | 75% |
| Marc Franzese | Houston, TX | Contract Assigned | Jun 17, 2026 | $29,520 | 55 | Adrian | 4 | 50% |
| Ethan Medina | Las Vegas, NV | Loan Processing | Jun 21, 2026 | $24,339 | 67 | TC #2 | 1 | 60% |
| April R Maxfield | Portland, OR | Inspection Scheduled | Jun 9, 2026 | $7,500 | 72 | Adrian | 2 | 65% |
| Tonia Yvette Slocumb | Memphis, TN | Clear to Close | Jun 24, 2026 | $18,000 | 80 | Adrian | 0 | 80% |

**Blocker descriptions:**
- Timothy Cline: "Lender unresponsive (5 days)"
- Clayton Lewis: "Waiting: Inspection report final version"
- Jeff Locke: "Title co hasn't responded to payoff request (7 days)"
- Dean J Nance: "Waiting: Final loan commitment letter"
- Marc Franzese: "Just assigned — initial doc requests not yet sent"
- Ethan Medina: "Waiting: Updated HOA docs"
- April R Maxfield: "Inspector confirmed, awaiting report"
- Tonia Yvette Slocumb: "Final walkthrough pending"

### AIDA Insights (3):
```typescript
export const aidaInsights: AidaInsight[] = [
  {
    id: 'insight-1',
    severity: 'urgent',
    title: 'Timothy Cline — 3 Overdue Items',
    description: 'Closing in 12 days. Lender unresponsive for 5 days. Title commitment, Loan payoffs, and ID verification still missing.',
    entityType: 'deal',
    entityId: 'deal-2',
    entityName: 'Timothy Cline',
    primaryAction: { label: 'Draft Follow-up to Lender', type: 'draft_email' },
    secondaryAction: { label: 'View Deal', type: 'view_detail' },
  },
  {
    id: 'insight-2',
    severity: 'warning',
    title: 'Dennis Pruitt — Title Issue Found',
    description: 'HOA lien of $8,400 discovered in Title Pre-Check. AIDA identified 3 similar cases resolved in 8-12 days via direct HOA negotiation.',
    entityType: 'lead',
    entityId: 'lead-5',
    entityName: 'Dennis Pruitt',
    primaryAction: { label: 'Draft HOA Negotiation Letter', type: 'draft_email' },
    secondaryAction: { label: 'View Lead', type: 'view_detail' },
  },
  {
    id: 'insight-3',
    severity: 'success',
    title: 'Stephen A Krizman — All Clear to Close',
    description: 'All 16 milestones complete. Closing confirmed for May 5. Revenue: $9,798. No action needed.',
    entityType: 'deal',
    entityId: 'deal-1',
    entityName: 'Stephen A Krizman',
    primaryAction: { label: 'View Closing Details', type: 'view_detail' },
  },
]
```

### Vendors (7):
| Name | Type | States | Contact | Email | Phone | Turnaround | Rating |
|------|------|--------|---------|-------|-------|------------|--------|
| Truehold Title | Title Company | FL, GA, SC, NC, TN | Maria Santos | maria@trueholdtitle.com | (813) 555-0142 | 3-4 days | 4.8 |
| First American Title | Title Company | All | Derek Olsen | dolsen@firstam.com | (800) 555-0301 | 5-7 days | 4.2 |
| Pacific Northwest Title | Title Company | WA, OR, ID | Lisa Chen | lchen@pnwtitle.com | (206) 555-0198 | 4-5 days | 4.6 |
| Velocity Mortgage | Lender | FL, TX, GA, NC, TN | James Ruiz | jruiz@velocitymtg.com | (855) 555-0212 | 48hrs | 4.5 |
| CrossCountry Mortgage | Lender | All | Amy Park | apark@ccmortgage.com | (888) 555-0345 | 72hrs | 4.1 |
| Elite Property Inspections | Inspector | FL, GA | Bob Martinez | bob@eliteinspect.com | (407) 555-0167 | Same week | 4.9 |
| Northwest Home Inspectors | Inspector | WA, OR | Tom Nguyen | tnguyen@nwhome.com | (503) 555-0234 | 2-3 days | 4.4 |

---

## 6. COMPONENT SPECIFICATIONS

### 6.1 Health Score Ring (`components/tc/health-score-ring.tsx`)

A circular progress indicator showing the health score (0-100).

**Props:**
- `score: number` - The health score value
- `size: 'sm' | 'md' | 'lg'` - Ring size (default: 'md')
- `showLabel: boolean` - Whether to show the score number in center (default: true)

**Behavior:**
- Uses SVG circle with stroke-dashoffset for progress
- Color changes based on score:
  - 0-39: Red (#dc2626)
  - 40-69: Amber (#d97706)
  - 70-100: Emerald (#059669)

### 6.2 KPI Card (`components/tc/kpi-card.tsx`)

A compact card displaying a single metric.

**Props:**
- `label: string` - Metric name (uppercase, muted)
- `value: string | number` - The primary value (large, bold)
- `subtext?: string` - Explanatory text below value
- `trend?: { value: number, direction: 'up' | 'down', isPositive: boolean }` - Optional trend indicator
- `highlight?: boolean` - Whether to apply amber highlight styling

**Layout:**
- Label at top (xs, uppercase, tracking-wider)
- Value large (2xl font, bold)
- Subtext below (xs, muted)
- Card with border, rounded-xl, shadow-sm

### 6.3 AIDA Panel (`components/tc/aida-panel.tsx`)

An expandable panel showing AI-generated insights with urgency levels.

**Props:**
- `insights: AidaInsight[]` - Array of insights to display
- `onDraftEmail?: (insight: AidaInsight) => void` - Callback for draft email action
- `onViewDetail?: (insight: AidaInsight) => void` - Callback for view detail action

**Behavior:**
- Collapsible via chevron button
- Header shows AIDA icon (Sparkles) with S2R green background (#40FF62)
- Shows count of alerts and breakdown (e.g., "2 urgent", "1 warning")
- Each insight card has:
  - Left border colored by severity (red/amber/emerald)
  - Severity badge (URGENT/WARNING/SUCCESS)
  - Title and description
  - Action buttons (outline primary + ghost secondary)

### 6.4 Deal Card (`components/tc/deal-card.tsx`)

A card displaying deal summary information.

**Props:**
- `deal: Deal` - The deal data
- `onClick?: () => void` - Click handler (opens deal drawer/detail)
- `compact?: boolean` - Whether to show compact version (default: false)

**Full Card Layout:**
- Health score ring + Name + Location (header row)
- Stage badge (top right, color-coded)
- Grid: Closing days + TC name
- Missing docs badge (red) or "All docs received" (green)
- Revenue amount (amber, right-aligned)
- Blocker description (if exists, muted text)
- Milestones progress bar with count

**Compact Card Layout:**
- Health ring + Name/Location + Revenue/Days (single row)

### 6.5 Lead Card (`components/tc/lead-card.tsx`)

Similar to Deal Card but for leads in Analyze & Qualify stages.

**Props:**
- `lead: Lead` - The lead data
- `onClick?: () => void` - Click handler

**Layout:**
- Health score ring + Name + Location
- Stage badge (blue for A&Q, red for Title Remediation)
- Days in stage + TC name
- Missing docs count/badge
- Revenue potential (amber)
- Issue description (red alert box if exists)
- Flags list (if no issue, show flags as muted text)
- Document progress bar (colored by percentage)

### 6.6 Closing Calendar (`components/tc/closing-calendar.tsx`)

A month-view calendar showing scheduled closings.

**Props:**
- `deals: Deal[]` - Deals to display on calendar
- `onDealClick?: (deal: Deal) => void` - Callback when clicking a closing pill

**Behavior:**
- Standard 7-column grid (Sun-Sat)
- Today button to reset view
- Previous/Next month navigation
- Month/Year title
- Total revenue and closing count in header
- Closing pills on dates:
  - Format: "FirstName - $Revenue"
  - Color by health score (green/amber/red)
  - Show "+N more" if >2 closings on same day
  - Click opens deal drawer

### 6.7 Revenue Forecast Table (`components/tc/revenue-forecast-table.tsx`)

A table showing closings grouped by time period.

**Props:**
- `deals: Deal[]` - All deals
- `onDealClick?: (deal: Deal) => void` - Row click handler

**Sections:**
1. "This Month - Estimated to Close" (blue header)
2. "Next Month - Estimated to Close"
3. "In 2 Months - Estimated to Close"

**Columns:**
- Est. Close Date
- Deal Name
- Stage (color badge)
- Closing % (colored by probability)
- Partner Name
- S2R Gross Revenue
- S2R Net Revenue (amber highlight column, calculated as gross * 0.7)

**Footer:**
- Grand Total row per section

### 6.8 Deal Drawer (`components/tc/deal-drawer.tsx`)

A slide-over panel showing complete deal information.

**Props:**
- `deal: Deal | null` - The deal to display
- `open: boolean` - Whether drawer is open
- `onOpenChange: (open: boolean) => void` - Open state handler

**Content:**
- Header: Health ring (lg) + Name + Location
- Status badge + Revenue (2xl, amber)
- Key info grid:
  - Closing Date (with days countdown)
  - TC Assigned
  - Missing Docs
  - Closing Probability
- Partner info card (if assigned):
  - Partner name
  - Phone + Email
  - Last contact days
- Current Blocker (amber alert box if exists)
- Milestones checklist:
  - PSA Signed, Title Pre-Check, Loan Quote, Inspection, Loan Payoffs, ID Verification, Clear to Close, Closing Scheduled
  - Each shows check icon (green if complete, muted if not)
- Action buttons:
  - "View Full Deal" (primary)
  - Email icon button (outline)

---

## 7. PAGE SPECIFICATIONS

### 7.1 TC Command Center (`/transaction-coordinator/page.tsx`)

**Header:**
- Breadcrumb: "Transaction Coordinator > Command Center"
- Partner Directory button (navigates to `/transaction-coordinator/partners`)
- TC Selector dropdown (All TCs, Adrian Montenegro, TC #2)
- Time filter pills: This Week, This Month, This Quarter, YTD

**Title:**
- "Transaction Coordination"
- Subtitle: "Real-time closing pipeline and document health"

**Tab Toggle:**
- Leads (with count badge)
- Deals (with count badge)

**KPI Scorecards (6 cards in a row):**

*Leads Tab KPIs:*
| Label | Calculation | Subtext |
|-------|-------------|---------|
| Active Leads | Count of leads | A&Q + Title Remediation |
| In Title Remediation | Count in title_remediation stage | Flagged with issues |
| Avg Days in A&Q | Average daysInStage for A&Q leads | Velocity indicator |
| Docs Missing | Sum of (docsRequired - docsReceived) | Total across all leads |
| Ready to Convert | Leads where docs complete AND health >= 70 | All milestones green |
| Est. Conversion | Leads with health >= 60 | This month |

*Deals Tab KPIs:*
| Label | Calculation | Subtext |
|-------|-------------|---------|
| Active Closings | Total deal count | Total deals in pipeline |
| Closing This Month | Count / Sum of revenue for current month | Count / Value |
| Closing Next Month | Count / Sum for next month | Count / Value |
| At-Risk Deals | Deals with health < 40 | Health score < 40 |
| Total Pipeline Value | Sum of all revenue | Est. revenue (HIGHLIGHT) |
| Avg Days to Close | Average days until closing | Velocity |

**AIDA Panel:**
- Collapsible, shows insights
- Actions trigger alert() for draft email (mock behavior)
- View Deal opens Deal Drawer

**Risk Radar:**
- Horizontal scrolling row of DealCards
- Sorted by health score ascending (most at-risk first)
- Show first 8 deals
- Clicking opens Deal Drawer

**Deals Tab Additional Sections:**

*Closing Calendar:*
- Full month view
- Click closing pill to open Deal Drawer

*Revenue Forecast Table:*
- 3 sections (This Month, Next Month, +2 Months)
- Click row to open Deal Drawer

*Deals Pipeline:*
- 4-column grid:
  1. Contract Assigned
  2. Inspection Scheduled
  3. Loan Processing
  4. Clear to Close / Closing
- DealCards in each column
- Empty state: "No deals" with dashed border

**Leads Tab Pipeline:**
- 2-column grid:
  1. Analyze & Qualify
  2. Title Remediation
- LeadCards in each column

---

### 7.2 Partner Directory (`/transaction-coordinator/partners/page.tsx`)

**FULL PAGE EXPERIENCE** - Not a modal.

**Header:**
- Breadcrumb: "Transaction Coordinator > Partner Directory"
- "Back to Command Center" button (navigates to `/transaction-coordinator`)

**Title:**
- "Partner Directory"
- Subtitle: "Manage your vendor network and assignments"

**Stats Row (5 category cards):**
Each card shows:
- Icon for vendor type
- Count of vendors in that category
- Category name
- Click to filter by that type (acts as toggle filter)

Categories:
1. Title Company (Building2 icon)
2. Lender (Landmark icon)
3. Inspector (ClipboardCheck icon)
4. HOA Management (Home icon)
5. Attorney (Scale icon)

**Filters Row:**
- Search input (by name, contact name, email)
- Type dropdown (All Types, Title Company, Lender, etc.)
- State dropdown (All States, FL, GA, TX, etc.)
- Rating filter (All Ratings, 4.5+, 4.0+, etc.)
- "Add Vendor" button (primary, plus icon) - shows alert("Add vendor form coming soon")

**Vendor Grid (3 columns):**
Each vendor card:
- Color header bar (by type: blue=title, green=lender, orange=inspector, purple=HOA, slate=attorney)
- Avatar circle with initials
- Vendor name + Type badge
- Contact name
- Star rating display (filled/empty stars)
- Email (mail icon) - click to copy
- Phone (phone icon) - click to copy
- "Avg: [turnaround]" with clock icon
- States served as badges
- Notes section (if exists)
- "Assign to Deal" dropdown:
  - Shows list of active deals
  - Each option: Deal name + City, State + Revenue
  - Selecting triggers assignment (alert for now)
- "View Details" button (ghost)

**View Detail Modal:**
When clicking "View Details":
- Full-screen modal with vendor info
- Larger layout with all contact info
- Copy-to-clipboard for email/phone
- Full list of states served
- "Assign to Deal" dropdown
- "Edit Vendor" and "Close" buttons

**Empty State:**
- "No vendors found" message
- "Try adjusting your filters"

---

### 7.3 Deal Detail Page (`/transaction-coordinator/deals/[id]/page.tsx`)

**Header:**
- Breadcrumb: "Transaction Coordinator > Deals > [Deal Name]"
- Back button to Command Center

**Hero Section:**
- Large health score ring
- Deal name (xl font)
- Location with MapPin icon
- Stage badge (large)
- Revenue display (2xl, amber)

**Quick Stats Grid (4 columns):**
1. Closing Date + Days countdown
2. TC Assigned
3. Missing Docs count
4. Closing Probability %

**AIDA Panel (TC-specific):**
- Shows insights specific to this deal
- Actions: Draft emails, view related items

**Tabs:**
1. **Overview** (default)
   - Partner info card
   - Current blocker (if exists)
   - Milestones checklist (full list, 16 items)
   - Recent activity timeline (mock)

2. **Documents**
   - Document checklist grouped by category:
     - Contract Documents
     - Title Documents
     - Loan Documents
     - Inspection Documents
   - Each doc shows: name, status (received/pending/missing), upload date
   - Upload button per document (mock)

3. **Communication**
   - Contact cards for all parties:
     - Seller
     - Title Company
     - Lender
     - Inspector
   - Each with: name, email, phone, last contact date
   - "Send Email" and "Log Call" buttons

4. **Timeline**
   - Chronological list of events
   - Each event: date, description, actor
   - Events: Stage changes, Document uploads, Communications, etc.

**Actions Sidebar (right side):**
- "Draft Follow-up Email" button
- "Update Stage" dropdown
- "Assign Partner" button
- "Add Note" button
- "Schedule Closing" button (if stage is clear_to_close)

---

## 8. GRAPHQL REPOSITORY STRUCTURE

Create `lib/repositories/tc-repository.ts`:

```typescript
/**
 * TC Repository - GraphQL integration layer
 * Uses mock data now; replace with Apollo Client calls later.
 */

// Query stubs (comments showing future GraphQL queries):

/*
query GetTCTeamMembers {
  tcTeamMembers { id name initials activeCount }
}

query GetLeads($tcId: ID, $stage: TCStage) {
  leads(tcId: $tcId, stage: $stage) { ...LeadFields }
}

query GetDeals($tcId: ID, $stage: TCStage) {
  deals(tcId: $tcId, stage: $stage) { ...DealFields }
}

query GetAidaInsights($entityType: String, $limit: Int) {
  aidaInsights(entityType: $entityType, limit: $limit) { ...InsightFields }
}

query GetVendors($type: VendorType, $state: String) {
  vendors(type: $type, state: $state) { ...VendorFields }
}

mutation AssignVendorToDeal($vendorId: ID!, $dealId: ID!) {
  assignVendorToDeal(vendorId: $vendorId, dealId: $dealId) {
    success
    deal { id partnerName }
  }
}

mutation UpdateDealStage($dealId: ID!, $stage: TCStage!) {
  updateDealStage(dealId: $dealId, stage: $stage) {
    success
    deal { id stage }
  }
}
*/

// Export async functions that return mock data:
export async function getTCTeamMembers(): Promise<TCTeamMember[]>
export async function getLeads(filters?: TCRepositoryFilters): Promise<Lead[]>
export async function getDeals(filters?: TCRepositoryFilters): Promise<Deal[]>
export async function getAidaInsights(limit?: number): Promise<AidaInsight[]>
export async function getVendors(filters?: TCRepositoryFilters): Promise<Vendor[]>
export async function getDealById(dealId: string): Promise<Deal | null>
export async function getLeadById(leadId: string): Promise<Lead | null>
export async function assignVendorToDeal(input: AssignVendorInput): Promise<{ success: boolean; dealId: string }>
export async function updateDealStage(input: UpdateDealStageInput): Promise<{ success: boolean; deal: Deal | null }>
export async function draftFollowUpEmail(entityId: string, entityType: 'deal' | 'lead', recipientType: string): Promise<{ subject: string; body: string }>
```

---

## 9. EXISTING BEACON COMPONENTS TO REFERENCE

When building, reference these existing Beacon patterns:

1. **SmSummaryHeader** - For page headers with breadcrumbs
2. **AidaBanner** - For the existing AIDA UI pattern (but TC AIDA is separate)
3. Use existing Button, Card, Badge, Table, Sheet components from the custom library
4. Match the existing dark theme color scheme
5. Follow existing layout wrapper for authenticated pages

---

## 10. FILE STRUCTURE

```
app/
├── transaction-coordinator/
│   ├── page.tsx                    # Command Center
│   ├── partners/
│   │   └── page.tsx                # Partner Directory
│   └── deals/
│       └── [id]/
│           └── page.tsx            # Deal Detail

components/
└── tc/
    ├── health-score-ring.tsx
    ├── kpi-card.tsx
    ├── aida-panel.tsx
    ├── deal-card.tsx
    ├── lead-card.tsx
    ├── closing-calendar.tsx
    ├── revenue-forecast-table.tsx
    ├── deal-drawer.tsx
    └── partner-directory/
        ├── vendor-card.tsx
        └── vendor-detail-modal.tsx

lib/
├── tc-types.ts
├── tc-mock-data.ts
└── repositories/
    └── tc-repository.ts
```

---

## 11. HELPER FUNCTIONS

Include these in `lib/tc-mock-data.ts`:

```typescript
export function getStageName(stage: string): string {
  const stageNames: Record<string, string> = {
    analyze_qualify: 'Analyze & Qualify',
    title_remediation: 'Title Remediation',
    contract_assigned: 'Contract Assigned',
    inspection_scheduled: 'Inspection Scheduled',
    loan_processing: 'Loan Processing',
    clear_to_close: 'Clear to Close',
    closing_scheduled: 'Closing Scheduled',
    deals_title_remediation: 'Title Remediation',
    closing: 'Closing',
  }
  return stageNames[stage] || stage
}

export function getVendorTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    title_company: 'Title Company',
    lender: 'Lender',
    inspector: 'Home Inspector',
    hoa_management: 'HOA Management',
    attorney: 'Real Estate Attorney',
  }
  return typeNames[type] || type
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getDaysUntilClosing(closingDate: Date): number {
  const now = new Date()
  const diffTime = closingDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
```

---

## 12. CURRENT DATE CONTEXT

For demo/mock purposes, assume today is **May 3, 2026**. All date calculations and "This Month" filters should be relative to this date.

---

## 13. ICONS (from lucide-react)

Required icons:
- ArrowRightLeft (sidebar nav)
- Building2 (Partner Directory button, Title Company)
- Users (TC Selector)
- ChevronRight, ChevronLeft, ChevronDown (navigation/collapse)
- Sparkles (AIDA)
- AlertCircle, AlertTriangle, CheckCircle2 (severity icons)
- MapPin, Calendar, Clock, User, FileX (info icons)
- Phone, Mail, ExternalLink (contact/action icons)
- TrendingUp, TrendingDown (trend indicators)
- Star (ratings)
- Search, Filter, Plus (filters/actions)
- Landmark (Lender)
- ClipboardCheck (Inspector)
- Home (HOA)
- Scale (Attorney)
- Copy (clipboard)

---

## 14. ACCESSIBILITY

- All interactive elements must have proper focus states
- Use semantic HTML (main, header, nav, section)
- Add aria-labels to icon-only buttons
- Ensure color contrast meets WCAG AA
- Add sr-only text for screen readers where appropriate

---

## 15. RESPONSIVE BEHAVIOR

- Desktop-first design (command center is power-user tool)
- KPI grid: 6 columns on desktop, 3 on tablet, 2 on mobile
- Partner Directory: 3 columns on desktop, 2 on tablet, 1 on mobile
- Calendar and Tables: Horizontal scroll on mobile
- Deal Drawer: Full-width on mobile

---

## END OF PROMPT

This prompt contains everything needed to build the TC AI Command Center module. All components, data structures, layouts, and behaviors are specified. The system uses mock data with a repository pattern that can be swapped for real GraphQL queries later.
