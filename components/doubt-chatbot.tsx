'use client'

import React from "react"

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Copy, Loader2, Globe } from 'lucide-react'

export default function DoubtChatbot() {
  const [input, setInput] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== 'ready') return

    const messageWithLanguage = `${input}\n\n(Please respond in ${selectedLanguage})`
    sendMessage({ text: messageWithLanguage })
    setInput('')
  }

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([])
    }
  }

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'spanish', name: 'Spanish' },
    { code: 'french', name: 'French' },
    { code: 'german', name: 'German' },
    { code: 'hindi', name: 'Hindi' },
    { code: 'mandarin', name: 'Mandarin' },
    { code: 'japanese', name: 'Japanese' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground">Doubt Solving Chatbot</h2>
        <div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>
        <p className="text-muted-foreground text-sm italic">
          Ask your questions and get instant explanations in your preferred language
        </p>
      </div>

      {/* Language Selector */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Select Response Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLanguage === lang.code
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Container */}
      <Card className="border border-border/50 flex flex-col h-[500px]">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat History
            </CardTitle>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:bg-destructive/10"
              >
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Ask your first question to get started
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, idx) => {
              const messageContent =
                message.parts?.[0]?.type === 'text'
                  ? message.parts[0].text
                  : message.content ||
                    (typeof message === 'string' ? message : JSON.stringify(message))

              return (
                <div
                  key={message.id || idx}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{messageContent}</p>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(messageContent, message.id || idx)}
                        className="mt-2 h-6 px-2 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedId === (message.id || idx) ? 'Copied!' : 'Copy'}
                      </Button>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">U</span>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {status === 'streaming' && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-muted px-4 py-2 rounded-lg">
                <p className="text-sm text-muted-foreground">AI is thinking...</p>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your question here..."
              disabled={status !== 'ready'}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={status !== 'ready' || !input.trim()}
              className="gap-2"
            >
              {status === 'streaming' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Tips: Ask clear, specific questions for better answers
          </p>
        </div>
      </Card>

      {/* Common Questions */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Example Questions</CardTitle>
          <CardDescription>Click to ask similar questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'What is the Pythagorean theorem?',
              'Explain photosynthesis',
              'How do I solve quadratic equations?',
              'What is the difference between velocity and speed?',
            ].map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => {
                  setInput(question)
                  setTimeout(() => {
                    const form = document.querySelector('form') as HTMLFormElement
                    if (form) form.dispatchEvent(new Event('submit', { bubbles: true }))
                  }, 100)
                }}
                className="justify-start text-left h-auto py-2"
              >
                <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
