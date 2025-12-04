// import React, { useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   MagnifyingGlassIcon,
//   ChevronDownIcon,
//   PlusIcon,
// } from "@heroicons/react/24/solid";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const DataTable = ({
//   columns = [],
//   data = [],
//   loading = false,
//   onPageChange,
//   currentPage,
//   totalPages,
//   pageSize, // We will now use this prop to control the page size
//   onPageSizeChange, // New prop to handle page size changes
//   title = "Data Table",
//   link = "#",
//   handleFilterChangeStatus,
// }) => {
//   const [sortConfig, setSortConfig] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

//   const filteredAndSortedData = useMemo(() => {
//     const filteredData = data.filter((row) =>
//       columns.some((col) => {
//         const cellValue =
//           typeof col.accessor === "function"
//             ? col.accessor(row)
//             : row[col.accessor];
//         return String(cellValue)
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//       })
//     );

//     if (!sortConfig) return filteredData;

//     const sorted = [...filteredData].sort((a, b) => {
//       const aValue =
//         typeof sortConfig.accessor === "function"
//           ? sortConfig.accessor(a)
//           : a[sortConfig.accessor];
//       const bValue =
//         typeof sortConfig.accessor === "function"
//           ? sortConfig.accessor(b)
//           : b[sortConfig.accessor];

//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     return sorted;
//   }, [data, sortConfig, searchTerm, columns]);

//   const handleSort = (col) => {
//     if (!col.sortable) return;

//     if (sortConfig?.accessor === col.accessor) {
//       setSortConfig({
//         accessor: col.accessor,
//         direction: sortConfig.direction === "asc" ? "desc" : "asc",
//       });
//     } else {
//       setSortConfig({ accessor: col.accessor, direction: "asc" });
//     }
//     if (onPageChange) onPageChange(1);
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     if (onPageChange) onPageChange(page);
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//     if (onPageChange) onPageChange(1);
//   };

//   const handlePageSizeChange = (newSize) => {
//     if (onPageSizeChange) {
//       onPageSizeChange(newSize);
//     }
//     setShowPageSizeDropdown(false);
//   };

//   return (
//     <div className='w-full bg-white rounded shadow border px-4'>
//       <div className='my-4'>
//         <div className='flex justify-between items-start gap-4 mb-4'>
//           {/* Left-aligned title container */}
//           <h2 className='text-lg font-semibold flex-grow'>{title}</h2>

//           {/* Right-aligned actions container */}
//           <div className='flex-shrink-0'>
//             <Link
//               to={link}
//               className='flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-md text-sm font-medium'>
//               <PlusIcon className='h-5 w-5' />
//               <span>Create</span>
//             </Link>
//           </div>
//         </div>

