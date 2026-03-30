import apiClient from "./config";

export const fetchUsers = (currentPage, pageSize) =>
  apiClient.get("/users", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const createUser = (data) => apiClient.post("/users", data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
