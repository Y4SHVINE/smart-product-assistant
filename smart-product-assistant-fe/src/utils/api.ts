import { Product } from '@/types/Product';
import { getSupabaseClient } from './supabase';
import axios from 'axios';
import { Category } from '@/types/Category';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config: any) => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return config;
    }
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
      return Promise.reject({ error: 'No response received from server' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ error: 'Request configuration error' });
    }
  }
);

// API methods
export const api = {
  // Products
  getProducts: async () => {
    const response = await axiosInstance.get<Product[]>('/products');
    return response;
  },
  getProduct: async (id: number) => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response;
  },
  searchProducts: async (query: string) => {
    const response = await axiosInstance.post<Product[]>('/products/search', { query });
    return response;
  },
  
  // Categories
  getCategories: async () => {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response;
  },
  getCategory: async (id: number) => {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response;
  },
}; 