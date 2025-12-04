import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import {
  fetchAccountNumberByChannelId,
  checkAccountBalance,
} from "../../service/accountNumberApi";

import {
  createIncomeExpensePosting,
  getAllIncomesExpenses,
  updateIncomeExpensePosting,
} from "../../service/income-expense/incomeExpenseApi";
import {
  createLoanPosting,
  getAllLoanParties,
  getLoanCalculation,
  updateLoanPosting,
} from "../../service/loanApi";
import DatePickerInput from "../../components/common/DatePickerInput";

const mockDropdownData = {
  transaction_types: [
    { id: "loan_taken", name: "Loan Taken" },
    { id: "loan_given", name: "Loan Given" },
    { id: "loan_payment", name: "Loan Payment" },
    { id: "loan_received", name: "Loan Received" },
  ],
};

// const validationSchema = yup.object().shape({
//   transaction_type: yup.string().required("Transaction type is required"),
//   head_type: yup.string().required("Party type is required"),
//   head_id: yup.string().required("Party is required"),
//   payment_channel_id: yup.string().required("Payment channel is required"),
//   account_id: yup.string().required("Account is required"),
//   receipt_number: yup.string().notRequired(),
//   amount_bdt: yup
//     .number()
//     .required("Amount is required")
//     .positive("Amount must be positive"),
//   posting_date: yup.date().required("Posting date is required"),
//   note: yup.string().notRequired(),
//   interest_rate: yup.number().when("transaction_type", {
//     is: (val) => ["received", "payment"].includes(val),
//     then: (schema) =>
//       schema
//         .required("Interest rate is required for loan transactions")
//         .positive("Interest rate must be positive"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   term_months: yup.number().when("transaction_type", {
//     is: (val) => ["received", "payment"].includes(val),
//     then: (schema) =>
//       schema
//         .required("Term in months is required for loan transactions")
//         .positive("Term must be a positive number"),
//     otherwise: (schema) => schema.notRequired(),
//   }),

// });

