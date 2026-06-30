import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ki_gostoso_token');
  if (token && config.url.startsWith('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public endpoints
export const getCategories = () => api.get('/categories');
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Admin endpoints
export const adminLogin = (data) => api.post('/admin/login', data);
export const adminGetProducts = (params) => api.get('/admin/products', { params });
export const adminCreateProduct = (formData) =>
  api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateProduct = (id, formData) =>
  api.put(`/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const adminGetOrders = (params) => api.get('/admin/orders', { params });
export const adminUpdateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status });
export const adminGetCategories = () => api.get('/admin/categories');

// ViaCEP
export const fetchCep = (cep) =>
  axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);

export default api;
