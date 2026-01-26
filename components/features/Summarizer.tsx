'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Summarizer() {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSummarize = async () => {
        if (text.length < 100) {
            toast.error('Please enter at least 100 characters');
            return;
        }
        setLoading(true);
        try {
            const response = await api.summarizeText({ text, title });
            if (response.success) {
                setResult(response.data);
                toast.success('Summary generated!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">📝 Notes Summarizer</h1>
                <p className="text-gray-500">Upload text and get short, concise notes instantly</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Input Text</h3>
                    <div className="input-group">
                        <label className="input-label">Title (optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                            placeholder="e.g., Physics Chapter 5"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Text to Summarize</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="input"
                            style={{ minHeight: '240px' }}
                            placeholder="Paste your notes here (minimum 100 characters)..."
                        />
                        <p className="input-hint">{text.length} characters</p>
                    </div>
                    <button
                        onClick={handleSummarize}
                        disabled={loading || text.length < 100}
                        className="btn btn-primary w-full"
                    >
                        {loading ? <><span className="spinner spinner-sm"></span> Summarizing...</> : 'Generate Summary'}
                    </button>
                </div>

                {/* Output */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Summary Result</h3>
                    {result ? (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-blue-50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-blue-600">{result.stats.originalWords}</p>
                                    <p className="text-xs text-gray-500">Original</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-purple-600">{result.stats.summaryWords}</p>
                                    <p className="text-xs text-gray-500">Summary</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-green-600">{result.stats.compressionRatio}</p>
                                    <p className="text-xs text-gray-500">Reduced</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 mb-2">Summary</h4>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">{result.summary}</p>
                            </div>
                            {result.keyPoints?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Key Points</h4>
                                    <ul className="space-y-2">
                                        {result.keyPoints.map((point: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                                                <span className="text-gray-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🤖</div>
                            <h3 className="empty-state-title">Ready to summarize</h3>
                            <p className="empty-state-text">Paste your text and click Generate Summary</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}