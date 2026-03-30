import * as Yup from "yup";

export const sourceSubCategoryDetailFormValidationSchema = Yup.object().shape({
  source_id: Yup.string().required("Source name is required"),
  source_cat_id: Yup.string().required("Source Category name is required"),
  source_subcat_id: Yup.string().required(
    "Source sub Category name is required"
  ),
  point_of_contact_id: Yup.string().required(
    "Point of contact name is required"
  ),
});
