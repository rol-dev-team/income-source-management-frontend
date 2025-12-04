import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"; // Import useFormik
import * as Yup from "yup";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable.component";

import { showToast } from "../../helper/toastMessage";
import {
  canChangeStatus,
  canEdit,
  capitalizeFirstLetter,
} from "../../helper/utility";
import { AuthContext } from "../../App";
import {
  getBankDepositPostingsPaginated,
  updateBankDepositPostingStatus,
} from "../../service/bankDepositApi";

const DepositPosting = () => {
  const { user } = useContext(AuthContext) || {};
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editedCurrency, setEditedCurrency] = useState(null);
  const [reloadDataTrigger, setReloadDataTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getBankDepositPostingsPaginated(
          currentPage,
          pageSize,
          filterStatus
        );
        setData(res.data);
        console.log(res);
        setTotalPages(Math.ceil(res.total / pageSize));
      } catch (err) {
        showToast.error(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, pageSize, reloadDataTrigger, filterStatus]);
  const formik = useFormik({
    initialValues: {
      status: "pending",
      rejection_note: "",
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(["approved", "rejected", "pending"])
        .required("Status is required"),
      rejection_note: Yup.string().when("status", {
        is: "rejected",
        then: (schema) =>
          schema.required("Rejection note is required for rejected status"),
      }),
    }),
    onSubmit: async (values) => {
      if (!selectedPosting) return;

      try {
        const response = await updateBankDepositPostingStatus(
          selectedPosting.id,
          values
        );
        showToast.success(
          response?.message || "Posting status updated successfully!"
        );
        setReloadDataTrigger((prev) => prev + 1);
        setIsDrawerOpen(false);
      } catch (err) {
        showToast.error(err.message || "Failed to update posting status");
      }
    },
  });
  const columns = [
    {
      header: "Status",
      accessor: (row) => (
        <button
          onClick={() => handleStatusClick(row)}
          className={`btn-xs ${
            row.status === "approved"
              ? "btn btn-success"
              : row.status === "rejected"
              ? "btn btn-error"
              : "btn btn-warning"
          }  font-bold`}
          disabled={!canChangeStatus(user, row.status)}>
          {capitalizeFirstLetter(row.status)}
        </button>
      ),
    },
    // {
    //   header: "Transaction Type",
    //   accessor: (row) => capitalizeFirstLetter(row.transaction_type),
    //   sortable: true,
    // },

    { header: "Payment Channel", accessor: "method_name", sortable: true },
    { header: "My A/C Name", accessor: "ac_name", sortable: true },
    { header: "My A/C No.", accessor: "ac_no", sortable: true },
    { header: "Amount in BDT", accessor: "amount_bdt", sortable: true },
    { header: "Posting Date", accessor: "posting_date", sortable: true },
    // { header: "Note", accessor: "note", sortable: true },
    // { header: "Rejected Note", accessor: "rejected_note", sortable: true },

    {
      header: "Actions",
      accessor: (row) => (
        <button
          disabled={!canEdit(user, row.status)}
          onClick={() => handleEdit(row)}
          className='text-blue-600 hover:underline'>
          <PencilSquareIcon className='w-5 h-5 text-gray-600' />
        </button>
      ),
    },
  ];
  const handleStatusClick = (posting) => {
    setSelectedPosting(posting);
    formik.resetForm();
    formik.setValues({
      status: posting.status,
      rejection_note: "",
    });
    setIsDrawerOpen(true);
  };
  const handleEdit = (currency) => {
    navigate(`/bank-deposit-create`, { state: { currency } });
  };

  const handleFilterChangeStatus = (event) => {
    const value = event.target.value;
    setFilterStatus(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pageSize={pageSize}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
        handleFilterChangeStatus={handleFilterChangeStatus}
        title='Bank Deposit List'
        link='/bank-deposit-create'
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } bg-white w-80 shadow-lg`}>
        <h5 className='mb-4 text-xl font-semibold text-gray-900'>
          Update Status
        </h5>
        <button
          onClick={() => setIsDrawerOpen(false)}
          className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center'>
          <svg
            className='w-3 h-3'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 14 14'>
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
            />
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>

        <form onSubmit={formik.handleSubmit}>
          <div className='mb-4'>
            <select
              id='status'
              name='status'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formik.errors.status && formik.touched.status
                  ? "border-red-500"
                  : "border-gray-300"
              }`}>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
            {formik.touched.status && formik.errors.status ? (
              <div className='text-red-500 text-sm mt-1'>
                {formik.errors.status}
              </div>
            ) : null}
          </div>

          {/* Conditional textarea for rejection reason */}
          {formik.values.status === "rejected" && (
            <div className='mb-4'>
              <label
                htmlFor='rejection_note'
                className='block text-sm font-medium text-gray-700'>
                Rejection Note
              </label>
              <textarea
                id='rejection_note'
                name='rejection_note'
                rows='4'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rejection_note}
                className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'></textarea>
              {formik.touched.rejection_note && formik.errors.rejection_note ? (
                <div className='text-red-500 text-sm mt-1'>
                  {formik.errors.rejection_note}
                </div>
              ) : null}
            </div>
          )}

          <div className='text-right mt-4'>
            <button
              type='submit'
              disabled={formik.isSubmitting}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out'>
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className='fixed inset-0 z-30 bg-gray-900 bg-opacity-50'></div>
      )}
    </div>
  );
};

export default DepositPosting;
