'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, X } from 'lucide-react'

const TIPS = [
  {
    title: 'Optimal Study Duration',
    description: 'Research shows that 45-90 minute study sessions are most effective. Use the Study Planner to create balanced sessions.',
    feature: 'Study Planner',
  },
  {
    title: 'Spaced Repetition',
    description: 'Review material at increasing intervals (1 day, 3 days, 1 week) for better retention. Track this in Exam Prep.',
    feature: 'Exam Prep',
  },
  {
    title: 'Active Note-Taking',
    description: 'Summarize key points in your own words using the Notes Summarizer to enhance understanding and memory.',
    feature: 'Summarizer',
  },
  {
    title: 'Ask Questions Early',
    description: 'Don\'t wait to ask doubts. The AI Chatbot is always available to clarify concepts immediately.',
    feature: 'Doubt Chatbot',
  },
  {
    title: 'Multi-Language Learning',
    description: 'Learning in your native language can improve comprehension. Switch languages in the Doubt Chatbot settings.',
    feature: 'Doubt Chatbot',
  },
  {
    title: 'Progress Visualization',
    description: 'Track your exam preparation progress topic by topic. Visual progress bars help maintain motivation.',
    feature: 'Exam Prep',
  },
]

interface QuickTipsProps {
  compact?: boolean
}

export default function QuickTips({ compact = false }: QuickTipsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  if (!isVisible) return null

  const currentTip = TIPS[currentTipIndex]

  const goToNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % TIPS.length)
  }

  return (
    <Card className="border border-primary/20 bg-accent/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Quick Tip
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold text-foreground">{currentTip.title}</h4>
          <p className="text-sm text-foreground/80 mt-2">{currentTip.description}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {currentTipIndex + 1} of {TIPS.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToNextTip}>
              Next Tip
            </Button>
            <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
              {currentTip.feature}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
