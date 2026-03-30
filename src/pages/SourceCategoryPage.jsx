import { DynamicForm } from "../components/forms/DynamicForm.component";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../components/common/DataTable.component";
import { showToast } from "../helper/toastMessage";
import messages from "../constants/message";

import { sourceCategoryFormFields } from "../constants/forms/sourceCategoryForm";
import { sourceCategoryFormValidationSchema } from "../schemas/sourceCategorySchemas";
import {
  createSourceCategory,
  fetchSourceCategory,
  updateSourceCategory,
} from "../service/sourceCategoryApi";
import { fetchSources } from "../service/sourceApi";

const SourceCategoryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSection, setVisibleSection] = useState("both");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formKey, setFormKey] = useState(0); // For forcing form re-render
  const [reloadDataTrigger, setReloadDataTrigger] = useState(0); // New state to trigger data reload
  const [sourceOptions, setSourceOptions] = useState([]);

  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchSourceCategory(currentPage, pageSize);
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

  useEffect(() => {
    const loadSourceOptions = async () => {
      try {
        const { data } = await fetchSources();
        if (Array.isArray(data)) {
          const finalOption = data?.map((item) => ({
            label: item.source_name,
            value: item.id,
          }));
          setSourceOptions(finalOption);
        } else {
          setSourceOptions([]);
        }
      } catch (error) {
        showToast.error("Failed to load channel options.");
      }
    };
    loadSourceOptions();
  }, []);

  const dynamicSourceCategoryFormFields = useMemo(() => {
    const fields = JSON.parse(JSON.stringify(sourceCategoryFormFields));

    const channelIdField = fields.find((field) => field.name === "source_id");
    if (channelIdField) {
      channelIdField.options = sourceOptions;
    }
    return fields;
  }, [sourceOptions]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setVisibleSection("form");
    setFormKey((prevKey) => prevKey + 1); // Force form re-render for edit
  };

  const handleClearForm = () => {
    setSelectedUser(null);
    setFormKey((prevKey) => prevKey + 1); // Force form re-render for clearing
  };

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Source Name", accessor: "source_name", sortable: true },
    { header: "Source Category", accessor: "cat_name", sortable: true },
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
      setIsLoading(true);
      if (selectedUser) {
        await updateSourceCategory(selectedUser.id, formData);
        showToast.success(
          messages.user.updateSuccess || "Updated successfully!"
        );
      } else {
        await createSourceCategory(formData);
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
      setIsLoading(false);
    }
  };

  return (
    <div className='md:flex gap-3'>
      {/* Table Section */}
      {(visibleSection === "both" || visibleSection === "table") && (
        <div
          className={`${
            visibleSection === "both" ? "md:w-1/2" : "w-full"
          } p-2 relative transition-all duration-300 shadow rounded`}>
          <h3 className='text-lg font-semibold mb-3'>Category List</h3>
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
          } p-2 relative transition-all duration-300 rounded shadow`}>
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

          <h3 className='text-lg font-semibold mb-3'>
            {selectedUser ? "Edit Category" : "Create Category"}
          </h3>
          <DynamicForm
            key={formKey}
            fields={dynamicSourceCategoryFormFields}
            onSubmit={handleSubmit}
            validationSchema={sourceCategoryFormValidationSchema}
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

export default SourceCategoryPage;
