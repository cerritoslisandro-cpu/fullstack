import api from '../api/axios';

export interface LoginCredentials {
    username: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};