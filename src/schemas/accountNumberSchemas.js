import * as Yup from "yup";

export const accountNumberFormValidationSchema = Yup.object().shape({
  channel_detail_id: Yup.string().required("Channel name is required"),
  ac_no: Yup.number()
    .typeError("Account Number must be a number")
    .required("Account Number is required"),
});
