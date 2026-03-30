// import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import { CSVLink } from "react-csv";
// import { useFormik } from "formik";
// import { showToast } from "../../helper/toastMessage";
// import { formatNumber, capitalizeFirstLetter } from "../../helper/utility";
// import LedgerDataTable from "../../components/common/LedgerDataTable";
// import SelectField from "../../components/common/SelectField";
// import { getAllLoanParties, getLedger } from "../../service/loanApi";
// import {
//   getAllInvestmentParties,
//   getInvestmentLedger,
// } from "../../service/investmentApi";

// import DatePickerInput from "../../components/common/DatePickerInput";

// const Ledger = () => {
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [incomeExpenseHeadOptions, setIncomeExpenseHeadOptions] = useState([]);
//   const [ledgerSummary, setLedgerSummary] = useState({
//     total_income: 0,
//     total_expense: 0,
//     net_balance: 0,
//   });
//   const [ledgerDetails, setLedgerDetails] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const initialFilterValues = {
//     transaction_type: "all",
//     head_id: "",
//     // start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
//     // end_date: dayjs().format("YYYY-MM-DD"),
//     start_date: "",
//     end_date: "",
//   };

//   // Set the filters state with the defined initial values
//   const [filters, setFilters] = useState(initialFilterValues);

//   const transactionTypeOptions = [
//     { value: "all", label: "All Transactions" },
//     { value: "investment", label: "Investment" },
//     { value: "investment_return", label: "Investment Return" },
//     { value: "investment_profit", label: "Investment Profit" },
//   ];

//   useEffect(() => {
//     const loadInitialOptions = async () => {
//       try {
//         const [incomeExpenseHeadsRes] = await Promise.all([
//           getAllInvestmentParties(),
//         ]);
//         const formattedIncomeExpenseHeads = (
//           incomeExpenseHeadsRes.data || []
//         ).map((head) => ({
//           value: head.id,
//           label: head.party_name,
//         }));

//         setIncomeExpenseHeadOptions(formattedIncomeExpenseHeads);
//       } catch (error) {
//         showToast.error("Failed to load initial form options.");
//       }
//     };
//     loadInitialOptions();
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         const res = await getInvestmentLedger(currentPage, pageSize, filters);
//         setLedgerDetails(res.details || []);
//         setLedgerSummary(
//           res.summary || { total_income: 0, total_expense: 0, net_balance: 0 }
//         );
//         setTotalPages(Math.ceil(res.total / pageSize));
//         setTotalRecords(res.total || 0);
//       } catch (err) {
//         showToast.error(err.message || "Failed to fetch ledger data.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, [currentPage, pageSize, filters]);

//   const entryTypeCustomize = (entryType) => {
//     switch (entryType) {
//       case "investment":
//         return "Investment";
//       case "investment_return":
//         return "Investment Return";
//       case "investment_profit":
//         return "Investment Profit";
//       default:
//         return entryType;
//     }
//   };

//   const columns = [
//     { header: "Posting Date", accessor: "posting_date", sortable: true },
//     {
//       header: "Trx Category",
//       accessor: (row) => entryTypeCustomize(row.entry_type),
//       sortable: true,
//     },
//     {
//       header: "Trx Type",
//       accessor: (row) => capitalizeFirstLetter(row.transaction_type),
//       sortable: true,
//     },

//     {
//       header: "Party",
//       accessor: (row) => row.party_name,
//       sortable: true,
//     },
//     {
//       header: "Amount in BDT",
//       accessor: (row) => `৳ ${formatNumber(row.amount_bdt)}`,
//       sortable: true,
//     },
//     { header: "Note", accessor: "note", sortable: true },
//   ];

//   const csvHeaders = [
//     { label: "Posting Date", key: "posting_date" },
//     { label: "Transaction Type", key: "transaction_type" },
//     { label: "Party", key: "party_name" },
//     { label: "Amount (BDT)", key: "amount_bdt" },
//     { label: "Note", key: "note" },
//   ];
//   const formik = useFormik({
//     initialValues: initialFilterValues,
//     onSubmit: (values, { resetForm }) => {
//       setFilters(values);
//       setCurrentPage(1);
//       setFilters(values);
//       resetForm({
//         values: {
//           transaction_type: "all",
//           head_id: "",
//           start_date: "",
//           end_date: "",
//         },
//       });
//     },
//   });

//   const handlePageSizeChange = (newSize) => {
//         setPageSize(newSize);
//         setCurrentPage(1); 
//     };
//   return (
//     <div className='w-full bg-white rounded shadow border p-4'>
//       <h2 className='text-lg font-semibold flex-grow mb-4'>
//         Investment Ledger
//       </h2>

