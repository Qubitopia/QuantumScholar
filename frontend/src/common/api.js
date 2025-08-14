import axios from 'axios';

export const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:8000';

export function apiPost(path, data, config = {}) {
  return axios.post(`${API_BASE}${path}`, data, { withCredentials: true, ...config });
}
