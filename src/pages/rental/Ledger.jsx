// import React, { useEffect, useState } from "react";
// import { CSVLink } from "react-csv";
// import { useFormik } from "formik";
// import { showToast } from "../../helper/toastMessage";
// import { formatNumber } from "../../helper/utility";
// import LedgerDataTable from "../../components/common/LedgerDataTable";
// import SelectField from "../../components/common/SelectField";
// import {
//     getAllRentalParties,
//     getRentalLedger,
//     getRentalLedgerSummary,
//     getHouseMappingsByParty,
// } from "../../service/rentalApi";

// const entryTypeCustomize = (entryType) => {
//     switch (entryType) {
//         case "auto_adjustment":
//             return "Auto Adjustment";
//         case "rent_received":
//             return "Rent Received";
//         case "security_money_refund":
//             return "Security Money Refund";
//         case "other_amount":
//             return "Other Amount";
//         case "security_money_amount":
//             return "Security Money";
//         default:
//             return entryType;
//     }
// };

// const Ledger = () => {
//     const [totalPages, setTotalPages] = useState(1);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [pageSize, setPageSize] = useState(10);

//     const [incomeExpenseHeadOptions, setIncomeExpenseHeadOptions] = useState(
//         []
//     );
//     const [rentalHouseOptions, setRentalHouseOptions] = useState([]);
//     const [ledgerSummary, setLedgerSummary] = useState({
//         total_monthly_rent: 0,
//         total_rent_received: 0,
//         total_security_money: 0,
//         total_auto_adjustment: 0,
//         total_remaining_security_money: 0,
//         total_security_refund: 0,
//         total_receivable: 0,
//         total_due_amount: 0,
//         total_due_month: 0,
//         partial_due_amount: 0,
//         already_adjusted: 0,
//     });
//     const [ledgerDetails, setLedgerDetails] = useState([]);
//     const [ledgerSummaryData, setLedgerSummaryData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);

//     const initialFilterValues = {
//         head_id: "",
//         house_id: "",
//         start_date: "",
//         end_date: "",
//         view_type: "summary",
//         transaction_type: "all",
//     };

//     const [filters, setFilters] = useState(initialFilterValues);

//     const viewTypeOptions = [
//         { value: "details", label: "Details" },
//         { value: "summary", label: "Summary" },
//     ];

//     const transactionTypeOptions = [
//         { value: "all", label: "All Transactions" },
//         { value: "rent_received", label: "Rent Received" },
//         { value: "security_money_amount", label: "Security Money" },
//         { value: "security_money_refund", label: "Security Refund" },
//         { value: "auto_adjustment", label: "Auto Adjustment" },
//         { value: "other_amount", label: "Other Amount" },
//         { value: "No Transaction", label: "No Transactions" }, // Add this option
//     ];

//     const partyOptions = [{ value: "", label: "All Parties" }];
//     const houseOptions = [{ value: "", label: "All Houses" }];

//     const summaryColumns = [
//         {
//             header: "Party Name",
//             accessor: (row) => row.party_name || "--",
//             sortable: true,
//         },
//         {
//             header: "Total Rent",
//             accessor: (row) => `৳ ${formatNumber(row.total_rent || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Security Money",
//             accessor: (row) => `৳ ${formatNumber(row.security_money || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Remaining Security Money",
//             accessor: (row) =>
//                 `৳ ${formatNumber(row.remaining_security_money || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Auto Adjust Amount",
//             accessor: (row) => `৳ ${formatNumber(row.auto_adjust_amount || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Already Adjusted",
//             accessor: (row) => `৳ ${formatNumber(row.already_adjusted || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Total Received",
//             accessor: (row) => `৳ ${formatNumber(row.total_received || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Total Receivable",
//             accessor: (row) => {
//                 const receivable = row.total_receivable || 0;
//                 const isReceivable = receivable > 0;
//                 return (
//                     <span
//                         className={
//                             isReceivable ? "text-red-600 font-semibold" : ""
//                         }
//                     >
//                         ৳ {formatNumber(receivable)}
//                     </span>
//                 );
//             },
//             sortable: true,
//         },
//         {
//             header: "Refund Amount",
//             accessor: (row) => `৳ ${formatNumber(row.refund_amount || 0)}`,
//             sortable: true,
//         },
//     ];
//     const detailsColumns = [
//         {
//             header: "Posting Date",
//             accessor: (row) => row.posting_date || "--",
//             sortable: true,
//         },
//         {
//             header: "Trx Category",
//             accessor: (row) => entryTypeCustomize(row.entry_type),
//             sortable: true,
//         },
//         {
//             header: "Party Name",
//             accessor: (row) => row.party_name || "--",
//             sortable: true,
//         },
//         {
//             header: "House Name",
//             accessor: (row) => row.house_name || "--",
//             sortable: true,
//         },
//         {
//             header: "Rent",
//             accessor: (row) => {
//                 if (row.rent === "--") return "--";
//                 return `৳ ${formatNumber(row.rent || 0)}`;
//             },
//             sortable: true,
//         },
//         {
//             header: "Security Money",
//             accessor: (row) => `৳ ${formatNumber(row.security_money || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Remaining Security Money",
//             accessor: (row) =>
//                 `৳ ${formatNumber(row.remaining_security_money || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Auto Adjust Amount",
//             accessor: (row) => `৳ ${formatNumber(row.auto_adjust_amount || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Already Adjusted",
//             accessor: (row) => `৳ ${formatNumber(row.already_adjusted || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Total Received",
//             accessor: (row) => `৳ ${formatNumber(row.total_received || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Total Receivable",
//             accessor: (row) => {
//                 if (row.total_receivable === "--") return "--";
//                 return `৳ ${formatNumber(row.total_receivable || 0)}`;
//             },
//             sortable: true,
//         },
//         {
//             header: "Total Due Amount",
//             accessor: (row) => {
//                 if (row.total_due_amount === "--") return "--";
//                 return `৳ ${formatNumber(row.total_due_amount || 0)}`;
//             },
//             sortable: true,
//         },
//         {
//             header: "Refund Amount",
//             accessor: (row) => `৳ ${formatNumber(row.refund_amount || 0)}`,
//             sortable: true,
//         },
//         {
//             header: "Total Due Month",
//             accessor: (row) => row.total_due_month || 0,
//             sortable: true,
//         },
//         {
//             header: "Partial Due Amount",
//             accessor: (row) => {
//                 if (row.partial_due_amount === "--") return "--";
//                 return `৳ ${formatNumber(row.partial_due_amount || 0)}`;
//             },
//             sortable: true,
//         },
//     ];

