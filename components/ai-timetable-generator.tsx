'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Calendar, Clock, BookOpen, Download } from 'lucide-react'

interface TimetableEntry {
  day: number
  date: string
  sessions: {
    subject: string
    duration: number
    focus: string
    timeSlot: string
  }[]
  totalHours: number
}

interface AITimetableProps {
  subjects: string[]
  examDate: string
  onGenerationComplete?: (timetable: TimetableEntry[]) => void
}

const API_URL = "http://localhost:5000/api"

export default function AITimetableGenerator({ subjects, examDate, onGenerationComplete }: AITimetableProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [timetable, setTimetable] = useState<TimetableEntry[] | null>(null)
  const [aiPlan, setAiPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateDaysUntilExam = () => {
    const exam = new Date(examDate)
    const today = new Date()
    const diffTime = exam.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const parseTimetableFromAI = (aiResponse: string, daysUntil: number): TimetableEntry[] => {
    var entries: TimetableEntry[] = []
    var today = new Date()
    
    for (var i = 0; i < Math.min(daysUntil, 14); i++) {
      var date = new Date(today)
      date.setDate(date.getDate() + i)
      
      var sessions = subjects.map(function(subject, idx) {
        return {
          subject: subject,
          duration: 2,
          focus: 'Study ' + subject + ' - Review key concepts',
          timeSlot: (9 + idx * 2) + ':00 - ' + (11 + idx * 2) + ':00'
        }
      })
      
      entries.push({
        day: i + 1,
        date: date.toLocaleDateString(),
        sessions: sessions,
        totalHours: subjects.length * 2
      })
    }
    
    return entries
  }

  const generateTimetable = async () => {
    if (!subjects.length || !examDate) {
      setError('Please enter subjects and exam date')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      var daysUntilExam = calculateDaysUntilExam()

      if (daysUntilExam <= 0) {
        setError('Exam date must be in the future')
        setIsGenerating(false)
        return
      }

      var response = await fetch(API_URL + '/exam-prep/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: subjects,
          examDate: examDate,
          hoursPerDay: 4
        }),
      })

      var data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate timetable')
      }

      setAiPlan(data.data.timetable)
      
      var generatedTimetable = parseTimetableFromAI(data.data.timetable, daysUntilExam)
      setTimetable(generatedTimetable)
      
      if (onGenerationComplete) {
        onGenerationComplete(generatedTimetable)
      }
    } catch (err: any) {
      console.error('Timetable error:', err)
      setError(err.message || 'Failed to generate timetable. Make sure backend is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadTimetable = () => {
    if (!aiPlan) return

    var content = '# AI Study Timetable\n\nGenerated: ' + new Date().toLocaleDateString() + '\nExam Date: ' + examDate + '\nSubjects: ' + subjects.join(', ') + '\n\n---\n\n' + aiPlan

    var blob = new Blob([content], { type: 'text/markdown' })
    var url = window.URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.href = url
    a.download = 'study-timetable-' + new Date().toISOString().split('T')[0] + '.md'
    a.click()
  }

  var daysUntil = calculateDaysUntilExam()
  var isDisabled = !subjects.length || !examDate || daysUntil <= 0

  return (
    <div className="space-y-6">
      <Card className="border border-primary/20 bg-accent/10 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                AI-Powered Study Timetable
              </CardTitle>
              <div className="h-0.5 w-8 bg-primary/30 mt-3 mb-4"></div>
              <CardDescription className="text-sm italic">
                Generate a personalized study schedule optimized for your exam date
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!aiPlan ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-sm border border-border/30">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  {daysUntil > 0 ? daysUntil + ' days until exam' : 'Exam date has passed'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={generateTimetable}
                  disabled={isDisabled || isGenerating}
                  className="gap-2 flex-1 sm:flex-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate AI Timetable
                    </>
                  )}
                </Button>

                {subjects.length > 0 && (
                  <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start px-3 py-2 bg-muted/20 rounded-sm">
                    <span className="font-medium text-foreground">{subjects.length}</span>
                    <span className="ml-1">{subjects.length === 1 ? 'subject' : 'subjects'} ready</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-sm text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/20 rounded-sm border border-border/30">
                <div>
                  <h3 className="text-base font-medium text-foreground mb-1">Your AI Study Plan</h3>
                  <p className="text-xs text-muted-foreground">
                    Personalized timetable for {subjects.length} subject{subjects.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTimetable}
                  className="gap-2 whitespace-nowrap bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="bg-muted/30 rounded-lg p-4 whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {aiPlan}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setTimetable(null)
                  setAiPlan(null)
                }}
                className="w-full"
              >
                Generate New Timetable
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}