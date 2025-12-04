import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable.component";
import {
  getHousePartyMappingPaginated,
  getRentalPartiesPaginated,
} from "../../service/rentalApi";

const HousePartyMappingPostingPage = () => {
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
        const res = await getHousePartyMappingPaginated(currentPage, pageSize);
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
    { header: "Party Name", accessor: "party_name", sortable: true },

    {
      header: "House",
      accessor: "house_name",
      sortable: true,
    },
  

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
    navigate(`/rental/house-party-mapping-create`, { state: { currency } });
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
        title='House Party Mapping List'
        link='/rental/house-party-mapping-create'
      />
    </div>
  );
};

export default HousePartyMappingPostingPage;
