export const postingFormFields = [
  {
    name: "transaction_type_id",
    label: "Transaction",
    type: "select",
    placeholder: "Select Transaction Type",
    options: [],
  },
  {
    name: "source_id",
    label: "Source",
    type: "select",
    placeholder: "Select Source",
    options: [],
  },
  {
    name: "source_cat_id",
    label: "Category",
    type: "select",
    placeholder: "Select Source Category",
    options: [],
  },
  {
    name: "source_subcat_id",
    label: "Sub-Category",
    type: "select",
    placeholder: "Select Source Sub-Category",
    options: [],
  },
  {
    name: "expense_type",
    label: "Expense Type",
    type: "select",
    placeholder: "Expense Type",
    options: [],
    showIf: (formValues) => formValues.transaction_type_id === 2,
  },
  {
    name: "point_of_contact_id",
    label: "Contact",
    type: "select",
    placeholder: "Select Point of Contact",
    options: [],
  },

  {
    name: "channel_detail_id",
    label: "Payment Channel",
    type: "select",
    placeholder: "Select Payment Channel",
    options: [],
  },
  {
    name: "recived_ac",
    label: "Received Account",
    type: "text",
    placeholder: "Enter Received A/C",
  },
  {
    name: "from_ac",
    label: "From Account",
    type: "text",
    placeholder: "Enter From A/C",
  },
  {
    name: "posting_date",
    label: "Posting Date",
    type: "date",
    placeholder: "Select Posting Date",
  },
  {
    name: "total_amount",
    label: "Amount",
    type: "text",
    placeholder: "Enter Amount",
  },
  { name: "isUnitPrice", label: "Unit Price", type: "checkbox" },
  {
    name: "exchange_rate",
    label: "Exchange Rate",
    type: "text",
    placeholder: "Enter Exchange Rate",
  },
  {
    name: "foreign_currency",
    label: "Foreign Currency",
    type: "text",
    placeholder: "Enter foreign currency",
  },


  {
    name: "note",
    label: "Note",
    type: "textarea",
    placeholder: "Add a note...",
  },
];
