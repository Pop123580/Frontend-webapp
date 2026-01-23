import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'purple' | 'green' | 'orange'
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendValue,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
    purple: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
    green: 'text-green-500 bg-green-50 dark:bg-green-950/30',
    orange: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30',
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card className="border border-border/50 hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && trendValue && (
          <p className={`text-xs font-medium ${trendColors[trend]}`}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
