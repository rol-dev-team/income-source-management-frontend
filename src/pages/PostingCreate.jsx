import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpCircleIcon,
  AdjustmentsHorizontalIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
// Service Imports
import {fetchAllSources, fetchSources} from "../service/sourceApi";
import { createPosting, fetchPostingById, updatePosting } from "../service/postingApi";
import { showToast } from "../helper/toastMessage";
import messages from "../constants/message";
import {fetchCategoriesBySourceId, fetchSourceCategory} from "../service/sourceCategoryApi";
import {fetchSourceSubCategory, fetchSubCategoryBySourceId} from "../service/sourceSubCategory";
import {
  fetchAdvancedPaymentByPointOfContactId,
  fetchPointOfContactsBySubCatId,
  fetchPointsOfContact
} from "./../service/pointOfContactApi";
import {fetchAllPaymentChannels, fetchPaymentChannelDetails} from "./../service/paymentChannelDetailsApi";
import { fetchTransactionTypes } from "../service/transactionTypeApi";
import { fetchAccountNumberByChannelId } from "../service/accountNumberApi";
import {fetchExpenseTypes, fetchExpenseTypesBySourceId} from "./../service/expenseTypeApi";
import Button from "../components/common/Button.component";

// Define a validation schema with Yup
const validationSchema = Yup.object().shape({
  source_id: Yup.string().required("Source is required"),
  source_cat_id: Yup.string().required("Category is required"),
  source_subcat_id: Yup.string().required("Sub-category is required"),
  point_of_contact_id: Yup.string().required("Point of Contact is required"),
  channel_detail_id: Yup.string().required("Payment channel is required"),
  posting_date: Yup.string().required("Posting date is required"),
  total_amount: Yup.number().required("Amount is required").min(0, "Amount cannot be negative"),
  exchange_rate: Yup.string().when('source_id', {
    is: '2',
    then: (schema) => schema.required("Exchange rate is required when source is 2"),
    otherwise: (schema) => schema.notRequired(),
  }),
  foreign_currency: Yup.string().when('source_id', {
    is: '2',
    then: (schema) => schema.required("Foreign currency is required when source is 2"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const PostingCreate = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const mode = params.get("mode");
  const postingId = params.get("postingId");

  const [sourceOptions, setSourceOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [pointOfContactOptions, setPointOfContactOptions] = useState([]);
  const [paymentChannelDetailsOptions, setPaymentChannelDetailsOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [expenseTypesOptions, setExpenseTypesOptions] = useState([]);
  const [advancedPaymentDetailsOptions, setAdvancedPaymentDetailsOptions] = useState([]);

  const [isDependentLoading, setIsDependentLoading] = useState(false);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] = useState(false);
  const [isPointOfContactDependentLoading, setIsPointOfContactDependentLoading] = useState(false);

  useEffect(() => {
        const loadPostingData = async () => {
            if (postingId) {
                try {
                    // Fetch the full posting data using the ID from the URL
                    const { data } = await fetchPostingById(postingId);
                  
                    formik.setValues({
                        transaction_type_id: data.transaction_type_id || "",
                        source_id: data.source_id || "",
                        source_cat_id: data.source_cat_id || "",
                        source_subcat_id: data.source_subcat_id || "",
                        expense_type: data.expense_type || "",
                        point_of_contact_id: data.point_of_contact_id || "",
                        channel_detail_id: data.channel_detail_id || "",
                        recived_ac: data.recived_ac || "",
                        from_ac: data.from_ac || "",
                        posting_date: data.posting_date ? data.posting_date.slice(0, 10) : "",
                        total_amount: data.total_amount || "",
                        foreign_currency: data.foreign_currency || "",
                        exchange_rate: data.exchange_rate || "",
                        note: data.note || "",
                    });
                } catch (error) {
                    showToast.error("Failed to load posting data for editing.");
                    navigate("/posting"); 
                }
            }
        };
        loadPostingData();
    }, [postingId, navigate]);

  // Initialize useFormik hook
  const formik = useFormik({
    initialValues: {
      transaction_type_id: mode || "",
      source_id: "",
      source_cat_id: "",
      source_subcat_id: "",
      expense_type: "",
      point_of_contact_id: "",
      channel_detail_id: "",
      recived_ac: "",
      from_ac: "",
      posting_date: "",
      total_amount: "",
      foreign_currency: "",
      exchange_rate: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
  
      try {
        const dataToSubmit = {
          ...values,
          posting_date: values.posting_date ? new Date(values.posting_date).toISOString().slice(0, 10) : null,
          total_amount: parseFloat(values.total_amount),
          foreign_currency: parseFloat(values.foreign_currency),
          exchange_rate: parseFloat(values.exchange_rate),
        };
        if (postingId) {
                await updatePosting(postingId, dataToSubmit);
                showToast.success(messages.user.createSuccess || "Created successfully!");
                } else {
                  await createPosting(dataToSubmit);
                  showToast.success("Posting created successfully!");
                }
       
        resetForm(); 
        navigate('/posting'); 
      } catch (error) {
        showToast.error(error.message || "Operation failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Extract values and handlers from formik for easier access
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    errors,
    touched
  } = formik;
  useEffect(() => {
    setFieldValue("transaction_type_id", mode || "");
  }, [mode, setFieldValue]);
  // Effects for fetching options (same as before)
  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [sourcesRes, paymentChannelDetailsRes] = await Promise.all([
          fetchAllSources(),
          fetchAllPaymentChannels()
        ]);

        setSourceOptions(sourcesRes.data || []);
        setPaymentChannelDetailsOptions(paymentChannelDetailsRes.data || []);

      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, [mode]);

  useEffect(() => {
    const loadDependentOptions = async () => {
      // Exit if source_id is not selected
      if (!values.source_id) {
        setCategoryOptions([]);
        setSubCategoryOptions([]);
        setExpenseTypesOptions([]);
        setAdvancedPaymentDetailsOptions([]);
        return;
      }
      setAdvancedPaymentDetailsOptions([]);
      setIsDependentLoading(true);
      try {
        // Pass the source_id to the fetch functions
        const [categoryRes, subCategoryRes, expenseTypesRes] = await Promise.all([
          fetchCategoriesBySourceId(values.source_id),
          fetchSubCategoryBySourceId(values.source_id),
          fetchExpenseTypesBySourceId(values.source_id)
        ]);

        setCategoryOptions(categoryRes.data || []);
        setSubCategoryOptions(subCategoryRes.data || []);
        setExpenseTypesOptions(expenseTypesRes.data || []);
      } catch (error) {
        showToast.error("Failed to load dependent options.");
      } finally {
        setIsDependentLoading(false);
      }
    };
    loadDependentOptions();
  }, [values.source_id, setFieldValue,mode]);

  useEffect(() => {
    const loadAccountOptions = async () => {
      if (!values.channel_detail_id) {
        setAccountOptions([]);
        return;
      }
      setIsAccountNoDependentLoading(true);
      try {
        const { data } = await fetchAccountNumberByChannelId(values.channel_detail_id);
        setAccountOptions(data || []);
      } catch (error) {
        showToast.error("Failed to load account options.");
      } finally {
        setIsAccountNoDependentLoading(false);
      }
    };
    loadAccountOptions();
  }, [values.channel_detail_id]);

  useEffect(() => {
    const loadPointOfContactBySubCateIdOptions = async () => {
      if (!values.source_subcat_id) {
        setPointOfContactOptions([]);
        return;
      }
      setIsPointOfContactDependentLoading(true);
      try {
        const { data } = await fetchPointOfContactsBySubCatId(values.source_subcat_id);

        setPointOfContactOptions(data || []);
      } catch (error) {
        showToast.error("Failed to load account options.");
      } finally {
        setIsPointOfContactDependentLoading(false);
      }
    };
    loadPointOfContactBySubCateIdOptions();
  }, [values.source_subcat_id]);

  useEffect(() => {
    const loadAdvancedPaymentDetailsOptions = async () => {
      if (!values.point_of_contact_id) {
        setAdvancedPaymentDetailsOptions([]);
        return;
      }
      try {
        const { data } = await fetchAdvancedPaymentByPointOfContactId({sub_cat_id: values.source_subcat_id ,point_of_contact_id: values.point_of_contact_id});
        setAdvancedPaymentDetailsOptions(data || []);
      } catch (error) {
        showToast.error("Failed to load account options.");
      } finally {
      }
    };
    loadAdvancedPaymentDetailsOptions();
  }, [values.point_of_contact_id]);

  // Effect for currency calculation
  useEffect(() => {
    const foreign = parseFloat(values.foreign_currency);
    const rate = parseFloat(values.exchange_rate);

    if (!isNaN(foreign) && !isNaN(rate) && foreign >= 0 && rate >= 0) {
      const newTotalAmount = (foreign * rate).toFixed(2);
      setFieldValue("total_amount", newTotalAmount);
    } else {
      setFieldValue("total_amount", "");
    }
  }, [values.foreign_currency, values.exchange_rate, setFieldValue]);

  const handleCancel = () => {
    navigate('/posting');
  };


  return (
      <div className="w-full relative transition-all duration-300 rounded-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          {`${mode === "1" ? "Income" : "Expense"} Posting`}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction and Source Group */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
              <div className="relative">
                <select
                    id="source_id"
                    name="source_id"
                    value={values.source_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.source_id && touched.source_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Source*</option>
                  {sourceOptions?.map(option => (
                      <option key={option.id} value={option.id}>{option.source_name}</option>
                  ))}
                </select>
                {errors.source_id && touched.source_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.source_id}</p>
                )}
              </div>

              <div className="relative">
                <select
                    id="source_cat_id"
                    name="source_cat_id"
                    value={values.source_cat_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isDependentLoading}
                    className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.source_cat_id && touched.source_cat_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">{isDependentLoading ? "Loading..." : "Category*"}</option>
                  {categoryOptions?.map(option => (
                      <option key={option.id} value={option.id}>{option.cat_name}</option>
                  ))}
                </select>
                {errors.source_cat_id && touched.source_cat_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.source_cat_id}</p>
                )}
              </div>

              <div className="relative">
                <select
                    id="source_subcat_id"
                    name="source_subcat_id"
                    value={values.source_subcat_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isDependentLoading}
                    className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.source_subcat_id && touched.source_subcat_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">{isDependentLoading ? "Loading..." : "Sub-Category*"}</option>
                  {subCategoryOptions?.map(option => (
                      <option key={option.id} value={option.id}>{option.subcat_name}</option>
                  ))}
                </select>
                {errors.source_subcat_id && touched.source_subcat_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.source_subcat_id}</p>
                )}
              </div>
              <div className="relative">
                <select
                    id="expense_type"
                    name="expense_type"
                    value={values.expense_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.transaction_type_id && touched.transaction_type_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">{`${mode === "1" ? "Income" : "Expense"}`} Type</option>
                  {expenseTypesOptions?.map(option => (
                      <option key={option.id} value={option.id}>{option.expense_type}</option>
                  ))}
                </select>
                {errors.expense_type && touched.expense_type && (
                    <p className="mt-1 text-sm text-red-500">{errors.expense_type}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Details Group */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Financial Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-4">

              <div className="relative">
                <select
                    id="point_of_contact_id"
                    name="point_of_contact_id"
                    value={values.point_of_contact_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">{isPointOfContactDependentLoading? 'Loading...' : 'Point of Contact'} </option>
                  {pointOfContactOptions?.map(option => (
                      <option key={option.point_of_contact_id} value={option.point_of_contact_id}>{option.contact_name}</option>
                  ))}
                </select>
                {errors.point_of_contact_id && touched.point_of_contact_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.point_of_contact_id}</p>
                )}
              </div>
              <div className="relative">
                <select
                    id="channel_detail_id"
                    name="channel_detail_id"
                    value={values.channel_detail_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Payment Channel</option>
                  {paymentChannelDetailsOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.method_name}</option>
                  ))}
                </select>
                {errors.channel_detail_id && touched.channel_detail_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.channel_detail_id}</p>
                )}
              </div>

    
                    <div className="relative">
                      <select
                          id="recived_ac"
                          name="recived_ac"
                          value={values.recived_ac}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isAccountNoDependentLoading}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">{isAccountNoDependentLoading ? "Loading..." : "My  A/C No."}</option>
                        {accountOptions.map(option => (
                            <option key={option.id} value={option.id}>{`${option.ac_name} - ${ option.ac_no}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <input
                          type="text"
                          id="from_ac"
                          name="from_ac"
                          value={values.from_ac}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Party A/C No."
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>
                 
             

              <div className="relative">
                <input
                    type="date"
                    id="posting_date"
                    name="posting_date"
                    value={values.posting_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {errors.posting_date && touched.posting_date && (
                    <p className="mt-1 text-sm text-red-500">{errors.posting_date}</p>
                )}
              </div>
              <div className="relative">
                <input
                    type="number"
                    id="total_amount"
                    name="total_amount"
                    value={values.total_amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Amount in BDT"
                    className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.total_amount && touched.total_amount ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.total_amount && touched.total_amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.total_amount}</p>
                )}
              </div>
              {values.source_id == 2 && (
                  <>
                    <div className="relative">
                      <input
                          type="number"
                          id="exchange_rate"
                          name="exchange_rate"
                          value={values.exchange_rate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Exchange Rate"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      {errors.exchange_rate && touched.exchange_rate && (
                          <p className="mt-1 text-sm text-red-500">{errors.exchange_rate}</p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                          type="number"
                          id="foreign_currency"
                          name="foreign_currency"
                          value={values.foreign_currency}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Foreign Currency"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      {errors.foreign_currency && touched.foreign_currency && (
                          <p className="mt-1 text-sm text-red-500">{errors.foreign_currency}</p>
                      )}
                    </div>
                  </>
              )}


              <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
                            <textarea
                                id="note"
                                name="note"
                                value={values.note}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Note"
                                rows="1"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
              </div>
            </div>
            {advancedPaymentDetailsOptions.length > 0 &&
                advancedPaymentDetailsOptions.map((item) => (
                    <div key={item.id || item.amount} className="mt-3 p-4 border border-blue-200 bg-blue-50 rounded-lg mb-2 flex gap-10 justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowUpCircleIcon className="h-5 w-5 text-blue-500" />
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Advanced:</span> {' ৳ '}{item.amount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-500" />
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Auto Adjust:</span> {' ৳ '}{item.auto_adjustment_amount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <WalletIcon className="h-5 w-5 text-blue-500" />
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Remaining Amount:</span> {' ৳ '} {item.remaining_amount}
                        </p>
                      </div>
                    </div>
                ))}

          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
                onClick={handleCancel}
                type="button"
                disabled={isSubmitting}
                children="Cancel"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
            />
            <Button
                type="submit"
                disabled={isSubmitting}
                children="Save"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
            />
          </div>
        </form>
      </div>
  );
};

export default PostingCreate;

