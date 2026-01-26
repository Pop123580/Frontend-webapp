'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ExamPrep() {
    const [plans, setPlans] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        examName: '', subject: '', examDate: '', topics: ''
    });

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.getExamPlans();
            if (response.success) setPlans(response.data.examPlans);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.createExamPlan(formData);
            if (response.success) {
                toast.success('Exam plan created!');
                setPlans([response.data.examPlan, ...plans]);
                setShowForm(false);
                setFormData({ examName: '', subject: '', examDate: '', topics: '' });
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🎯 Exam Preparation</h1>
                    <p className="text-gray-500">Practice questions and revision help</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ New Exam Plan'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card p-6 animate-slideDown">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Create Exam Plan</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="input-group">
                            <label className="input-label">Exam Name</label>
                            <input
                                type="text"
                                value={formData.examName}
                                onChange={(e) => setFormData({...formData, examName: e.target.value})}
                                className="input"
                                placeholder="e.g., Final Exam"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="input"
                                placeholder="e.g., Physics"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Exam Date</label>
                            <input
                                type="date"
                                value={formData.examDate}
                                onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                                className="input"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Topics (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.topics}
                                onChange={(e) => setFormData({...formData, topics: e.target.value})}
                                className="input"
                                placeholder="e.g., Newton's Laws, Waves"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" disabled={loading} className="btn btn-primary w-full">
                                {loading ? <><span className="spinner spinner-sm"></span> Creating...</> : 'Generate Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Plans */}
            {plans.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🎯</div>
                        <h3 className="empty-state-title">No exam plans yet</h3>
                        <p className="empty-state-text">Create an AI-powered study plan for your exam</p>
                        <button onClick={() => setShowForm(true)} className="btn btn-primary mt-6">
                            + Create Plan
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 stagger">
                    {plans.map((plan) => (
                        <div key={plan._id} className="card p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="icon-box icon-box-purple">🎯</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{plan.examName}</h4>
                                        <p className="text-gray-500">{plan.subject}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {new Date(plan.examDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-blue-600">Exam Date</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-semibold">{plan.progress || 0}%</span>
                                </div>
                                <div className="progress">
                                    <div className="progress-bar" style={{ width: `${plan.progress || 0}%` }}></div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {plan.topics?.map((topic: string, i: number) => (
                                    <span key={i} className="badge">{topic}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}