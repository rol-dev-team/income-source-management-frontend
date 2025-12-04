import apiClient from "../config";

// --- Currency ---
export const getCurrenciesPaginated = (currentPage, pageSize) =>
    apiClient.get("/currency-trading/currency", {
        params: { page: currentPage, pageSize },
    });

export const getAllCurrencies = () =>
    apiClient.get("/currency-trading/currency-list");

export const getCurrencyById = (id) =>
    apiClient.get(`/currency-trading/currency/${id}`);

export const createCurrency = (data) =>
    apiClient.post("/currency-trading/currency", data);

export const updateCurrency = (id, data) =>
    apiClient.put(`/currency-trading/currency/${id}`, data);

export const deleteCurrency = (id) =>
    apiClient.delete(`/currency-trading/currency/${id}`);

// --- Currency Party ---
export const getCurrencyPartiesPaginated = (currentPage, pageSize) =>
    apiClient.get("/currency-trading/currency-party", {
        params: { page: currentPage, pageSize },
    });

export const getAllCurrencyParties = () =>
    apiClient.get("/currency-trading/currency-party-list");

export const getCurrencyPartyById = (id) =>
    apiClient.get(`/currency-trading/currency-party/${id}`);

export const createCurrencyParty = (data) =>
    apiClient.post("/currency-trading/currency-party", data);

export const updateCurrencyParty = (id, data) =>
    apiClient.put(`/currency-trading/currency-party/${id}`, data);

export const deleteCurrencyParty = (id) =>
    apiClient.delete(`/currency-trading/currency-party/${id}`);

// --- Currency Trading (resource name overlaps prefix, consider renaming) ---
export const getCurrencyPostingsPaginated = (currentPage, pageSize, status) =>
    apiClient.get("/currency-trading/currency-posting", {
        params: { page: currentPage, pageSize, status },
    });

export const getAllCurrencyPostings = () =>
    apiClient.get("/currency-trading/currency-posting");

export const getCurrencyPostingById = (id) =>
    apiClient.get(`/currency-trading/currency-posting/${id}`);

export const createCurrencyPosting = (data) =>
    apiClient.post("/currency-trading/currency-posting", data);

export const updateCurrencyPosting = (id, data) =>
    apiClient.put(`/currency-trading/currency-posting/${id}`, data);

export const deleteCurrencyPosting = (id) =>
    apiClient.delete(`/currency-trading/currency-posting/${id}`);

export const updateCurrencyPostingStatus = (id, data) =>
    apiClient.put(`/currency-trading/currency-posting/status/${id}`, data);

// --- Currency Payment Posting ---
export const getCurrencyPaymentPostingsPaginated = (currentPage, pageSize) =>
    apiClient.get("/currency-trading/currency-payment-posting", {
        params: { page: currentPage, pageSize },
    });

export const getAllCurrencyPaymentPostings = () =>
    apiClient.get("/currency-trading/currency-payment-posting");

export const getCurrencyPaymentPostingById = (id) =>
    apiClient.get(`/currency-trading/currency-payment-posting/${id}`);

export const createCurrencyPaymentPosting = (data) =>
    apiClient.post("/currency-trading/currency-payment-posting", data);

export const updateCurrencyPaymentPosting = (id, data) =>
    apiClient.put(`/currency-trading/currency-payment-posting/${id}`, data);

export const deleteCurrencyPaymentPosting = (id) =>
    apiClient.delete(`/currency-trading/currency-payment-posting/${id}`);

export const getCurrencyAnalysis = (params = {}) =>
    apiClient.get("/currency-trading/currency-analysis", {
        params: params,
    });
