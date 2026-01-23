'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Upload, Loader2, Copy, Trash2, Download } from 'lucide-react'

interface Summary {
  id: string
  fileName: string
  originalText: string
  summary: string
  keyPoints: string[]
  createdAt: Date
}

export default function NotesSummarizer() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [uploadMode, setUploadMode] = useState<'text' | 'pdf' | null>(null)
  const [loading, setLoading] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const generateSummary = async (text: string, fileName: string) => {
    setLoading(true)
    try {
      // Simulate AI summarization
      const summary = generateMockSummary(text)
      const newSummary: Summary = {
        id: Date.now().toString(),
        fileName,
        originalText: text,
        summary: summary.text,
        keyPoints: summary.points,
        createdAt: new Date(),
      }
      setSummaries([newSummary, ...summaries])
      setTextInput('')
      setUploadMode(null)
    } catch (error) {
      alert('Error summarizing content')
    } finally {
      setLoading(false)
    }
  }

  const generateMockSummary = (text: string) => {
    const sentences = text.split('.').filter(s => s.trim()).slice(0, 3)
    return {
      text: sentences.map(s => s.trim()).join('. ') + '.',
      points: [
        'Key concept: ' + sentences[0]?.substring(0, 50) + '...',
        'Important point: Understanding and application',
        'Main takeaway: Review and reinforce learning',
      ],
    }
  }

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      alert('Please enter some text to summarize')
      return
    }
    generateSummary(textInput, 'Text Input')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      generateSummary(text, file.name)
    }
    reader.readAsText(file)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteSummary = (id: string) => {
    setSummaries(summaries.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground">Notes Summarizer</h2>
        <div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>
        <p className="text-muted-foreground text-sm italic">
          AI-powered extraction of key points from your documents
        </p>
      </div>

      {!uploadMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => setUploadMode('text')}
            variant="outline"
            className="h-32 flex flex-col gap-2"
          >
            <FileText className="w-8 h-8 text-muted-foreground" />
            <span>Paste Text</span>
          </Button>
          <Button
            onClick={() => setUploadMode('pdf')}
            variant="outline"
            className="h-32 flex flex-col gap-2"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span>Upload PDF</span>
          </Button>
        </div>
      ) : null}

      {uploadMode === 'text' && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Paste Your Notes</CardTitle>
            <CardDescription>Paste text content to summarize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your notes or article text here..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              className="min-h-48"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleTextSubmit}
                disabled={loading}
                className="flex-1 gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Summarizing...' : 'Summarize'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadMode(null)
                  setTextInput('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadMode === 'pdf' && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>Upload a PDF file to summarize</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Click to upload PDF</p>
              <p className="text-xs text-muted-foreground mt-1">Supported: PDF files up to 10MB</p>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
            <Button
              variant="outline"
              onClick={() => setUploadMode(null)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {summaries.length === 0 && !uploadMode ? (
        <Card className="border border-border/50 border-dashed">
          <CardContent className="pt-8 pb-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No summaries yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload a document or paste text to get started
            </p>
          </CardContent>
        </Card>
      ) : null}

      {summaries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your Summaries</h3>
          {summaries.map(summary => (
            <Card key={summary.id} className="border border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{summary.fileName}</CardTitle>
                    <CardDescription>
                      {summary.createdAt.toLocaleDateString()} at{' '}
                      {summary.createdAt.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSummary(summary.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Summary</h4>
                  <p className="text-sm text-foreground/90 leading-relaxed bg-muted/50 p-3 rounded">
                    {summary.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Key Points</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-foreground/90 flex gap-2">
                        <span className="text-muted-foreground flex-shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(summary.summary, summary.id)}
                    className="gap-2 flex-1"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedId === summary.id ? 'Copied!' : 'Copy Summary'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    Export
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
