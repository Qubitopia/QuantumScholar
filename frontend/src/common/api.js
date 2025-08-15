import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export function apiPost(path, data, config = {}) {
  return axios.post(`${VITE_API_URL}${path}`, data, { withCredentials: true, ...config });
}