//         {/* Search field, placed below the title */}
//         <div className='flex justify-between items-center'>
//           <div className='relative w-full max-w-lg'>
//             <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
//               <MagnifyingGlassIcon className='w-4 h-4 text-gray-400' />
//             </div>
//             <input
//               type='text'
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className='block rounded-md border-0 py-1.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
//               placeholder='Search...'
//             />
//           </div>
//           {(title === "Currency Postings" ||
//             title === "Income & Expense Postings" ||
//             title === "Bank Deposit Postings" ||
//             title === "Loan Postings" ||
//             title === "Investment Postings" ||
//             title === "Rental Postings" ||
//             title === "Bank Deposit List") && (
//             <div className=' w-100'>
//               <select
//                 id='status'
//                 name='status'
//                 onChange={handleFilterChangeStatus}
//                 className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "border-gray-300"`}>
//                 <option value='pending'>Pending</option>
//                 <option value='all'>All</option>
//                 <option value='approved'>Approved</option>
//                 <option value='rejected'>Rejected</option>
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className='w-full overflow-x-auto'>
//         <table className='w-full divide-y divide-gray-200'>
//           <thead className='bg-gray-50'>
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col.header}
//                   scope='col'
//                   onClick={() => handleSort(col)}
//                   className={classNames(
//                     "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none",
//                     col.sortable && "hover:text-gray-700"
//                   )}>
//                   <div className='flex items-center gap-1'>
//                     {col.header}
//                     {sortConfig?.accessor === col.accessor ? (
//                       sortConfig.direction === "asc" ? (
//                         <svg
//                           className='w-3 h-3 text-gray-600'
//                           fill='none'
//                           stroke='currentColor'
//                           strokeWidth='2'
//                           viewBox='0 0 24 24'
//                           xmlns='http://www.w3.org/2000/svg'>
//                           <path d='M5 15l7-7 7 7'></path>
//                         </svg>
//                       ) : (
//                         <svg
//                           className='w-3 h-3 text-gray-600'
//                           fill='none'
//                           stroke='currentColor'
//                           strokeWidth='2'
//                           viewBox='0 0 24 24'
//                           xmlns='http://www.w3.org/2000/svg'>
//                           <path d='M19 9l-7 7-7-7'></path>
//                         </svg>
//                       )
//                     ) : null}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className='bg-white divide-y divide-gray-200'>
//             {loading ? (
//               <tr>
//                 <td colSpan={columns.length} className='text-center py-6'>
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredAndSortedData.length > 0 ? (
//               filteredAndSortedData.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                   {columns.map((col) => (
//                     <td
//                       key={col.header}
//                       className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
//                       {typeof col.accessor === "function"
//                         ? col.accessor(row)
//                         : row[col.accessor]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className='text-center py-6 text-gray-500'>
//                   No data available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* Pagination Controls and Search Footer */}
//       <div className='flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-gray-50 border-t gap-2 sm:gap-0'>
//         {/* Page size and Search container */}
//         <div className='flex items-center gap-2 relative'>
//           {/* Page Size Label */}
//           <span className='text-sm text-gray-700'>Rows per page</span>

//           {/* Page Size Dropdown */}
//           <div className='relative'>
//             <button
//               onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
//               className='flex items-center justify-between min-w-[120px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
//               {pageSize}
//               <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5 text-gray-400' />
//             </button>
//             {showPageSizeDropdown && (
//               <div className='absolute right-0 bottom-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mb-2'>
//                 <div className='py-1'>
//                   {[10, 20, 50, 100].map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => {
//                         handlePageSizeChange(size);
//                       }}
//                       className={classNames(
//                         size === pageSize
//                           ? "bg-gray-100 text-gray-900"
//                           : "text-gray-700",
//                         "block px-4 py-2 text-sm w-full text-left"
//                       )}>
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Pagination Controls */}
//         <div className='flex items-center space-x-2'>
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
//             <ChevronLeftIcon className='w-4 h-4' />
//           </button>
//           <div className='flex items-center space-x-1'>
//             <button
//               className={classNames(
//                 "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
//                 currentPage === currentPage
//                   ? "bg-blue-600 text-white"
//                   : "bg-transparent text-gray-700 hover:bg-gray-200"
//               )}
//               onClick={() => handlePageChange(1)}>
//               {currentPage}
//             </button>
//             {totalPages > 2 && (
//               <span className='text-sm text-gray-500'>...</span>
//             )}
//             {totalPages > 1 && (
//               <button
//                 className={classNames(
//                   "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
//                   currentPage === totalPages
//                     ? "bg-blue-600 text-white"
//                     : "bg-transparent text-gray-700 hover:bg-gray-200"
//                 )}
//                 onClick={() => handlePageChange(totalPages)}>
//                 {totalPages}
//               </button>
//             )}
//           </div>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
//             <ChevronRightIcon className='w-4 h-4' />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;



