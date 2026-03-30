import { DynamicForm } from "../components/forms/DynamicForm.component";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../components/common/DataTable.component";
import { showToast } from "../helper/toastMessage";
import messages from "../constants/message";
import { createSource, fetchSources, updateSource } from "../service/sourceApi";
import { sourceFormFields } from "../constants/forms/sourceForm";
import { sourceFormValidationSchema } from "../schemas/source.schemas";

const SourcePage = () => {
  const [isLoading, setIsloading] = useState(false);
  const [visibleSection, setVisibleSection] = useState("both");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [reloadDataTrigger, setReloadDataTrigger] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchSources(currentPage, pageSize);
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

  // Function to handle editing a user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setVisibleSection("form");
    setFormKey((prevKey) => prevKey + 1);
  };

  // Function to clear the form and reset selected user
  const handleClearForm = () => {
    setSelectedUser(null);
    setFormKey((prevKey) => prevKey + 1);
    // Optionally set visibleSection to 'both' or 'table' after clearing
    // For now, let's keep it on 'form' if the user was editing
  };

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Name", accessor: "source_name", sortable: true },
    {
      header: "Status",
      accessor: (row) => (
        <span className={row.status === 1 ? "text-green-600" : "text-red-600"}>
          {row.status === 1 ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    { header: "Remark", accessor: "remarks", sortable: true },
    {
      header: "Actions",
      accessor: (row) => (
        <button
          onClick={() => handleEditUser(row)}
          className='text-blue-600 hover:underline'>
          <PencilSquareIcon className='w-5 h-5 text-gray-600' />
        </button>
      ),
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      setIsloading(true);
      if (selectedUser) {
        // If selectedUser exists, it's an update operation
        await updateSource(selectedUser.id, formData); // Assuming your updateUser API takes ID and data
        showToast.success(
          messages.user.updateSuccess || "User updated successfully!"
        );
      } else {
        // Otherwise, it's a new user registration
        await createSource(formData);
        showToast.success(messages.user.createSuccess);
      }
      setSelectedUser(null); // Clear selected user to reset the form
      setFormKey((prevKey) => prevKey + 1); // Force form re-render/clear

      setReloadDataTrigger((prev) => prev + 1);
      setCurrentPage(1);

      setVisibleSection("both");
    } catch (error) {
      showToast.error(error.message || "Operation failed");
    } finally {
      setIsloading(false);
    }
  };
  const filteredSourceFormFields = selectedUser
    ? sourceFormFields
    : sourceFormFields.filter((field) => field.name !== "status");
  return (
    <div className='md:flex '>
      {/* Table Section */}
      {(visibleSection === "both" || visibleSection === "table") && (
        <div
          className={`${
            visibleSection === "both" ? "md:w-1/2" : "w-full"
          } p-4 relative transition-all duration-300`}>
          {/* Top-right Button */}
          <div className='absolute top-2 right-2 z-10'>
            {visibleSection === "both" && (
              <button
                onClick={() => setVisibleSection("form")}
                className='bg-gray-200 hover:bg-gray-300 rounded-full p-1 shadow'
                aria-label='Hide Table'
                title='Hide Table'>
                <ChevronRightIcon className='w-5 h-5 text-gray-600' />
              </button>
            )}
            {visibleSection === "table" && (
              <button
                onClick={() => setVisibleSection("both")}
                className='bg-gray-200 hover:bg-gray-300 rounded-full p-1 shadow'
                aria-label='Show Both'
                title='Show Both'>
                <ChevronLeftIcon className='w-5 h-5 text-gray-600' />
              </button>
            )}
          </div>

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
          />
        </div>
      )}

      {/* Form Section */}
      {(visibleSection === "both" || visibleSection === "form") && (
        <div
          className={`${
            visibleSection === "both" ? "md:w-1/2" : "w-full"
          } p-4 relative transition-all duration-300`}>
          {/* Top-right Button */}
          <div className='absolute top-2 right-2 z-10'>
            {visibleSection === "both" && (
              <button
                onClick={() => setVisibleSection("table")}
                className='bg-gray-200 hover:bg-gray-300 rounded-full p-1 shadow'
                aria-label='Hide Form'
                title='Hide Form'>
                <ChevronLeftIcon className='w-5 h-5 text-gray-600' />
              </button>
            )}
            {visibleSection === "form" && (
              <button
                onClick={() => setVisibleSection("both")}
                className='bg-gray-200 hover:bg-gray-300 rounded-full p-1 shadow'
                aria-label='Show Both'
                title='Show Both'>
                <ChevronRightIcon className='w-5 h-5 text-gray-600' />
              </button>
            )}
          </div>

          <h2 className='text-xl font-semibold mb-4'>
            {selectedUser ? "Edit Source" : "Create Source"}
          </h2>
          <DynamicForm
            key={formKey}
            fields={filteredSourceFormFields}
            onSubmit={handleSubmit}
            validationSchema={sourceFormValidationSchema}
            label={selectedUser ? "Update" : "Create"}
            isLoading={isLoading}
            disabled={isLoading}
            initialData={selectedUser}
            onClear={handleClearForm}
          />
        </div>
      )}
    </div>
  );
};

export default SourcePage;
