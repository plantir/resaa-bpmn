import axios, { AxiosError } from 'axios';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const Axios = axios.create({
	baseURL: API_URL
});
Axios.interceptors.request.use(async function (config) {
	// if (config.url?.startsWith("http")) return config;
	if (typeof window !== 'undefined' && localStorage.token) {
		config.headers.Authorization = localStorage.token;
	}
	return config;
});
Axios.interceptors.response.use(
	(response: any) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			if (error.response.config.url?.includes('auth/logout')) throw error;
			console.log('logout');
		}
		throw error;
	}
);
export default Axios;