//       <form onSubmit={formik.handleSubmit}>
//         <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
//           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto'>
//             <SelectField
//               label='Transaction Type'
//               name='transaction_type'
//               className='w-full sm:w-64'
//               placeholder='Choose a country...'
//               options={transactionTypeOptions}
//               value={transactionTypeOptions.find(
//                 (option) => option.value === formik.values.transaction_type
//               )}
//               onChange={(selectedOption) =>
//                 formik.setFieldValue("transaction_type", selectedOption.value)
//               }
//             />
//             <SelectField
//               label='Select Head'
//               name='head_id'
//               className='w-full sm:w-64'
//               placeholder='Choose a Head'
//               options={incomeExpenseHeadOptions}
//               value={incomeExpenseHeadOptions.find(
//                 (option) => option.value === formik.values.head_id
//               )}
//               onChange={(selectedOption) =>
//                 formik.setFieldValue("head_id", selectedOption.value)
//               }
//             />


//             {/* <div className='flex flex-col'>
//               <input
//                 type='date'
//                 name='start_date'
//                 value={formik.values.start_date}
//                 onChange={formik.handleChange}
//                 className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500'
//               />
//             </div>


//             <div className='flex flex-col'>
//               <input
//                 type='date'
//                 name='end_date'
//                 value={formik.values.end_date}
//                 onChange={formik.handleChange}
//                 className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500'
//               />
//             </div> */}


//             <div className="relative">
//                 <DatePickerInput
//                  key={formik.values.start_date}
//                   onDateChange={(date) => {
//                     if (!date) {
//                       formik.setFieldValue("start_date", "");
//                       return;
//                     }
//                     const localDate = new Date(date);
//                     const year = localDate.getFullYear();
//                     const month = String(localDate.getMonth() + 1).padStart(2, "0");
//                     const day = String(localDate.getDate()).padStart(2, "0");
//                     formik.setFieldValue("start_date", `${year}-${month}-${day}`);
//                     formik.setFieldTouched("start_date", true, false);
//                   }}
//                   placeholderText="Start Date"
//                   initialDate={formik.values.start_date || null}
//                 />
//                 {formik.touched.start_date && formik.errors.start_date && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {formik.errors.start_date}
//                   </p>
//                 )}
//               </div> 

            

//             <div className="relative">
//                 <DatePickerInput
//                 key={formik.values.end_date}
//                   onDateChange={(date) => {
//                     if (!date) {
//                       formik.setFieldValue("end_date", "");
//                       return;
//                     }
//                     const localDate = new Date(date);
//                     const year = localDate.getFullYear();
//                     const month = String(localDate.getMonth() + 1).padStart(2, "0");
//                     const day = String(localDate.getDate()).padStart(2, "0");
//                     formik.setFieldValue("end_date", `${year}-${month}-${day}`);
//                     formik.setFieldTouched("end_date", true, false);
//                   }}
//                   placeholderText="End Date"
//                   initialDate={formik.values.end_date || null}
//                 />
//                 {formik.touched.end_date && formik.errors.end_date && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {formik.errors.end_date}
//                   </p>
//                 )}
//               </div>


//           </div>
//           {/* Filter Button */}
//           <button
//             type='submit'
//             className='btn btn-primary border-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200'>
//             Filter
//           </button>
//           <CSVLink
//             data={ledgerDetails}
//             headers={csvHeaders}
//             filename={"ledger-data.csv"}
//             className='btn btn-primary border-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200'>
//             Export CSV
//           </CSVLink>
//         </div>
//       </form>
//       <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
//         <div className='bg-green-100 p-4 rounded shadow'>
//           <p className='text-sm'>Total Investment</p>
//           <h3 className='text-2xl font-bold text-green-800'>
//             ৳ {formatNumber(ledgerSummary.total_investment) || 0}
//           </h3>
//         </div>
//         <div className='bg-red-100 p-4 rounded shadow'>
//           <p className='text-sm'>Total Returned</p>
//           <h3 className='text-2xl font-bold text-red-800'>
//             ৳ {formatNumber(ledgerSummary.total_returned) || 0}
//           </h3>
//         </div>
//         <div className='bg-blue-100 p-4 rounded shadow'>
//           <p className='text-sm'>Profit</p>
//           <h3 className='text-2xl font-bold text-blue-800'>
//             ৳ {formatNumber(ledgerSummary.total_profit) || 0}
//           </h3>
//         </div>
//         <div className='bg-blue-100 p-4 rounded shadow'>
//           <p className='text-sm'>Receivable</p>
//           <h3 className='text-2xl font-bold text-blue-800'>
//             ৳ {formatNumber(ledgerSummary.balance) || 0}
//           </h3>
//         </div>
//       </div>

