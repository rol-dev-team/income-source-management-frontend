import apiClient from "./config";

export const getTransfersPaginated = (currentPage, pageSize) =>
  apiClient.get("/transfer", {
    params: { page: currentPage, pageSize },
  });
export const getAllTransfers = () => apiClient.get("/transfer-list");

export const getTransferById = (id) => apiClient.get(`/transfer/${id}`);

export const createTransfer = (data) => apiClient.post("/transfer", data);

export const updateTransfer = (id, data) =>
  apiClient.put(`/transfer/${id}`, data);

export const deleteTransfer = (id) => apiClient.delete(`/transfer/${id}`);
