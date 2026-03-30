import * as Yup from "yup";

export const sourceSubCategoryFormValidationSchema = Yup.object().shape({
  source_id: Yup.string().required("Source name is required"),
  subcat_name: Yup.string().required("Sub Category name is required"),
});
