import { calculateOverallProgress } from '@/lib/helpers'

interface ProgressTrackerProps {
  items: { [key: string]: number }
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
}

export default function ProgressTracker({
  items,
  size = 'md',
  showPercentage = true,
  animated = true,
}: ProgressTrackerProps) {
  const progress = calculateOverallProgress(items)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const containerSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
      )}
    </div>
  )
}
