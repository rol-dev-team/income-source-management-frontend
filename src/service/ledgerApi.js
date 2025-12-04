import apiClient from "./config";
export const fetchTransactions = async (filters) => {
  const { transaction_type, category_id, subcategory_id,point_of_contact, account_number, startDate, endDate } =
    filters;
  const params = {
    transaction_type,
    category_id,
    subcategory_id,
    point_of_contact,
    account_number,
    start_date: startDate,
    end_date: endDate,
  };

  const res = await apiClient.get("/transactions", { params });

  return {
    transactions: res.data.transactions,
    summary: res.data.summary,
    pagination: res.data.pagination,
  };
};
