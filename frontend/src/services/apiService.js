import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/transactions';

export const initializeDatabase = () => axios.get(`${API_BASE_URL}/initialize`);

export const getTransactions = (month, page = 1, perPage = 10, search = '') =>
    axios.get(`${API_BASE_URL}/list`, { params: { month, page, perPage, search } });

export const getStatistics = (month) =>
    axios.get(`${API_BASE_URL}/statistics`, { params: { month } });

export const getBarChart = (month) =>
    axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });

export const getPieChart = (month) =>
    axios.get(`${API_BASE_URL}/pie-chart`, { params: { month } });

export const getCombinedData = (month) =>
    axios.get(`${API_BASE_URL}/combined`, { params: { month } });
