import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
import { getTransfersPaginated } from "../../service/transferApi";

const TransferPage = () => {
  const { user } = useContext(AuthContext) || {};
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editedCurrency, setEditedCurrency] = useState(null);
  const [reloadDataTrigger, setReloadDataTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getTransfersPaginated(currentPage, pageSize);
        setData(res.data);
        setTotalPages(Math.ceil(res.total / pageSize));
      } catch (err) {
        showToast.error(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, pageSize, reloadDataTrigger]);

  const columns = [
    // { header: "Transfer ID", accessor: "transfer_id", sortable: true },
    {
      header: "Transaction Type",
      accessor: (row) => capitalizeFirstLetter(row.transaction_type),
      sortable: true,
    },
    { header: "Payment Channel", accessor: "method_name", sortable: true },
    { header: "My A/C Name", accessor: "ac_name", sortable: true },
    { header: "My A/C No.", accessor: "ac_no", sortable: true },
    { header: "Amount in BDT", accessor: "amount_bdt", sortable: true },
    { header: "Transfer Date", accessor: "transfer_date", sortable: true },
    { header: "Note", accessor: "note", sortable: true },

    {
      header: "Actions",
      accessor: (row) => (
        <button
          // disabled={!canEdit(user, row.status)}
          disabled={true}
          onClick={() => handleEdit(row)}
          className='text-blue-600 hover:underline'>
          <PencilSquareIcon className='w-5 h-5 text-gray-600' />
        </button>
      ),
    },
  ];

  const handleEdit = (currency) => {
    navigate(`/transfer/create`, { state: { currency } });
  };

  const handleStatusClick = (posting) => {
    setSelectedPosting(posting);
    formik.resetForm();
    formik.setValues({
      status: posting.status,
      rejection_note: "",
    });
    setIsDrawerOpen(true);
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
        title='Transfers'
        link='/transfer/create'
      />
    </div>
  );
};

export default TransferPage;
