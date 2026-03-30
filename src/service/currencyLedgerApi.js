import apiClient from "./config";

export const fetchCurrencyPostings = (params = {}) =>
    apiClient.get("/currency-trading/currency-ledger", {
        params: params,
    });

export const fetchCurrencyPostingById = (id) =>
    apiClient.get(`/currency-trading/currency-ledger/${id}`);

export const createCurrencyPosting = (data) =>
    apiClient.post("/currency-trading/currency-ledger", data);

export const updateCurrencyPosting = (id, data) =>
    apiClient.put(`/currency-trading/currency-ledger/${id}`, data);

export const deleteCurrencyPosting = (id) =>
    apiClient.delete(`/currency-trading/currency-ledger/${id}`);

export const fetchCurrencyLedgerSummaryPostings = (params = {}) =>
    apiClient.get("/currency-trading/currency-ledger-summary", {
        params: params,
    });
