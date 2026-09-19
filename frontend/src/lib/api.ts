import axios from 'axios';
import { Product, ComponentCategory, ConfigurationCreate, QuoteCreate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (e) {
        console.error("Failed to parse auth token", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired or invalid credentials
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth-storage');
      } catch (e) {
        console.error("Failed to clear auth storage on 401", e);
      }
    }
    return Promise.reject(error);
  }
);

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products/');
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const getComponentCategories = async (): Promise<ComponentCategory[]> => {
  const response = await api.get('/components/categories');
  return response.data;
};

export const createComponent = async (componentData: any) => {
  const response = await api.post('/components/', componentData);
  return response.data;
};

export const saveConfiguration = async (config: ConfigurationCreate) => {
  const response = await api.post('/configurations/', config);
  return response.data;
};

export const getConfiguration = async (id: number) => {
  const response = await api.get(`/configurations/${id}`);
  return response.data;
};

export const updateConfiguration = async (id: number, data: Partial<ConfigurationCreate>) => {
  const response = await api.put(`/configurations/${id}`, data);
  return response.data;
};

export const deleteConfiguration = async (id: number) => {
  const response = await api.delete(`/configurations/${id}`);
  return response.data;
};

export const submitQuote = async (quote: QuoteCreate) => {
  const response = await api.post('/quotes/', quote);
  return response.data;
};

export const login = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const getQuotes = async () => {
  const response = await api.get('/quotes/');
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getMyQuotes = async () => {
  const response = await api.get('/quotes/me');
  return response.data;
};

export const getMyConfigurations = async () => {
  const response = await api.get('/configurations/me');
  return response.data;
};

export const updateQuoteStatus = async (quoteId: number, status: string) => {
  const response = await api.put(`/quotes/${quoteId}/status`, { status });
  return response.data;
};

export const getConstraints = async () => {
  const response = await api.get('/components/constraints');
  return response.data;
};

export const createConstraint = async (data: any) => {
  const response = await api.post('/components/constraints', data);
  return response.data;
};

export const deleteConstraint = async (constraintId: number) => {
  const response = await api.delete(`/components/constraints/${constraintId}`);
  return response.data;
};

export const updateComponent = async (componentId: number, data: any) => {
  const response = await api.put(`/components/${componentId}`, data);
  return response.data;
};

export const deleteComponent = async (componentId: number) => {
  const response = await api.delete(`/components/${componentId}`);
  return response.data;
};

export const getApprovedQuotes = async () => {
  const response = await api.get('/quotes/approved');
  return response.data;
};