//     const csvHeaders = [
//         { label: "Posting Date", key: "posting_date" },
//         { label: "Transaction Type", key: "transaction_type" },
//         { label: "Party Name", key: "party_name" },
//         { label: "Amount (BDT)", key: "amount_bdt" },
//         { label: "Note", key: "note" },
//     ];

//     const handlePageSizeChange = (newSize) => {
//         setPageSize(newSize);
//         setCurrentPage(1);
//     };

//     const loadHouseOptions = async (partyId) => {
//         console.log("🔹 loadHouseOptions called with partyId:", partyId);

//         if (!partyId) {
//             console.log(
//                 "⚠️ No partyId provided — resetting to default house options."
//             );
//             setRentalHouseOptions([{ value: "", label: "All Houses" }]);
//             return;
//         }

//         try {
//             const response = await getHouseMappingsByParty(partyId);
//             console.log("✅ API Response checkkkk :", response);

//             const formattedHouses = response.data.map((house) => ({
//                 value: house.id,
//                 label: house.house_name || `House ${house.id}`,
//             }));

//             console.log("🎯 Formatted house options:", formattedHouses);

//             setRentalHouseOptions([
//                 { value: "", label: "All Houses" },
//                 ...formattedHouses,
//             ]);
//             console.log("✅ Rental house options updated successfully.");
//         } catch (error) {
//             console.error("❌ Failed to load house options:", error);
//             showToast.error("Failed to load house options.");
//             setRentalHouseOptions([{ value: "", label: "All Houses" }]);
//         }
//     };

//     // Custom Details Table Component with Red Highlighting
//     const CustomDetailsTable = ({ data, columns, loading }) => {
//         if (loading) {
//             return (
//                 <div className="flex justify-center items-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                 </div>
//             );
//         }

//         if (!data || data.length === 0) {
//             return (
//                 <div className="text-center py-8 text-gray-500">
//                     No data available
//                 </div>
//             );
//         }

