import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams,useLocation, useNavigate } from 'react-router-dom';
import { createCurrency, updateCurrency, getCurrencyById } from '../../service/currency-trading/currencyApi';
import { showToast } from '../../helper/toastMessage'; 


const validationSchema = yup.object({
  currency: yup
    .string('Currency must be a string')
    .required('Currency is required')
    .matches(/^[A-Z]+$/, 'Currency must contain only uppercase letters'),
});

const CreateCurrencyPage = () => {

  const { postingId } = useParams();
  const navigate = useNavigate();
   const location = useLocation(); 
    const currencyToEdit = location.state?.currency;

  const formik = useFormik({
    initialValues: {
      currency: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        
        if (currencyToEdit) {
          const response = await updateCurrency(currencyToEdit?.id, values);
          showToast.success(response?.message || "Updated successfully!");
        } else {
          const response = await createCurrency(values);
          showToast.success(response?.message || "Created successfully!");
        }
        
        resetForm();
        navigate('/currency-trading/currency'); 
      } catch (error) {
       showToast.error(error?.response?.data?.message || "An error occurred. Please try again.");
      }
    },
  });

 useEffect(() => {
        if (currencyToEdit) {
            formik.setFieldValue('currency', currencyToEdit.currency);
        }
    }, [currencyToEdit]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">
            {postingId ? 'Update Currency' : 'Create Currency'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
            <div className="relative">
              <input
                id="currency"
                name="currency"
                type="text"
                placeholder="Enter currency (e.g., USD)"
                value={formik.values.currency}
                onChange={(e) => {
                  formik.setFieldValue('currency', e.target.value.toUpperCase());
                }}
                onBlur={formik.handleBlur}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {formik.touched.currency && formik.errors.currency && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.currency}</p>
              )}
            </div>
            <div className="">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
              >
                {postingId ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCurrencyPage;