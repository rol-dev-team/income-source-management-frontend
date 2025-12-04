import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../helper/toastMessage";
import messages from "../constants/message";
import { fetchPosting, updatePostingStatus } from "../service/postingApi"; // Added updatePostingStatus
import { Link } from "react-router-dom";
import DataTable from "../components/common/DataTable.component";
import Button from "../components/common/Button.component";
import { PencilSquareIcon } from "@heroicons/react/24/outline/index.js";
import { useFormik } from "formik"; // Import useFormik
import * as Yup from "yup"; // Import Yup for validation

const PostingTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState(null); // Used to pass data to drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility
  const [reloadDataTrigger, setReloadDataTrigger] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchPosting(currentPage, pageSize);
        setData(res.data);
        setTotalPages(Math.ceil(res.total / pageSize));
      } catch (err) {
        showToast.error(err.message || "Failed to fetch postings");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, pageSize, reloadDataTrigger]);

  // Formik hook for the status update form
  const formik = useFormik({
    initialValues: {
      status: "pending",
      rejection_note: "",
    },
   validationSchema: Yup.object({
  status: Yup.string().oneOf(["approved", "rejected", "pending"]).required("Status is required"),
  rejection_note: Yup.string().when("status", {
    is: "rejected",
    then: (schema) => schema.required("Rejection note is required for rejected status"),
  }),
}),
    onSubmit: async (values) => {
        
      if (!selectedPosting) return;

      try {
        await updatePostingStatus(selectedPosting.id, values);
        showToast.success("Posting status updated successfully!");
        setReloadDataTrigger((prev) => prev + 1); // Reload data after successful update
        setIsDrawerOpen(false); // Close the drawer
      } catch (err) {
        showToast.error(err.message || "Failed to update posting status");
      }
    },
  });

  const handleEditUser = (user) => {
    navigate(`/posting/create?postingId=${user.id}`);
  };

  const handleStatusClick = (posting) => {
    setSelectedPosting(posting);
    formik.resetForm(); // Reset the form with new data
    formik.setValues({
      status: posting.status,
      rejection_note: "",
    });
    setIsDrawerOpen(true);
  };

  const columns = [
    { header: "Source Name", accessor: "source_name", sortable: true },
    { header: "Category", accessor: "cat_name", sortable: true },
    { header: "SubCategory", accessor: "subcat_name", sortable: true },
    { header: "Type", accessor: "expense_type", sortable: true },
    { header: "Channel", accessor: "method_name", sortable: true },
    { header: "Transaction", accessor: "transaction_type", sortable: true },
    { header: "Point of Contact", accessor: "contact_name", sortable: true },
    { header: "Party A/C", accessor: "from_ac", sortable: true },
    { header: "My A/C", accessor: "recived_ac", sortable: true },
    { header: "Exchange Rate", accessor: "exchange_rate", sortable: true },
    { header: "Foreign Currency", accessor: "foreign_currency", sortable: true },
    { header: "Amount", accessor: "total_amount", sortable: true },
    { header: "Posting", accessor: "posting_date", sortable: true },
    { header: "Note", accessor: "note", sortable: true },
    { header: "Reject Reason", accessor: "rejected_note", sortable: true },
    {
      header: "Status",
      accessor: (row) => (
        <button
          onClick={() => handleStatusClick(row)}
          className={`btn-xs btn-outline ${row.status === "approved"? 'btn btn-success' : row.status === "rejected" ? "btn btn-error" : "btn btn-warning"} text-white`}
        >
          {row.status.toUpperCase()}
        </button>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <button
          onClick={() => handleEditUser(row)}
          className="text-blue-600 hover:underline"
        >
          <PencilSquareIcon className="w-5 h-5 text-gray-600" />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full relative transition-all duration-300 shadow rounded">
      <DataTable
        columns={columns}
        data={data}
        pageSize={pageSize}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } bg-white w-80 shadow-lg`}
      >
        <h5 className="mb-4 text-xl font-semibold text-gray-900">Update Status</h5>
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${formik.errors.status && formik.touched.status ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            {formik.touched.status && formik.errors.status ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
            ) : null}
          </div>

          {/* Conditional textarea for rejection reason */}
          {formik.values.status === "rejected" && (
            <div className="mb-4">
              <label htmlFor="rejection_note" className="block text-sm font-medium text-gray-700">
                Rejection Note
              </label>
              <textarea
                id="rejection_note"
                name="rejection_note"
                rows="4"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rejection_note}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              ></textarea>
              {formik.touched.rejection_note && formik.errors.rejection_note ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.rejection_note}</div>
              ) : null}
            </div>
          )}

          <button type="submit" isLoading={formik.isSubmitting} className="flex justify-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out">Update</button>
         
        </form>
      </div>

      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50"
        ></div>
      )}
    </div>
  );
};

export default PostingTable;