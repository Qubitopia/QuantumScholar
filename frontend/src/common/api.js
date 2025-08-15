import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export function apiGet(path, config = {}) {
    console.log('API GET:', `${VITE_API_URL}${path}`);
    return axios.get(`${VITE_API_URL}${path}`, { withCredentials: true, ...config });
}

export function apiPost(path, data, config = {}) {
    console.log('API POST:', `${VITE_API_URL}${path}`, data);
    return axios.post(`${VITE_API_URL}${path}`, data, { withCredentials: true, ...config });
}

export function apiPut(path, data, config = {}) {
    console.log('API PUT:', `${VITE_API_URL}${path}`, data, config);
    return axios.put(`${VITE_API_URL}${path}`, data, { withCredentials: true, ...config });
}