import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onPageChange,
  currentPage,
  totalPages,
  pageSize, // We will now use this prop to control the page size
  onPageSizeChange, // New prop to handle page size changes
  title = "Data Table",
  link = "#",
  handleFilterChangeStatus,
  handleFilterChangeEntryType, // New prop for entry type filter
  entryTypeOptions = [], // New prop for entry type options
}) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    const filteredData = data.filter((row) =>
      columns.some((col) => {
        const cellValue =
          typeof col.accessor === "function"
            ? col.accessor(row)
            : row[col.accessor];
        return String(cellValue)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );

    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue =
        typeof sortConfig.accessor === "function"
          ? sortConfig.accessor(a)
          : a[sortConfig.accessor];
      const bValue =
        typeof sortConfig.accessor === "function"
          ? sortConfig.accessor(b)
          : b[sortConfig.accessor];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig, searchTerm, columns]);

  const handleSort = (col) => {
    if (!col.sortable) return;

    if (sortConfig?.accessor === col.accessor) {
      setSortConfig({
        accessor: col.accessor,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ accessor: col.accessor, direction: "asc" });
    }
    if (onPageChange) onPageChange(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) onPageChange(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (onPageChange) onPageChange(1);
  };

  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
    setShowPageSizeDropdown(false);
  };

  return (
    <div className='w-full bg-white rounded shadow border px-4'>
      <div className='my-4'>
        <div className='flex justify-between items-start gap-4 mb-4'>
          {/* Left-aligned title container */}
          <h2 className='text-lg font-semibold flex-grow'>{title}</h2>

          {/* Right-aligned actions container */}
          <div className='flex-shrink-0'>
            <Link
              to={link}
              className='flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-md text-sm font-medium'>
              <PlusIcon className='h-5 w-5' />
              <span>Create</span>
            </Link>
          </div>
        </div>

        {/* Search field, placed below the title */}
        <div className='flex justify-between items-center'>
          <div className='relative w-full max-w-lg'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <MagnifyingGlassIcon className='w-4 h-4 text-gray-400' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              className='block rounded-md border-0 py-1.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Search...'
            />
          </div>
          
          {/* Filters Container */}
          <div className='flex gap-2'>
            {/* Entry Type Filter - Only for Loan Postings */}
            {title === "Loan Postings" && handleFilterChangeEntryType && (
              <div className='w-48'>
                <select
                  id='entryType'
                  name='entryType'
                  onChange={handleFilterChangeEntryType}
                  className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                  {/* <option value=''>All Entry Types</option> */}
                  {entryTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            {(title === "Currency Postings" ||
              title === "Income & Expense Postings" ||
              title === "Bank Deposit Postings" ||
              title === "Loan Postings" ||
              title === "Investment Postings" ||
              title === "Rental Postings" ||
              title === "Bank Deposit List") && (
              <div className='w-48'>
                <select
                  id='status'
                  name='status'
                  onChange={handleFilterChangeStatus}
                  defaultValue='pending' // Set default value to 'pending'
                  className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                  <option value='all'>All Status</option>
                  <option value='pending'>Pending</option>
                  <option value='approved'>Approved</option>
                  <option value='rejected'>Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='w-full overflow-x-auto'>
        <table className='w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  scope='col'
                  onClick={() => handleSort(col)}
                  className={classNames(
                    "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none",
                    col.sortable && "hover:text-gray-700"
                  )}>
                  <div className='flex items-center gap-1'>
                    {col.header}
                    {sortConfig?.accessor === col.accessor ? (
                      sortConfig.direction === "asc" ? (
                        <svg
                          className='w-3 h-3 text-gray-600'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path d='M5 15l7-7 7 7'></path>
                        </svg>
                      ) : (
                        <svg
                          className='w-3 h-3 text-gray-600'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path d='M19 9l-7 7-7-7'></path>
                        </svg>
                      )
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-6'>
                  Loading...
                </td>
              </tr>
            ) : filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='text-center py-6 text-gray-500'>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls and Search Footer */}
      <div className='flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-gray-50 border-t gap-2 sm:gap-0'>
        {/* Page size and Search container */}
        <div className='flex items-center gap-2 relative'>
          {/* Page Size Label */}
          <span className='text-sm text-gray-700'>Rows per page</span>

          {/* Page Size Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
              className='flex items-center justify-between min-w-[120px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
              {pageSize}
              <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5 text-gray-400' />
            </button>
            {showPageSizeDropdown && (
              <div className='absolute right-0 bottom-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mb-2'>
                <div className='py-1'>
                  {[10, 20, 50, 100].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        handlePageSizeChange(size);
                      }}
                      className={classNames(
                        size === pageSize
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700",
                        "block px-4 py-2 text-sm w-full text-left"
                      )}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Pagination Controls */}
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
            <ChevronLeftIcon className='w-4 h-4' />
          </button>
          <div className='flex items-center space-x-1'>
            <button
              className={classNames(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                currentPage === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => handlePageChange(1)}>
              {currentPage}
            </button>
            {totalPages > 2 && (
              <span className='text-sm text-gray-500'>...</span>
            )}
            {totalPages > 1 && (
              <button
                className={classNames(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </button>
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
            <ChevronRightIcon className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;