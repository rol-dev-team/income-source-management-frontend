import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable.component";
import { getCurrenciesPaginated } from "../../service/currency-trading/currencyApi";

const CurrencyPage = () => {

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
            const res = await getCurrenciesPaginated(currentPage, pageSize);
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
        { header: "ID", accessor: "id", sortable: true },
        { header: "Currency Name", accessor: "currency", sortable: true },
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
      // Instead of setting state, navigate to the edit page with the currency ID
      navigate(`/currency-trading/create`, { state: { currency } });
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
            title="Currencies"
            link="/currency-trading/create"
          />
    </div>
  )
}

export default CurrencyPage
