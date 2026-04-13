import axios from 'axios';
import { UserRole, User } from '../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  contactNumber?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async updateProfile(data: { firstName: string, lastName: string, studentId: string, password: string }): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    const response = await api.put('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  }
};

export default authService;
