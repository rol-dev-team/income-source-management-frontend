import apiClient from "./config";
export const fetchSourceCategory = (currentPage, pageSize) =>
  apiClient.get("/source-category", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchCategoriesBySourceId = (id) =>
    apiClient.get(`/source-categories/${id}`);
export const fetchSourceCategoryById = (id) =>
  apiClient.get(`/source-category/${id}`);
export const createSourceCategory = (data) =>
  apiClient.post("/source-category", data);
export const updateSourceCategory = (id, data) =>
  apiClient.put(`/source-category/${id}`, data);
export const deleteSourceCategory = (id) =>
  apiClient.delete(`/source-category/${id}`);
