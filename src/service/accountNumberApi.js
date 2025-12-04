import apiClient from "./config";
export const fetchAccountNumber = (currentPage, pageSize) =>
  apiClient.get("/payment-account-number", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

export const fetchAccountNumberById = (id) =>
  apiClient.get(`/payment-account-number/${id}`);
export const fetchAccountNumberByChannelId = (id) =>
  apiClient.get(`/payment/account-numbers/channel/${id}`);
export const createAccountNumber = (data) =>
  apiClient.post("/payment-account-number", data);
export const updateAccountNumber = (id, data) =>
  apiClient.put(`/payment-account-number/${id}`, data);
export const deleteAccountNumber = (id) =>
  apiClient.delete(`/payment-account-number/${id}`);

export const fetchAllAccountNumber = () => apiClient.get(`/account-number-all`);

export const checkAccountBalance = (account_id) =>
  apiClient.get(`/balance/${account_id}`);
