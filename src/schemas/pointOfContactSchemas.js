import * as Yup from "yup";

export const pointOfContactFormValidationSchema = Yup.object().shape({
  contact_name: Yup.string().required("Point of contact is required"),

  contact_no: Yup.number()
    .typeError("Contact no must be a number")
    .required("Contact no is required"),

  nid: Yup.number()
    .typeError("NID must be a number")
    .required("NID is required"),
  address: Yup.string().required("Address no is required"),
});
