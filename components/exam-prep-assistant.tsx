'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  AlertCircle,
  TrendingUp,
  FileText,
  Lightbulb,
} from 'lucide-react'

interface ExamPrep {
  id: string
  examName: string
  subject: string
  examDate: string
  syllabus: string
  topicsProgress: { [key: string]: number }
  resources: string[]
  notes: string
  createdAt: Date
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

  const handleAddExam = () => {
    if (!formData.examName || !formData.subject || !formData.examDate || !formData.syllabus) {
      alert('Please fill in all required fields')
      return
    }

    const topics = formData.syllabus
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const topicsProgress: { [key: string]: number } = {}
    topics.forEach(topic => {
      topicsProgress[topic] = 0
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
    }

    setExams([...exams, newExam])
    setFormData({ examName: '', subject: '', examDate: '', syllabus: '' })
    setShowForm(false)
  }

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id))
    setSelectedExamId(null)
  }

  const updateProgress = (examId: string, topic: string, progress: number) => {
    setExams(
      exams.map(e =>
        e.id === examId
          ? {
              ...e,
              topicsProgress: {
                ...e.topicsProgress,
                [topic]: Math.min(100, Math.max(0, progress)),
              },
            }
          : e,
      ),
    )
  }

  const addResource = (examId: string) => {
    if (!newResource.trim()) return
    setExams(
      exams.map(e =>
        e.id === examId ? { ...e, resources: [...e.resources, newResource] } : e,
      ),
    )
    setNewResource('')
  }

  const removeResource = (examId: string, index: number) => {
    setExams(
      exams.map(e =>
        e.id === examId ? { ...e, resources: e.resources.filter((_, i) => i !== index) } : e,
      ),
    )
  }

  const updateNotes = (examId: string, notes: string) => {
    setExams(exams.map(e => (e.id === examId ? { ...e, notes } : e)))
  }

  const selectedExam = exams.find(e => e.id === selectedExamId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-foreground">Exam Preparation Assistant</h2>
          <div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>
          <p className="text-muted-foreground text-sm italic">
            Personalized guidance and resources for your exams
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Exam
        </Button>
      </div>

      {showForm && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Add New Exam</CardTitle>
            <CardDescription>Create a preparation plan for your exam</CardDescription>
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
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Topics/Syllabus * (comma-separated)
              </label>
              <Textarea
                placeholder="e.g., Algebra, Geometry, Trigonometry"
                value={formData.syllabus}
                onChange={e => setFormData({ ...formData, syllabus: e.target.value })}
                className="mt-2 min-h-20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter topics separated by commas
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddExam} className="flex-1">
                Create Exam Plan
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {exams.length === 0 ? (
        <Card className="border border-border/50 border-dashed">
          <CardContent className="pt-8 pb-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No exams yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first exam preparation plan
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              Create Exam Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exams List */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {exams.map(exam => (
                <Card
                  key={exam.id}
                  className={`border cursor-pointer transition-all ${
                    selectedExamId === exam.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => setSelectedExamId(exam.id)}
                >
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                      {exam.examName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{exam.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Exam Details */}
          {selectedExam && (
            <div className="lg:col-span-2 space-y-4">
              <Card className="border border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{selectedExam.examName}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedExam.subject} • {new Date(selectedExam.examDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExam(selectedExam.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="topics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                {/* Topics Tab */}
                <TabsContent value="topics" className="space-y-3">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Topic Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(selectedExam.topicsProgress).map(([topic, progress]) => (
                        <div key={topic}>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-foreground">{topic}</label>
                            <span className="text-sm text-muted-foreground">{progress}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={e =>
                              updateProgress(selectedExam.id, topic, parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-3">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Study Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a resource link or title"
                          value={newResource}
                          onChange={e => setNewResource(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === 'Enter') addResource(selectedExam.id)
                          }}
                        />
                        <Button
                          onClick={() => addResource(selectedExam.id)}
                          className="px-4"
                        >
                          Add
                        </Button>
                      </div>

                      {selectedExam.resources.length > 0 ? (
                        <div className="space-y-2">
                          {selectedExam.resources.map((resource, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-muted rounded-md"
                            >
                              <p className="text-sm text-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                {resource}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeResource(selectedExam.id, idx)}
                                className="h-6 w-6"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No resources added yet
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-3">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Study Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add your exam preparation notes here..."
                        value={selectedExam.notes}
                        onChange={e => updateNotes(selectedExam.id, e.target.value)}
                        className="min-h-32"
                      />
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
