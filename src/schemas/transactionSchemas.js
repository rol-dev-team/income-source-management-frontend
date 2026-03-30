import * as Yup from "yup";

export const transactionFormValidationSchema = Yup.object().shape({
  transaction_type: Yup.string().required("Transaction type is required"),
});