//       <LedgerDataTable
//         columns={columns}
//         data={ledgerDetails}
//         pageSize={pageSize}
//         loading={isLoading}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalRecords={totalRecords}
//         onPageChange={(page) => {
//           setCurrentPage(page);
//         }}
//         onPageSizeChange={handlePageSizeChange}
//       />
//     </div>
//   );
// };

// export default Ledger;



import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import { useFormik } from "formik";
import { showToast } from "../../helper/toastMessage";
import { formatNumber, capitalizeFirstLetter } from "../../helper/utility";
import LedgerDataTable from "../../components/common/LedgerDataTable";
import SelectField from "../../components/common/SelectField";
import DatePickerInput from "../../components/common/DatePickerInput";
import {
  getAllInvestmentParties,
  getInvestmentLedger,
  getInvestmentLedgerSummary,
} from "../../service/investmentApi";

const Ledger = () => {
  const [viewType, setViewType] = useState("summary");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [headOptions, setHeadOptions] = useState([]);
  const [ledgerSummary, setLedgerSummary] = useState({
    total_investment: 0,
    total_returned: 0,
    total_profit: 0,
    balance: 0,
  });
  const [summaryRows, setSummaryRows] = useState([]);
  const [ledgerDetails, setLedgerDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialFilterValues = {
    transaction_type: "all",
    head_id: "",
    start_date: "",
    end_date: "",
  };

  const [filters, setFilters] = useState(initialFilterValues);

  const transactionTypeOptions = [
    { value: "all", label: "All Transactions" },
    { value: "investment", label: "Investment" },
    { value: "investment_return", label: "Investment Return" },
    { value: "investment_profit", label: "Investment Profit" },
  ];

  const viewTypeOptions = [
    { value: "summary", label: "Summary" },
    { value: "details", label: "Details" },
  ];

  useEffect(() => {
    const loadHeads = async () => {
      try {
        const res = await getAllInvestmentParties();
        const formatted = (res.data || []).map((h) => ({
          value: h.id,
          label: h.party_name,
        }));
        setHeadOptions(formatted);
      } catch {
        showToast.error("Failed to load parties.");
      }
    };
    loadHeads();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (viewType === "summary") {
          const res = await getInvestmentLedgerSummary(filters);
          setLedgerSummary(res.summary || {});
          setSummaryRows(res.details || []);
        } else {
          const res = await getInvestmentLedger(currentPage, pageSize, filters);
          setLedgerSummary(res.summary || {});
          setLedgerDetails(res.details || []);
          setTotalPages(Math.ceil(res.total / pageSize));
          setTotalRecords(res.total || 0);
        }
      } catch {
        showToast.error("Failed to load ledger data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters, currentPage, pageSize, viewType]);

  const formik = useFormik({
    initialValues: initialFilterValues,
    onSubmit: () => {},
  });

  const handleFilterChange = (name, value) => {
    formik.setFieldValue(name, value);
    setFilters({ ...formik.values, [name]: value });
    setCurrentPage(1);
  };

  const columns = [
    { header: "Posting Date", accessor: "posting_date", sortable: true },
    {
      header: "Transaction Type",
      accessor: (row) => entryTypeCustomize(row.entry_type),
      sortable: true,
    },
    {
      header: "Trx Category",
      accessor: (row) => capitalizeFirstLetter(row.transaction_type),
      sortable: true,
    },
    { header: "Party", accessor: "party_name", sortable: true },
    {
      header: "Amount in BDT",
      accessor: (row) => `৳ ${formatNumber(row.amount_bdt)}`,
      sortable: true,
    },
    { header: "Note", accessor: "note", sortable: true },
  ];

  const entryTypeCustomize = (entryType) => {
    switch (entryType) {
      case "investment":
        return "Investment";
      case "investment_return":
        return "Investment Return";
      case "investment_profit":
        return "Investment Profit";
      default:
        return entryType;
    }
  };

  const csvData = viewType === "summary" ? summaryRows : ledgerDetails;

  return (
    <div className="w-full bg-white rounded shadow border p-4">
      <h2 className="text-lg font-semibold mb-4">Investment Ledger</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <SelectField
          label="View Type"
          name="viewType"
          className="w-64"
          placeholder="Select View"
          options={viewTypeOptions}
          value={viewTypeOptions.find((o) => o.value === viewType)}
          onChange={(opt) => setViewType(opt.value)}
        />

         {viewType === "details" && (
        < >
          <SelectField
            label="Transaction Type"
            name="transaction_type"
            options={transactionTypeOptions}
            value={transactionTypeOptions.find(
              (o) => o.value === formik.values.transaction_type
            )}
            onChange={(opt) => handleFilterChange("transaction_type", opt.value)}
          />

          <SelectField
            label="Select Party"
            name="head_id"
            className="w-64"
            placeholder="Select Party"
            options={headOptions}
            value={
              formik.values.head_id
                ? headOptions.find((o) => o.value === formik.values.head_id)
                : null
            }
            onChange={(opt) =>
              handleFilterChange("head_id", opt ? opt.value : "")
            }
          />

          <div className="relative">
            <DatePickerInput
            label="Start Date"
            placeholderText="Start Date"
            initialDate={formik.values.start_date || null}
            onDateChange={(date) =>
              handleFilterChange(
                "start_date",
                date ? dayjs(date).format("YYYY-MM-DD") : ""
              )
            }
          />
          </div>

          <div className="relative">
            <DatePickerInput
            label="End Date"
            placeholderText="End Date"
            initialDate={formik.values.end_date || null}
            onDateChange={(date) =>
              handleFilterChange(
                "end_date",
                date ? dayjs(date).format("YYYY-MM-DD") : ""
              )
            }
          />
          </div>
        </>
      )}
        <CSVLink
          data={csvData}
          headers={
            viewType === "summary"
              ? [
                  { label: "Entry Type", key: "entry_type" },
                  { label: "Amount (BDT)", key: "amount_bdt" },
                ]
              : columns.map((c) => ({
                  label: c.header,
                  key: typeof c.accessor === "string" ? c.accessor : c.header,
                }))
          }
          filename={"ledger.csv"}
          className="border-0 bg-green-700 hover:bg-green-600 text-white font-bold rounded 
         transition-colors duration-200
         flex items-center justify-center 
         px-4 h-10"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* {viewType === "details" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SelectField
            label="Transaction Type"
            name="transaction_type"
            options={transactionTypeOptions}
            value={transactionTypeOptions.find(
              (o) => o.value === formik.values.transaction_type
            )}
            onChange={(opt) => handleFilterChange("transaction_type", opt.value)}
          />

          <SelectField
            label="Select Party"
            name="head_id"
            options={headOptions}
            value={
              formik.values.head_id
                ? headOptions.find((o) => o.value === formik.values.head_id)
                : null
            }
            onChange={(opt) =>
              handleFilterChange("head_id", opt ? opt.value : "")
            }
          />

          <DatePickerInput
            label="Start Date"
            initialDate={formik.values.start_date || null}
            onDateChange={(date) =>
              handleFilterChange(
                "start_date",
                date ? dayjs(date).format("YYYY-MM-DD") : ""
              )
            }
          />

          <DatePickerInput
            label="End Date"
            initialDate={formik.values.end_date || null}
            onDateChange={(date) =>
              handleFilterChange(
                "end_date",
                date ? dayjs(date).format("YYYY-MM-DD") : ""
              )
            }
          />
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm">Total Investment</p>
          <h3 className="text-2xl font-bold text-green-800">
            ৳ {formatNumber(ledgerSummary.total_investment)}
          </h3>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm">Total Returned</p>
          <h3 className="text-2xl font-bold text-red-800">
            ৳ {formatNumber(ledgerSummary.total_returned)}
          </h3>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm">Profit</p>
          <h3 className="text-2xl font-bold text-blue-800">
            ৳ {formatNumber(ledgerSummary.total_profit)}
          </h3>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm">Receivable</p>
          <h3 className="text-2xl font-bold text-blue-800">
            ৳ {formatNumber(ledgerSummary.balance)}
          </h3>
        </div>
      </div>

      {/* {viewType === "summary" && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Entry Type</th>
              <th className="p-2 border">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border">{entryTypeCustomize(row.entry_type)}</td>
                <td className="p-2 border">৳ {formatNumber(row.amount_bdt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}


      {viewType === "summary" && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-2 border">Party</th>
              <th className="p-2 border">Total Investment</th>
              <th className="p-2 border">Total Returned</th>
              <th className="p-2 border">Profit</th>
              <th className="p-2 border">Receivable</th>
            </tr>
          </thead>

          <tbody>
            {summaryRows.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-3 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              summaryRows.map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2 border">{row.party_name || "N/A"}</td>
                  <td className="p-2 border">৳ {formatNumber(row.total_investment)}</td>
                  <td className="p-2 border">৳ {formatNumber(row.total_returned)}</td>
                  <td className="p-2 border">৳ {formatNumber(row.total_profit)}</td>
                  <td className="p-2 border font-semibold">
                    ৳ {formatNumber(row.balance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}



      {viewType === "details" && (
        <LedgerDataTable
          columns={columns}
          data={ledgerDetails}
          pageSize={pageSize}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};

export default Ledger;
