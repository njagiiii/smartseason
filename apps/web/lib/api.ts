import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (name: string, email: string, password: string, role: string) =>
  api.post("/auth/register", { name, email, password, role });

// Fields
export const getAllFields = () => api.get("/fields/getallfields");
export const getMyFields = () => api.get("/fields/my-fields");
export const getFieldById = (id: string) => api.get(`/fields/getfield/${id}`);
export const createField = (data: any) => api.post("/fields/createfield", data);
export const updateFieldStage = (id: string, data: any) => api.post(`/fields/${id}/update`, data);
export const updateFieldDetails = (id: string, data: any) => api.put(`/fields/updateallfields/${id}`, data);
export const assignField = (id: string, agentId: string) => api.post(`/fields/${id}/assign`, { agentId });
export const getDashboardSummary = () => api.get("/fields/dashboard");

// Users
export const getAllAgents = () => api.get("/users/agents");

export default api;