// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get stored token
    getToken() {
        return localStorage.getItem('learnai_token');
    }

    // Set token
    setToken(token) {
        localStorage.setItem('learnai_token', token);
    }

    // Remove token
    removeToken() {
        localStorage.removeItem('learnai_token');
        localStorage.removeItem('learnai_user');
    }

    // Get stored user
    getUser() {
        const user = localStorage.getItem('learnai_user');
        return user ? JSON.parse(user) : null;
    }

    // Set user
    setUser(user) {
        localStorage.setItem('learnai_user', JSON.stringify(user));
    }

    // Base fetch method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // ============ AUTH ENDPOINTS ============

    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (response.success) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }

        return response;
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
        }
    }

    async getMe() {
        return this.request('/auth/me');
    }

    async updateProfile(data) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // ============ STUDY PLAN ENDPOINTS ============

    async getStudySessions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/study-plan?${queryString}`);
    }

    async createStudySession(data) {
        return this.request('/study-plan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateStudySession(id, data) {
        return this.request(`/study-plan/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteStudySession(id) {
        return this.request(`/study-plan/${id}`, {
            method: 'DELETE',
        });
    }

    async getTodaySessions() {
        return this.request('/study-plan/today');
    }

    async getUpcomingSessions() {
        return this.request('/study-plan/upcoming');
    }

    // ============ SUMMARIZER ENDPOINTS ============

    async summarizeText(data) {
        return this.request('/summarizer/text', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async summarizePDF(file, data = {}) {
        const formData = new FormData();
        formData.append('file', file);
        if (data.title) formData.append('title', data.title);
        if (data.subject) formData.append('subject', data.subject);

        const token = this.getToken();
        const response = await fetch(`${this.baseURL}/summarizer/pdf`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to summarize PDF');
        }
        return result;
    }

    async getSummaries(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/summarizer?${queryString}`);
    }

    async getSummary(id) {
        return this.request(`/summarizer/${id}`);
    }

    async deleteSummary(id) {
        return this.request(`/summarizer/${id}`, {
            method: 'DELETE',
        });
    }

    // ============ EXAM PREP ENDPOINTS ============

    async createExamPlan(data) {
        return this.request('/exam-prep', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getExamPlans(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/exam-prep?${queryString}`);
    }

    async getExamPlan(id) {
        return this.request(`/exam-prep/${id}`);
    }

    async updateExamPlan(id, data) {
        return this.request(`/exam-prep/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async updateTaskStatus(examId, taskId, data) {
        return this.request(`/exam-prep/${examId}/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteExamPlan(id) {
        return this.request(`/exam-prep/${id}`, {
            method: 'DELETE',
        });
    }

    // ============ CHATBOT ENDPOINTS ============

    async sendMessage(data) {
        return this.request('/chatbot/message', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getChatHistory(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/chatbot/history?${queryString}`);
    }

    async getChatSession(sessionId) {
        return this.request(`/chatbot/session/${sessionId}`);
    }

    async createChatSession(data = {}) {
        return this.request('/chatbot/session', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteChatSession(sessionId) {
        return this.request(`/chatbot/session/${sessionId}`, {
            method: 'DELETE',
        });
    }

    async clearChatHistory() {
        return this.request('/chatbot/history', {
            method: 'DELETE',
        });
    }
}

const api = new ApiService();
export default api;