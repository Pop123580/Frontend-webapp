'use client';

import React, { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}
const languages = [
  { code: "en", name: "English", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "or", name: "Odia", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "as", name: "Assamese", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", flag: "🇮🇳" },
  { code: "sa", name: "Sanskrit", flag: "🇮🇳" },
];

export default function AskAI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('English');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setLoading(true);

        try {
            const response = await api.sendMessage({ message: msg, sessionId: sessionId || undefined, language });
            if (response.success) {
                if (!sessionId) setSessionId(response.data.sessionId);
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.message.content }]);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="animate-fadeIn h-[calc(100vh-280px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">💬 Doubt Solving Chatbot</h1>
                    <p className="text-gray-500">Ask questions in multiple languages</p>
                </div>
                <button onClick={() => { setMessages([]); setSessionId(null); }} className="btn btn-secondary btn-sm">
                    + New Chat
                </button>
            </div>

            {/* Language */}
            <div className="flex flex-wrap gap-2 mb-4">
                {languages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`btn btn-sm ${language === lang ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 card p-6 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🤖</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">How can I help you?</h3>
                            <p className="text-gray-500 max-w-sm">
                                Ask me anything about your studies. I can explain concepts, solve problems, and more!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`message ${m.role === 'user' ? 'message-user' : 'message-ai'}`}>
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="message message-ai flex items-center gap-2">
                                    <span className="spinner spinner-sm"></span>
                                    <span className="text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    className="input flex-1"
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading || !input.trim()} className="btn btn-primary px-8">
                    {loading ? <span className="spinner spinner-sm"></span> : 'Send'}
                </button>
            </div>
        </div>
    );
}