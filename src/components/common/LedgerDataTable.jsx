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

// const LedgerDataTable = ({
//   columns = [],
//   data = [],
//   loading = false,
//   onPageChange,
//   currentPage,
//   totalPages,
//   pageSize, // We will now use this prop to control the page size
//   onPageSizeChange, // New prop to handle page size changes
//   title = "Data Table",
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

// export default LedgerDataTable;

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

// const LedgerDataTable = ({
//   columns = [],
//   data = [],
//   loading = false,
//   onPageChange,
//   currentPage,
//   totalPages,
//   pageSize,
//   onPageSizeChange,
//   title = "Data Table",
// }) => {
//   const [sortConfig, setSortConfig] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

//   // Memoized data for filtering and sorting
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

//   // Memoized page numbers for display
//   const pagesToDisplay = useMemo(() => {
//     const pages = [];
//     const maxPages = 5;
//     const halfPages = Math.floor(maxPages / 2);

//     if (totalPages <= maxPages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else if (currentPage <= halfPages + 1) {
//       for (let i = 1; i <= maxPages - 1; i++) {
//         pages.push(i);
//       }
//       pages.push("...");
//       pages.push(totalPages);
//     } else if (currentPage >= totalPages - halfPages) {
//       pages.push(1);
//       pages.push("...");
//       for (let i = totalPages - (maxPages - 2); i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       pages.push(1);
//       pages.push("...");
//       for (let i = currentPage - halfPages; i <= currentPage + halfPages; i++) {
//         pages.push(i);
//       }
//       pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   }, [currentPage, totalPages]);

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
//     if (typeof page !== "number") return;
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
//         {/* Page size container */}
//         <div className='flex items-center gap-2 relative'>
//           <span className='text-sm text-gray-700'>Rows per page</span>
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
//                       onClick={() => handlePageSizeChange(size)}
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
//             disabled={currentPage === 1 || loading}
//             className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
//             <ChevronLeftIcon className='w-4 h-4' />
//           </button>
//           <div className='flex items-center space-x-1'>
//             {pagesToDisplay.map((page, index) =>
//               page === "..." ? (
//                 <span key={index} className='text-sm text-gray-500'>
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={page}
//                   className={classNames(
//                     "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
//                     currentPage === page
//                       ? "bg-blue-600 text-white"
//                       : "bg-transparent text-gray-700 hover:bg-gray-200"
//                   )}
//                   onClick={() => handlePageChange(page)}>
//                   {page}
//                 </button>
//               )
//             )}
//           </div>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages || loading}
//             className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
//             <ChevronRightIcon className='w-4 h-4' />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LedgerDataTable;

// import React, { useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import {
//     ChevronLeftIcon,
//     ChevronRightIcon,
//     MagnifyingGlassIcon,
//     ChevronDownIcon,
//     PlusIcon,
// } from "@heroicons/react/24/solid";

// function classNames(...classes) {
//     return classes.filter(Boolean).join(" ");
// }

// const LedgerDataTable = ({
//     columns = [],
//     data = [],
//     loading = false,
//     onPageChange,
//     currentPage,
//     totalPages,
//     pageSize,
//     onPageSizeChange,
//     title = "Data Table",
//     getRowClass, // Add this prop
//     totalRecords, // Add this prop if needed
// }) => {
//     const [sortConfig, setSortConfig] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

//     // Memoized data for filtering and sorting
//     const filteredAndSortedData = useMemo(() => {
//         const filteredData = data.filter((row) =>
//             columns.some((col) => {
//                 const cellValue =
//                     typeof col.accessor === "function"
//                         ? col.accessor(row)
//                         : row[col.accessor];
//                 return String(cellValue)
//                     .toLowerCase()
//                     .includes(searchTerm.toLowerCase());
//             })
//         );

//         if (!sortConfig) return filteredData;

//         const sorted = [...filteredData].sort((a, b) => {
//             const aValue =
//                 typeof sortConfig.accessor === "function"
//                     ? sortConfig.accessor(a)
//                     : a[sortConfig.accessor];
//             const bValue =
//                 typeof sortConfig.accessor === "function"
//                     ? sortConfig.accessor(b)
//                     : b[sortConfig.accessor];

//             if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//             if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//             return 0;
//         });
//         return sorted;
//     }, [data, sortConfig, searchTerm, columns]);

//     // Memoized page numbers for display
//     const pagesToDisplay = useMemo(() => {
//         const pages = [];
//         const maxPages = 5;
//         const halfPages = Math.floor(maxPages / 2);

//         if (totalPages <= maxPages) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else if (currentPage <= halfPages + 1) {
//             for (let i = 1; i <= maxPages - 1; i++) {
//                 pages.push(i);
//             }
//             pages.push("...");
//             pages.push(totalPages);
//         } else if (currentPage >= totalPages - halfPages) {
//             pages.push(1);
//             pages.push("...");
//             for (let i = totalPages - (maxPages - 2); i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             pages.push(1);
//             pages.push("...");
//             for (
//                 let i = currentPage - halfPages;
//                 i <= currentPage + halfPages;
//                 i++
//             ) {
//                 pages.push(i);
//             }
//             pages.push("...");
//             pages.push(totalPages);
//         }
//         return pages;
//     }, [currentPage, totalPages]);

