import axios from 'axios';
import { getToken } from './utils';

// In production, VITE_API_URL points to the deployed backend (e.g. https://medicompare-api.onrender.com)
// In development, leave empty so Vite proxy forwards /api → localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(e);
  }
);

export const authApi = {
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
  me: () => api.get('/api/auth/me').then((r) => r.data),
  toggleSaved: (hospitalId) => api.post(`/api/auth/saved/${hospitalId}`).then((r) => r.data),
};

export const hospitalsApi = {
  list: (params) => api.get('/api/hospitals', { params }).then((r) => r.data),
  get: (slug) => api.get(`/api/hospitals/${slug}`).then((r) => r.data),
  suggest: (q) => api.get('/api/hospitals/suggest', { params: { q } }).then((r) => r.data),
  categories: () => api.get('/api/hospitals/categories').then((r) => r.data),
};

export const recommendApi = {
  get: (params) => api.get('/api/recommend', { params }).then((r) => r.data),
};

export const bookingsApi = {
  list: () => api.get('/api/bookings').then((r) => r.data),
  get: (id) => api.get(`/api/bookings/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/bookings', data).then((r) => r.data),
  confirm: (id, data) => api.patch(`/api/bookings/${id}/confirm`, data).then((r) => r.data),
  cancel: (id) => api.patch(`/api/bookings/${id}/cancel`).then((r) => r.data),
  pay: (id, data) => api.patch(`/api/bookings/${id}/pay`, data).then((r) => r.data),
};

export const reviewsApi = {
  list: (hospitalId) => api.get(`/api/reviews/hospital/${hospitalId}`).then((r) => r.data),
  create: (data) => api.post('/api/reviews', data).then((r) => r.data),
};

export const adminApi = {
  stats: () => api.get('/api/admin/stats').then((r) => r.data),
  bookingsAnalytics: () => api.get('/api/admin/bookings/analytics').then((r) => r.data),
  hospitals: () => api.get('/api/admin/hospitals').then((r) => r.data),
  verifyHospital: (id) => api.patch(`/api/admin/hospitals/${id}/verify`).then((r) => r.data),
  categories: () => api.get('/api/admin/categories').then((r) => r.data),
  createCategory: (data) => api.post('/api/admin/categories', data).then((r) => r.data),
  bookings: () => api.get('/api/admin/bookings').then((r) => r.data),
  updateBookingStatus: (id, status) => api.patch(`/api/admin/bookings/${id}/status`, { status }).then((r) => r.data),
};

export const aiApi = {
  chat: (message) => api.post('/api/ai/chat', { message }).then((r) => r.data),
};

export const invoiceUrl = (bookingId) => `/api/invoice/${bookingId}`;

export default api;
