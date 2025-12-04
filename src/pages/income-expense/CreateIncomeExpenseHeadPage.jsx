import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import {
  createIncomeExpense,
  updateIncomeExpense,
} from "../../service/income-expense/incomeExpenseApi";

const validationSchema = yup.object({
  head_name: yup.string().required("Income Expense head is required"),
});

const CreateIncomeExpenseHeadPage = () => {
  const { postingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currencyToEdit = location.state?.currency;

  const formik = useFormik({
    initialValues: {
      head_name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (currencyToEdit) {
          const response = await updateIncomeExpense(
            currencyToEdit?.id,
            values
          );
          showToast.success(response?.message || "Updated successfully!");
        } else {
          const response = await createIncomeExpense(values);
          showToast.success(response?.message || "Created successfully!");
        }

        resetForm();
        navigate("/income-expense/head");
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
      formik.setFieldValue("head_name", currencyToEdit.head_name);
    }
  }, [currencyToEdit]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-lg font-semibold mb-4 text-gray-700'>
            {postingId ? "Update Income Head" : "Create Income Head"}
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
                <option value='income'>Income</option>
                <option value='expense'>Expense</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.type}
                </p>
              )}
            </div>
            <div className='relative'>
              <input
                id='head_name'
                name='head_name'
                type='text'
                placeholder='Enter Head'
                value={formik.values.head_name}
                onChange={(e) => {
                  formik.setFieldValue("head_name", e.target.value);
                }}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.head_name && formik.errors.head_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.head_name}
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

export default CreateIncomeExpenseHeadPage;
