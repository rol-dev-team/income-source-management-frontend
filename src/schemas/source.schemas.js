import * as Yup from "yup";

export const sourceFormValidationSchema = Yup.object().shape({
  source_name: Yup.string().trim().required("Name is required"),
});
