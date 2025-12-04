import apiClient from "./config";

// --- Rental Parties ---

// GET /rental/parties-all (Retrieve all parties, often for dropdowns)
export const getAllRentalParties = () => apiClient.get("/rental/parties-all");
export const getRentalPartiesInfo = (data) =>
    apiClient.post("/rental/parties-info", data);
export const getRentalPartiesRefundInfo = (id) =>
    apiClient.get(`/rental/parties-refund-info/${id}`);

// GET /rental/parties (Retrieve paginated/filtered list of parties)
export const getRentalPartiesPaginated = (currentPage, pageSize) =>
    apiClient.get("/rental/parties", {
        params: { page: currentPage, pageSize },
    });

// GET /rental/parties/{id}
export const getRentalPartyById = (id) =>
    apiClient.get(`/rental/parties/${id}`);

// POST /rental/parties
export const createRentalParty = (data) =>
    apiClient.post("/rental/parties", data);

// PUT /rental/parties/{id}
export const updateRentalParty = (id, data) =>
    apiClient.put(`/rental/parties/${id}`, data);

// DELETE /rental/parties/{id}
export const deleteRentalParty = (id) =>
    apiClient.delete(`/rental/parties/${id}`);

// --- Rental Houses/Properties ---

// GET /rental/houses-all (Retrieve all houses, often for dropdowns)
export const getAllRentalHouses = () => apiClient.get("/rental/houses-all");

// GET /rental/houses (Retrieve paginated/filtered list of houses)
export const getRentalHousesPaginated = (currentPage, pageSize) =>
    apiClient.get("/rental/houses", {
        params: { page: currentPage, pageSize },
    });

// GET /rental/houses/{id}
export const getRentalHouseById = (id) => apiClient.get(`/rental/houses/${id}`);

// POST /rental/houses
export const createRentalHouse = (data) =>
    apiClient.post("/rental/houses", data);

// PUT /rental/houses/{id}
export const updateRentalHouse = (id, data) =>
    apiClient.put(`/rental/houses/${id}`, data);

// DELETE /rental/houses/{id}
export const deleteRentalHouse = (id) =>
    apiClient.delete(`/rental/houses/${id}`);

// --- Rental Postings (Agreements/Transactions) ---

// GET /rental/postings (Retrieve paginated/filtered list of postings)
export const getRentalPostingsPaginated = (currentPage, pageSize, status) =>
    apiClient.get("/rental/postings", {
        params: { page: currentPage, pageSize, status },
    });

// GET /rental/postings/{id}
export const getRentalPostingById = (id) =>
    apiClient.get(`/rental/postings/${id}`);

// POST /rental/postings
export const createRentalPosting = (data) =>
    apiClient.post("/rental/postings", data);

// PUT /rental/postings/{id}
export const updateRentalPosting = (id, data) =>
    apiClient.put(`/rental/postings/${id}`, data);

// DELETE /rental/postings/{id}
export const deleteRentalPosting = (id) =>
    apiClient.delete(`/rental/postings/${id}`);

// PUT /rental/postings/{id}/status (Custom route for status update)
export const updateRentalPostingStatus = (id, data) =>
    apiClient.put(`/rental/postings/status/${id}`, data);

// --- Ledger/Accounting ---

// GET /rental/ledger/data (Retrieve detailed ledger data)
export const getRentalLedger = (currentPage, pageSize, filter) =>
    apiClient.get("/rental/ledger", {
        params: { page: currentPage, pageSize, filter },
    });

// GET /rental/ledger/summary (Retrieve ledger summary statistics)
// export const getLedgerSummary = (currentPage, pageSize, filter) =>
//     apiClient.get("/rental/ledger/summary", {
//         params: { page: currentPage, pageSize, filter },
//     });

export const getRentalLedgerSummary = (currentPage, pageSize, filter) =>
    apiClient.get("/rental/rental-ledger-summary", {
        params: { page: currentPage, pageSize, filter },
    });

// (Optional) GET /rental/calculation/{partyId}/{date}
// If this route is implemented in the backend:
// export const getRentalCalculation = (partyId, date) =>
//   apiClient.get(`/rental/calculation/${partyId}/${date}`);

// --- House Party Mapping ---

export const getAllHousePartyMapping = () =>
    apiClient.get("/rental/house-party-mapping-all");

export const getHouseMappingsByParty = (partyId) =>
    apiClient.get(`/rental/house-mappings-by-party/${partyId}`);

// GET /house-party-mapping (Retrieve paginated/filtered list)
export const getHousePartyMappingPaginated = (currentPage, pageSize) =>
    apiClient.get("/rental/house-party-mapping", {
        params: { page: currentPage, pageSize },
    });

// GET /house-party-mapping/{id} (Retrieve single mapping details)
export const getHousePartyMappingById = (id) =>
    apiClient.get(`/rental/house-party-mapping/${id}`);

// POST /house-party-mapping (Create new mapping)
export const createHousePartyMapping = (data) =>
    apiClient.post("/rental/house-party-mapping", data);

// PUT /house-party-mapping/{id} (Update mapping)
export const updateHousePartyMapping = (id, data) =>
    apiClient.put(`/rental/house-party-mapping/${id}`, data);

// DELETE /house-party-mapping/{id} (Delete mapping)
export const deleteHousePartyMapping = (id) =>
    apiClient.delete(`/rental/house-party-mapping/${id}`);

// export const getRentalLedgerSummary = async (page, pageSize, filters) => {
//     // Implementation similar to getRentalLedger but for summary data
//     const response = await apiClient.get("/rental/rental-ledger-summary", {
//         params: { page, pageSize, ...filters },
//     });
//     return response.data;
// };

// export const getHouseMappingsByParty = (partyId) =>
//     apiClient.get(`/rental/house-mappings-by-party/${partyId}`);


///// Rental Mapping
export const getRentalMappingPaginated = (currentPage, pageSize) =>
    apiClient.get("/rental/rent-mapping", {
        params: { page: currentPage, pageSize },
    });

// GET /house-party-mapping/{id} (Retrieve single mapping details)
export const getRentalMappingById = (id) =>
    apiClient.get(`/rental/rent-mapping/${id}`);

// POST /house-party-mapping (Create new mapping)
export const createRentalMapping = (data) =>
    apiClient.post("/rental/rent-mapping", data);

// PUT /house-party-mapping/{id} (Update mapping)
export const updateRentalMapping = (id, data) =>
    apiClient.put(`/rental/rent-mapping/${id}`, data);

// DELETE /house-party-mapping/{id} (Delete mapping)
export const deleteRentalMapping = (id) =>
    apiClient.delete(`/rental/rent-mapping/${id}`);

export const getPartyWiseHouses = (partyId) =>
    apiClient.get(`/rental/party-wise-houses/${partyId}`);
