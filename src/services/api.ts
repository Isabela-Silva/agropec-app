import axios from 'axios';

// Configuração da API
const apiBaseUrl = 'http://localhost:3000';

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const adminToken = localStorage.getItem('admin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o token expirou ou é inválido, remove do localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('auth_data');
      localStorage.removeItem('admin_data');

      // Redireciona para login se estiver em uma rota protegida
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
