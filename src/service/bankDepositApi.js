import apiClient from "./config";

export const getBankDepositPostingsPaginated = (
  currentPage,
  pageSize,
  status
) =>
  apiClient.get("/bank-deposit/posting", {
    params: { page: currentPage, pageSize, status },
  });

export const getBankDepositPostingById = (id) =>
  apiClient.get(`/bank-deposit/posting/${id}`);

export const createBankDepositPosting = (data) =>
  apiClient.post("/bank-deposit/posting", data);

export const updateBankDepositPosting = (id, data) =>
  apiClient.put(`/bank-deposit/posting/${id}`, data);

export const deleteBankDepositPosting = (id) =>
  apiClient.delete(`/bank-deposit/posting/${id}`);

export const updateBankDepositPostingStatus = (id, data) =>
  apiClient.put(`/bank-deposit/posting/status/${id}`, data);
