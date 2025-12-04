import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import {
  createAccountNumber,
  fetchAccountNumber,
  updateAccountNumber,
} from "../../service/accountNumberApi";

const accountNumberFormValidationSchema = yup.object().shape({
  channel_detail_id: yup.string().required("Payment Channel is required"),
  ac_no: yup.string().required("Account Number is required"),
  ac_name: yup.string().required("Account Name is required"),
  ac_details: yup.string().required("Account Details are required"),
});

const CreateAccountNumberPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accountNumberToEdit = location.state?.currency;
  const [channelOptions, setChannelOptions] = useState([]);

  useEffect(() => {
    const loadChannelOptions = async () => {
      try {
        const response = await fetchAllPaymentChannels();
        setChannelOptions(response.data);
      } catch (error) {
        console.error("Failed to load channel options:", error);
        showToast.error("Failed to load channel options.");
      }
    };
    loadChannelOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      channel_detail_id: "",
      ac_no: "",
      ac_name: "",
      ac_details: "",
    },
    validationSchema: accountNumberFormValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (accountNumberToEdit) {
          const response = await updateAccountNumber(
            accountNumberToEdit.id,
            values
          );
          showToast.success(
            response?.message || "Account number updated successfully!"
          );
        } else {
          const response = await createAccountNumber(values);
          showToast.success(
            response?.message || "Account number created successfully!"
          );
        }

        resetForm();
        navigate("/settings/account-numbers");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    // Set initial values for editing
    if (accountNumberToEdit) {
      formik.setFieldValue(
        "channel_detail_id",
        accountNumberToEdit.channel_detail_id || ""
      );
      formik.setFieldValue("ac_no", accountNumberToEdit.ac_no || "");
      formik.setFieldValue("ac_name", accountNumberToEdit.ac_name || "");
      formik.setFieldValue("ac_details", accountNumberToEdit.ac_details || "");
    }
  }, [accountNumberToEdit, formik.setFieldValue]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h4 className='text-xl font-bold mb-6 text-gray-800'>
          {accountNumberToEdit
            ? "Update Account Number"
            : "Create Account Number"}
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
          {/* Payment Channel Dropdown */}
          <div className='relative'>
            <select
              id='channel_detail_id'
              name='channel_detail_id'
              value={formik.values.channel_detail_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
              <option value='' disabled>
                Payment Channel
              </option>
              {channelOptions
                ?.filter((item) => item.id !== 8 && item.id !== 15)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.method_name}
                  </option>
                ))}
            </select>
            {formik.touched.channel_detail_id &&
              formik.errors.channel_detail_id && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.channel_detail_id}
                </p>
              )}
          </div>

          {/* Account Number Input */}
          <div className='relative'>
            <input
              id='ac_no'
              name='ac_no'
              type='text'
              placeholder='Enter A/C No.'
              value={formik.values.ac_no}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
            />
            {formik.touched.ac_no && formik.errors.ac_no && (
              <p className='mt-1 text-sm text-red-500'>{formik.errors.ac_no}</p>
            )}
          </div>

          {/* Account Name Input */}
          <div className='relative'>
            <input
              id='ac_name'
              name='ac_name'
              type='text'
              placeholder='Enter A/C Name'
              value={formik.values.ac_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
            />
            {formik.touched.ac_name && formik.errors.ac_name && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.ac_name}
              </p>
            )}
          </div>

          {/* Account Details Input */}
          <div className='relative'>
            <textarea
              id='ac_details'
              name='ac_details'
              placeholder='Enter A/C Details'
              value={formik.values.ac_details}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
              rows='2' // Added rows attribute for height
            />
            {formik.touched.ac_details && formik.errors.ac_details && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.ac_details}
              </p>
            )}
          </div>
        </div>

        <div className='mt-6 flex justify-end'>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105'>
            {accountNumberToEdit ? "Update Account Number" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateAccountNumberPage;
