import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { showToast } from '../../helper/toastMessage'; 
import { createCurrencyParty, updateCurrencyParty } from '../../service/currency-trading/currencyApi';


const validationSchema = yup.object({
  party_name: yup
    .string('Party name must be a string')
    .required('Party name is required'),
  mobile: yup
    .string('Mobile must be a string')
    .required('Mobile number is required'),
  nid: yup
    .string('NID must be a string')
    .required('NID is required'),
  email: yup
    .string('Email must be a string')
    .email('Invalid email address')
    .required('Email is required'),
  address: yup
    .string('Address must be a string')
    .required('Address is required'),
});

const CreatePartyPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const partyToEdit = location.state?.currency;

  const formik = useFormik({
    initialValues: {
      party_name: '',
      mobile: '',
      nid: '',
      email: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (partyToEdit) {
          const response = await updateCurrencyParty(partyToEdit?.id, values);
          showToast.success(response?.message || "Party updated successfully!");
        } else {
          const response = await createCurrencyParty(values);
          showToast.success(response?.message || "Party created successfully!");
        }
        
        resetForm();
        navigate('/currency-trading/party');
      } catch (error) {
        showToast.error(error?.response?.data?.message || "An error occurred. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (partyToEdit) {
      formik.setFieldValue('party_name', partyToEdit.party_name);
      formik.setFieldValue('mobile', partyToEdit.mobile);
      formik.setFieldValue('nid', partyToEdit.nid);
      formik.setFieldValue('email', partyToEdit.email);
      formik.setFieldValue('address', partyToEdit.address);
    }
  }, [partyToEdit, formik.setFieldValue]);

  return (
      <form onSubmit={formik.handleSubmit} >
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-xl font-bold mb-6 text-gray-800">
            {partyToEdit ? 'Update Party' : 'Create Party'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Party Name Input */}
            <div className="relative">
              <input
                id="party_name"
                name="party_name"
                type="text"
                placeholder="Enter party name"
                value={formik.values.party_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.party_name && formik.errors.party_name && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.party_name}</p>
              )}
            </div>

            {/* Mobile Input */}
            <div className="relative">
              
              <input
                id="mobile"
                name="mobile"
                type="text"
                placeholder="Enter mobile number"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.mobile}</p>
              )}
            </div>
            
            {/* NID Input */}
            <div className="relative">
              
              <input
                id="nid"
                name="nid"
                type="text"
                placeholder="Enter NID"
                value={formik.values.nid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.nid && formik.errors.nid && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.nid}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>
            
            {/* Address Input */}
            <div className="relative col-span-1 md:col-span-2">
              
              <textarea
                id="address"
                name="address"
                placeholder="Enter full address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 transition duration-150 ease-in-out"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.address}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {partyToEdit ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    
  );
};

export default CreatePartyPage;