//         return (
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             {columns.map((column, index) => (
//                                 <th
//                                     key={index}
//                                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                                 >
//                                     {column.header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {data.map((row, index) => {
//                             const totalDueMonth =
//                                 parseFloat(row.total_due_month) || 0;
//                             const isOverdue = totalDueMonth > 0;
//                             const rowClassName = isOverdue
//                                 ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
//                                 : "hover:bg-gray-50";

//                             return (
//                                 <tr key={index} className={rowClassName}>
//                                     {columns.map((column, colIndex) => {
//                                         const cellValue =
//                                             typeof column.accessor ===
//                                             "function"
//                                                 ? column.accessor(row)
//                                                 : row[column.accessor];

//                                         return (
//                                             <td
//                                                 key={colIndex}
//                                                 className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                                     isOverdue
//                                                         ? "text-red-800 font-medium"
//                                                         : "text-gray-900"
//                                                 }`}
//                                             >
//                                                 {cellValue}
//                                             </td>
//                                         );
//                                     })}
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     };

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     useEffect(() => {
//         const loadInitialOptions = async () => {
//             try {
//                 const [incomeExpenseHeadsRes] = await Promise.all([
//                     getAllRentalParties(),
//                 ]);
//                 const formattedIncomeExpenseHeads = (
//                     incomeExpenseHeadsRes.data || []
//                 ).map((head) => ({
//                     value: head.id,
//                     label: head.party_name,
//                 }));

//                 const allOptions = [
//                     ...partyOptions,
//                     ...formattedIncomeExpenseHeads,
//                 ];
//                 setIncomeExpenseHeadOptions(allOptions);
//                 setRentalHouseOptions(houseOptions);
//             } catch (error) {
//                 showToast.error("Failed to load initial form options.");
//             }
//         };
//         loadInitialOptions();
//     }, []);

//     useEffect(() => {
//         if (filters.head_id) {
//             loadHouseOptions(filters.head_id);
//         } else {
//             setRentalHouseOptions(houseOptions);
//         }
//     }, [filters.head_id]);

//     useEffect(() => {
//         if (!isMounted) return;

//         const loadData = async () => {
//             setIsLoading(true);
//             try {
//                 if (filters.view_type === "details") {
//                     const res = await getRentalLedger(
//                         currentPage,
//                         pageSize,
//                         filters
//                     );

//                     const summary = res.summary || {};
//                     setLedgerSummary({
//                         total_monthly_rent: summary.total_monthly_rent || 0,
//                         total_rent_received: summary.total_rent_received || 0,
//                         total_security_money: summary.total_security_money || 0,
//                         total_auto_adjustment:
//                             summary.total_auto_adjustment || 0,
//                         total_remaining_security_money:
//                             summary.total_remaining_security_money || 0,
//                         total_security_refund:
//                             summary.total_security_refund || 0,
//                         total_receivable: summary.total_receivable || 0,
//                         total_due_amount: summary.total_due_amount || 0,
//                         total_due_month: summary.total_due_month || 0,
//                         partial_due_amount: summary.partial_due_amount || 0,
//                         already_adjusted: summary.already_adjusted || 0,
//                     });

//                     setLedgerDetails(res.details || []);
//                     setTotalRecords(res.total || 0);
//                     setTotalPages(Math.ceil((res.total || 0) / pageSize));
//                 } else if (filters.view_type === "summary") {
//                     const res = await getRentalLedgerSummary(
//                         currentPage,
//                         pageSize,
//                         filters
//                     );

//                     const data = res.data || [];
//                     const summary = res.summary || {
//                         total_monthly_rent: 0,
//                         total_rent_received: 0,
//                         total_security_money: 0,
//                         total_auto_adjustment: 0,
//                         total_remaining_security_money: 0,
//                         total_security_refund: 0,
//                         total_receivable: 0,
//                         total_due_amount: 0,
//                         total_due_month: 0,
//                         partial_due_amount: 0,
//                         already_adjusted: 0,
//                     };

//                     setLedgerSummaryData(data);
//                     setLedgerDetails([]);
//                     setTotalRecords(res.total || 0);
//                     setTotalPages(Math.ceil((res.total || 0) / pageSize));

//                     setLedgerSummary({
//                         total_monthly_rent: summary.total_monthly_rent || 0,
//                         total_rent_received: summary.total_rent_received || 0,
//                         total_security_money: summary.total_security_money || 0,
//                         total_auto_adjustment:
//                             summary.total_auto_adjustment || 0,
//                         total_remaining_security_money:
//                             summary.total_remaining_security_money || 0,
//                         total_security_refund:
//                             summary.total_security_refund || 0,
//                         total_receivable: summary.total_receivable || 0,
//                         total_due_amount: summary.total_due_amount || 0,
//                         total_due_month: summary.total_due_month || 0,
//                         partial_due_amount: summary.partial_due_amount || 0,
//                         already_adjusted: summary.already_adjusted || 0,
//                     });
//                 }
//             } catch (err) {
//                 showToast.error(err.message || "Failed to fetch ledger data.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         const timer = setTimeout(() => {
//             loadData();
//         }, 100);

//         return () => clearTimeout(timer);
//     }, [currentPage, pageSize, filters, isMounted]);

//     const formik = useFormik({
//         initialValues: initialFilterValues,
//         onSubmit: (values) => {
//             setFilters(values);
//             setCurrentPage(1);
//         },
//     });

//     const handleViewTypeChange = (selectedOption) => {
//         const newViewType = selectedOption.value;
//         formik.setFieldValue("view_type", newViewType);
//         formik.setFieldValue("house_id", "");
//         setFilters((prev) => ({
//             ...prev,
//             view_type: newViewType,
//             house_id: "",
//         }));
//         setCurrentPage(1);
//     };

//     const handlePartyChange = (selectedOption) => {
//         const partyId = selectedOption ? selectedOption.value : "";
//         formik.setFieldValue("head_id", partyId);
//         formik.setFieldValue("house_id", "");
//         setFilters((prev) => ({
//             ...prev,
//             head_id: partyId,
//             house_id: "",
//         }));
//         setCurrentPage(1);
//     };

//     return (
//         <div className="w-full bg-white rounded shadow border p-4">
//             <h2 className="text-lg font-semibold flex-grow mb-4">
//                 Rental Ledger
//             </h2>

//             <form onSubmit={formik.handleSubmit}>
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full md:w-auto">
//                         <SelectField
//                             label="View Type"
//                             name="view_type"
//                             className="w-full sm:w-56"
//                             options={viewTypeOptions}
//                             value={viewTypeOptions.find(
//                                 (opt) => opt.value === formik.values.view_type
//                             )}
//                             onChange={handleViewTypeChange}
//                         />

//                         {formik.values.view_type === "details" && (
//                             <>
//                                 <SelectField
//                                     label="Select Party"
//                                     name="head_id"
//                                     className="w-full sm:w-56"
//                                     options={incomeExpenseHeadOptions}
//                                     value={incomeExpenseHeadOptions.find(
//                                         (opt) =>
//                                             opt.value === formik.values.head_id
//                                     )}
//                                     onChange={handlePartyChange}
//                                 />
//                                 <SelectField
//                                     label="Select House"
//                                     name="house_id"
//                                     className="w-full sm:w-56"
//                                     options={rentalHouseOptions}
//                                     value={rentalHouseOptions.find(
//                                         (opt) =>
//                                             opt.value === formik.values.house_id
//                                     )}
//                                     onChange={(selectedOption) =>
//                                         formik.setFieldValue(
//                                             "house_id",
//                                             selectedOption
//                                                 ? selectedOption.value
//                                                 : ""
//                                         )
//                                     }
//                                     isDisabled={!formik.values.head_id}
//                                 />
//                                 <input
//                                     type="date"
//                                     name="start_date"
//                                     value={formik.values.start_date}
//                                     onChange={formik.handleChange}
//                                     className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
//                                 />
//                                 <input
//                                     type="date"
//                                     name="end_date"
//                                     value={formik.values.end_date}
//                                     onChange={formik.handleChange}
//                                     className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
//                                 />
//                             </>
//                         )}

//                         {formik.values.view_type === "summary" && (
//                             <>
//                                 <SelectField
//                                     label="Select Party"
//                                     name="head_id"
//                                     className="w-full sm:w-56"
//                                     options={incomeExpenseHeadOptions}
//                                     value={incomeExpenseHeadOptions.find(
//                                         (opt) =>
//                                             opt.value === formik.values.head_id
//                                     )}
//                                     onChange={handlePartyChange}
//                                 />
//                                 <input
//                                     type="date"
//                                     name="start_date"
//                                     value={formik.values.start_date}
//                                     onChange={formik.handleChange}
//                                     className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
//                                 />
//                                 <input
//                                     type="date"
//                                     name="end_date"
//                                     value={formik.values.end_date}
//                                     onChange={formik.handleChange}
//                                     className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
//                                 />
//                             </>
//                         )}
//                     </div>

//                     <div className="flex gap-2 mt-2 md:mt-0">
//                         <button
//                             type="submit"
//                             className="btn btn-primary border-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
//                         >
//                             Filter
//                         </button>
//                         {formik.values.view_type === "details" && (
//                             <CSVLink
//                                 data={ledgerDetails}
//                                 headers={csvHeaders}
//                                 filename={"rental-ledger-data.csv"}
//                                 className="btn btn-primary border-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
//                             >
//                                 Export CSV
//                             </CSVLink>
//                         )}
//                     </div>
//                 </div>
//             </form>

//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-green-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Monthly Rent</p>
//                     <h3 className="text-2xl font-bold text-green-800">
//                         ৳ {formatNumber(ledgerSummary.total_monthly_rent) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-red-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Rent Received</p>
//                     <h3 className="text-2xl font-bold text-red-800">
//                         ৳ {formatNumber(ledgerSummary.total_rent_received) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-blue-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Security Money</p>
//                     <h3 className="text-2xl font-bold text-blue-800">
//                         ৳{" "}
//                         {formatNumber(ledgerSummary.total_security_money) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-blue-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Auto Adjustment</p>
//                     <h3 className="text-2xl font-bold text-blue-800">
//                         ৳{" "}
//                         {formatNumber(ledgerSummary.total_auto_adjustment) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-blue-100 p-4 rounded shadow">
//                     <p className="text-sm">Remaining Security Money</p>
//                     <h3 className="text-2xl font-bold text-blue-800">
//                         ৳{" "}
//                         {formatNumber(
//                             ledgerSummary.total_remaining_security_money
//                         ) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-blue-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Security Refund</p>
//                     <h3 className="text-2xl font-bold text-blue-800">
//                         ৳{" "}
//                         {formatNumber(ledgerSummary.total_security_refund) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-orange-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Receivable</p>
//                     <h3 className="text-2xl font-bold text-orange-800">
//                         ৳ {formatNumber(ledgerSummary.total_receivable) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-purple-100 p-4 rounded shadow">
//                     <p className="text-sm">Total Due Amount</p>
//                     <h3 className="text-2xl font-bold text-purple-800">
//                         ৳ {formatNumber(ledgerSummary.total_due_amount) || 0}
//                     </h3>
//                 </div>
//                 <div className="bg-yellow-100 p-4 rounded shadow">
//                     <p className="text-sm">Already Adjusted</p>
//                     <h3 className="text-2xl font-bold text-yellow-800">
//                         ৳ {formatNumber(ledgerSummary.already_adjusted) || 0}
//                     </h3>
//                 </div>
//             </div>

//             {/* Summary Table */}
//             {formik.values.view_type === "summary" && (
//                 <LedgerDataTable
//                     columns={summaryColumns}
//                     data={ledgerSummaryData}
//                     pageSize={pageSize}
//                     loading={isLoading}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     totalRecords={totalRecords}
//                     onPageChange={(page) => setCurrentPage(page)}
//                     onPageSizeChange={handlePageSizeChange}
//                 />
//             )}

//             {/* Custom Details Table with Red Highlighting */}
//             {formik.values.view_type === "details" && (
//                 <div>
//                     <CustomDetailsTable
//                         data={ledgerDetails}
//                         columns={detailsColumns}
//                         loading={isLoading}
//                     />

//                     {/* Pagination for Custom Table */}
//                     {!isLoading && ledgerDetails.length > 0 && (
//                         <div className="flex items-center justify-between mt-4">
//                             <div className="flex items-center">
//                                 <span className="text-sm text-gray-700">
//                                     Showing {(currentPage - 1) * pageSize + 1}{" "}
//                                     to{" "}
//                                     {Math.min(
//                                         currentPage * pageSize,
//                                         totalRecords
//                                     )}{" "}
//                                     of {totalRecords} entries
//                                 </span>
//                                 <select
//                                     value={pageSize}
//                                     onChange={(e) =>
//                                         handlePageSizeChange(
//                                             Number(e.target.value)
//                                         )
//                                     }
//                                     className="ml-4 border rounded-md p-1 text-sm"
//                                 >
//                                     <option value={10}>10</option>
//                                     <option value={25}>25</option>
//                                     <option value={50}>50</option>
//                                     <option value={100}>100</option>
//                                 </select>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <button
//                                     onClick={() =>
//                                         setCurrentPage(currentPage - 1)
//                                     }
//                                     disabled={currentPage === 1}
//                                     className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
//                                 >
//                                     Previous
//                                 </button>
//                                 <span className="text-sm text-gray-700">
//                                     Page {currentPage} of {totalPages}
//                                 </span>
//                                 <button
//                                     onClick={() =>
//                                         setCurrentPage(currentPage + 1)
//                                     }
//                                     disabled={currentPage === totalPages}
//                                     className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Ledger;

import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useFormik } from "formik";
import { showToast } from "../../helper/toastMessage";
import { formatNumber } from "../../helper/utility";
import LedgerDataTable from "../../components/common/LedgerDataTable";
import SelectField from "../../components/common/SelectField";
import {
    getAllRentalParties,
    getRentalLedger,
    getRentalLedgerSummary,
    getHouseMappingsByParty,
} from "../../service/rentalApi";

const entryTypeCustomize = (entryType) => {
    switch (entryType) {
        case "auto_adjustment":
            return "Auto Adjustment";
        case "rent_received":
            return "Rent Received";
        case "security_money_refund":
            return "Security Money Refund";
        case "other_amount":
            return "Other Amount";
        case "security_money_amount":
            return "Security Money";
        default:
            return entryType;
    }
};

const Ledger = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [incomeExpenseHeadOptions, setIncomeExpenseHeadOptions] = useState(
        []
    );
    const [rentalHouseOptions, setRentalHouseOptions] = useState([]);
    const [ledgerSummary, setLedgerSummary] = useState({
        total_monthly_rent: 0,
        total_rent_received: 0,
        total_security_money: 0,
        total_auto_adjustment: 0,
        total_remaining_security_money: 0,
        total_security_refund: 0,
        total_receivable: 0,
        total_due_amount: 0,
        total_due_month: 0,
        partial_due_amount: 0,
        already_adjusted: 0,
    });
    const [ledgerDetails, setLedgerDetails] = useState([]);
    const [ledgerSummaryData, setLedgerSummaryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const initialFilterValues = {
        head_id: "",
        house_id: "",
        start_date: "",
        end_date: "",
        view_type: "summary",
        transaction_type: "all",
    };

    const [filters, setFilters] = useState(initialFilterValues);

    const viewTypeOptions = [
        { value: "details", label: "Details" },
        { value: "summary", label: "Summary" },
    ];

    const transactionTypeOptions = [
        { value: "all", label: "All Transactions" },
        { value: "rent_received", label: "Rent Received" },
        { value: "security_money_amount", label: "Security Money" },
        { value: "security_money_refund", label: "Security Refund" },
        { value: "auto_adjustment", label: "Auto Adjustment" },
        { value: "other_amount", label: "Other Amount" },
        { value: "No Transaction", label: "No Transactions" },
    ];

    const partyOptions = [{ value: "", label: "All Parties" }];
    const houseOptions = [{ value: "", label: "All Houses" }];

    const summaryColumns = [
        {
            header: "Party Name",
            accessor: (row) => row.party_name || "--",
            sortable: true,
        },
        {
            header: "Total Rent",
            accessor: (row) => `৳ ${formatNumber(row.total_rent || 0)}`,
            sortable: true,
        },
        {
            header: "Security Money",
            accessor: (row) => `৳ ${formatNumber(row.security_money || 0)}`,
            sortable: true,
        },
        {
            header: "Remaining Security Money",
            accessor: (row) =>
                `৳ ${formatNumber(row.remaining_security_money || 0)}`,
            sortable: true,
        },
        {
            header: "Auto Adjust Amount",
            accessor: (row) => `৳ ${formatNumber(row.auto_adjust_amount || 0)}`,
            sortable: true,
        },
        {
            header: "Already Adjusted",
            accessor: (row) => `৳ ${formatNumber(row.already_adjusted || 0)}`,
            sortable: true,
        },
        {
            header: "Total Received",
            accessor: (row) => `৳ ${formatNumber(row.total_received || 0)}`,
            sortable: true,
        },
        {
            header: "Total Receivable",
            accessor: (row) => {
                const receivable = row.total_receivable || 0;
                const isReceivable = receivable > 0;
                return (
                    <span
                        className={
                            isReceivable ? "text-red-600 font-semibold" : ""
                        }
                    >
                        ৳ {formatNumber(receivable)}
                    </span>
                );
            },
            sortable: true,
        },
        {
            header: "Refund Amount",
            accessor: (row) => `৳ ${formatNumber(row.refund_amount || 0)}`,
            sortable: true,
        },
        {
            header: "Due Months",
            accessor: (row) => `৳ ${formatNumber(row.total_due_month || 0)}`,
            sortable: true,
        },
        {
            header: "Missing Months",
            accessor: (row) => (
                <span className="text-red-500">{row.missing_months || "--"}</span>
            ),
        },

    ];

    const detailsColumns = [
        {
            header: "Posting Date",
            accessor: (row) => row.posting_date || "--",
            sortable: true,
        },
        {
            header: "Trx Category",
            accessor: (row) => entryTypeCustomize(row.entry_type),
            sortable: true,
        },
        {
            header: "Party Name",
            accessor: (row) => row.party_name || "--",
            sortable: true,
        },
        {
            header: "House Name",
            accessor: (row) => row.house_name || "--",
            sortable: true,
        },
        {
            header: "Rent",
            accessor: (row) => {
                if (row.rent === "--") return "--";
                return `৳ ${formatNumber(row.rent || 0)}`;
            },
            sortable: true,
        },
        {
            header: "Security Money",
            accessor: (row) => `৳ ${formatNumber(row.security_money || 0)}`,
            sortable: true,
        },
        {
            header: "Remaining Security Money",
            accessor: (row) =>
                `৳ ${formatNumber(row.remaining_security_money || 0)}`,
            sortable: true,
        },
        {
            header: "Auto Adjust Amount",
            accessor: (row) => `৳ ${formatNumber(row.auto_adjust_amount || 0)}`,
            sortable: true,
        },
        {
            header: "Already Adjusted",
            accessor: (row) => `৳ ${formatNumber(row.already_adjusted || 0)}`,
            sortable: true,
        },
        {
            header: "Total Received",
            accessor: (row) => `৳ ${formatNumber(row.total_received || 0)}`,
            sortable: true,
        },
        {
            header: "Total Receivable",
            accessor: (row) => {
                if (row.total_receivable === "--") return "--";
                return `৳ ${formatNumber(row.total_receivable || 0)}`;
            },
            sortable: true,
        },
        {
            header: "Total Due Amount",
            accessor: (row) => {
                if (row.total_due_amount === "--") return "--";
                return `৳ ${formatNumber(row.total_due_amount || 0)}`;
            },
            sortable: true,
        },
        {
            header: "Refund Amount",
            accessor: (row) => `৳ ${formatNumber(row.refund_amount || 0)}`,
            sortable: true,
        },
        {
            header: "Total Due Month",
            accessor: (row) => row.total_due_month || 0,
            sortable: true,
        },
        {
            header: "Partial Due Amount",
            accessor: (row) => {
                if (row.partial_due_amount === "--") return "--";
                return `৳ ${formatNumber(row.partial_due_amount || 0)}`;
            },
            sortable: true,
        },
        // {
        //     header: "Rent Start Date",
        //     accessor: (row) => row.rent_start_date ? row.rent_start_date.split('T')[0] : '--',
        //     sortable: true,
        // },
        // {
        //     header: "Rent End Date",
        //     accessor: (row) => row.rent_start_date ? row.rent_end_date.split('T')[0] : '--',
        //     sortable: true,
        // }

        ...(filters.view_type === "details" && ledgerDetails.some(row => 
        row.entry_type !== "security_money_amount"
        ) ? [{
            header: "Rent Start Month",
            accessor: (row) => {
                
                if (row.entry_type === "security_money_amount") return "--";
                return row.rent_start_date ? row.rent_start_date.split('T')[0] : '--';
            },
            sortable: true,
        }] : []),
        
        ...(filters.view_type === "details" && ledgerDetails.some(row => 
            row.entry_type !== "security_money_amount"
        ) ? [{
            header: "Rent End Month",
            accessor: (row) => {
                
                if (row.entry_type === "security_money_amount") return "--";
                return row.rent_end_date ? row.rent_end_date.split('T')[0] : '--';
            },
            sortable: true,
        }] : [])
    ];

    const getCsvHeaders = () => {
        if (filters.view_type === "details") {
            return [
                { label: "Posting Date", key: "posting_date" },
                { label: "Transaction Type", key: "entry_type" },
                { label: "Party Name", key: "party_name" },
                { label: "House Name", key: "house_name" },
                { label: "Amount (BDT)", key: "amount_bdt" },
                { label: "Note", key: "note" },
            ];
        } else {
            return [
                { label: "Party Name", key: "party_name" },
                { label: "Total Rent", key: "total_rent" },
                { label: "Security Money", key: "security_money" },
                {
                    label: "Remaining Security Money",
                    key: "remaining_security_money",
                },
                { label: "Auto Adjust Amount", key: "auto_adjust_amount" },
                { label: "Already Adjusted", key: "already_adjusted" },
                { label: "Total Received", key: "total_received" },
                { label: "Total Receivable", key: "total_receivable" },
                { label: "Refund Amount", key: "refund_amount" },
            ];
        }
    };

    const getCsvData = () => {
        if (filters.view_type === "details") {
            return ledgerDetails;
        } else {
            return ledgerSummaryData;
        }
    };

    const getCsvFilename = () => {
        const date = new Date().toISOString().split("T")[0];
        return `rental-ledger-${filters.view_type}-${date}.csv`;
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const loadHouseOptions = async (partyId) => {
        console.log("🔹 loadHouseOptions called with partyId:", partyId);

        if (!partyId) {
            console.log(
                "⚠️ No partyId provided — resetting to default house options."
            );
            setRentalHouseOptions([{ value: "", label: "All Houses" }]);
            return;
        }

        try {
            const response = await getHouseMappingsByParty(partyId);
            console.log("✅ API Response checkkkk :", response);

            const formattedHouses = response.data.map((house) => ({
                value: house.id,
                label: house.house_name || `House ${house.id}`,
            }));

            console.log("🎯 Formatted house options:", formattedHouses);

            setRentalHouseOptions([
                { value: "", label: "All Houses" },
                ...formattedHouses,
            ]);
            console.log("✅ Rental house options updated successfully.");
        } catch (error) {
            console.error("❌ Failed to load house options:", error);
            showToast.error("Failed to load house options.");
            setRentalHouseOptions([{ value: "", label: "All Houses" }]);
        }
    };

    // Custom Details Table Component with Red Highlighting
    const CustomDetailsTable = ({ data, columns, loading }) => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    No data available
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, index) => {
                            const totalDueMonth =
                                parseFloat(row.total_due_month) || 0;
                            const isOverdue = totalDueMonth > 0;
                            const rowClassName = isOverdue
                                ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
                                : "hover:bg-gray-50";

                            return (
                                <tr key={index} className={rowClassName}>
                                    {columns.map((column, colIndex) => {
                                        const cellValue =
                                            typeof column.accessor ===
                                            "function"
                                                ? column.accessor(row)
                                                : row[column.accessor];

                                        return (
                                            <td
                                                key={colIndex}
                                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                    isOverdue
                                                        ? "text-red-800 font-medium"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {cellValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const loadInitialOptions = async () => {
            try {
                const [incomeExpenseHeadsRes] = await Promise.all([
                    getAllRentalParties(),
                ]);
                const formattedIncomeExpenseHeads = (
                    incomeExpenseHeadsRes.data || []
                ).map((head) => ({
                    value: head.id,
                    label: head.party_name,
                }));

                const allOptions = [
                    ...partyOptions,
                    ...formattedIncomeExpenseHeads,
                ];
                setIncomeExpenseHeadOptions(allOptions);
                setRentalHouseOptions(houseOptions);
            } catch (error) {
                showToast.error("Failed to load initial form options.");
            }
        };
        loadInitialOptions();
    }, []);

    useEffect(() => {
        if (filters.head_id) {
            loadHouseOptions(filters.head_id);
        } else {
            setRentalHouseOptions(houseOptions);
        }
    }, [filters.head_id]);

    useEffect(() => {
        if (!isMounted) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                if (filters.view_type === "details") {
                    const res = await getRentalLedger(
                        currentPage,
                        pageSize,
                        filters
                    );

                    const summary = res.summary || {};
                    setLedgerSummary({
                        total_monthly_rent: summary.total_monthly_rent || 0,
                        total_rent_received: summary.total_rent_received || 0,
                        total_security_money: summary.total_security_money || 0,
                        total_auto_adjustment:
                            summary.total_auto_adjustment || 0,
                        total_remaining_security_money:
                            summary.total_remaining_security_money || 0,
                        total_security_refund:
                            summary.total_security_refund || 0,
                        total_receivable: summary.total_receivable || 0,
                        total_due_amount: summary.total_due_amount || 0,
                        total_due_month: summary.total_due_month || 0,
                        partial_due_amount: summary.partial_due_amount || 0,
                        already_adjusted: summary.already_adjusted || 0,
                    });

                    setLedgerDetails(res.details || []);
                    setTotalRecords(res.total || 0);
                    setTotalPages(Math.ceil((res.total || 0) / pageSize));
                } else if (filters.view_type === "summary") {
                    const res = await getRentalLedgerSummary(
                        currentPage,
                        pageSize,
                        filters
                    );

                    const data = res.data || [];
                    const summary = res.summary || {
                        total_monthly_rent: 0,
                        total_rent_received: 0,
                        total_security_money: 0,
                        total_auto_adjustment: 0,
                        total_remaining_security_money: 0,
                        total_security_refund: 0,
                        total_receivable: 0,
                        total_due_amount: 0,
                        total_due_month: 0,
                        partial_due_amount: 0,
                        already_adjusted: 0,
                    };

                    setLedgerSummaryData(data);
                    setLedgerDetails([]);
                    setTotalRecords(res.total || 0);
                    setTotalPages(Math.ceil((res.total || 0) / pageSize));

                    setLedgerSummary({
                        total_monthly_rent: summary.total_monthly_rent || 0,
                        total_rent_received: summary.total_rent_received || 0,
                        total_security_money: summary.total_security_money || 0,
                        total_auto_adjustment:
                            summary.total_auto_adjustment || 0,
                        total_remaining_security_money:
                            summary.total_remaining_security_money || 0,
                        total_security_refund:
                            summary.total_security_refund || 0,
                        total_receivable: summary.total_receivable || 0,
                        total_due_amount: summary.total_due_amount || 0,
                        total_due_month: summary.total_due_month || 0,
                        partial_due_amount: summary.partial_due_amount || 0,
                        already_adjusted: summary.already_adjusted || 0,
                    });
                }
            } catch (err) {
                showToast.error(err.message || "Failed to fetch ledger data.");
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            loadData();
        }, 100);

        return () => clearTimeout(timer);
    }, [currentPage, pageSize, filters, isMounted]);

    const formik = useFormik({
        initialValues: initialFilterValues,
        onSubmit: (values) => {
            setFilters(values);
            setCurrentPage(1);
        },
    });

    const handleViewTypeChange = (selectedOption) => {
        const newViewType = selectedOption.value;
        formik.setFieldValue("view_type", newViewType);
        formik.setFieldValue("house_id", "");
        setFilters((prev) => ({
            ...prev,
            view_type: newViewType,
            house_id: "",
        }));
        setCurrentPage(1);
    };

    const handlePartyChange = (selectedOption) => {
        const partyId = selectedOption ? selectedOption.value : "";
        formik.setFieldValue("head_id", partyId);
        formik.setFieldValue("house_id", "");
        setFilters((prev) => ({
            ...prev,
            head_id: partyId,
            house_id: "",
        }));
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-white rounded shadow border p-4">
            <h2 className="text-lg font-semibold flex-grow mb-4">
                Rental Ledger
            </h2>

            {/* Filters Section - No Form, No Filter Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full md:w-auto">
                    <SelectField
                        label="View Type"
                        name="view_type"
                        className="w-full sm:w-56"
                        options={viewTypeOptions}
                        value={viewTypeOptions.find(
                            (opt) => opt.value === formik.values.view_type
                        )}
                        onChange={handleViewTypeChange}
                    />

                    <SelectField
                        label="Select Party"
                        name="head_id"
                        className="w-full sm:w-56"
                        options={incomeExpenseHeadOptions}
                        value={incomeExpenseHeadOptions.find(
                            (opt) => opt.value === formik.values.head_id
                        )}
                        onChange={handlePartyChange}
                    />

                    {formik.values.view_type === "details" && (
                        <SelectField
                            label="Select House"
                            name="house_id"
                            className="w-full sm:w-56"
                            options={rentalHouseOptions}
                            value={rentalHouseOptions.find(
                                (opt) => opt.value === formik.values.house_id
                            )}
                            onChange={(selectedOption) =>
                                formik.setFieldValue(
                                    "house_id",
                                    selectedOption ? selectedOption.value : ""
                                )
                            }
                            isDisabled={!formik.values.head_id}
                        />
                    )}

                    <input
                        type="date"
                        name="start_date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    <input
                        type="date"
                        name="end_date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                </div>

                {/* Export CSV Button - Show for both views */}
                <div className="flex gap-2 mt-2 md:mt-0">
                    <CSVLink
                        data={getCsvData()}
                        headers={getCsvHeaders()}
                        filename={getCsvFilename()}
                        className="btn btn-primary border-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Export CSV
                    </CSVLink>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded shadow">
                    <p className="text-sm">Total Monthly Rent</p>
                    <h3 className="text-2xl font-bold text-green-800">
                        ৳ {formatNumber(ledgerSummary.total_monthly_rent) || 0}
                    </h3>
                </div>
                <div className="bg-red-100 p-4 rounded shadow">
                    <p className="text-sm">Total Rent Received</p>
                    <h3 className="text-2xl font-bold text-red-800">
                        ৳ {formatNumber(ledgerSummary.total_rent_received) || 0}
                    </h3>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm">Total Security Money</p>
                    <h3 className="text-2xl font-bold text-blue-800">
                        ৳{" "}
                        {formatNumber(ledgerSummary.total_security_money) || 0}
                    </h3>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm">Total Auto Adjustment</p>
                    <h3 className="text-2xl font-bold text-blue-800">
                        ৳{" "}
                        {formatNumber(ledgerSummary.total_auto_adjustment) || 0}
                    </h3>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm">Remaining Security Money</p>
                    <h3 className="text-2xl font-bold text-blue-800">
                        ৳{" "}
                        {formatNumber(
                            ledgerSummary.total_remaining_security_money
                        ) || 0}
                    </h3>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm">Total Security Refund</p>
                    <h3 className="text-2xl font-bold text-blue-800">
                        ৳{" "}
                        {formatNumber(ledgerSummary.total_security_refund) || 0}
                    </h3>
                </div>
                <div className="bg-orange-100 p-4 rounded shadow">
                    <p className="text-sm">Total Receivable</p>
                    <h3 className="text-2xl font-bold text-orange-800">
                        ৳ {formatNumber(ledgerSummary.total_receivable) || 0}
                    </h3>
                </div>
                <div className="bg-purple-100 p-4 rounded shadow">
                    <p className="text-sm">Total Due Amount</p>
                    <h3 className="text-2xl font-bold text-purple-800">
                        ৳ {formatNumber(ledgerSummary.total_due_amount) || 0}
                    </h3>
                </div>
                <div className="bg-yellow-100 p-4 rounded shadow">
                    <p className="text-sm">Already Adjusted</p>
                    <h3 className="text-2xl font-bold text-yellow-800">
                        ৳ {formatNumber(ledgerSummary.already_adjusted) || 0}
                    </h3>
                </div>
            </div>

            {/* Summary Table */}
            {formik.values.view_type === "summary" && (
                <LedgerDataTable
                    columns={summaryColumns}
                    data={ledgerSummaryData}
                    pageSize={pageSize}
                    loading={isLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {/* Custom Details Table with Red Highlighting */}
            {formik.values.view_type === "details" && (
                <div>
                    <CustomDetailsTable
                        data={ledgerDetails}
                        columns={detailsColumns}
                        loading={isLoading}
                    />

                    {/* Pagination for Custom Table */}
                    {!isLoading && ledgerDetails.length > 0 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700">
                                    Showing {(currentPage - 1) * pageSize + 1}{" "}
                                    to{" "}
                                    {Math.min(
                                        currentPage * pageSize,
                                        totalRecords
                                    )}{" "}
                                    of {totalRecords} entries
                                </span>
                                <select
                                    value={pageSize}
                                    onChange={(e) =>
                                        handlePageSizeChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="ml-4 border rounded-md p-1 text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Ledger;
