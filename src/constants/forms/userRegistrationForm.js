export const userFormFields = [
  {
    name: "full_name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter username",
  },
  { name: "email", label: "Email", type: "email", placeholder: "Email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
  },
];
