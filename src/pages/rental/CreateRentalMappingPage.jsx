
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import SelectField from "../../components/common/SelectField";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import { fetchAccountNumberByChannelId } from "../../service/accountNumberApi";
import DatePickerMonth from "../../components/common/DatePickerMonth";
import {
  getAllRentalParties,
  getAllRentalHouses,
  createHousePartyMapping,
  updateHousePartyMapping,
  updateRentalMapping,
  createRentalMapping,
  getAllHousePartyMapping,
  getPartyWiseHouses,
} from "../../service/rentalApi";

// --- Constants for IDs ---
const CASH_PAYMENT_CHANNEL_ID = 8;
const CASH_ACCOUNT_ID = 1;

// Validation schema
const validationSchema = yup.object({
  party_name: yup.string().required("Party Name is required"),
  house: yup.string().required("House is required"),
  // security_money: yup
  //   .number()
  //   .typeError("Security Money must be a number")
  //   .positive("Security Money must be positive")
  //   .required("Security Money is required"),
  payment_channel_id: yup.string().required("Payment Channel is required"),
  account_id: yup.string().required("My A/C No. is required"),
  monthly_rent: yup
    .number()
    .typeError("Monthly Rent must be a number")
    .positive("Monthly Rent must be positive")
    .required("Monthly Rent is required"),
  status: yup.string().required("Status is required"),
  rent_start_date: yup.date().required("Rent Start Date is required"),
});

const CreateRentalMappingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const partyToEdit = location.state?.currency;

  const [partyOptions, setPartyOptions] = useState([]);
  const [houseOptions, setHouseOptions] = useState([]);
  const [paymentChannelOptions, setPaymentChannelOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] =
    useState(false);

  // Helper to find {value,label} from id
  const findOption = (options, value) =>
    options.find((option) => String(option.value) === String(value)) || null;

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes, houses, partyRes] = await Promise.all([
          fetchAllPaymentChannels(),
          getAllRentalHouses(),
          getAllRentalParties(),
        ]);

        setPaymentChannelOptions(
          (paymentChannelRes.data || []).map((pc) => ({
            value: pc.id,
            label: pc.method_name,
          }))
        );

        // setHouseOptions(
        //   (houses.data || []).map((house) => ({
        //     value: house.id,
        //     label: house.house_name,
        //   }))
        // );

        setPartyOptions(
          (partyRes.data || []).map((p) => ({
            value: p.id,
            label: p.party_name,
          }))
        );
      } catch (error) {
        console.error("Error loading initial options:", error);
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);


  const formik = useFormik({
    initialValues: {
      party_name: "",
      house: "",
      security_money: "",
      payment_channel_id: "",
      account_id: "",
      monthly_rent: "",
      auto_adjustment: "",
      rent_start_date: "",
      rent_end_date: "",
      status: "active",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        rental_house_id: values.house,
        rental_party_id: values.party_name,
      };
      try {
        if (partyToEdit) {
          await updateRentalMapping(partyToEdit.id, payload);
          showToast.success("Posting updated successfully!");
        } else {
          await createRentalMapping(payload);
          showToast.success("Posting created successfully!");
        }
        resetForm();
        navigate("/rental/mapping");
      } catch (error) {
        console.error("Error submitting form:", error);
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });
 
  // party wise house
   useEffect(() => {
      const loadMappingDataOptions = async () => {
        if (!formik.values.party_name) {
          setHouseOptions([]);
          return;
        }
        try {
          const { data } = await getPartyWiseHouses(formik.values.party_name);
          setHouseOptions(
          (data || []).map((house) => ({
            value: house.id,
            label: house.house_name,
          }))
        );
        } catch (error) {
          showToast.error('Failed to load account options.');
        } finally {
        }
      };
      loadMappingDataOptions();
    }, [formik.values.party_name]);
  // Load account options based on payment channel
  useEffect(() => {
    const loadAccountOptions = async () => {
      if (!formik.values.payment_channel_id) {
        setAccountOptions([]);
        return;
      }

      setIsAccountNoDependentLoading(true);
      try {
        const { data } = await fetchAccountNumberByChannelId(
          formik.values.payment_channel_id
        );
        setAccountOptions(
          (data || []).map((ac) => ({
            value: ac.id,
            label: ac.ac_name + " - " + ac.ac_no,
          }))
        );
      } catch (error) {
        showToast.error("Failed to load account options.");
      } finally {
        setIsAccountNoDependentLoading(false);
      }
    };
    loadAccountOptions();
  }, [formik.values.payment_channel_id]);

  const handlePaymentChannelSelectChange = (option) => {
    const selectedId = option ? option.value : "";
    formik.setFieldValue("payment_channel_id", selectedId);
    formik.setFieldTouched("payment_channel_id", true);

    if (String(selectedId) === String(CASH_PAYMENT_CHANNEL_ID)) {
      formik.setFieldValue("account_id", CASH_ACCOUNT_ID);
    } else {
      formik.setFieldValue("account_id", "");
    }
  };

  // Load edit data into form
  useEffect(() => {
    if (
      partyToEdit &&
      partyOptions.length &&
      paymentChannelOptions.length
    ) {
      formik.setFieldValue("party_name", partyToEdit.party_id);
      formik.setFieldValue("house", partyToEdit.house_id);
      formik.setFieldValue(
        "payment_channel_id",
        partyToEdit.method_name === "Cash"
          ? CASH_PAYMENT_CHANNEL_ID
          : partyToEdit.payment_channel_id
      );
      formik.setFieldValue(
        "account_id",
        partyToEdit.ac_name === "Cash"
          ? CASH_ACCOUNT_ID
          : partyToEdit.account_id
      );
      formik.setFieldValue("security_money", partyToEdit.security_money);
      formik.setFieldValue("monthly_rent", partyToEdit.monthly_rent);
      formik.setFieldValue("auto_adjustment", partyToEdit.auto_adjustment);
      formik.setFieldValue("rent_start_date", partyToEdit.rent_start_date);
      formik.setFieldValue("rent_end_date", partyToEdit.rent_end_date);
      formik.setFieldValue("status", partyToEdit.status || "active");
    }
  }, [partyToEdit, partyOptions, paymentChannelOptions]);

  const handleSelectBlur = (name) => () => {
    formik.setFieldTouched(name, true);
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

 console.log('edit',partyToEdit);
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-lg font-semibold mb-4 text-gray-700'>
            {partyToEdit
              ? "Update Rental Mapping "
              : "Create Rental Mapping"}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-4'>
            {/* Party Name */}
            <div className='relative'>
              <SelectField
                id='party_name'
                name='party_name'
                options={partyOptions}
                value={findOption(partyOptions, formik.values.party_name)}
                onChange={(option) =>
                  formik.setFieldValue("party_name", option ? option.value : "")
                }
                onBlur={handleSelectBlur("party_name")}
                placeholder='Select Party Name'
              />
              {formik.touched.party_name && formik.errors.party_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.party_name}
                </p>
              )}
            </div>

            {/* House */}
            <div className='relative'>
              <SelectField
                id='house'
                name='house'
                options={houseOptions}
                value={findOption(houseOptions, formik.values.house)}
                onChange={(option) =>
                  formik.setFieldValue("house", option ? option.value : "")
                }
                onBlur={handleSelectBlur("house")}
                placeholder='Select House'
              />
              {formik.touched.house && formik.errors.house && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.house}
                </p>
              )}
            </div>

            {/* Monthly Rent */}
            <div className='relative'>
              <input
                id='monthly_rent'
                name='monthly_rent'
                type='number'
                placeholder='Enter Monthly Rent'
                value={formik.values.monthly_rent}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.monthly_rent && formik.errors.monthly_rent && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.monthly_rent}
                </p>
              )}
            </div>

            {/* Auto Adjustment */}
            <div className='relative'>
              <input
                id='auto_adjustment'
                name='auto_adjustment'
                type='number'
                placeholder='Enter Auto Adjustment Amount'
                value={formik.values.auto_adjustment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.auto_adjustment &&
                formik.errors.auto_adjustment && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.auto_adjustment}
                  </p>
                )}
            </div>

            {/* Security Money */}
            <div className='relative'>
              <input
                id='security_money'
                name='security_money'
                type='number'
                placeholder='Enter Security Money'
                value={formik.values.security_money}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.security_money &&
                formik.errors.security_money && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.security_money}
                  </p>
                )}
            </div>

            {/* Payment Channel */}
            <div className='relative'>
              <SelectField
                id='payment_channel_id'
                name='payment_channel_id'
                options={paymentChannelOptions}
                value={findOption(
                  paymentChannelOptions,
                  formik.values.payment_channel_id
                )}
                onChange={handlePaymentChannelSelectChange}
                onBlur={handleSelectBlur("payment_channel_id")}
                placeholder='My Payment Channel'
              />
              {formik.touched.payment_channel_id &&
                formik.errors.payment_channel_id && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.payment_channel_id}
                  </p>
                )}
            </div>

            {/* Account ID */}
            <div className='relative'>
              <SelectField
                id='account_id'
                name='account_id'
                options={accountOptions}
                value={findOption(accountOptions, formik.values.account_id)}
                onChange={(option) =>
                  formik.setFieldValue("account_id", option ? option.value : "")
                }
                onBlur={handleSelectBlur("account_id")}
                placeholder='My A/C No.'
                isDisabled={
                  String(formik.values.payment_channel_id) ===
                    String(CASH_PAYMENT_CHANNEL_ID) ||
                  isAccountNoDependentLoading
                }
              />
              {formik.touched.account_id && formik.errors.account_id && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.account_id}
                </p>
              )}
            </div>

            {/* Rent Start Date */}
           <div className="flex gap-3">
             <div>
              <DatePickerMonth
                value={formik.values.rent_start_date}
                placeholderTextValue="Rent Start Month"
                onChange={(val) => formik.setFieldValue("rent_start_date", val)}
              />
              {formik.touched.rent_start_date &&
                formik.errors.rent_start_date && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.rent_start_date}
                  </p>
                )}
            </div>
               {partyToEdit?.rent_end_date === null && (
                  <div>
              <DatePickerMonth
                value={formik.values.rent_end_date}
                placeholderTextValue="Rent End Month"
                onChange={(val) => formik.setFieldValue("rent_end_date", val)}
              />
              {formik.touched.rent_end_date &&
                formik.errors.rent_end_date && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formik.errors.rent_end_date}
                  </p>
                )}
            </div>
                )}
            
           </div>
            

            {/* Status Dropdown */}
            <div className='relative'>
              <SelectField
                id='status'
                name='status'
                options={statusOptions}
                value={findOption(statusOptions, formik.values.status)}
                onChange={(option) =>
                  formik.setFieldValue("status", option ? option.value : "")
                }
                onBlur={handleSelectBlur("status")}
                placeholder='Select Status'
              />
              {formik.touched.status && formik.errors.status && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.status}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className='w-full flex justify-end mt-4'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out'>
              {partyToEdit ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRentalMappingPage;
