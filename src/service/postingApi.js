import apiClient from "./config";
export const fetchPosting = (currentPage, pageSize) =>
  apiClient.get("/posting", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

export const fetchPostingById = (id) => apiClient.get(`/posting/${id}`);
export const createPosting = (data) => apiClient.post("/posting", data);
export const updatePosting = (id, data) =>
  apiClient.put(`/posting/${id}`, data);
export const deletePosting = (id) => apiClient.delete(`/posting/${id}`);

export const updatePostingStatus = (id,data) =>
  apiClient.put(`posting/status/${id}`,data);
