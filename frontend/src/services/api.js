import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getVendors = () => axios.get(`${API_URL}/vendors`);
export const getMetrics = () => axios.get(`${API_URL}/vendor-metrics`);
export const getRoutingLogs = () => axios.get(`${API_URL}/routing-logs`);
export const testRoute = (payload) => axios.post(`${API_URL}/route`, payload);
export const createVendor = (vendorData) => axios.post(`${API_URL}/vendors`, vendorData);
export const suggestRouting = (prompt) => axios.post(`${API_URL}/vendors/ai/suggest-routing`, { prompt });