//     const handleSort = (col) => {
//         if (!col.sortable) return;

//         if (sortConfig?.accessor === col.accessor) {
//             setSortConfig({
//                 accessor: col.accessor,
//                 direction: sortConfig.direction === "asc" ? "desc" : "asc",
//             });
//         } else {
//             setSortConfig({ accessor: col.accessor, direction: "asc" });
//         }
//         if (onPageChange) onPageChange(1);
//     };

//     const handlePageChange = (page) => {
//         if (typeof page !== "number") return;
//         if (page < 1 || page > totalPages) return;
//         if (onPageChange) onPageChange(page);
//     };

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//         if (onPageChange) onPageChange(1);
//     };

//     const handlePageSizeChange = (newSize) => {
//         if (onPageSizeChange) {
//             onPageSizeChange(newSize);
//         }
//         setShowPageSizeDropdown(false);
//     };

//     return (
//         <div className="w-full bg-white rounded shadow border px-4">
//             <div className="my-4">
//                 {/* Search field, placed below the title */}
//                 <div className="flex justify-between items-center">
//                     <div className="relative w-full max-w-lg">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                             <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
//                         </div>
//                         <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             className="block rounded-md border-0 py-1.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             placeholder="Search..."
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="w-full overflow-x-auto">
//                 <table className="w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             {columns.map((col) => (
//                                 <th
//                                     key={col.header}
//                                     scope="col"
//                                     onClick={() => handleSort(col)}
//                                     className={classNames(
//                                         "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none",
//                                         col.sortable && "hover:text-gray-700"
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-1">
//                                         {col.header}
//                                         {sortConfig?.accessor ===
//                                         col.accessor ? (
//                                             sortConfig.direction === "asc" ? (
//                                                 <svg
//                                                     className="w-3 h-3 text-gray-600"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="2"
//                                                     viewBox="0 0 24 24"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                 >
//                                                     <path d="M5 15l7-7 7 7"></path>
//                                                 </svg>
//                                             ) : (
//                                                 <svg
//                                                     className="w-3 h-3 text-gray-600"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="2"
//                                                     viewBox="0 0 24 24"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                 >
//                                                     <path d="M19 9l-7 7-7-7"></path>
//                                                 </svg>
//                                             )
//                                         ) : null}
//                                     </div>
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {loading ? (
//                             <tr>
//                                 <td
//                                     colSpan={columns.length}
//                                     className="text-center py-6"
//                                 >
//                                     Loading...
//                                 </td>
//                             </tr>
//                         ) : filteredAndSortedData.length > 0 ? (
//                             filteredAndSortedData.map((row, idx) => {
//                                 // Apply the row class if getRowClass function is provided
//                                 const customRowClass = getRowClass
//                                     ? getRowClass(row)
//                                     : "";

//                                 // Only apply alternating colors if there's no custom row class
//                                 const baseRowClass = customRowClass
//                                     ? ""
//                                     : idx % 2 === 0
//                                     ? "bg-white"
//                                     : "bg-gray-50";

//                                 return (
//                                     <tr
//                                         key={idx}
//                                         className={classNames(
//                                             baseRowClass,
//                                             customRowClass
//                                         )}
//                                     >
//                                         {columns.map((col) => (
//                                             <td
//                                                 key={col.header}
//                                                 className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                                             >
//                                                 {typeof col.accessor ===
//                                                 "function"
//                                                     ? col.accessor(row)
//                                                     : row[col.accessor]}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan={columns.length}
//                                     className="text-center py-6 text-gray-500"
//                                 >
//                                     No data available.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             {/* Pagination Controls and Search Footer */}
//             <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-gray-50 border-t gap-2 sm:gap-0">
//                 {/* Page size container */}
//                 <div className="flex items-center gap-2 relative">
//                     <span className="text-sm text-gray-700">Rows per page</span>
//                     <div className="relative">
//                         <button
//                             onClick={() =>
//                                 setShowPageSizeDropdown(!showPageSizeDropdown)
//                             }
//                             className="flex items-center justify-between min-w-[120px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                         >
//                             {pageSize}
//                             <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-gray-400" />
//                         </button>
//                         {showPageSizeDropdown && (
//                             <div className="absolute right-0 bottom-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mb-2">
//                                 <div className="py-1">
//                                     {[10, 20, 50, 100].map((size) => (
//                                         <button
//                                             key={size}
//                                             onClick={() =>
//                                                 handlePageSizeChange(size)
//                                             }
//                                             className={classNames(
//                                                 size === pageSize
//                                                     ? "bg-gray-100 text-gray-900"
//                                                     : "text-gray-700",
//                                                 "block px-4 py-2 text-sm w-full text-left"
//                                             )}
//                                         >
//                                             {size}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 {/* Pagination Controls */}
//                 <div className="flex items-center space-x-2">
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1 || loading}
//                         className="flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         <ChevronLeftIcon className="w-4 h-4" />
//                     </button>
//                     <div className="flex items-center space-x-1">
//                         {pagesToDisplay.map((page, index) =>
//                             page === "..." ? (
//                                 <span
//                                     key={index}
//                                     className="text-sm text-gray-500"
//                                 >
//                                     ...
//                                 </span>
//                             ) : (
//                                 <button
//                                     key={page}
//                                     className={classNames(
//                                         "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
//                                         currentPage === page
//                                             ? "bg-blue-600 text-white"
//                                             : "bg-transparent text-gray-700 hover:bg-gray-200"
//                                     )}
//                                     onClick={() => handlePageChange(page)}
//                                 >
//                                     {page}
//                                 </button>
//                             )
//                         )}
//                     </div>
//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages || loading}
//                         className="flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         <ChevronRightIcon className="w-4 h-4" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LedgerDataTable;

import React, { useState, useMemo, useRef, useEffect } from "react";
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

const LedgerDataTable = ({
  columns = [],
  data = [],
  loading = false,
  onPageChange,
  currentPage,
  totalPages,
  pageSize,
  onPageSizeChange,
  title = "",
  getRowClass, // Add this prop
  totalRecords, // Add this prop if needed
}) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

  // NEW: Ref for handling click outside the dropdown
  const dropdownRef = useRef(null);

  // NEW: Page size options
  const pageSizeOptions = [10, 25, 50, 100,5000];

  // NEW: Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPageSizeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Memoized data for filtering and sorting
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

    if (!sortConfig) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue =
        typeof sortConfig.accessor === "function"
          ? sortConfig.accessor(a)
          : a[sortConfig.accessor];
      const bValue =
        typeof sortConfig.accessor === "function"
          ? sortConfig.accessor(b)
          : b[sortConfig.accessor];

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, columns, searchTerm, sortConfig]);

  const requestSort = (accessor) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.accessor === accessor &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ accessor, direction });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const pagesBefore = Math.floor((maxPagesToShow - 1) / 2);
      const pagesAfter = Math.ceil((maxPagesToShow - 1) / 2);

      if (currentPage <= pagesBefore) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + pagesAfter >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - pagesBefore;
        endPage = currentPage + pagesAfter;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      if (startPage > 2) {
        pageNumbers.unshift("...");
      }
      pageNumbers.unshift(1);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const getSortIndicator = (accessor) => {
    if (!sortConfig || sortConfig.accessor !== accessor) {
      return null;
    }
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  // Calculate item range for display
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        {/* Search Input */}
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
          <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead className='bg-gray-50'>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.header}
                      scope='col'
                      className={classNames(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        col.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                      )}
                      onClick={() => col.sortable && requestSort(col.accessor)}>
                      {col.header}
                      {getSortIndicator(col.accessor)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className='px-6 py-4 text-center text-sm font-medium text-gray-500'>
                      Loading...
                    </td>
                  </tr>
                ) : filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map((row, index) => (
                    <tr
                      key={index}
                      className={classNames(
                        getRowClass ? getRowClass(row) : "",
                        index % 2 === 0 ? undefined : "bg-gray-50"
                      )}>
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
                      className='px-6 py-4 text-center text-sm font-medium text-gray-500'>
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
        <div className='flex items-center gap-2 relative'>
          <span className='text-sm text-gray-700'>Rows per page</span>
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
              className='flex items-center justify-between min-w-[120px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
              {pageSize}
              <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5 text-gray-400' />
            </button>

            {/* NEW: Dropdown menu for page size options */}
            {showPageSizeDropdown && (
              <div
                className='absolute z-10 bottom-full mb-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='menu-button'>
                <div className='py-1' role='none'>
                  {pageSizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onPageSizeChange(size); // Call the prop function
                        setShowPageSizeDropdown(false); // Close the dropdown
                      }}
                      className={classNames(
                        size === pageSize
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700",
                        "block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                      )}
                      role='menuitem'>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-1 justify-between sm:justify-end'>
          <div className='text-sm text-gray-700 mr-4 flex items-center'>
            Showing {startItem} to {endItem} of {totalRecords} results
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
              <ChevronLeftIcon className='w-4 h-4' />
            </button>
            <div className='flex items-center space-x-1'>
              {getPageNumbers().map((page) =>
                page === "..." ? (
                  <span
                    key={page + Math.random()}
                    className='px-2 py-1 text-sm text-gray-700'>
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={classNames(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-transparent text-gray-700 hover:bg-gray-200"
                    )}
                    onClick={() => handlePageChange(page)}>
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className='flex items-center bg-transparent hover:bg-gray-300 p-1 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'>
              <ChevronRightIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerDataTable;
