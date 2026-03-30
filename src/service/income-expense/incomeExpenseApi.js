import apiClient from "../config";

// --- Income Expense Head ---
export const getAllIncomesExpenses = () =>
  apiClient.get("/income-expense/head-all");

export const getIncomesExpensePaginated = (currentPage, pageSize) =>
  apiClient.get("/income-expense/head", {
    params: { page: currentPage, pageSize },
  });

export const getIncomeExpenseById = (id) =>
  apiClient.get(`/income-expense/head/${id}`);

export const createIncomeExpense = (data) =>
  apiClient.post("/income-expense/head", data);

export const updateIncomeExpense = (id, data) =>
  apiClient.put(`/income-expense/head/${id}`, data);

export const deleteIncomeExpense = (id) =>
  apiClient.delete(`/income-expense/head/${id}`);

// --- Income/Expense Posting ---
export const getIncomeExpensePostingsPaginated = (
  currentPage,
  pageSize,
  status
) =>
  apiClient.get("/income-expense/posting", {
    params: { page: currentPage, pageSize, status },
  });

export const getIncomeExpensePostingById = (id) =>
  apiClient.get(`/income-expense/posting/${id}`);

export const createIncomeExpensePosting = (data) =>
  apiClient.post("/income-expense/posting", data);

export const updateIncomeExpensePosting = (id, data) =>
  apiClient.put(`/income-expense/posting/${id}`, data);

export const deleteIncomeExpensePosting = (id) =>
  apiClient.delete(`/income-expense/posting/${id}`);

export const updateIncomeExpensePostingStatus = (id, data) =>
  apiClient.put(`/income-expense/posting/status/${id}`, data);

// Ledger

export const getLedger = (currentPage, pageSize, filter) =>
  apiClient.get("/income-expense/ledger", {
    params: { page: currentPage, pageSize, filter },
  });



export const getLedgersummary = (currentPage, pageSize, filter) =>
  apiClient.get("/income-expense/ledger-summary", {
    params: { page: currentPage, pageSize, filter },
  });





export const deleteIncomeExpensePostingSoftDelete = async (id) => {
  const response = await apiClient.post(`/income-expense/posting/${id}/soft-delete`);
  return response.data;
};

export const restoreIncomeExpensePosting = async (id) => {
  const response = await apiClient.put(`/income-expense/posting/${id}/restore`);
  return response.data;
};