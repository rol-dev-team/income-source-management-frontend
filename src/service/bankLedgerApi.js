import apiClient from "./config";

// export const fetchBankLedgerPostings = (params = {}) =>
//     apiClient.get("/bank-ledger", {
//         params: params,
//     });

export const fetchBankLedgerPostings = (params = {}) =>
    apiClient.get("/bank-ledger", {
        params: {
            ...params,
            view: params.view || "summary", // Default to "summary" if not provided
        },
    });

export const fetchBankLedgerSummary = (params = {}) =>
    apiClient.get("/bank-ledger/summary", {
        params: params,
    });

export const fetchBankLedgerDetails = (params = {}) =>
    apiClient.get("/bank-ledger/details", {
        params: params,
    });

// export const fetchBankLedgerPostingById = (id) =>
//   apiClient.get(`/bank-ledger/${id}`);

// export const createBankLedgerPosting = (data) =>
//   apiClient.post("/bank-ledger", data);

// export const updateBankLedgerPosting = (id, data) =>
//   apiClient.put(`/bank-ledger/${id}`, data);

// export const deleteBankLedgerPosting = (id) =>
//   apiClient.delete(`/bank-ledger/${id}`);
