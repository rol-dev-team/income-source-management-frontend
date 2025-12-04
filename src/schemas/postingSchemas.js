import * as Yup from "yup";

export const postingFormValidationSchema = Yup.object().shape({
  source_id: Yup.string().required("Source name is required").trim(),
  source_cat_id: Yup.string()
    .required("Source category name is required")
    .trim(),
  source_subcat_id: Yup.string()
    .required("Source sub-category name is required")
    .trim(),
  point_of_contact_id: Yup.string()
    .required("Point of contact name is required")
    .trim(),
  transaction_type_id: Yup.string()
    .required("Transaction type is required")
    .trim(),
  channel_detail_id: Yup.string()
    .required("Payment channel details is required")
    .trim(),
  // recived_ac: Yup.string()
  //   .required("Received account number is required")
  //   .matches(/^[0-9]+$/, "Received account number must be digits only")
  //   .trim(),
  // from_ac: Yup.string()
  //   .required("From account number is required")
  //   .matches(/^[0-9]+$/, "From account number must be digits only")
  //   .trim(),

  isUnitPrice: Yup.boolean(),

  foreign_currency: Yup.number()
    .nullable(true) // Allows the value to be null
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    ) // Transforms empty strings to null
    .when("isUnitPrice", {
      is: true,
      then: (schema) => schema.required("Foreign currency is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  exchange_rate: Yup.number()
    .nullable(true) // Allows the value to be null
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    ) // Transforms empty strings to null
    .when("isUnitPrice", {
      is: true,
      then: (schema) => schema.required("Exchange rate is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  posting_date: Yup.date()
    .typeError("Posting date must be a valid date")
    .required("Posting date is required"),
});
