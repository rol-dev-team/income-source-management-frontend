import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { showToast } from '../../helper/toastMessage'; 
import { createCurrencyParty, updateCurrencyParty } from '../../service/currency-trading/currencyApi';
import { userFormValidationSchema } from '../../schemas/user.schema';
import {  updateUser } from '../../service/userApi';
import {registerUser} from '../../service/authApi';
const CreateUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userToEdit = location.state?.currency; 

  const formik = useFormik({
    initialValues: {
      full_name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validationSchema: userFormValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (userToEdit) {
          const response = await updateUser(userToEdit?.id, values);
          showToast.success(response?.message || "User updated successfully!");
        } else {
          const response = await registerUser(values);
          showToast.success(response?.message || "User created successfully!");
        }

        resetForm();
        navigate('/settings/users');
      } catch (error) {
        showToast.error(error?.response?.data?.message || "An error occurred. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (userToEdit) {
      formik.setFieldValue('full_name', userToEdit.full_name || '');
      formik.setFieldValue('username', userToEdit.username || '');
      formik.setFieldValue('email', userToEdit.email || '');
      formik.setFieldValue('role', userToEdit.role || '');
    }
  }, [userToEdit, formik.setFieldValue]);

  return (
      <form onSubmit={formik.handleSubmit} >
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-xl font-bold mb-6 text-gray-800">
            {userToEdit ? 'Update User' : 'Create User'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name Input */}
            <div className="relative">
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Enter full name"
                value={formik.values.full_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.full_name}</p>
              )}
            </div>

            {/* Username Input */}
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.username && formik.errors.username && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative col-span-1">
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

            {/* Role Dropdown */}
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              >
                <option value="" disabled>Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.role}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-150 ease-in-out"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {userToEdit ? 'Update User' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
  );
};

export default CreateUserPage;
