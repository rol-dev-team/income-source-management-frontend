import apiClient from "./config";
export const fetchSources = (currentPage, pageSize) =>
  apiClient.get("/sources", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchAllSources = () => apiClient.get("/sources");
export const fetchSourceById = (id) => apiClient.get(`/sources/${id}`);
export const createSource = (data) => apiClient.post("/sources", data);
export const updateSource = (id, data) => apiClient.put(`/sources/${id}`, data);
export const deleteSource = (id) => apiClient.delete(`/sources/${id}`);
