import apiClient from "./config";
export const fetchSourceSubCategoryDetails = (currentPage, pageSize) =>
  apiClient.get("/source-sub-category-details", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

export const fetchSourceSubCategoryDetailsById = (id) =>
  apiClient.get(`/source-sub-category-details/${id}`);
export const createSourceSubCategoryDetails = (data) =>
  apiClient.post("/source-sub-category-details", data);
export const updateSourceSubCategoryDetails = (id, data) =>
  apiClient.put(`/source-sub-category-details/${id}`, data);
export const deleteSourceSubCategoryDetails = (id) =>
  apiClient.delete(`/source-sub-category-details/${id}`);
