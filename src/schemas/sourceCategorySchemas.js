import * as Yup from "yup";

export const sourceCategoryFormValidationSchema = Yup.object().shape({
  source_id: Yup.string().required("Source name is required"),
  cat_name: Yup.string().required("Category name is required"),
});
