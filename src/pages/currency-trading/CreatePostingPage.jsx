import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import DatePickerInput from "../../components/common/DatePickerInput";
import {
  createCurrencyPosting,
  getAllCurrencies,
  getAllCurrencyParties,
  updateCurrencyPosting,
} from "../../service/currency-trading/currencyApi";
import {
  fetchAccountNumberByChannelId,
  checkAccountBalance,
} from "../../service/accountNumberApi";

const mockDropdownData = {
  transaction_types: [
    { id: "buy", name: "Buy" },
    { id: "sell", name: "Sell" },
    { id: "payment", name: "Payment" },
    { id: "received", name: "Received" },
  ],
};

const validationSchema = yup.object().shape({
  transaction_type: yup.string().required("Transaction type is required"),
  currency_id: yup.string().when("transaction_type", {
    is: (transaction_type) =>
      transaction_type !== "payment" && transaction_type !== "received",
    then: (schema) => schema.required("Currency is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  currency_party_id: yup.string().required("Currency party is required"),
  payment_channel_id: yup.string().required("Payment channel is required"),
  account_id: yup.string().required("Account is required"),
  party_account_number: yup.string().notRequired(),
  currency_amount: yup.number().when("transaction_type", {
    is: (transaction_type) =>
      transaction_type !== "payment" && transaction_type !== "received",
    then: (schema) =>
      schema
        .required("Currency amount is required")
        .positive("Amount must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  exchange_rate: yup.number().when("transaction_type", {
    is: (transaction_type) =>
      transaction_type !== "payment" && transaction_type !== "received",
    then: (schema) =>
      schema
        .required("Exchange rate is required")
        .positive("Rate must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  amount_bdt: yup
    .number()
    .required("BDT amount is required")
    .positive("Amount must be positive"),
  posting_date: yup.string().required("Posting date is required"),
  note: yup.string().notRequired(),
});

const CreatePostingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postingToEdit = location.state?.currency;
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [partyOptions, setPartyOptions] = useState([]);
  const [paymentChannelOptions, setPaymentChannelOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] =
    useState(false);
  const [isAvailableBalance, setIsAvailableBalance] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [currenciesRes, partiesRes, paymentChannelRes] =
          await Promise.all([
            getAllCurrencies(),
            getAllCurrencyParties(),
            fetchAllPaymentChannels(),
          ]);

        setCurrencyOptions(currenciesRes.data || []);
        setPartyOptions(partiesRes.data || []);
        setPaymentChannelOptions(paymentChannelRes.data || []);
      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      transaction_type: "",
      currency_id: "",
      currency_party_id: "",
      payment_channel_id: "",
      account_id: "",
      party_account_number: "",
      currency_amount: "",
      exchange_rate: "",
      amount_bdt: "",
      posting_date: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (postingToEdit) {
          const response = await updateCurrencyPosting(
            postingToEdit?.id,
            values
          );
          showToast.success(response?.message || "Party updated successfully!");
        } else {
          const response = await createCurrencyPosting(values);
          showToast.success(
            response?.message || "Posting created successfully!"
          );
        }

        resetForm();
        navigate("/currency-trading/posting");
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
    const showCurrencyFields =
      formik.values.transaction_type !== "payment" &&
      formik.values.transaction_type !== "received";

    if (showCurrencyFields) {
      const foreign = parseFloat(formik.values.currency_amount);
      const rate = parseFloat(formik.values.exchange_rate);

      if (!isNaN(foreign) && !isNaN(rate) && foreign >= 0 && rate >= 0) {
        const newTotalAmount = (foreign * rate).toFixed(2);
        formik.setFieldValue("amount_bdt", newTotalAmount);
      } else {
        formik.setFieldValue("amount_bdt", "");
      }
    }
  }, [
    formik.values.currency_amount,
    formik.values.exchange_rate,
    formik.values.transaction_type,
  ]);

  useEffect(() => {
    if (postingToEdit) {
      formik.setValues({
        transaction_type: postingToEdit.transaction_type,
        currency_id: postingToEdit.currency_id,
        currency_party_id: postingToEdit.currency_party_id,
        payment_channel_id: postingToEdit.payment_channel_id,
        account_id: postingToEdit.account_id,
        party_account_number: postingToEdit.party_account_number || "",
        currency_amount: postingToEdit.currency_amount,
        exchange_rate: postingToEdit.exchange_rate,
        amount_bdt: postingToEdit.amount_bdt,
        posting_date: postingToEdit.posting_date,
        note: postingToEdit.note || "",
      });
    }
  }, [postingToEdit, formik.setFieldValue]);

  useEffect(() => {
    if (formik.values.payment_channel_id == 8) {
      formik.setFieldValue("account_id", 1);
    }
  }, [formik.values.payment_channel_id]);

  const showCurrencyFields =
    formik.values.transaction_type !== "payment" &&
    formik.values.transaction_type !== "received";
  const formTitle = postingToEdit
    ? "Update Currency Trading"
    : "Currency Trading";

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
      (formik.values.transaction_type === "payment" ||
        formik.values.transaction_type === "sell")
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
          <h4 className='text-xl font-bold mb-6 text-gray-800'>{formTitle}</h4>
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

            {/* Conditional Currency Fields */}
            {showCurrencyFields && (
              <>
                {/* Currency Dropdown */}
                <div className='relative'>
                  <select
                    id='currency_id'
                    name='currency_id'
                    value={formik.values.currency_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                    <option value='' disabled>
                      Currency
                    </option>
                    {currencyOptions?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.currency}
                      </option>
                    ))}
                  </select>
                  {formik.touched.currency_id && formik.errors.currency_id && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.currency_id}
                    </p>
                  )}
                </div>

                {/* Currency Amount Input */}
                <div className='relative'>
                  <input
                    id='currency_amount'
                    name='currency_amount'
                    type='number'
                    step='0.01'
                    placeholder='Enter Currency Amount'
                    value={formik.values.currency_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
                  />
                  {formik.touched.currency_amount &&
                    formik.errors.currency_amount && (
                      <p className='mt-1 text-sm text-red-500'>
                        {formik.errors.currency_amount}
                      </p>
                    )}
                </div>

                {/* Exchange Rate Input */}
                <div className='relative'>
                  <input
                    id='exchange_rate'
                    name='exchange_rate'
                    type='number'
                    step='0.01'
                    placeholder='Enter Exchange Rate'
                    value={formik.values.exchange_rate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
                  />
                  {formik.touched.exchange_rate &&
                    formik.errors.exchange_rate && (
                      <p className='mt-1 text-sm text-red-500'>
                        {formik.errors.exchange_rate}
                      </p>
                    )}
                </div>
              </>
            )}

            {/* BDT Amount field */}
            <div className='relative'>
              <input
                id='amount_bdt'
                name='amount_bdt'
                type='number'
                step='0.01'
                placeholder={
                  formik.values.transaction_type === "payment"
                    ? "Enter Paid Amount in BDT"
                    : formik.values.transaction_type === "received"
                    ? "Enter Received Amount in BDT"
                    : "Enter Amount in BDT"
                }
                value={formik.values.amount_bdt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
              />
              {formik.touched.amount_bdt && formik.errors.amount_bdt && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.amount_bdt}
                </p>
              )}
            </div>

            <div className='relative'>
              <select
                id='currency_party_id'
                name='currency_party_id'
                value={formik.values.currency_party_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  Party
                </option>
                {partyOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.party_name}
                  </option>
                ))}
              </select>
              {formik.touched.currency_party_id &&
                formik.errors.currency_party_id && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.currency_party_id}
                  </p>
                )}
            </div>

            <div className='relative'>
              <select
                id='payment_channel_id'
                name='payment_channel_id'
                value={formik.values.payment_channel_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  Payment Channel
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

            <div className='relative'>
              <select
                id='account_id'
                name='account_id'
                value={formik.values.account_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.values.payment_channel_id == 8}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  My A/C No.
                </option>
                {accountOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ac_no}{" "}
                    {formik.values.payment_channel_id == 8 ? "" : "-"}{" "}
                    {item.ac_name}
                  </option>
                ))}
              </select>
              {formik.touched.account_id && formik.errors.account_id && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.account_id}
                </p>
              )}
            </div>

            <div className='relative'>
              <input
                id='party_account_number'
                name='party_account_number'
                type='text'
                placeholder='Enter Party A/C No. (optional)'
                value={formik.values.party_account_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
              />
              {formik.touched.party_account_number &&
                formik.errors.party_account_number && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.party_account_number}
                  </p>
                )}
            </div>

            {/* <div className='relative'>
              <input
                id='posting_date'
                name='posting_date'
                type='date'
                value={formik.values.posting_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
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

            <div className='relative col-span-1 md:col-span-2'>
              <textarea
                id='note'
                name='note'
                placeholder='Add a note (optional)'
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 transition duration-150 ease-in-out'
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <button
              disabled={isDisabled}
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
