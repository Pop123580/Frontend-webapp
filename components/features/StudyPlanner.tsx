'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Session {
    _id: string;
    subject: string;
    topic: string;
    duration: number;
    deadline: string;
    priority: 'Low' | 'Medium' | 'High';
    status: string;
}

export default function StudyPlanner() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: '', topic: '', duration: 60, deadline: '', priority: 'Medium'
    });

    useEffect(() => { fetchSessions(); }, []);

    const fetchSessions = async () => {
        try {
            const response = await api.getStudySessions();
            if (response.success) setSessions(response.data.sessions);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await api.createStudySession(formData);
            if (response.success) {
                toast.success('Study session created!');
                setSessions([response.data, ...sessions]);
                setShowForm(false);
                setFormData({ subject: '', topic: '', duration: 60, deadline: '', priority: 'Medium' });
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create session');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this session?')) return;
        try {
            await api.deleteStudySession(id);
            setSessions(sessions.filter(s => s._id !== id));
            toast.success('Session deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const priorityStyles: Record<string, string> = {
        Low: 'badge-success',
        Medium: 'badge-warning',
        High: 'badge-error'
    };

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📅 Study Planner</h1>
                    <p className="text-gray-500">Organize and track your study sessions</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ Create Session'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card p-6 animate-slideDown">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">New Study Session</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="input-group">
                            <label className="input-label">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="input"
                                placeholder="e.g., Mathematics"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Topic</label>
                            <input
                                type="text"
                                value={formData.topic}
                                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                className="input"
                                placeholder="e.g., Calculus"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Duration (minutes)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                className="input"
                                min="5"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Deadline</label>
                            <input
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                className="input"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                className="input"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                                {submitting ? <><span className="spinner spinner-sm"></span> Creating...</> : 'Create Session'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Sessions */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="spinner spinner-lg"></div>
                </div>
            ) : sessions.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <h3 className="empty-state-title">No study sessions yet</h3>
                        <p className="empty-state-text">Create your first study session to get started</p>
                        <button onClick={() => setShowForm(true)} className="btn btn-primary mt-6">
                            + Create Session
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 stagger">
                    {sessions.map((session) => (
                        <div key={session._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="icon-box icon-box-blue">📖</div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{session.subject}</h4>
                                    <p className="text-sm text-gray-500">{session.topic}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">{session.duration} min</p>
                                    <p className="text-xs text-gray-400">Duration</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">
                                        {new Date(session.deadline).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-400">Deadline</p>
                                </div>
                                <span className={`badge ${priorityStyles[session.priority]}`}>
                                    {session.priority}
                                </span>
                                <button 
                                    onClick={() => handleDelete(session._id)}
                                    className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}