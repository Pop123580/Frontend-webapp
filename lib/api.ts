const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('learnai_token');
        }
        return null;
    }

    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('learnai_token', token);
        }
    }

    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('learnai_token');
            localStorage.removeItem('learnai_user');
        }
    }

    getUser(): any {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('learnai_user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    setUser(user: any): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('learnai_user', JSON.stringify(user));
        }
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(options.headers || {}),
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

    async register(userData: { name: string; email: string; password: string }) {
        const response = await this.request<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (response.success) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }
        return response;
    }

    async login(credentials: { email: string; password: string }) {
        const response = await this.request<any>('/auth/login', {
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
        this.removeToken();
    }

    async getMe() {
        return this.request<any>('/auth/me');
    }

    async getStudySessions() {
        return this.request<any>('/study-plan');
    }

    async createStudySession(data: any) {
        return this.request<any>('/study-plan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateStudySession(id: string, data: any) {
        return this.request<any>(`/study-plan/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteStudySession(id: string) {
        return this.request<any>(`/study-plan/${id}`, {
            method: 'DELETE',
        });
    }

    async summarizeText(data: any) {
        return this.request<any>('/summarizer/text', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getSummaries() {
        return this.request<any>('/summarizer');
    }

    async createExamPlan(data: any) {
        return this.request<any>('/exam-prep', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getExamPlans() {
        return this.request<any>('/exam-prep');
    }

    async sendMessage(data: any) {
        return this.request<any>('/chatbot/message', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getChatHistory() {
        return this.request<any>('/chatbot/history');
    }
}

const api = new ApiService();
export default api;