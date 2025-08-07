import { api } from '../index';

export const getTopSellingProducts = () => api.get('/dashboard/top-selling');
export const getUnsoldProducts = () => api.get('/dashboard/unsold');
export const getExpiredProducts = () => api.get('/dashboard/expired');
export const getTotalRevenue = () => api.get('/dashboard/revenue');
export const getMonthlyRevenue = () => api.get('/dashboard/monthly-revenue');