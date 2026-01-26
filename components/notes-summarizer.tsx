'use client'

import React from "react"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

const API_URL = "http://localhost:5000/api"

export default function NotesSummarizer() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [uploadMode, setUploadMode] = useState<'text' | 'pdf' | null>(null)
  const [loading, setLoading] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [summaryStyle, setSummaryStyle] = useState<'bullet' | 'paragraph' | 'outline'>('bullet')

  const extractKeyPoints = (summary: string): string[] => {
    const bulletPattern = /[•\-\*]\s*(.+)/g
    const matches = summary.match(bulletPattern)
    
    if (matches && matches.length > 0) {
      return matches.slice(0, 5).map(function(m) {
        return m.replace(/^[•\-\*]\s*/, '')
      })
    }
    
    const sentences = summary.split(/[.!?]+/).filter(function(s) {
      return s.trim().length > 20
    })
    return sentences.slice(0, 4).map(function(s) {
      return s.trim()
    })
  }

  const generateSummary = async (text: string, fileName: string) => {
    setLoading(true)
    try {
      const response = await fetch(API_URL + '/summarizer/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          length: summaryLength,
          style: summaryStyle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to summarize')
      }

      const keyPoints = extractKeyPoints(data.data.summary)

      const newSummary: Summary = {
        id: Date.now().toString(),
        fileName: fileName,
        originalText: text,
        summary: data.data.summary,
        keyPoints: keyPoints,
        createdAt: new Date(),
      }
      setSummaries([newSummary, ...summaries])
      setTextInput('')
      setUploadMode(null)
    } catch (error: any) {
      console.error('Summarization error:', error)
      alert('Error: ' + (error.message || 'Failed to summarize. Make sure backend is running.'))
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      alert('Please enter some text to summarize')
      return
    }
    if (textInput.trim().length < 50) {
      alert('Please enter at least 50 characters to summarize')
      return
    }
    generateSummary(textInput, 'Text Input')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text.length < 50) {
          alert('File content is too short. Please upload a file with more content.')
          setLoading(false)
          return
        }
        generateSummary(text, file.name)
      }
      reader.readAsText(file)
      return
    }

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('length', summaryLength)
        formData.append('style', summaryStyle)

        const response = await fetch(API_URL + '/summarizer/pdf', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to process PDF')
        }

        const keyPoints = extractKeyPoints(data.data.summary)

        const newSummary: Summary = {
          id: Date.now().toString(),
          fileName: file.name,
          originalText: 'PDF content',
          summary: data.data.summary,
          keyPoints: keyPoints,
          createdAt: new Date(),
        }
        setSummaries([newSummary, ...summaries])
        setUploadMode(null)
      } catch (error: any) {
        console.error('PDF upload error:', error)
        alert('Error: ' + (error.message || 'Failed to process PDF'))
      } finally {
        setLoading(false)
      }
      return
    }

    alert('Unsupported file type. Please upload a PDF or TXT file.')
    setLoading(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteSummary = (id: string) => {
    setSummaries(summaries.filter(s => s.id !== id))
  }

  const downloadSummary = (summary: Summary) => {
    const content = '# Summary: ' + summary.fileName + '\nGenerated: ' + summary.createdAt.toLocaleString() + '\n\n## Summary\n' + summary.summary + '\n\n## Key Points\n' + summary.keyPoints.map(p => '- ' + p).join('\n')

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'summary-' + summary.fileName.replace(/\.[^/.]+$/, '') + '.md'
    a.click()
    URL.revokeObjectURL(url)
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

      {uploadMode && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Summary Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Length</label>
              <div className="flex gap-2">
                {(['short', 'medium', 'long'] as const).map(len => (
                  <button
                    key={len}
                    onClick={() => setSummaryLength(len)}
                    className={'px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ' + (summaryLength === len ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80')}
                  >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Style</label>
              <div className="flex gap-2">
                {(['bullet', 'paragraph', 'outline'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setSummaryStyle(style)}
                    className={'px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ' + (summaryStyle === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80')}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardDescription>Paste text content to summarize (minimum 50 characters)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your notes or article text here..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              className="min-h-48"
            />
            <p className="text-xs text-muted-foreground">
              {textInput.length} characters {textInput.length < 50 && textInput.length > 0 ? '(minimum 50 required)' : ''}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleTextSubmit}
                disabled={loading || textInput.length < 50}
                className="flex-1 gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Summarizing...' : 'Summarize with AI'}
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
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Upload a PDF or text file to summarize</CardDescription>
          </CardHeader>
          <CardContent>
            <label className={'block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition ' + (loading ? 'opacity-50 pointer-events-none' : '')}>
              {loading ? (
                <div>
                  <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                  <p className="text-sm font-medium text-foreground">Processing...</p>
                  <p className="text-xs text-muted-foreground mt-1">AI is analyzing your document</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">Supported: PDF, TXT files up to 10MB</p>
                </div>
              )}
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
              disabled={loading}
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
              Upload a document or paste text to get AI-powered summaries
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
                      {summary.createdAt.toLocaleDateString()} at {summary.createdAt.toLocaleTimeString()}
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
                  <div className="text-sm text-foreground/90 leading-relaxed bg-muted/50 p-3 rounded whitespace-pre-wrap">
                    {summary.summary}
                  </div>
                </div>

                {summary.keyPoints.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Key Points</h4>
                    <ul className="space-y-2">
                      {summary.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-foreground/90 flex gap-2">
                          <span className="text-primary flex-shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                    onClick={() => downloadSummary(summary)}
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