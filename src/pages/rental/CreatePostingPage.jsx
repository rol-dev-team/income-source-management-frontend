import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { showToast } from '../../helper/toastMessage';
import { fetchAllPaymentChannels } from '../../service/paymentChannelDetailsApi';
import { fetchAccountNumberByChannelId, checkAccountBalance } from '../../service/accountNumberApi';

import {
  createIncomeExpensePosting,
  getAllIncomesExpenses,
  updateIncomeExpensePosting,
} from '../../service/income-expense/incomeExpenseApi';
import {
  createLoanPosting,
  getAllLoanParties,
  getLoanCalculation,
  updateLoanPosting,
} from '../../service/loanApi';
import DatePickerInput from '../../components/common/DatePickerInput';
import {
  createRentalPosting,
  getAllHousePartyMapping,
  getAllRentalHouses,
  getAllRentalParties,
  getPartyWiseHouses,
  getRentalPartiesInfo,
  getRentalPartiesRefundInfo,
  updateRentalPosting,
} from '../../service/rentalApi';
import DatePickerMonth from '../../components/common/DatePickerMonth';

const mockDropdownData = {
  transaction_types: [
    { id: 'rent_received', name: 'Rent Received' },
    { id: 'security_money_refund', name: 'Security Money Refund' },
  ],
};

