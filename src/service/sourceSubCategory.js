import apiClient from "./config";
export const fetchSourceSubCategory = (currentPage, pageSize) =>
  apiClient.get("/source-sub-category", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchSubCategoryBySourceId = (id) =>
    apiClient.get(`/source-sub-categories/${id}`);
export const fetchSourceSubCategoryById = (id) =>
  apiClient.get(`/source-sub-category/${id}`);
export const createSourceSubCategory = (data) =>
  apiClient.post("/source-sub-category", data);
export const updateSourceSubCategory = (id, data) =>
  apiClient.put(`/source-sub-category/${id}`, data);
export const deleteSourceSubCategory = (id) =>
  apiClient.delete(`/source-sub-category/${id}`);
