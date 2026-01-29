'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Clock, FileText, Lightbulb, MessageCircle, LogOut } from 'lucide-react'
import StudyPlanner from '@/components/study-planner'
import NotesSummarizer from '@/components/notes-summarizer'
import ExamPrepAssistant from '@/components/exam-prep-assistant'
import DoubtChatbot from '@/components/doubt-chatbot'
import UserPreferences from '@/components/user-preferences'
import QuickTips from '@/components/quick-tips'
import ThemeToggle from '@/components/theme-toggle'
import { useAudio } from '@/hooks/use-audio'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { play: playPageTurn } = useAudio('/sounds/paper-turn.wav')

  const handleTabChange = (value: string) => {
    playPageTurn()
    setActiveTab(value)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center text-primary-foreground">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-foreground tracking-wide">LearnAI</h1>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground hidden sm:block italic">Elevate Your Learning</p>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <UserPreferences />
                <Button variant="ghost" size="icon" title="Sign Out" className="h-9 w-9">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Study Plan</span>
            </TabsTrigger>
            <TabsTrigger value="summarizer" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="exam" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Exam Prep</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-medium text-foreground mb-2">Welcome back</h2>
              <div className="h-0.5 w-16 bg-primary/40"></div>
              <p className="text-muted-foreground mt-3 italic">Continue your learning journey with curated resources</p>
            </div>
            
            <QuickTips />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-border/40 bg-card/60">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs font-medium uppercase tracking-widest text-primary">Study Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-light text-foreground">0</p>
                  <p className="text-xs text-muted-foreground">Scheduled this week</p>
                </CardContent>
              </Card>

              <Card className="border border-border/40 bg-card/60">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs font-medium uppercase tracking-widest text-primary">Notes Summarized</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-light text-foreground">0</p>
                  <p className="text-xs text-muted-foreground">Documents processed</p>
                </CardContent>
              </Card>

              <Card className="border border-border/40 bg-card/60">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs font-medium uppercase tracking-widest text-primary">Exams Tracked</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-light text-foreground">0</p>
                  <p className="text-xs text-muted-foreground">Preparation plans</p>
                </CardContent>
              </Card>

              <Card className="border border-border/40 bg-card/60">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs font-medium uppercase tracking-widest text-primary">Doubts Solved</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-light text-foreground">0</p>
                  <p className="text-xs text-muted-foreground">Questions answered</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/40 mt-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-medium">Welcome to LearnAI</CardTitle>
                <div className="h-0.5 w-12 bg-primary/30 mt-3"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  LearnAI combines four powerful AI tools designed specifically for students and learners:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-sm border border-border/20">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Study Planner</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Intelligent scheduling based on your deadlines and study patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-sm border border-border/20">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Notes Summarizer</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Extract key points from PDFs and videos instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-sm border border-border/20">
                    <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Exam Prep</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Personalized guidance and resources for your exams
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-sm border border-border/20">
                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Doubt Solver</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Ask questions in multiple languages and get instant answers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Planner Tab */}
          <TabsContent value="planner">
            <StudyPlanner />
          </TabsContent>

          {/* Notes Summarizer Tab */}
          <TabsContent value="summarizer">
            <NotesSummarizer />
          </TabsContent>

          {/* Exam Prep Tab */}
          <TabsContent value="exam">
            <ExamPrepAssistant />
          </TabsContent>

          {/* Chatbot Tab */}
          <TabsContent value="chatbot">
            <DoubtChatbot />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-0.5 w-12 bg-primary/20"></div>
            <p className="text-center text-sm text-muted-foreground">
              © 2026 LearnAI. Your AI-powered learning platform.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Designed for scholarly excellence and crafted with care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
