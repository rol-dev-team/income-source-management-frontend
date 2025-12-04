import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable.component";
import { fetchUsers } from "../../service/userApi";


const UsersPage = () => {

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
            const res = await fetchUsers(currentPage, pageSize);
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
          { header: "Full Name", accessor: "full_name", sortable: true },
          { header: "Username", accessor: "username", sortable: true },
          { header: "Email", accessor: "email", sortable: true },
          { header: "Role", accessor: "role", sortable: true },
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
      navigate(`/settings/create-user`, { state: { currency } });
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
            title="Users"
            link="/settings/create-user"
          />
    </div>
  )
}

export default UsersPage
