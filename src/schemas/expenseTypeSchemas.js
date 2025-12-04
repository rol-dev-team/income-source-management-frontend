import * as Yup from "yup";

export const expenseFormValidationSchema = Yup.object().shape({
  source_id: Yup.string().required("Source name is required"),
  expense_type: Yup.string().required("Expense type is required"),
});
