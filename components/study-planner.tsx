'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import AITimetableGenerator from '@/components/ai-timetable-generator'

interface StudySession {
  id: string
  subject: string
  topic: string
  duration: number
  deadline: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

export default function StudyPlanner() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    duration: 60,
    deadline: '',
    priority: 'medium' as const,
  })

  const handleAddSession = () => {
    if (!formData.subject || !formData.topic || !formData.deadline) {
      alert('Please fill in all required fields')
      return
    }

    const newSession: StudySession = {
      id: Date.now().toString(),
      ...formData,
      completed: false,
    }

    setSessions([...sessions, newSession])
    setFormData({ subject: '', topic: '', duration: 60, deadline: '', priority: 'medium' })
    setShowForm(false)
  }

  const toggleComplete = (id: string) => {
    setSessions(sessions.map(s => (s.id === id ? { ...s, completed: !s.completed } : s)))
  }

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-primary/20 text-primary border-primary/40'
      case 'medium':
        return 'bg-secondary/20 text-secondary border-secondary/40'
      case 'low':
        return 'bg-accent/20 text-accent border-accent/40'
      default:
        return 'bg-muted/40 text-muted-foreground'
    }
  }

  const uniqueSubjects = Array.from(new Set(sessions.map(s => s.subject)))
  const nextDeadline = sessions.length > 0
    ? new Date(Math.min(...sessions.map(s => new Date(s.deadline).getTime()))).toISOString().split('T')[0]
    : ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-foreground">Study Planner & Timetable</h2>
          <div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>
          <p className="text-muted-foreground text-sm italic">
            AI-powered scheduling that adapts to your learning pace
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Session
        </Button>
      </div>

      {/* AI Timetable Generator */}
      {sessions.length > 0 && nextDeadline && (
        <AITimetableGenerator
          subjects={uniqueSubjects}
          examDate={nextDeadline}
        />
      )}

      {showForm && (
        <Card className="border border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Create Study Session</CardTitle>
            <CardDescription>Plan your study time with AI-powered scheduling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Subject *</label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                <Input
                  type="number"
                  min="15"
                  max="240"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Topic *</label>
              <Textarea
                placeholder="What will you study?"
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                className="mt-2 min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Deadline *</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddSession} className="flex-1">
                Create Session
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sessions.length === 0 ? (
        <Card className="border border-border/50 border-dashed">
          <CardContent className="pt-8 pb-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No study sessions yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first study plan to get started
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              Create Your First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map(session => (
            <Card
              key={session.id}
              className={`border border-border/50 transition-opacity ${session.completed ? 'opacity-60' : ''}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleComplete(session.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 transition-colors ${
                          session.completed
                            ? 'text-green-500'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{session.subject}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded border ${getPriorityColor(session.priority)}`}
                        >
                          {session.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{session.topic}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Duration: {session.duration} min</span>
                        <span>Deadline: {new Date(session.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSession(session.id)}
                    className="h-9 w-9 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
