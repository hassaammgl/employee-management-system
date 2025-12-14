import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE = (import.meta as any).env?.VITE_API_URL || "";

const axiosInstance = axios.create({
    baseURL: API_BASE ? `${API_BASE}/api` : "/api",
    withCredentials: true,
});

export default axiosInstance;