const validationSchema = yup.object().shape({
  transaction_type: yup.string().required('Transaction type is required'),
  head_id: yup.string().required('Party is required'),
  house_id: yup.string().required('House is required'),
  payment_channel_id: yup.string().required('Payment channel is required'),
  account_id: yup.string().required('Account is required'),
  amount_bdt: yup.number().required('Amount is required').positive('Amount must be positive'),
  posting_date: yup.date().required('Posting date is required'),
  rent_received: yup.string().when('transaction_type', {
    is: (val) => val === 'rent_received',
    then: (schema) => schema.required('Rent Received Date is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  note: yup.string().notRequired(),
});

const CreatePostingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postingToEdit = location.state?.currency;

  const [houseOptions, setHouseOptions] = useState([]);
  const [partiesOptions, setPartiesOptions] = useState([]);
  const [expenseHeadOptions, setExpenseHeadOptions] = useState([]);
  const [paymentChannelOptions, setPaymentChannelOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] = useState(false);
  const [partiesInfo, setPartiesInfo] = useState(null);
  const [partiesRefundInfo, setPartiesRefundInfo] = useState(null);
  const [isPartiesInfoLoading, setIsPartiesInfoLoading] = useState(false);
  const [isAvailableBalance, setIsAvailableBalance] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes, partiesRes] = await Promise.all([
          fetchAllPaymentChannels(),
          getAllRentalParties(),
        ]);

        setPaymentChannelOptions(paymentChannelRes.data || []);
        setPartiesOptions(partiesRes.data || []);
      } catch (error) {
        showToast.error('Failed to load initial form options.');
      }
    };
    loadInitialOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      transaction_type: '',
      head_id: '',
      house_id: '',
      payment_channel_id: '',
      account_id: '',
      amount_bdt: '',
      other_cost_bdt: '',
      receipt_number: '',
      // posting_date: new Date().toISOString().split("T")[0],
      posting_date: '',
      rent_received: '',
      note: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
        };

        if (postingToEdit) {
          await updateRentalPosting(postingToEdit?.id, payload);
          showToast.success('Posting updated successfully!');
        } else {
          const res = await createRentalPosting(payload);
          showToast.success('Posting created successfully!');
        }
        resetForm();
        navigate('/rental/postings');
      } catch (error) {
        
        showToast.error(error?.response?.data?.message || 'An error occurred. Please try again.');
      }
    },
  });

  useEffect(() => {
    const loadAccountOptions = async () => {
      if (!formik.values.payment_channel_id) {
        setAccountOptions([]);
        return;
      }
      setIsAccountNoDependentLoading(true);
      try {
        const { data } = await fetchAccountNumberByChannelId(formik.values.payment_channel_id);
        setAccountOptions(data || []);
      } catch (error) {
        showToast.error('Failed to load account options.');
      } finally {
        setIsAccountNoDependentLoading(false);
      }
    };
    loadAccountOptions();
  }, [formik.values.payment_channel_id]);

  // useEffect(() => {
  //   const loadMappingDataOptions = async () => {
  //     if (!formik.values.head_id) {
  //       setHouseOptions([]);
  //       return;
  //     }
  //     try {
  //       const { data } = await getAllHousePartyMapping();
  //       const filtered = (data || []).filter(
  //         (item) => item.rental_party_id == formik.values.head_id
  //       );
  //       setHouseOptions(filtered || []);
  //     } catch (error) {
  //       showToast.error('Failed to load account options.');
  //     } finally {
  //     }
  //   };
  //   loadMappingDataOptions();
  // }, [formik.values.head_id]);

    useEffect(() => {
        const loadMappingDataOptions = async () => {
          if (!formik.values.head_id) {
            setHouseOptions([]);
            return;
          }
          try {
            const { data } = await getPartyWiseHouses(formik.values.head_id);
            setHouseOptions(data);
          //   setHouseOptions(
          //   (data || []).map((house) => ({
          //     value: house.id,
          //     label: house.house_name,
          //   }))
          // );
          } catch (error) {
            showToast.error('Failed to load account options.');
          } finally {
          }
        };
        loadMappingDataOptions();
      }, [formik.values.head_id]);


  useEffect(() => {
    if (postingToEdit) {
      formik.setValues({
        transaction_type: postingToEdit.entry_type || '',
        head_type: postingToEdit.head_type || '',
        head_id: postingToEdit.head_id || '',
        payment_channel_id: postingToEdit.payment_channel_id || '',
        account_id: postingToEdit.account_id || '',
        amount_bdt: postingToEdit.amount_bdt || '',
        party_ac: postingToEdit.party_ac || '',
        other_cost_bdt: postingToEdit.other_cost_bdt || '',
        posting_date: postingToEdit.posting_date?.split('T')[0] || '',
        rent_received: postingToEdit.rent_received || '',
        note: postingToEdit.note || '',
        receipt_number: postingToEdit.receipt_number || '',
      });
    }
  }, [postingToEdit, formik.setValues]);

  const handlePaymentChannelChange = (e) => {
    const selectedPaymentChannelId = e.target.value;
    formik.handleChange(e);
    if (selectedPaymentChannelId == 8) {
      formik.setFieldValue('account_id', 1);
    } else {
      formik.setFieldValue('account_id', '');
    }
  };

  // useEffect(() => {
  //   const fetchPartiesInfo = async () => {
  //     if (!formik.values.house_id) {
  //       setPartiesInfo(null);
  //       setPartiesRefundInfo(null);
  //       formik.setFieldValue('amount_bdt', '');
  //       return;
  //     }
  //     setIsPartiesInfoLoading(true);
  //     try {
  //       if (formik.values.transaction_type === 'rent_received') {
  //         const payloadsInfo = {
  //           party_id: formik.values.head_id,
  //           house_id: formik.values.house_id,
  //           rent_received: formik.values.rent_received,
  //         };
  //         const { data } = await getRentalPartiesInfo(payloadsInfo);
  //         setPartiesInfo(data);
  //         formik.setFieldValue('amount_bdt', data?.monthly_rent || '');
  //         setPartiesRefundInfo(null);
  //       } else {
  //         const { data } = await getRentalPartiesRefundInfo(formik.values.house_id);
  //         setPartiesRefundInfo(data);
  //         formik.setFieldValue('amount_bdt', data?.total_payable || '');
  //         setPartiesInfo(null);
  //       }
  //     } catch (error) {
  //       showToast.error(error.response.data.message || 'Failed to load account options.');
  //     } finally {
  //       setIsPartiesInfoLoading(false);
  //     }
  //   };
  //   fetchPartiesInfo();
  // }, [formik.values.rent_received, formik.values.transaction_type]);

  useEffect(() => {
    setPartiesInfo(null);
    setPartiesRefundInfo(null);
  formik.setFieldValue('amount_bdt', '');

  if (!formik.values.house_id) return;

  const fetchPartiesInfo = async () => {

    setIsPartiesInfoLoading(true);

    try {
      if (formik.values.transaction_type === 'rent_received' && formik.values.rent_received) {
        // Rent received logic
        const payloadsInfo = {
          party_id: formik.values.head_id,
          house_id: formik.values.house_id,
          rent_received: formik.values.rent_received,
        };
        const { data } = await getRentalPartiesInfo(payloadsInfo);
        setPartiesInfo(data);
        formik.setFieldValue('amount_bdt', data?.monthly_rent || '');
        setPartiesRefundInfo(null);
      } else if (
        formik.values.transaction_type === 'security_money_refund' &&
        formik.values.house_id
      ) {
        // Security refund logic
        const { data } = await getRentalPartiesRefundInfo(formik.values.house_id);
        setPartiesRefundInfo(data);
        formik.setFieldValue('amount_bdt', data?.total_payable || '');
        setPartiesInfo(null);
      } else {
        // Reset if neither condition matches
        setPartiesInfo(null);
        setPartiesRefundInfo(null);
        formik.setFieldValue('amount_bdt', '');
      }
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to load account options.');
    } finally {
      setIsPartiesInfoLoading(false);
    }
  };

  fetchPartiesInfo();
}, [formik.values.rent_received, formik.values.transaction_type, formik.values.house_id]);


  useEffect(() => {
    if (!formik.values.account_id && formik.values.transaction_type === 'security_money_refund') {
      setIsAvailableBalance(null);
      return;
    }

    checkAccountBalance(formik.values.account_id)
      .then((res) => {
        setIsAvailableBalance(res.data);
      })
      .catch((err) => console.log(err));
  }, [formik.values.account_id]);

  useEffect(() => {
    if (
      formik.values.amount_bdt &&
      isAvailableBalance !== null &&
      formik.values.transaction_type === 'security_money_refund'
    ) {
      const enteredAmount = Number(formik.values.amount_bdt) || 0;
      const otherAmount = Number(formik.values.other_cost_bdt) || 0;
      const finalAmount = enteredAmount + otherAmount;
      const available = parseFloat(isAvailableBalance);

      if (finalAmount > available) {
        showToast.error('Insufficient balance! Please enter a smaller amount.');
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }
  }, [formik.values.amount_bdt, isAvailableBalance, formik.values.transaction_type]);

  console.log('formik values', houseOptions);
  return (
    <div className="container mx-auto p-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-xl font-bold mb-6 text-gray-800">
            {postingToEdit ? 'Update Rental Posting' : 'Rental Posting'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Transaction Type Dropdown */}
            <div className="relative">
              <select
                id="transaction_type"
                name="transaction_type"
                value={formik.values.transaction_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" disabled>
                  Transaction Type
                </option>
                {mockDropdownData.transaction_types.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formik.touched.transaction_type && formik.errors.transaction_type && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.transaction_type}</p>
              )}
            </div>

            <div className="relative">
              <select
                id="head_id"
                name="head_id"
                value={formik.values.head_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Select Party</option>
                {partiesOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.party_name}
                  </option>
                ))}
              </select>
              {formik.touched.head_id && formik.errors.head_id && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.head_id}</p>
              )}
            </div>

            <div className="relative">
              <select
                id="house_id"
                name="house_id"
                value={formik.values.house_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Select House</option>
                {houseOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.house_name}
                  </option>
                ))}
              </select>
              {formik.touched.house_id && formik.errors.house_id && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.house_id}</p>
              )}
            </div>
              {formik.values.transaction_type === 'rent_received' && (
                <div className="relative">
              <DatePickerMonth
                value={formik.values.rent_received}
                placeholderTextValue="Rent Month"
                onChange={(val) => formik.setFieldValue('rent_received', val)}
              />
              {formik.touched.rent_received && formik.errors.rent_received && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.rent_received}</p>
              )}
            </div>
              )}
            

            {/* Payment Channel Dropdown */}
            <div className="relative">
              <select
                id="payment_channel_id"
                name="payment_channel_id"
                value={formik.values.payment_channel_id}
                onChange={handlePaymentChannelChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" disabled>
                  My Payment Channel
                </option>
                {paymentChannelOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.method_name}
                  </option>
                ))}
              </select>
              {formik.touched.payment_channel_id && formik.errors.payment_channel_id && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.payment_channel_id}</p>
              )}
            </div>

            {/* Account Number Dropdown */}
            <div className="relative">
              <select
                id="account_id"
                name="account_id"
                disabled={
                  isAccountNoDependentLoading ||
                  formik.values.payment_channel_id == 8 ||
                  !!postingToEdit
                }
                value={formik.values.account_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" disabled>
                  My A/C No.
                </option>
                {accountOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ac_no} - {item.ac_name}
                  </option>
                ))}
              </select>
              {formik.touched.account_id && formik.errors.account_id && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.account_id}</p>
              )}
            </div>

            {/* Amount BDT Input */}
            <div className="relative">
              <input
                id="amount_bdt"
                name="amount_bdt"
                type="number"
                step="0.01"
                placeholder={formik.values.transaction_type === 'rent_received'? 'Enter Rent Amount in BDT': 'Enter Refund Amount in BDT'}
                value={formik.values.amount_bdt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {formik.touched.amount_bdt && formik.errors.amount_bdt && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.amount_bdt}</p>
              )}
            </div>

              {formik.values.transaction_type === 'rent_received' && (
                <div className="relative">
              <input
                id="other_cost_bdt"
                name="other_cost_bdt"
                type="number"
                step="0.01"
                placeholder={'Enter Utility / Service Cost in BDT'}
                value={formik.values.other_cost_bdt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {formik.touched.other_cost_bdt && formik.errors.other_cost_bdt && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.other_cost_bdt}</p>
              )}
            </div>
              )}
            

            {/* Receipt Number Input (Optional) */}

            <div className="relative">
              <input
                id="receipt_number"
                name="receipt_number"
                type="text"
                placeholder="Party A/C"
                value={formik.values.receipt_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {formik.touched.receipt_number && formik.errors.receipt_number && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.receipt_number}</p>
              )}
            </div>

            {/* Posting Date Input */}
            <div className="relative">
              <DatePickerInput
                // onDateChange={(date) => {
                //   formik.setFieldValue(
                //     "posting_date",
                //     date.toISOString().split("T")[0]
                //   );
                // }}

                onDateChange={(date) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');

                  formik.setFieldValue('posting_date', `${year}-${month}-${day}`);
                }}
                placeholderText={'Posting Date'}
              />
              {formik.touched.posting_date && formik.errors.posting_date && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.posting_date}</p>
              )}
            </div>

            {/* Note Textarea */}

            <div className="relative">
              <textarea
                id="note"
                name="note"
                placeholder="Add a note (optional)"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-[40px] mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            {partiesInfo && Object.keys(partiesInfo).length > 0 && (
              <div class="relative col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-4 flex items-center justify-between flex-wrap text-sm w-full">
                <div class="flex items-center space-x-2 my-1">
                  <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z" />
                  </svg>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Monthly Rent</span>
                    <span class="text-gray-900 font-bold">BDT {partiesInfo?.monthly_rent}</span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 my-1">
                  <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1.5-12.5a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0v-5z" />
                  </svg>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Auto Adjustment</span>
                    <span class="text-gray-900 font-bold">BDT {partiesInfo?.auto_adjustment}</span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 my-1">
                  <svg class="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z" />
                  </svg>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Remaining Security Balance</span>
                    <span class="text-gray-900 font-bold">
                      BDT {partiesInfo?.remaining_security_money}
                    </span>
                  </div>
                </div>

                {/* <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-blue-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>Remaining</span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.remaining_balance}
                    </span>
                  </div>
                </div> */}

                {/* <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-purple-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>
                      Installment / Month
                    </span>
                    <span class='text-gray-900 font-bold'>
                      BDT {loanCalculationData?.per_month}
                    </span>
                  </div>
                </div> */}

                {/* <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-orange-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>Total Term</span>
                    <span class='text-gray-900 font-bold'>
                      {loanCalculationData?.total_term} Months
                    </span>
                  </div>
                </div> */}

                {/* <div class='flex items-center space-x-2 my-1'>
                  <svg
                    class='h-5 w-5 text-red-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z' />
                  </svg>
                  <div class='flex flex-col'>
                    <span class='text-gray-500 font-medium'>
                      Remaining Term
                    </span>
                    <span class='text-gray-900 font-bold'>
                      {loanCalculationData?.remaining_term} Months
                    </span>
                  </div>
                </div> */}
              </div>
            )}

            {partiesRefundInfo && Object.keys(partiesRefundInfo).length > 0 && (
              <div class="relative col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-4 flex items-center justify-between flex-wrap text-sm w-full">
                <div class="flex items-center space-x-2 my-1">
                  <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z" />
                  </svg>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Security Money</span>
                    <span class="text-gray-900 font-bold">
                      BDT {partiesRefundInfo?.security_money}
                    </span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 my-1">
                  <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1.5-12.5a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0v-5z" />
                  </svg>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Total Adjustment</span>
                    <span class="text-gray-900 font-bold">
                      BDT {partiesRefundInfo?.total_adjustment}
                    </span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 my-1">
                  <svg class="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.75-8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25z" />
                  </svg>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Total Payable</span>
                    <span class="text-gray-900 font-bold">
                      BDT {partiesRefundInfo?.total_payable}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={partiesRefundInfo?.total_payable <= 0 || isDisabled}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {postingToEdit ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostingPage;
