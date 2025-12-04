import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { createLoanParty, updateLoanParty } from "../../service/loanApi";
import SelectField from "../../components/common/SelectField";
import { createRentalHouse, updateRentalHouse } from "../../service/rentalApi";

const validationSchema = yup.object({
  house_name: yup.string().required("House Name is required"),
  address: yup.string().required("House address is required"),
});

const CreateHousePage = () => {
  const { postingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const partyToEdit = location.state?.currency;

  const formik = useFormik({
    initialValues: {
      house_name: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const submissionValues = {
        ...values,
      };
      try {
        if (partyToEdit) {
          const response = await updateRentalHouse(
            partyToEdit?.id,
            submissionValues
          );
          showToast.success(response?.message || "Updated successfully!");
        } else {
          const response = await createRentalHouse(submissionValues);
          showToast.success(response?.message || "Created successfully!");
        }
        resetForm();
        navigate("/rental/house");
      } catch (error) {
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    if (partyToEdit) {
      formik.setFieldValue("house_name", partyToEdit.house_name || "");
      formik.setFieldValue("address", partyToEdit.address || "");
    }
  }, [partyToEdit]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-lg font-semibold mb-4 text-gray-700'>
            {partyToEdit ? "Update House" : "Create House"}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4'>
            <div className='relative'>
              <input
                id='house_name'
                name='house_name'
                type='text'
                placeholder='Enter House Name'
                value={formik.values.house_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.house_name && formik.errors.house_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.house_name}
                </p>
              )}
            </div>

            <div className='relative'>
              <textarea
                id='address'
                name='address'
                rows='1'
                placeholder='Enter Address'
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
              />
              {formik.touched.address && formik.errors.address && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.address}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className=''>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out'>
                {partyToEdit ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateHousePage;
