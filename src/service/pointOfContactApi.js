import apiClient from "./config";
export const fetchPointsOfContact = (currentPage, pageSize) =>
  apiClient.get("/points-of-contact", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchPointOfContactsBySubCatId = (subCatId) =>
    apiClient.get(`/points-of-contact/by-subcategory/${subCatId}`);
export const fetchAdvancedPaymentByPointOfContactId = (data) =>
    apiClient.post(`/advanced-payments-by-point-of-contact-id`,data);
export const fetchPointsOfContactById = (id) =>
  apiClient.get(`/points-of-contact/${id}`);
export const createPointsOfContact = (data) =>
  apiClient.post("/points-of-contact", data);
export const updatePointsOfContact = (id, data) =>
  apiClient.put(`/points-of-contact/${id}`, data);
export const deletePointsOfContact = (id) =>
  apiClient.delete(`/points-of-contact/${id}`);

// export const fetchPointOfContactsBySubCatId = (subCatId) =>
//   apiClient.get(`/points-of-contact/by-subcategory/${subCatId}`);