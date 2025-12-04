import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import {
  checkAccountBalance,
  fetchAccountNumberByChannelId,
} from "../../service/accountNumberApi";
import { createTransfer, updateTransfer } from "../../service/transferApi";
import DatePickerInput from "../../components/common/DatePickerInput";

const validationSchema = yup.object().shape({
  from_payment_channel_id: yup
    .string()
    .required("From Payment channel is required"),
  from_account_id: yup.string().required("From Account is required"),
  to_payment_channel_id: yup
    .string()
    .required("To Payment channel is required"),
  to_account_id: yup.string().required("To Account is required"),
  amount_bdt: yup
    .number()
    .required("BDT amount is required")
    .positive("Amount must be positive"),
  transfer_date: yup.string().required("Transfer date is required"),
  note: yup.string().notRequired(),
});

const CreatePostingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postingToEdit = location.state?.currency;
  const [fromPaymentChannelOptions, setFromPaymentChannelOptions] = useState(
    []
  );
  const [toPaymentChannelOptions, setToPaymentChannelOptions] = useState([]);
  const [fromAccountOptions, setFromAccountOptions] = useState([]);
  const [toAccountOptions, setToAccountOptions] = useState([]);
  const [isAvailableBalance, setIsAvailableBalance] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes] = await Promise.all([
          fetchAllPaymentChannels(),
        ]);

        setFromPaymentChannelOptions(paymentChannelRes.data || []);
        setToPaymentChannelOptions(paymentChannelRes.data || []);
      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      from_payment_channel_id: "",
      from_account_id: "",
      to_payment_channel_id: "",
      to_account_id: "",
      amount_bdt: "",
      transfer_date: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (postingToEdit) {
          const response = await updateTransfer(postingToEdit?.id, values);
          showToast.success(response?.message || "Updated successfully!");
        } else {
          const response = await createTransfer(values);
          showToast.success(response?.message || "Created successfully!");
        }
        resetForm();
        navigate("/transfer");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    const loadFromAccountOptions = async () => {
      if (!formik.values.from_payment_channel_id) {
        setFromAccountOptions([]);
        return;
      }
      try {
        const { data } = await fetchAccountNumberByChannelId(
          formik.values.from_payment_channel_id
        );
        setFromAccountOptions(data || []);
      } catch (error) {
        showToast.error("Failed to load from account options.");
      }
    };
    loadFromAccountOptions();
  }, [formik.values.from_payment_channel_id]);

  useEffect(() => {
    const loadToAccountOptions = async () => {
      if (!formik.values.to_payment_channel_id) {
        setToAccountOptions([]);
        return;
      }
      try {
        const { data } = await fetchAccountNumberByChannelId(
          formik.values.to_payment_channel_id
        );
        setToAccountOptions(data || []);
      } catch (error) {
        showToast.error("Failed to load to account options.");
      }
    };
    loadToAccountOptions();
  }, [formik.values.to_payment_channel_id]);

  // useEffect(() => {
  //   // Cash
  //   if (formik.values.from_payment_channel_id == 8) {
  //     formik.setFieldValue("from_account_id", 1);
  //   } else {
  //     formik.setFieldValue("from_account_id", "");
  //   }
  //   if (formik.values.to_payment_channel_id == 8) {
  //     formik.setFieldValue("to_account_id", 1);
  //   } else {
  //     formik.setFieldValue("to_account_id", "");
  //   }

  //   // wallet
  //    if (formik.values.from_payment_channel_id == 15) {
  //     formik.setFieldValue("from_account_id", 9);
  //   } else {
  //     formik.setFieldValue("from_account_id", "");
  //   }

  //    if (formik.values.to_payment_channel_id == 15) {
  //     formik.setFieldValue("to_account_id", 9);
  //   } else {
  //     formik.setFieldValue("to_account_id", "");
  //   }

  // }, [
  //   formik.values.from_payment_channel_id,
  //   formik.values.to_payment_channel_id,
  // ]);

  useEffect(() => {
  // from
  let fromAccount = "";
  if (formik.values.from_payment_channel_id == 8) {
    fromAccount = 1;
  } else if (formik.values.from_payment_channel_id == 15) {
    fromAccount = 9;
  }
  formik.setFieldValue("from_account_id", fromAccount);

  // to
  let toAccount = "";
  if (formik.values.to_payment_channel_id == 8) {
    toAccount = 1;
  } else if (formik.values.to_payment_channel_id == 15) {
    toAccount = 9;
  }
  formik.setFieldValue("to_account_id", toAccount);

}, [
  formik.values.from_payment_channel_id,
  formik.values.to_payment_channel_id,
]);

  useEffect(() => {
    if (postingToEdit) {
      formik.setValues({
        from_payment_channel_id: postingToEdit.from_payment_channel_id,
        from_account_id: postingToEdit.from_account_id,
        to_payment_channel_id: postingToEdit.to_payment_channel_id,
        to_account_id: postingToEdit.to_account_id,
        amount_bdt: postingToEdit.amount_bdt,
        transfer_date: postingToEdit.transfer_date,
        note: postingToEdit.note || "",
      });
    }
  }, [postingToEdit, formik.setFieldValue]);

  useEffect(() => {
    if (!formik.values.from_account_id) {
      setIsAvailableBalance(null);
      return;
    }
    checkAccountBalance(formik.values.from_account_id)
      .then((res) => {
        setIsAvailableBalance(res.data);
      })
      .catch((err) => console.log(err));
  }, [formik.values.from_account_id]);

  // useEffect(() => {
  //   if (formik.values.amount_bdt && isAvailableBalance !== null) {
  //     const enteredAmount = parseFloat(formik.values.amount_bdt);
  //     const available = parseFloat(isAvailableBalance);

  //     if (enteredAmount > available) {
  //       showToast.error("Insufficient balance! Please enter a smaller amount.");
  //       setIsDisabled(true);
  //     } else {
  //       setIsDisabled(false);
  //     }
  //   } else {
  //     setIsDisabled(false);
  //   }
  // }, [formik.values.amount_bdt, isAvailableBalance]);

  const formTitle = postingToEdit ? "Update Transfer" : "Create Transfer";

  console.log(formik.values);
  return (
    <div className='container mx-auto p-4'>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-xl font-bold mb-6 text-gray-800'>{formTitle}</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            {/* From Payment Channel field */}
            <div className='relative'>
              <select
                id='from_payment_channel_id'
                name='from_payment_channel_id'
                value={formik.values.from_payment_channel_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  Transfer From
                </option>
                {fromPaymentChannelOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.method_name}
                  </option>
                ))}
              </select>
              {formik.touched.from_payment_channel_id &&
                formik.errors.from_payment_channel_id && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.from_payment_channel_id}
                  </p>
                )}
            </div>

            {/* From Account field */}
            <div className='relative'>
              <select
                id='from_account_id'
                name='from_account_id'
                value={formik.values.from_account_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={[8, 15].includes(parseInt(formik.values.from_payment_channel_id))}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  From A/C No.
                </option>
                {fromAccountOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ac_no} - {item.ac_name}
                  </option>
                ))}
              </select>
              {formik.touched.from_account_id &&
                formik.errors.from_account_id && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.from_account_id}
                  </p>
                )}
            </div>

            {/* To Payment Channel field */}
            <div className='relative'>
              <select
                id='to_payment_channel_id'
                name='to_payment_channel_id'
                value={formik.values.to_payment_channel_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  Transfer To
                </option>
                {toPaymentChannelOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.method_name}
                  </option>
                ))}
              </select>
              {formik.touched.to_payment_channel_id &&
                formik.errors.to_payment_channel_id && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.to_payment_channel_id}
                  </p>
                )}
            </div>

            {/* To Account field */}
            <div className='relative'>
              <select
                id='to_account_id'
                name='to_account_id'
                value={formik.values.to_account_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={[8, 15].includes(parseInt(formik.values.to_payment_channel_id))}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value='' disabled>
                  To A/C No.
                </option>
                {toAccountOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ac_no} - {item.ac_name}
                  </option>
                ))}
              </select>
              {formik.touched.to_account_id && formik.errors.to_account_id && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.to_account_id}
                </p>
              )}
            </div>

            {/* Amount field */}
            <div className='relative'>
              <input
                id='amount_bdt'
                name='amount_bdt'
                type='number'
                step='0.01'
                placeholder='Enter Amount in BDT'
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

            {/* Transfer Date field */}
            {/* <div className='relative'>
              <input
                id='transfer_date'
                name='transfer_date'
                type='date'
                value={formik.values.transfer_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
              />
              {formik.touched.transfer_date && formik.errors.transfer_date && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.transfer_date}
                </p>
              )}
            </div> */}

            <div className='relative'>
              <DatePickerInput
              key={formik.values.transfer_date}
                onDateChange={(date) => {
                  if (!date) {
                    formik.setFieldValue("transfer_date", "");
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
                    "transfer_date",
                    `${year}-${month}-${day}`
                  );
                }}
                placeholderText='transfer_date Date'
                initialDate={formik.values.transfer_date || ""}
              />
              {formik.touched.transfer_date && formik.errors.transfer_date && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.transfer_date}
                </p>
              )}
            </div>

            {/* Note field */}
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
              // disabled={isDisabled}
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
