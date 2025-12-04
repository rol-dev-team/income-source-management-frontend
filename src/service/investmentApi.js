import apiClient from "./config";

// --- Investment Party ---
export const getAllInvestmentParties = () =>
  apiClient.get("/investment/party-all");

export const getInvestmentPartyPaginated = (currentPage, pageSize) =>
  apiClient.get("/investment/party", {
    params: { page: currentPage, pageSize },
  });

export const getInvestmentPartyById = (id) =>
  apiClient.get(`/investment/party/${id}`);

export const createInvestmentParty = (data) =>
  apiClient.post("/investment/party", data);

export const updateInvestmentParty = (id, data) =>
  apiClient.put(`/investment/party/${id}`, data);

export const deleteInvestmentParty = (id) =>
  apiClient.delete(`/investment/party/${id}`);

// --- Investment Posting ---
export const getInvestmentPostingsPaginated = (currentPage, pageSize, status) =>
  apiClient.get("/investment/posting", {
    params: { page: currentPage, pageSize, status },
  });

export const getInvestmentPostingById = (id) =>
  apiClient.get(`/investment/posting/${id}`);

export const createInvestmentPosting = (data) =>
  apiClient.post("/investment/posting", data);

export const updateInvestmentPosting = (id, data) =>
  apiClient.put(`/investment/posting/${id}`, data);

export const deleteInvestmentPosting = (id) =>
  apiClient.delete(`/investment/posting/${id}`);

export const updateInvestmentPostingStatus = (id, data) =>
  apiClient.put(`/investment/posting/status/${id}`, data);

// --- Calculate return and balance ---
export const getInvestmentCalculation = (investment_party_id) =>
  apiClient.get(`/investment/investment-calculation/${investment_party_id}`);

// --- Ledger ---
export const getInvestmentLedger = (currentPage, pageSize, filter) =>
  apiClient.get("/investment/ledger", {
    params: { page: currentPage, pageSize, filter },
  });
