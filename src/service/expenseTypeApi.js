import apiClient from "./config";
export const fetchExpenseTypes = (currentPage, pageSize) =>
  apiClient.get("/expense-types", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchExpenseTypesBySourceId = (id) =>
    apiClient.get(`/expense-types-by-source/${id}`);
export const fetchExpenseTypesById = (id) =>
  apiClient.get(`/expense-types/${id}`);
export const createExpenseTypes = (data) =>
  apiClient.post("/expense-types", data);
export const updateExpenseTypes = (id, data) =>
  apiClient.put(`/expense-types/${id}`, data);
export const deleteExpenseTypes = (id) =>
  apiClient.delete(`/expense-types/${id}`);
