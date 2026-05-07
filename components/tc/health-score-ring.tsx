'use client'

import { cn } from '@/lib/utils'

interface HealthScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function HealthScoreRing({ score, size = 'md', showLabel = true }: HealthScoreRingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }

  const strokeWidth = size === 'lg' ? 3 : 2
  const radius = size === 'lg' ? 24 : size === 'md' ? 17 : 13
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score < 40) return { stroke: '#dc2626', text: 'text-red-600', bg: 'bg-red-50' }
    if (score < 70) return { stroke: '#d97706', text: 'text-amber-600', bg: 'bg-amber-50' }
    return { stroke: '#059669', text: 'text-emerald-600', bg: 'bg-emerald-50' }
  }

  const colors = getColor(score)

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}>
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      {showLabel && (
        <span className={cn('absolute font-semibold tabular-nums', colors.text)}>
          {score}
        </span>
      )}
    </div>
  )
}
