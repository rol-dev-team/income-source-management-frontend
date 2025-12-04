// src/api/advancedPaymentApi.js
import apiClient from "./config";

export const fetchAdvancedPayments = (currentPage, pageSize) =>
  apiClient.get("/advanced-payments", {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

export const fetchAdvancedPaymentById = (id) =>
  apiClient.get(`/advanced-payments/${id}`);

export const createAdvancedPayment = (data) =>
  apiClient.post("/advanced-payments", data);

export const updateAdvancedPayment = (id, data) =>
  apiClient.put(`/advanced-payments/${id}`, data);

export const deleteAdvancedPayment = (id) =>
  apiClient.delete(`/advanced-payments/${id}`);
