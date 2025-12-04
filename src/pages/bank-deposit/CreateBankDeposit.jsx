import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import { fetchAccountNumberByChannelId } from "../../service/accountNumberApi";
import DatePickerInput from "../../components/common/DatePickerInput";
import {
  createIncomeExpensePosting,
  getAllIncomesExpenses,
  updateIncomeExpensePosting,
} from "../../service/income-expense/incomeExpenseApi";
import {
  createBankDepositPosting,
  updateBankDepositPosting,
} from "../../service/bankDepositApi";

const validationSchema = yup.object().shape({
  transaction_type: yup.string().required("Transaction type is required"),
  payment_channel_id: yup.string().required("Payment channel is required"),
  account_id: yup.string().required("Account is required"),
  amount_bdt: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  posting_date: yup.string().required("Posting date is required"),
  note: yup.string().notRequired(),
});

const CreateBankDeposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postingToEdit = location.state?.currency;

  const [incomeExpenseHeadOptions, setIncomeExpenseHeadOptions] = useState([]);
  const [expenseHeadOptions, setExpenseHeadOptions] = useState([]);
  const [paymentChannelOptions, setPaymentChannelOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] =
    useState(false);

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes, incomeExpenseHeadsRes] = await Promise.all([
          fetchAllPaymentChannels(),
          getAllIncomesExpenses(),
        ]);

        setPaymentChannelOptions(paymentChannelRes.data || []);
        setIncomeExpenseHeadOptions(incomeExpenseHeadsRes.data || []);
      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      transaction_type: "received",
      payment_channel_id: "",
      account_id: "",
      amount_bdt: "",
      // posting_date: new Date().toISOString().split("T")[0],
      posting_date: "",
      note: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      
      try {
        const payload = {
          ...values,
        };

        if (postingToEdit) {
          await updateBankDepositPosting(postingToEdit?.id, payload);
          showToast.success("Posting updated successfully!");
        } else {
          await createBankDepositPosting(payload);
          showToast.success("Posting created successfully!");
        }
        resetForm();
        navigate("/bank-deposit");
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
    if (postingToEdit) {
      formik.setValues({
        transaction_type: postingToEdit.transaction_type,
        payment_channel_id: postingToEdit.payment_channel_id,
        account_id: postingToEdit.account_id,
        amount_bdt: postingToEdit.amount_bdt,
        posting_date: postingToEdit.posting_date,
        note: postingToEdit.note || "",
      });
    }
  }, [postingToEdit, formik.setFieldValue]);

 

  const handlePaymentChannelChange = (e) => {
    const selectedPaymentChannelId = e.target.value;
    formik.handleChange(e);
    if (selectedPaymentChannelId == 8) {
      formik.setFieldValue("account_id", 1);
    } else {
      formik.setFieldValue("account_id", "");
    }
  };
  return (
    <div className='container mx-auto p-4'>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-xl font-bold mb-6 text-gray-800'>
            {postingToEdit
              ? "Update Bank Deposit Posting"
              : "Bank Deposit Posting"}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
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
                  Payment Channel
                </option>posting_date
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

            {/* Posting Date Input */}
            {/* <div className='relative'>
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
            </div> */}

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
                placeholderText='Posting Date'
                initialDate={formik.values.posting_date || ""}
              />
              {formik.touched.posting_date && formik.errors.posting_date && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.posting_date}
                </p>
              )}
            </div>

            {/* Note Textarea */}
            <div className='relative col-span-1 md:col-span-2'>
              <textarea
                id='note'
                name='note'
                placeholder='Add a note (optional)'
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24'
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <button
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

export default CreateBankDeposit;
