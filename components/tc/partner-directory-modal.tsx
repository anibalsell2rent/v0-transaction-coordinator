'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Star, Phone, Mail, Clock, Plus, Building2 } from 'lucide-react'
import { getVendorTypeName } from '@/lib/tc-mock-data'
import type { Vendor, Deal } from '@/lib/tc-types'

interface PartnerDirectoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendors: Vendor[]
  deals: Deal[]
  onAssignToDeal?: (vendor: Vendor, deal: Deal) => void
}

export function PartnerDirectoryModal({
  open,
  onOpenChange,
  vendors,
  deals,
  onAssignToDeal,
}: PartnerDirectoryModalProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [stateFilter, setStateFilter] = useState<string>('all')

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.contactName.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'all' || vendor.type === typeFilter
      const matchesState =
        stateFilter === 'all' ||
        vendor.states.includes('All') ||
        vendor.states.includes(stateFilter)
      return matchesSearch && matchesType && matchesState
    })
  }, [vendors, search, typeFilter, stateFilter])

  const uniqueStates = useMemo(() => {
    const states = new Set<string>()
    vendors.forEach(v => v.states.forEach(s => {
      if (s !== 'All') states.add(s)
    }))
    return Array.from(states).sort()
  }, [vendors])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'title_company':
        return 'bg-blue-100 text-blue-700'
      case 'lender':
        return 'bg-emerald-100 text-emerald-700'
      case 'inspector':
        return 'bg-purple-100 text-purple-700'
      case 'hoa_management':
        return 'bg-amber-100 text-amber-700'
      case 'attorney':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'
            )}
          />
        ))}
        <span className="ml-1 text-sm font-medium tabular-nums">{rating}</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Partner Directory
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-3 border-b border-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors or contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="title_company">Title Company</SelectItem>
              <SelectItem value="lender">Lender</SelectItem>
              <SelectItem value="inspector">Inspector</SelectItem>
              <SelectItem value="hoa_management">HOA Management</SelectItem>
              <SelectItem value="attorney">Attorney</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Vendor
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No vendors found matching your criteria
            </div>
          ) : (
            filteredVendors.map(vendor => (
              <div
                key={vendor.id}
                className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
                      {vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{vendor.name}</h4>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-md',
                          getTypeColor(vendor.type)
                        )}>
                          {getVendorTypeName(vendor.type)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Contact: {vendor.contactName}</span>
                        {renderStars(vendor.rating)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Assign to Deal
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {deals.map(deal => (
                        <DropdownMenuItem
                          key={deal.id}
                          onClick={() => onAssignToDeal?.(vendor, deal)}
                        >
                          {deal.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${vendor.contactEmail}`} className="hover:underline">
                      {vendor.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Avg: {vendor.avgTurnaround}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Serves:</span>
                  <div className="flex flex-wrap gap-1">
                    {vendor.states.slice(0, 6).map(state => (
                      <span
                        key={state}
                        className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground"
                      >
                        {state}
                      </span>
                    ))}
                    {vendor.states.length > 6 && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                        +{vendor.states.length - 6}
                      </span>
                    )}
                  </div>
                </div>

                {vendor.notes && (
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    {vendor.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
