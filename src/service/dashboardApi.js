import apiClient from "./config";

export const getCurrency = () => apiClient.get("/dashboard/currency");

export const getAccountBalance = () => apiClient.get("/dashboard/account-balance");
export const getTotalIncomeExpense = (data) => apiClient.get("/dashboard/total-income-expence",data);
export const getTotalIncomeExpenseGraph = (data) => apiClient.post("/dashboard/total-income-expence-graph",data);

export const getTotalRental = () => apiClient.get("/dashboard/total-rental");
export const getMontlyRentalGraph = (data) => apiClient.post("/dashboard/monthly-rental-graph",data);
export const getInvestment = () => apiClient.get("/dashboard/investment");
export const getTotalLoan = () => apiClient.get("/dashboard/total-loan");



// export const financialSummary = () => apiClient.get("/dashboard/financial-summary");

export const financialSummary = (months = null) => {
  const params = {};
  if (months) {
    params.months = months;
  }
  return apiClient.get("/dashboard/financial-summary", { params });
};
