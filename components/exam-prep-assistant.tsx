'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  TrendingUp,
  FileText,
  Lightbulb,
  Clock,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Flame,
  Brain,
  Trophy,
  Flag,
  Timer,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react'
import AITimetableGenerator from '@/components/ai-timetable-generator'

interface ExamPrep {
  id: string
  examName: string
  subject: string
  examDate: string
  syllabus: string
  topicsProgress: { [key: string]: TopicProgress }
  resources: Resource[]
  notes: string
  createdAt: Date
  totalStudyTime: number // in minutes
  sessionsCompleted: number
  streakDays: number
  lastStudied: Date | null
}

interface TopicProgress {
  progress: number
  status: 'not-started' | 'in-progress' | 'revision' | 'completed'
  timeSpent: number // minutes
  lastPracticed: Date | null
  confidence: number // 1-5
}

interface Resource {
  id: string
  title: string
  type: 'link' | 'pdf' | 'video' | 'note'
  url?: string
  addedAt: Date
}

interface StudySession {
  isActive: boolean
  startTime: Date | null
  topic: string | null
  elapsedSeconds: number
}

export default function ExamPrepAssistant() {
  const [exams, setExams] = useState<ExamPrep[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    examName: '',
    subject: '',
    examDate: '',
    syllabus: '',
  })
  const [newResource, setNewResource] = useState('')
  const [resourceType, setResourceType] = useState<'link' | 'pdf' | 'video' | 'note'>('link')
  
  // Study session timer
  const [studySession, setStudySession] = useState<StudySession>({
    isActive: false,
    startTime: null,
    topic: null,
    elapsedSeconds: 0,
  })

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (studySession.isActive) {
      interval = setInterval(() => {
        setStudySession(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [studySession.isActive])

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate days until exam
  const getDaysUntil = (dateString: string) => {
    const examDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    examDate.setHours(0, 0, 0, 0)
    const diffTime = examDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get urgency level
  const getUrgencyLevel = (days: number) => {
    if (days < 0) return { level: 'passed', color: 'text-muted-foreground', bg: 'bg-muted' }
    if (days <= 3) return { level: 'critical', color: 'text-red-500', bg: 'bg-red-500/10' }
    if (days <= 7) return { level: 'urgent', color: 'text-orange-500', bg: 'bg-orange-500/10' }
    if (days <= 14) return { level: 'soon', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    return { level: 'comfortable', color: 'text-green-500', bg: 'bg-green-500/10' }
  }

  const handleAddExam = () => {
    if (!formData.examName || !formData.subject || !formData.examDate || !formData.syllabus) {
      alert('Please fill in all required fields')
      return
    }

    const topics = formData.syllabus
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const topicsProgress: { [key: string]: TopicProgress } = {}
    topics.forEach(topic => {
      topicsProgress[topic] = {
        progress: 0,
        status: 'not-started',
        timeSpent: 0,
        lastPracticed: null,
        confidence: 1,
      }
    })

    const newExam: ExamPrep = {
      id: Date.now().toString(),
      examName: formData.examName,
      subject: formData.subject,
      examDate: formData.examDate,
      syllabus: formData.syllabus,
      topicsProgress,
      resources: [],
      notes: '',
      createdAt: new Date(),
      totalStudyTime: 0,
      sessionsCompleted: 0,
      streakDays: 0,
      lastStudied: null,
    }

    setExams([...exams, newExam])
    setFormData({ examName: '', subject: '', examDate: '', syllabus: '' })
    setShowForm(false)
    setSelectedExamId(newExam.id)
  }

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id))
    setSelectedExamId(null)
  }

  const updateTopicProgress = (examId: string, topic: string, updates: Partial<TopicProgress>) => {
    setExams(
      exams.map(e =>
        e.id === examId
          ? {
              ...e,
              topicsProgress: {
                ...e.topicsProgress,
                [topic]: {
                  ...e.topicsProgress[topic],
                  ...updates,
                  lastPracticed: new Date(),
                },
              },
            }
          : e,
      ),
    )
  }

  const setTopicStatus = (examId: string, topic: string, status: TopicProgress['status']) => {
    const progressMap = {
      'not-started': 0,
      'in-progress': 50,
      'revision': 80,
      'completed': 100,
    }
    updateTopicProgress(examId, topic, { status, progress: progressMap[status] })
  }

  const addResource = (examId: string) => {
    if (!newResource.trim()) return
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource,
      type: resourceType,
      addedAt: new Date(),
    }
    setExams(
      exams.map(e =>
        e.id === examId ? { ...e, resources: [...e.resources, resource] } : e,
      ),
    )
    setNewResource('')
  }

  const removeResource = (examId: string, resourceId: string) => {
    setExams(
      exams.map(e =>
        e.id === examId 
          ? { ...e, resources: e.resources.filter(r => r.id !== resourceId) } 
          : e,
      ),
    )
  }

  const updateNotes = (examId: string, notes: string) => {
    setExams(exams.map(e => (e.id === examId ? { ...e, notes } : e)))
  }

  // Start/Stop study session
  const toggleStudySession = (topic?: string) => {
    if (studySession.isActive) {
      // Stop session - save time
      if (selectedExamId && studySession.topic) {
        const minutesStudied = Math.floor(studySession.elapsedSeconds / 60)
        setExams(exams.map(e => {
          if (e.id === selectedExamId) {
            return {
              ...e,
              totalStudyTime: e.totalStudyTime + minutesStudied,
              sessionsCompleted: e.sessionsCompleted + 1,
              lastStudied: new Date(),
              topicsProgress: {
                ...e.topicsProgress,
                [studySession.topic!]: {
                  ...e.topicsProgress[studySession.topic!],
                  timeSpent: e.topicsProgress[studySession.topic!].timeSpent + minutesStudied,
                },
              },
            }
          }
          return e
        }))
      }
      setStudySession({
        isActive: false,
        startTime: null,
        topic: null,
        elapsedSeconds: 0,
      })
    } else {
      // Start session
      setStudySession({
        isActive: true,
        startTime: new Date(),
        topic: topic || null,
        elapsedSeconds: 0,
      })
    }
  }

  const selectedExam = exams.find(e => e.id === selectedExamId)

  // Calculate overall progress
  const calculateOverallProgress = (exam: ExamPrep) => {
    const topics = Object.values(exam.topicsProgress)
    if (topics.length === 0) return 0
    const totalProgress = topics.reduce((sum, t) => sum + t.progress, 0)
    return Math.round(totalProgress / topics.length)
  }

  // Get status icon
  const getStatusIcon = (status: TopicProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'revision':
        return <Brain className="w-5 h-5 text-blue-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  // Get confidence stars
  const getConfidenceStars = (confidence: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < confidence ? 'text-yellow-500' : 'text-muted-foreground/30'}>
        ★
      </span>
    ))
  }

  // Get resource icon
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return '🎬'
      case 'pdf': return '📄'
      case 'note': return '📝'
      default: return '🔗'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-foreground flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary" />
            Exam Preparation Assistant
          </h2>
          <div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>
          <p className="text-muted-foreground text-sm italic">
            Personalized guidance and tracking for your exams
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Exam
        </Button>
      </div>

      {/* Active Study Session Banner */}
      {studySession.isActive && (
        <Card className="border-2 border-green-500 bg-green-500/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Timer className="w-6 h-6 text-green-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currently studying</p>
                  <p className="font-semibold text-lg">{studySession.topic || 'General'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-mono font-bold text-green-500">
                  {formatTime(studySession.elapsedSeconds)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleStudySession()}
                  className="gap-2 border-green-500 text-green-500 hover:bg-green-500/10"
                >
                  <Pause className="w-4 h-4" />
                  Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Exam Form */}
      {showForm && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Add New Exam
            </CardTitle>
            <CardDescription>Create a preparation plan for your upcoming exam</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Exam Name *</label>
                <Input
                  placeholder="e.g., Final Exam - Mathematics"
                  value={formData.examName}
                  onChange={e => setFormData({ ...formData, examName: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Subject *</label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Exam Date *</label>
              <Input
                type="date"
                value={formData.examDate}
                onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                className="mt-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Topics/Syllabus * (comma-separated)
              </label>
              <Textarea
                placeholder="e.g., Algebra, Geometry, Trigonometry, Calculus"
                value={formData.syllabus}
                onChange={e => setFormData({ ...formData, syllabus: e.target.value })}
                className="mt-2 min-h-20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter topics separated by commas for individual tracking
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddExam} className="flex-1 gap-2">
                <Target className="w-4 h-4" />
                Create Exam Plan
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {exams.length === 0 ? (
        <Card className="border border-border/50 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">No exams yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first exam preparation plan to start tracking your progress
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Exam Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exams List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Your Exams
            </h3>
            {exams.map(exam => {
              const daysUntil = getDaysUntil(exam.examDate)
              const urgency = getUrgencyLevel(daysUntil)
              const overallProgress = calculateOverallProgress(exam)

              return (
                <Card
                  key={exam.id}
                  className={`border cursor-pointer transition-all hover:shadow-md ${
                    selectedExamId === exam.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => setSelectedExamId(exam.id)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                          {exam.examName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{exam.subject}</p>
                      </div>
                      {selectedExamId === exam.id && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    
                    {/* Days countdown */}
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${urgency.bg} ${urgency.color} mb-3`}>
                      <Calendar className="w-3 h-3" />
                      {daysUntil < 0 ? (
                        'Exam passed'
                      ) : daysUntil === 0 ? (
                        'Today!'
                      ) : daysUntil === 1 ? (
                        'Tomorrow!'
                      ) : (
                        `${daysUntil} days left`
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2" />
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(exam.totalStudyTime / 60)}h studied
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {exam.streakDays} day streak
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Exam Details */}
          {selectedExam && (
            <div className="lg:col-span-2 space-y-4">
              {/* Exam Header Card */}
              <Card className="border border-border/50 overflow-hidden">
                <div className={`h-2 ${getUrgencyLevel(getDaysUntil(selectedExam.examDate)).bg.replace('/10', '')}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{selectedExam.examName}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <span>{selectedExam.subject}</span>
                        <span>•</span>
                        <span>{new Date(selectedExam.examDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExam(selectedExam.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className={`text-2xl font-bold ${getUrgencyLevel(getDaysUntil(selectedExam.examDate)).color}`}>
                        {Math.max(0, getDaysUntil(selectedExam.examDate))}
                      </div>
                      <div className="text-xs text-muted-foreground">Days Left</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {calculateOverallProgress(selectedExam)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {Math.round(selectedExam.totalStudyTime / 60)}h
                      </div>
                      <div className="text-xs text-muted-foreground">Studied</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {selectedExam.sessionsCompleted}
                      </div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Timetable Generator */}
              <AITimetableGenerator
                subjects={[selectedExam.subject]}
                examDate={selectedExam.examDate}
              />

              {/* Tabs */}
              <Tabs defaultValue="topics" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="topics" className="gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Topics
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="gap-1">
                    <Brain className="w-4 h-4" />
                    Practice
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="gap-1">
                    <FileText className="w-4 h-4" />
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-1">
                    <Lightbulb className="w-4 h-4" />
                    Notes
                  </TabsTrigger>
                </TabsList>

                {/* Topics Tab */}
                <TabsContent value="topics" className="space-y-3 mt-4">
                  <Card className="border border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Topic Progress
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {Object.values(selectedExam.topicsProgress).filter(t => t.status === 'completed').length} 
                          /{Object.keys(selectedExam.topicsProgress).length} completed
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(selectedExam.topicsProgress).map(([topic, data]) => (
                        <div key={topic} className="border border-border/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(data.status)}
                              <div>
                                <h4 className="font-medium text-foreground">{topic}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Confidence:
                                  </span>
                                  <div className="flex">
                                    {getConfidenceStars(data.confidence)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{data.progress}%</span>
                              <p className="text-xs text-muted-foreground">
                                {data.timeSpent} min studied
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <Progress value={data.progress} className="h-2 mb-3" />

                          {/* Status buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {(['not-started', 'in-progress', 'revision', 'completed'] as const).map(status => (
                              <Button
                                key={status}
                                variant={data.status === status ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => setTopicStatus(selectedExam.id, topic, status)}
                              >
                                {status.replace('-', ' ')}
                              </Button>
                            ))}
                            
                            {/* Start studying button */}
                            {!studySession.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 ml-auto gap-1 text-green-600"
                                onClick={() => toggleStudySession(topic)}
                              >
                                <Play className="w-3 h-3" />
                                Study Now
                              </Button>
                            )}
                          </div>

                          {/* Confidence slider */}
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-muted-foreground">Confidence Level</span>
                              <span className="font-medium">{data.confidence}/5</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={data.confidence}
                              onChange={e =>
                                updateTopicProgress(selectedExam.id, topic, { 
                                  confidence: parseInt(e.target.value) 
                                })
                              }
                              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Practice Tab */}
                <TabsContent value="practice" className="space-y-3 mt-4">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        Quick Practice Session
                      </CardTitle>
                      <CardDescription>
                        Start a timed study session to track your progress
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Study timer */}
                      <div className="text-center py-6 bg-muted/30 rounded-lg">
                        <div className="text-5xl font-mono font-bold mb-4">
                          {formatTime(studySession.elapsedSeconds)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {studySession.isActive 
                            ? `Studying: ${studySession.topic || 'General'}` 
                            : 'Ready to start studying?'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            size="lg"
                            className="gap-2"
                            variant={studySession.isActive ? 'destructive' : 'default'}
                            onClick={() => toggleStudySession('General')}
                          >
                            {studySession.isActive ? (
                              <>
                                <Pause className="w-4 h-4" />
                                Stop Session
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                Start Studying
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Quick topic selection */}
                      {!studySession.isActive && (
                        <div>
                          <h4 className="text-sm font-medium mb-3">Or pick a topic to study:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(selectedExam.topicsProgress).map(topic => (
                              <Button
                                key={topic}
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => toggleStudySession(topic)}
                              >
                                <Play className="w-3 h-3" />
                                {topic}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Study tips */}
                      <div className="bg-primary/5 rounded-lg p-4 mt-4">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          Study Tips
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Use the Pomodoro technique: 25 min study, 5 min break</li>
                          <li>• Review weak topics more frequently</li>
                          <li>• Take notes while studying for better retention</li>
                          <li>• Practice active recall instead of passive reading</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-3 mt-4">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Study Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Add resource form */}
                      <div className="flex gap-2">
                        <select
                          value={resourceType}
                          onChange={e => setResourceType(e.target.value as Resource['type'])}
                          className="px-3 py-2 border border-border rounded-md bg-background text-sm w-28"
                        >
                          <option value="link">🔗 Link</option>
                          <option value="video">🎬 Video</option>
                          <option value="pdf">📄 PDF</option>
                          <option value="note">📝 Note</option>
                        </select>
                        <Input
                          placeholder="Add a resource title or URL"
                          value={newResource}
                          onChange={e => setNewResource(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === 'Enter') addResource(selectedExam.id)
                          }}
                          className="flex-1"
                        />
                        <Button onClick={() => addResource(selectedExam.id)}>
                          Add
                        </Button>
                      </div>

                      {/* Resources list */}
                      {selectedExam.resources.length > 0 ? (
                        <div className="space-y-2">
                          {selectedExam.resources.map(resource => (
                            <div
                              key={resource.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{getResourceIcon(resource.type)}</span>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {resource.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Added {new Date(resource.addedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeResource(selectedExam.id, resource.id)}
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No resources added yet</p>
                          <p className="text-xs mt-1">Add links, videos, or notes for quick access</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-3 mt-4">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Study Notes
                      </CardTitle>
                      <CardDescription>
                        Quick notes, key points, and things to remember
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add your exam preparation notes here...

• Key formulas
• Important concepts  
• Common mistakes to avoid
• Quick revision points"
                        value={selectedExam.notes}
                        onChange={e => updateNotes(selectedExam.id, e.target.value)}
                        className="min-h-[250px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Tip: Write notes in your own words for better retention
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  )
}