import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import {
  createPaymentChannelDetails,
  updatePaymentChannelDetails,
} from "../../service/paymentChannelDetailsApi";
import { paymentChannelDetailsFormValidationSchema } from "../../schemas/paymentChannelDetailsSchemas";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import {
  createPaymentChannel,
  fetchAllPaymentMode,
  updatePaymentChannel,
} from "../../service/paymentChannelApi";

const CreatePaymentChannelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentChannelToEdit = location.state?.currency;
  const [channelOptions, setChannelOptions] = useState([]);

  useEffect(() => {
    const loadChannelOptions = async () => {
      try {
        const response = await fetchAllPaymentMode();
        setChannelOptions(response.data);
      } catch (error) {
        showToast.error("Failed to load channel options.");
      }
    };

    loadChannelOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      channel_id: "",
      method_name: "",
    },
    validationSchema: paymentChannelDetailsFormValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (paymentChannelToEdit) {
          const response = await updatePaymentChannelDetails(
            paymentChannelToEdit?.id,
            values
          );
          showToast.success(
            response?.message || "Payment channel updated successfully!"
          );
        } else {
          const response = await createPaymentChannelDetails(values);
          showToast.success(
            response?.message || "Payment channel created successfully!"
          );
        }

        resetForm();
        navigate("/settings/payment-channels");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    if (paymentChannelToEdit) {
      formik.setFieldValue("channel_id", paymentChannelToEdit.channel_id || "");
      formik.setFieldValue(
        "method_name",
        paymentChannelToEdit.method_name || ""
      );
    }
  }, [paymentChannelToEdit, formik.setFieldValue]);

console.log('sdjsdjfdklsjflsdjfl',channelOptions);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h4 className='text-xl font-bold mb-6 text-gray-800'>
          {paymentChannelToEdit
            ? "Update Payment Channel"
            : "Create Payment Channel"}
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
          {/* Channel ID Input */}
          <div className='relative'>
            <select
              id='channel_id'
              name='channel_id'
              value={formik.values.channel_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
              <option value='' disabled>
                Payment Mode
              </option>
              {channelOptions
                ?.filter((item) => item.id !== 3 && item.id !== 4)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.channel_name}
                  </option>
                ))}
            </select>
            {formik.touched.channel_id && formik.errors.channel_id && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.channel_id}
              </p>
            )}
          </div>

          {/* Method Name Input */}
          <div className='relative'>
            <input
              id='method_name'
              name='method_name'
              type='text'
              placeholder='Enter Payment Channel Name'
              value={formik.values.method_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out'
            />
            {formik.touched.method_name && formik.errors.method_name && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.method_name}
              </p>
            )}
          </div>
        </div>

        <div className='mt-6 flex justify-end'>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105'>
            {paymentChannelToEdit ? "Update Payment Channel" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePaymentChannelPage;
