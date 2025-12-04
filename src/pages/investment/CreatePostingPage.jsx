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
  createInvestmentPosting,
  getAllInvestmentParties,
  getInvestmentCalculation,
  updateInvestmentPosting,
} from "../../service/investmentApi";

const mockDropdownData = {
  transaction_types: [
    { id: "investment", name: "Investment" },
    { id: "investment_return", name: "Investment Return" },
    { id: "investment_profit", name: "Investment Profit" },
  ],
};

const validationSchema = yup.object().shape({
  transaction_type: yup.string().required("Transaction type is required"),
  head_id: yup.string().required("Party is required"),
  payment_channel_id: yup.string().required("Payment channel is required"),
  account_id: yup.string().required("Account is required"),
  receipt_number: yup.string().notRequired(),
  amount_bdt: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  posting_date: yup.date().required("Posting date is required"),
  note: yup.string().notRequired(),
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
  const [isAvailableBalance, setIsAvailableBalance] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes, incomeExpenseHeadsRes] = await Promise.all([
          fetchAllPaymentChannels(),
          getAllInvestmentParties(),
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
      head_id: "",
      payment_channel_id: "",
      account_id: "",
      receipt_number: "",
      amount_bdt: "",
      posting_date: new Date().toISOString().split("T")[0],
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
        };

        if (postingToEdit) {
          await updateInvestmentPosting(postingToEdit?.id, payload);
          showToast.success("Posting updated successfully!");
        } else {
          await createInvestmentPosting(payload);
          showToast.success("Posting created successfully!");
        }
        resetForm();
        navigate("/investment/postings");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

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
    const calculateInvestment = async () => {
      if (
        formik.values.head_id &&
        (formik.values.transaction_type === "investment_return" ||
          formik.values.transaction_type === "investment_profit")
      ) {
        try {
          const response = await getInvestmentCalculation(
            formik.values.head_id
          );
          if (response) {
            formik.setFieldValue("investment_id", response.investment_id);
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

    calculateInvestment();
  }, [formik.values.head_id, formik.values.transaction_type]);

  useEffect(() => {
    if (postingToEdit) {
      formik.setValues({
        transaction_type: postingToEdit.entry_type || "",
        head_id: postingToEdit.head_id || "",
        payment_channel_id: postingToEdit.payment_channel_id || "",
        account_id: postingToEdit.account_id || "",
        receipt_number: postingToEdit.receipt_number || "",
        amount_bdt: postingToEdit.amount_bdt || "",
        posting_date: postingToEdit.posting_date?.split("T")[0] || "",
        note: postingToEdit.note || "",
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
      formik.values.transaction_type === "investment"
    ) {
      const enteredAmount = parseFloat(formik.values.amount_bdt);
      const available = parseFloat(isAvailableBalance);

      if (enteredAmount > available) {
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
            {postingToEdit ? "Update Investment Posting" : "Investment Posting"}
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

            <div className='relative'>
              <select
                id='head_id'
                name='head_id'
                value={formik.values.head_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value=''>Select Party</option>
                {loanInvestPartiesOptions?.map((item) => (
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
                  formik.values.payment_channel_id == 8
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

            {/* Amount BDT Input */}
            <div className='relative'>
              <input
                id='amount_bdt'
                name='amount_bdt'
                type='number'
                step='0.01'
                placeholder={"Enter Amount in BDT"}
                value={formik.values.amount_bdt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.amount_bdt && formik.errors.amount_bdt && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.amount_bdt}
                </p>
              )}
            </div>

            {/* Receipt Number Input (Optional) */}

            <div className='relative'>
              <input
                id='receipt_number'
                name='receipt_number'
                type='text'
                placeholder={"Party A/C No. (Optional)"}
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
            </div>

            {/* Posting Date Input */}
            <div className='relative'>
              <input
                id='posting_date'
                name='posting_date'
                type='date'
                value={formik.values.posting_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.posting_date && formik.errors.posting_date && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.posting_date}
                </p>
              )}
            </div>

            {/* Note Textarea */}
            <div className='relative'>
              <textarea
                id='note'
                name='note'
                placeholder='Add a note (optional)'
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='h-[40px] mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
            </div>
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
                    <span class='text-gray-500 font-medium'>Investment</span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.total_investment}
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
                    <span class='text-gray-500 font-medium'>Returned</span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.total_returns}
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
                      BDT {loanCalculationData?.remaining}
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
                    <span class='text-gray-500 font-medium'>Profit</span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.total_profit}
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
