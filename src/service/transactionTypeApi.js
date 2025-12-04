import apiClient from "./config";
export const fetchTransactionTypes = (currentPage, pageSize) =>
  apiClient.get("/transaction-types", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

export const fetchTransactionTypesById = (id) =>
  apiClient.get(`/transaction-types/${id}`);
export const createTransactionTypes = (data) =>
  apiClient.post("/transaction-types", data);
export const updateTransactionTypes = (id, data) =>
  apiClient.put(`/transaction-types/${id}`, data);
export const deleteTransactionTypes = (id) =>
  apiClient.delete(`/transaction-types/${id}`);