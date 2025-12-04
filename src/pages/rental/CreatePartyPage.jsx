import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastMessage";
import { createLoanParty, updateLoanParty } from "../../service/loanApi";
import SelectField from "../../components/common/SelectField";
import { fetchAllPaymentChannels } from "../../service/paymentChannelDetailsApi";
import { fetchAccountNumberByChannelId } from "../../service/accountNumberApi";
import {
  createRentalParty,
  getAllRentalHouses,
  updateRentalHouse,
  updateRentalParty,
} from "../../service/rentalApi";

// --- Constants for IDs (Adjust these if your actual IDs are different) ---
const CASH_PAYMENT_CHANNEL_ID = 8;
const CASH_ACCOUNT_ID = 1;
// -------------------------------------------------------------------------

const validationSchema = yup.object({
  party_name: yup.string().required("Party Name is required"),
  cell_number: yup
    .string()
    .matches(/^[0-9]+$/, "Cell Number must be a number")
    .required("Cell Number is required"),
  nid: yup
    .string()
    .matches(/^[0-9]+$/, "NID must be a number")
    .required("NID is required"),

  // party_ac_no: yup.string().required("Party A/C No. is required"),
});

const CreatePartyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const partyToEdit = location.state?.currency;

  const [houseOptions, setHouseOptions] = useState([]);
  const [paymentChannelOptions, setPaymentChannelOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isAccountNoDependentLoading, setIsAccountNoDependentLoading] =
    useState(false);

  // Helper to find the {value, label} object from an ID
  const findOption = (options, value) =>
    options.find((option) => String(option.value) === String(value)) || null;

  // Helper to find an array of {value, label} objects from an array of IDs
  const findOptions = (options, values) =>
    options.filter(
      (option) => Array.isArray(values) && values.includes(option.value)
    ) || [];

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [paymentChannelRes, houses] = await Promise.all([
          fetchAllPaymentChannels(),
          getAllRentalHouses(),
        ]);
        const paymentChannelResMapped = (paymentChannelRes.data || []).map(
          (pc) => ({
            value: pc.id,
            label: pc.method_name,
          })
        );
        const houseResMapped = (houses.data || []).map((house) => ({
          value: house.id,
          label: house.house_name,
        }));
        setHouseOptions(houseResMapped);
        setPaymentChannelOptions(paymentChannelResMapped);
      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      party_name: "",
      cell_number: "",
      nid: "",
      party_ac_no: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
      };
      try {
        if (partyToEdit) {
          await updateRentalParty(partyToEdit?.id, payload);
          showToast.success("Posting updated successfully!");
        } else {
          await createRentalParty(payload);
          showToast.success("Posting created successfully!");
        }
        resetForm();
        navigate("/rental/party");
      } catch (error) {
        console.error("Error submitting form:", error);
        showToast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  // Load account options based on selected payment channel ID
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
        const acountMapped = (data || []).map((ac) => ({
          value: ac.id,
          label: ac.ac_name + " - " + ac.ac_no,
        }));
        setAccountOptions(acountMapped);
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

  useEffect(() => {
    if (partyToEdit) {
      formik.setFieldValue("party_name", partyToEdit.party_name || "");
      formik.setFieldValue("cell_number", partyToEdit.cell_number || "");
      formik.setFieldValue("nid", partyToEdit.nid || "");
      formik.setFieldValue("party_ac_no", partyToEdit.party_ac_no || "");
    }
  }, [partyToEdit, paymentChannelOptions, houseOptions]);

  const handleSelectBlur = (name) => () => {
    formik.setFieldTouched(name, true);
  };

  const handleHouseSelectChange = (selectedOptions) => {
    formik.setFieldValue("house", selectedOptions || []);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h4 className='text-lg font-semibold mb-4 text-gray-700'>
            {partyToEdit ? "Update Party" : "Create Party"}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-4'>
            {/* Party Name */}
            <div className='relative'>
              <input
                id='party_name'
                name='party_name'
                type='text'
                placeholder='Enter Party Name'
                value={formik.values.party_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.party_name && formik.errors.party_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.party_name}
                </p>
              )}
            </div>

            {/* Cell Number */}
            <div className='relative'>
              <input
                id='cell_number'
                name='cell_number'
                type='text'
                placeholder='Enter Cell Number'
                value={formik.values.cell_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.cell_number && formik.errors.cell_number && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.cell_number}
                </p>
              )}
            </div>

            {/* NID */}
            <div className='relative'>
              <input
                id='nid'
                name='nid'
                type='text'
                placeholder='Enter NID'
                value={formik.values.nid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.nid && formik.errors.nid && (
                <p className='mt-1 text-sm text-red-500'>{formik.errors.nid}</p>
              )}
            </div>

            {/* Party A/C No. (Text) */}
            <div className='relative'>
              <input
                id='party_ac_no'
                name='party_ac_no'
                type='text'
                placeholder='Party A/C No.'
                value={formik.values.party_ac_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              />
              {formik.touched.party_ac_no && formik.errors.party_ac_no && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.party_ac_no}
                </p>
              )}
            </div>

            {/* Submit Button */}
          </div>
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

export default CreatePartyPage;
