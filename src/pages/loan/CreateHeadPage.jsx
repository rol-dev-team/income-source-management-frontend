import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { createLoanParty, updateLoanParty } from "../../service/loanApi";

const validationSchema = yup.object({
  type: yup.string().required("Type is required"),
  party_name: yup.string().required("Party is required"),
});

const CreateHeadPage = () => {
  const { postingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currencyToEdit = location.state?.currency;

  const formik = useFormik({
    initialValues: {
      type: "",
      party_name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (currencyToEdit) {
          const response = await updateLoanParty(currencyToEdit?.id, values);
          showToast.success(response?.message || "Updated successfully!");
        } else {
          const response = await createLoanParty(values);
          showToast.success(response?.message || "Created successfully!");
        }

        resetForm();
        navigate("/loan/head");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    if (currencyToEdit) {
      formik.setFieldValue("type", currencyToEdit.type);
      formik.setFieldValue("party_name", currencyToEdit.party_name);
    }
  }, [currencyToEdit]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-lg font-semibold mb-4 text-gray-700'>
            {postingId ? "Update Party" : "Create Party"}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4'>
            <div className='relative'>
              <select
                id='type'
                name='type'
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                <option value=''>Type</option>
                <option value='bank'>Bank</option>
                <option value='party'>Party</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.type}
                </p>
              )}
            </div>
            <div className='relative'>
              <input
                id='party_name'
                name='party_name'
                type='text'
                placeholder='Enter Name'
                value={formik.values.party_name}
                onChange={(e) => {
                  formik.setFieldValue("party_name", e.target.value);
                }}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.party_name && formik.errors.party_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.party_name}
                </p>
              )}
            </div>
            <div className=''>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out'>
                {postingId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateHeadPage;
