
import axios from 'axios';

export const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://api.sulfire.com.br",
  headers: {
    "Content-Type": "application/json",
    'Accept': 'application/json'
    },
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  error => {
 
    const errorStatusList = [401, 403]
    if (error.response &&  errorStatusList.includes(error.response.status)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
