import apiClient from "./config";
export const fetchPaymentChannel = (currentPage, pageSize) =>
  apiClient.get("/payment-channels", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchAllPaymentMode = () =>
    apiClient.get(`/payment-mode-list`);
export const fetchPaymentChannelById = (id) =>
  apiClient.get(`/payment-channels/${id}`);
export const createPaymentChannel = (data) =>
  apiClient.post("/payment-channels", data);
export const updatePaymentChannel = (id, data) =>
  apiClient.put(`/payment-channels/${id}`, data);
export const deletePaymentChannel = (id) =>
  apiClient.delete(`/payment-channels/${id}`);
