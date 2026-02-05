import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return this.token || localStorage.getItem('auth_token');
        }
        return this.token;
    }

    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const token = options.token || this.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                // Auto-logout on 401
                if (response.status === 401 && typeof window !== 'undefined') {
                    // Only clear if we actually had a token (avoid loops)
                    if (localStorage.getItem('auth_token')) {
                        console.warn('Unauthorized - clearing token');
                        localStorage.removeItem('auth_token');
                        // Optional: window.location.href = '/login'; 
                    }
                }

                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || `Request failed with status ${response.status}`;
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error: any) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    get<T>(endpoint: string, options: RequestOptions = {}) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body: any, options: RequestOptions = {}) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: any, options: RequestOptions = {}) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    patch<T>(endpoint: string, body: any, options: RequestOptions = {}) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string, options: RequestOptions = {}) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const api = new ApiClient();
