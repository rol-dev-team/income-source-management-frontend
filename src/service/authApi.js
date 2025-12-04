import apiClient from "./config";

export const loginUser = (data) => apiClient.post("/auth/login", data);
export const registerUser = (data) => apiClient.post("/auth/register", data);
export const getProfile = () => apiClient.get("/auth/profile");
export const logoutUser = () => apiClient.post("/auth/logout");
