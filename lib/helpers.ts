/**
 * Calculate days remaining until deadline
 */
export function daysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  const diffTime = deadlineDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Calculate overall progress percentage
 */
export function calculateOverallProgress(progress: { [key: string]: number }): number {
  const values = Object.values(progress)
  if (values.length === 0) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

/**
 * Format time duration in hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Get priority badge color and text
 */
export function getPriorityDisplay(priority: 'low' | 'medium' | 'high') {
  switch (priority) {
    case 'high':
      return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    case 'medium':
      return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
    case 'low':
      return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  }
}

/**
 * Get urgency indicator based on days remaining
 */
export function getUrgencyLevel(daysRemaining: number): 'critical' | 'high' | 'medium' | 'low' {
  if (daysRemaining <= 1) return 'critical'
  if (daysRemaining <= 3) return 'high'
  if (daysRemaining <= 7) return 'medium'
  return 'low'
}

/**
 * Generate study session recommendations
 */
export function generateSessionRecommendations(
  deadline: string,
  duration: number,
): { date: string; duration: number }[] {
  const sessions: { date: string; duration: number }[] = []
  const daysLeft = daysUntilDeadline(deadline)
  const totalMinutes = duration
  const minutesPerDay = Math.ceil(totalMinutes / Math.max(daysLeft, 1))

  for (let i = 0; i < daysLeft; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    sessions.push({
      date: date.toISOString().split('T')[0],
      duration: Math.min(minutesPerDay, totalMinutes - minutesPerDay * i),
    })
  }

  return sessions
}
