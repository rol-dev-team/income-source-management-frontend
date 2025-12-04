import * as Yup from "yup";

export const userFormValidationSchema = Yup.object().shape({
  full_name: Yup.string().trim().required("Full Name is required"),
  username: Yup.string().trim().required("Username is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 6 characters"),
  // .matches(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{6,}$/,
  //   "Password must contain uppercase, lowercase, number, and special character"
  // )
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  role: Yup.string().required("Role is required"),
});