const validationSchema = yup.object().shape({
  transaction_type: yup.string().required("Transaction type is required"),
  head_type: yup.string().required("Party type is required"),
  head_id: yup.string().required("Party is required"),
  payment_channel_id: yup.string().required("Payment channel is required"),
  account_id: yup.string().required("Account is required"),
  receipt_number: yup.string().notRequired(),
  amount_bdt: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  //   posting_date: yup.date().required("Posting date is required"),
  posting_date: yup.string().required("Posting Date is required"),
  note: yup.string().notRequired(),
  interest_rate: yup.number().when("transaction_type", {
    is: (val) => ["loan_taken", "loan_given"].includes(val),
    then: (schema) =>
      schema
        .required("Interest rate is required for loan transactions")
        .positive("Interest rate must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  term_months: yup.number().when("transaction_type", {
    is: (val) => ["loan_taken", "loan_given"].includes(val),
    then: (schema) =>
      schema
        .required("Term in months is required for loan transactions")
        .positive("Term must be a positive number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  installment_date: yup.number().when("transaction_type", {
    is: (val) => ["loan_taken", "loan_given"].includes(val),
    then: (schema) => schema.required("Installment date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  interest_rate_effective_date: yup.string().when("transaction_type", {
    is: (val) => ["loan_taken", "loan_given"].includes(val),
    then: (schema) =>
      schema.required(
        "Interest Rate Effective Date is required for loan transactions"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const CreatePostingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postingToEdit = location.state?.currency;

  const [loanInvestPartiesOptions, setLoanInvestPartiesOptions] = useState([]);
  const [expenseHeadOptions, setExpenseHeadOptions] = useState([]);
  const [paymentChannelOptions, setPaymentChannelOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] =
    useState(false);
  const [loanCalculationData, setLoanCalculationData] = useState([]);
  const [loanDueDateOptions, setLoanDueDateOptions] = useState([]);
  const [dateInputType, setDateInputType] = useState("text");
  const [isAvailableBalance, setIsAvailableBalance] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    setLoanDueDateOptions(days);
  }, []);
  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes, incomeExpenseHeadsRes] = await Promise.all([
          fetchAllPaymentChannels(),
          getAllLoanParties(),
        ]);

        setPaymentChannelOptions(paymentChannelRes.data || []);
        setLoanInvestPartiesOptions(incomeExpenseHeadsRes.data || []);
      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      transaction_type: "",
      head_type: "",
      head_id: "",
      payment_channel_id: "",
      account_id: "",
      receipt_number: "",
      amount_bdt: "",
      extra_charge: "",
      //   posting_date: new Date().toISOString().split("T")[0],
      posting_date: "",
      note: "",
      interest_rate: "",
      //   interest_rate_effective_date: new Date().toISOString().split("T")[0],
      interest_rate_effective_date: "",
      term_months: "",
      installment_date: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
        };

        if (postingToEdit) {
          await updateLoanPosting(postingToEdit?.id, payload);
          showToast.success("Posting updated successfully!");
        } else {
          await createLoanPosting(payload);
          showToast.success("Posting created successfully!");
        }
        resetForm();
        navigate("/loan/postings");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    if (formik.values.transaction_type === "loan_given") {
      formik.setFieldValue("head_type", "party");
    } else {
      formik.setFieldValue("head_type", "");
      formik.setFieldValue("head_id", "");
    }
  }, [formik.values.transaction_type]);

  useEffect(() => {
    const loadAccountOptions = async () => {
      if (!formik.values.payment_channel_id) {
        setAccountOptions([]);
        return;
      }
      setIsAccountNoDependentLoading(true);
      try {
        const { data } = await fetchAccountNumberByChannelId(
          formik.values.payment_channel_id
        );
        setAccountOptions(data || []);
      } catch (error) {
        showToast.error("Failed to load account options.");
      } finally {
        setIsAccountNoDependentLoading(false);
      }
    };
    loadAccountOptions();
  }, [formik.values.payment_channel_id]);

  useEffect(() => {
    const calculateLoan = async () => {
      if (
        formik.values.head_id &&
        formik.values.posting_date &&
        (formik.values.transaction_type === "loan_payment" ||
          formik.values.transaction_type === "loan_received")
      ) {
        try {
          const response = await getLoanCalculation(
            formik.values.head_id,
            formik.values.posting_date
          );
          if (response) {
            formik.setFieldValue("loan_id", response.loan_id);
            formik.setFieldValue("interest_rate_id", response.interest_rate_id);
            setLoanCalculationData(response);
          }
        } catch (error) {
          showToast.error("Failed to fetch loan calculation.");
          setLoanCalculationData(null);
        }
      } else {
        setLoanCalculationData(null);
      }
    };

    calculateLoan();
  }, [formik.values.head_id, formik.values.posting_date]);

  useEffect(() => {
    if (postingToEdit) {
      formik.setValues({
        transaction_type: postingToEdit.entry_type || "",
        head_type: postingToEdit.head_type || "",
        head_id: postingToEdit.head_id || "",
        payment_channel_id: postingToEdit.payment_channel_id || "",
        account_id: postingToEdit.account_id || "",
        receipt_number: postingToEdit.receipt_number || "",
        amount_bdt: postingToEdit.amount_bdt || "",
        extra_charge: postingToEdit.extra_charge || "",
        posting_date: postingToEdit.posting_date?.split("T")[0] || "",
        interest_rate_effective_date:
          postingToEdit.effective_date?.split("T")[0] || "",
        note: postingToEdit.note || "",
        interest_rate: postingToEdit.interest_rate || "",
        term_months: postingToEdit.term_months || "",
        installment_date: postingToEdit.installment_date || "",
      });
    }
  }, [postingToEdit, formik.setValues]);

  const handlePaymentChannelChange = (e) => {
    const selectedPaymentChannelId = e.target.value;
    formik.handleChange(e);
    if (selectedPaymentChannelId == 8) {
      formik.setFieldValue("account_id", 1);
    } else {
      formik.setFieldValue("account_id", "");
    }
  };
  const filteredParties = loanInvestPartiesOptions.filter(
    (party) => party.type === formik.values.head_type
  );

  useEffect(() => {
    if (!formik.values.account_id) {
      setIsAvailableBalance(null);
      return;
    }

    checkAccountBalance(formik.values.account_id)
      .then((res) => {
        setIsAvailableBalance(res.data);
      })
      .catch((err) => console.log(err));
  }, [formik.values.account_id]);

  useEffect(() => {
    if (
      formik.values.amount_bdt &&
      isAvailableBalance !== null &&
      (formik.values.transaction_type === "loan_payment" ||
        formik.values.transaction_type === "loan_given")
    ) {
      const enteredAmount = Number(formik.values.amount_bdt) || 0;
      const extraChargeAmount = Number(formik.values.extra_charge) || 0;
      const finalTotalAmount = enteredAmount + extraChargeAmount;

      const available = parseFloat(isAvailableBalance);

      if (finalTotalAmount > available) {
        showToast.error("Insufficient balance! Please enter a smaller amount.");
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }
  }, [
    formik.values.amount_bdt,
    isAvailableBalance,
    formik.values.transaction_type,
  ]);

  return (
    <div className='container mx-auto p-4'>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-xl font-bold mb-6 text-gray-800'>
            {postingToEdit ? "Update Loan Posting" : "Loan Posting"}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            {/* Transaction Type Dropdown */}
            <div className='relative'>
              <select
                id='transaction_type'
                name='transaction_type'
                value={formik.values.transaction_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!postingToEdit}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  Transaction Type
                </option>
                {mockDropdownData.transaction_types.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formik.touched.transaction_type &&
                formik.errors.transaction_type && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.transaction_type}
                  </p>
                )}
            </div>

            {formik.values.transaction_type !== "loan_given" &&
              formik.values.transaction_type !== "" && (
                <div className='relative'>
                  <select
                    id='head_type'
                    name='head_type'
                    value={formik.values.head_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!!postingToEdit}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                    <option value=''>
                      {formik.values.transaction_type === "loan_taken"
                        ? "Loan Provider"
                        : formik.values.transaction_type === "loan_given"
                        ? "Loan Receiver"
                        : "Select Party Type"}
                    </option>
                    <option value='bank'>Bank</option>
                    <option value='party'>Party</option>
                  </select>
                  {formik.touched.head_type && formik.errors.head_type && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.head_type}
                    </p>
                  )}
                </div>
              )}

            <div className='relative'>
              <select
                id='head_id'
                name='head_id'
                value={formik.values.head_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!postingToEdit}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value=''>
                  {formik.values.head_type === "bank"
                    ? "Select Bank"
                    : "Select Party"}
                </option>
                {filteredParties?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.party_name}
                  </option>
                ))}
              </select>
              {formik.touched.head_id && formik.errors.head_id && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.head_id}
                </p>
              )}
            </div>

            {/* Payment Channel Dropdown */}
            <div className='relative'>
              <select
                id='payment_channel_id'
                name='payment_channel_id'
                value={formik.values.payment_channel_id}
                onChange={handlePaymentChannelChange}
                onBlur={formik.handleBlur}
                disabled={!!postingToEdit}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  My Payment Channel
                </option>
                {paymentChannelOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.method_name}
                  </option>
                ))}
              </select>
              {formik.touched.payment_channel_id &&
                formik.errors.payment_channel_id && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.payment_channel_id}
                  </p>
                )}
            </div>

            {/* Account Number Dropdown */}
            <div className='relative'>
              <select
                id='account_id'
                name='account_id'
                value={formik.values.account_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={
                  isAccountNoDependentLoading ||
                  formik.values.payment_channel_id == 8 ||
                  !!postingToEdit
                }
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  My A/C No.
                </option>
                {accountOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ac_no} - {item.ac_name}
                  </option>
                ))}
              </select>
              {formik.touched.account_id && formik.errors.account_id && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.account_id}
                </p>
              )}
            </div>

            {/* Receipt Number Input (Optional) */}

            {/* <div className='relative'>
              <input
                id='receipt_number'
                name='receipt_number'
                type='text'
                placeholder={
                  formik.values.transaction_type === "income"
                    ? "Received From A/C No. (Optional)"
                    : "Payment To A/C No. (Optional)"
                }
                value={formik.values.receipt_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.receipt_number &&
                formik.errors.receipt_number && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.receipt_number}
                  </p>
                )}
            </div> */}

            {/* Conditional Loan Fields */}
            {(["loan_taken", "loan_given"].includes(
              formik.values.transaction_type
            ) ||
              !!postingToEdit) && (
              <>
                <div className='relative'>
                  <input
                    id='term_months'
                    name='term_months'
                    type='number'
                    placeholder={"Enter Term in Months"}
                    value={formik.values.term_months}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!!postingToEdit}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  />
                  {formik.touched.term_months && formik.errors.term_months && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.term_months}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Amount BDT Input */}
            <div className='relative'>
              <input
                id='amount_bdt'
                name='amount_bdt'
                type='number'
                step='0.01'
                placeholder={"Enter Loan Amount in BDT"}
                value={formik.values.amount_bdt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!postingToEdit}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.amount_bdt && formik.errors.amount_bdt && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.amount_bdt}
                </p>
              )}
            </div>

            <div className='relative'>
              <DatePickerInput
              key={formik.values.posting_date}
                onDateChange={(date) => {
                  if (!date) {
                    formik.setFieldValue("posting_date", "");
                    return;
                  }
                  const localDate = new Date(date);
                  const year = localDate.getFullYear();
                  const month = String(localDate.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day = String(localDate.getDate()).padStart(2, "0");
                  formik.setFieldValue(
                    "posting_date",
                    `${year}-${month}-${day}`
                  );
                }}
                placeholderText='Loan Posting Date'
                initialDate={formik.values.posting_date || ""}
              />
              {formik.touched.posting_date && formik.errors.posting_date && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.posting_date}
                </p>
              )}
            </div>

            {(["loan_taken", "loan_given"].includes(
              formik.values.transaction_type
            ) ||
              !!postingToEdit) && (
              <>
                <div className='relative'>
                  <input
                    id='interest_rate'
                    name='interest_rate'
                    type='number'
                    step='0.01'
                    placeholder={"Enter Interest Rate (%)"}
                    value={formik.values.interest_rate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  />
                  {formik.touched.interest_rate &&
                    formik.errors.interest_rate && (
                      <p className='mt-1 text-sm text-red-500'>
                        {formik.errors.interest_rate}
                      </p>
                    )}
                </div>

                {/* <div className='relative'>
                  <input
                    id='interest_rate_effective_date'
                    name='interest_rate_effective_date'
                    placeholder='Interest Effective Date'
                    type='date'
                    value={formik.values.interest_rate_effective_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  />
                  {formik.touched.interest_rate_effective_date &&
                    formik.errors.interest_rate_effective_date && (
                      <p className='mt-1 text-sm text-red-500'>
                        {formik.errors.interest_rate_effective_date}
                      </p>
                    )}
                </div> */}
                <div className='relative'>
                  <DatePickerInput
                  key={formik.values.interest_rate_effective_date}
                    onDateChange={(date) => {
                      if (!date) {
                        formik.setFieldValue(
                          "interest_rate_effective_date",
                          ""
                        );

                        return;
                      }
                      const localDate = new Date(date);
                      const year = localDate.getFullYear();
                      const month = String(localDate.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(localDate.getDate()).padStart(2, "0");
                      formik.setFieldValue(
                        "interest_rate_effective_date",
                        `${year}-${month}-${day}`
                      );
                    }}
                    placeholderText='Interest Rate Effective Date'
                    initialDate={
                      formik.values.interest_rate_effective_date || ""
                    }
                  />
                  {formik.touched.interest_rate_effective_date &&
                    formik.errors.interest_rate_effective_date && (
                      <p className='mt-1 text-sm text-red-500'>
                        {formik.errors.interest_rate_effective_date}
                      </p>
                    )}
                </div>

                {/* <div className='relative'>
                  <input
                    id='term_months'
                    name='term_months'
                    type='number'
                    placeholder={"Enter Term in Months"}
                    value={formik.values.term_months}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!!postingToEdit}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  />
                  {formik.touched.term_months && formik.errors.term_months && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.term_months}
                    </p>
                  )}
                </div> */}
              </>
            )}

            {/* Posting Date Input */}
            {/* <div className='relative'>
              <input
                id='posting_date'
                name='posting_date'
                type='date'
                value={formik.values.posting_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!postingToEdit}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.posting_date && formik.errors.posting_date && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.posting_date}
                </p>
              )}
            </div> */}

            {(["loan_taken", "loan_given"].includes(
              formik.values.transaction_type
            ) ||
              !!postingToEdit) && (
              <div className='relative'>
                <input
                  id='extra_charge'
                  name='extra_charge'
                  type='number'
                  step='0.01'
                  placeholder={"Enter Extra Charge in BDT"}
                  value={formik.values.extra_charge}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!!postingToEdit}
                  className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                />
              </div>
            )}

            {["loan_taken", "loan_given"].includes(
              formik.values.transaction_type
            ) && (
              <div className='relative'>
                <select
                  id='installment_date'
                  name='installment_date'
                  value={formik.values.installment_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!!postingToEdit}
                  className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                  <option value=''>Installment Date</option>
                  {loanDueDateOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {formik.touched.installment_date &&
                  formik.errors.installment_date && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.installment_date}
                    </p>
                  )}
              </div>
            )}

            {/* Note Textarea */}
            {/* <div className='relative col-span-1 md:col-span-2'> */}
            <div className='relative'>
              <textarea
                id='note'
                name='note'
                placeholder='Add a note (optional)'
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!!postingToEdit}
                className='h-[40px] mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
            </div>
            {/* Calculate Loan Button */}
            {loanCalculationData && (
              <div class='relative col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-4 flex items-center justify-between flex-wrap text-sm w-full'>
                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-green-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>
                      Principal Amount
                    </span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.loan_principal_amount}
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-yellow-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1.5-12.5a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0v-5z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>Payable</span>
                    <span class='text-gray-900 font-bold'>
                      BDT{" "}
                      {loanCalculationData?.loan_principal_amount_with_interest}
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-purple-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>Payment</span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.total_payments}
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-blue-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>Remaining</span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.remaining_balance}
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-purple-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>
                      Installment / Month
                    </span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.per_month}
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-orange-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>Total Term</span>
                    <span class='text-gray-900 font-bold'>
                      {loanCalculationData?.total_term} Months
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-red-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>
                      Remaining Term
                    </span>
                    <span class='text-gray-900 font-bold'>
                      {loanCalculationData?.remaining_term} Months
                    </span>
                  </div>
                </div>

                <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-pink-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>
                      Interest Rate %
                    </span>
                    <span class='text-gray-900 font-bold'>
                      {loanCalculationData?.interest_rate} %
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='mt-6 flex justify-end'>
            <button
              disabled={
                loanCalculationData?.remaining_balance === 0 || isDisabled
              }
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105'>
              {postingToEdit ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostingPage;
