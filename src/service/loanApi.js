import apiClient from "./config";

// --- Loan Party ---

export const getAllLoanParties = () => apiClient.get("/loan/party-all");

export const getLoanPartyPaginated = (currentPage, pageSize) =>
    apiClient.get("/loan/party", {
        params: { page: currentPage, pageSize },
    });

export const getLoanPartyById = (id) => apiClient.get(`/loan/party/${id}`);

export const createLoanParty = (data) => apiClient.post("/loan/party", data);

export const updateLoanParty = (id, data) =>
    apiClient.put(`/loan/party/${id}`, data);

export const deleteLoanParty = (id) => apiClient.delete(`/loan/party/${id}`);

// --- Loan Posting ---
// export const getLoanPostingsPaginated = (currentPage, pageSize, status) =>
//     apiClient.get("/loan/posting", {
//         params: { page: currentPage, pageSize, status },
//     });


export const getLoanPostingsPaginated = (currentPage, pageSize, status, entryType) =>
    apiClient.get("/loan/posting", {
        params: { 
            page: currentPage, 
            pageSize, 
            status,
            entry_type: entryType // Add this parameter
        },
    });

    
export const getLoanPostingById = (id) => apiClient.get(`/loan/posting/${id}`);

export const createLoanPosting = (data) =>
    apiClient.post("/loan/posting", data);

export const updateLoanPosting = (id, data) =>
    apiClient.put(`/loan/posting/${id}`, data);

export const deleteLoanPosting = (id) =>
    apiClient.delete(`/loan/posting/${id}`);

export const updateLoanPostingStatus = (id, data) =>
    apiClient.put(`/loan/posting/status/${id}`, data);

// -- calculate interest and balance ---
export const getLoanCalculation = (loan_party_id, interest_rate_date) =>
    apiClient.get(
        `/loan/loan-calculation/${loan_party_id}/${interest_rate_date}`
    );
// --- Ledger ---
export const getLedger = (currentPage, pageSize, filter) =>
    apiClient.get("/loan/ledger", {
        params: { page: currentPage, pageSize, filter },
    });

export const getLedgerSummary = (currentPage, pageSize, filter) =>
    apiClient.get("/loan/ledger/summary", {
        params: { page: currentPage, pageSize, filter },
    });
