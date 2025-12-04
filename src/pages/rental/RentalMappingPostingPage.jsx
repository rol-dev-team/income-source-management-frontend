
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable.component";
import {
  getHousePartyMappingPaginated,
  getRentalMappingPaginated,
  getRentalPartiesPaginated,
} from "../../service/rentalApi";

const RentalMappingPostingPage = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editedCurrency, setEditedCurrency] = useState(null);
  const [reloadDataTrigger, setReloadDataTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getRentalMappingPaginated(currentPage, pageSize);
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
    // { header: "Party Name", accessor: "party_name", sortable: true },
    // { header: "Cell No.", accessor: "cell_number", sortable: true },
    // { header: "NID", accessor: "nid", sortable: true },
    {
      header: "House",
      accessor: "house_name",
      sortable: true,
    },
    { header: "Security Money", accessor: "security_money", sortable: true },
    { header: "Monthly Rent", accessor: "monthly_rent", sortable: true },
    { header: "Auto Adjustment", accessor: "auto_adjustment", sortable: true },
    {
      header: "Remaining Security Money",
      accessor: "remaining_security_money",
      sortable: true,
    },
    {
      header: "Refund Security Money",
      accessor: "refund_security_money",
      sortable: true,
    },
    { header: "Payment Channel", accessor: "method_name", sortable: true },
    { header: "My A/C No.", accessor: "ac_no", sortable: true },
    { header: "My A/C Name", accessor: "ac_name", sortable: true },
    // { header: "Party A/C No.", accessor: "party_ac_no", sortable: true },
    { header: "Rent Start Date", accessor: "rent_start_date", sortable: true },
     { header: "Rent End Date", accessor: "rent_end_date", sortable: true },
    { header: "Status", accessor: "status", sortable: true },

    {
      header: "Actions",
      accessor: (row) => (
        <button
          onClick={() => handleEdit(row)}
          className='text-blue-600 hover:underline'>
          <PencilSquareIcon className='w-5 h-5 text-gray-600' />
        </button>
      ),
    },
  ];

  const handleEdit = (currency) => {
    navigate(`/rental/mapping-create`, { state: { currency } });
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
        title='Rental Mapping List'
        link='/rental/mapping-create'
      />
    </div>
  );
};

export default RentalMappingPostingPage;
