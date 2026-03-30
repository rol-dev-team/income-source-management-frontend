import apiClient from "./config";
export const fetchPaymentChannelDetails = (currentPage, pageSize) =>
  apiClient.get("/payment-channels-details", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
export const fetchAllPaymentChannels = () =>
    apiClient.get(`/payment-channels-list`);
export const fetchPaymentChannelDetailsById = (id) =>
  apiClient.get(`/payment-channels-details/${id}`);
export const createPaymentChannelDetails = (data) =>
  apiClient.post("/payment-channels-details", data);
export const updatePaymentChannelDetails = (id, data) =>
  apiClient.put(`/payment-channels-details/${id}`, data);
export const deletePaymentChannelDetails = (id) =>
  apiClient.delete(`/payment-channels-details/${id}`);
