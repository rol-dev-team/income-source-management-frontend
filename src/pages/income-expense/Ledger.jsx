import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import { CSVLink } from "react-csv";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAllIncomesExpenses,
  getLedger,
} from "../../service/income-expense/incomeExpenseApi";
import { showToast } from "../../helper/toastMessage";
import { formatNumber, capitalizeFirstLetter } from "../../helper/utility";
import LedgerDataTable from "../../components/common/LedgerDataTable";
import SelectField from "../../components/common/SelectField";
import DatePickerInput from "../../components/common/DatePickerInput";


const ledgerFilterValidationSchema = Yup.object().shape({
  start_date: Yup.string().nullable(),

  end_date: Yup.string().nullable().when("start_date", {
    is: (val) => !!val, 
    then: (schema) =>
      schema
        .required("End Date is required")
        .test(
          "end-after-start",
          "End Date must be the same or after Start Date",
          function (end_date) {
            const { start_date } = this.parent;
            if (!end_date || !start_date) return true;
            return dayjs(end_date).isSameOrAfter(dayjs(start_date));
          }
        ),
    otherwise: (schema) => schema, 
  }),
});

const Ledger = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [incomeExpenseHeadOptions, setIncomeExpenseHeadOptions] = useState([]);
  const [ledgerSummary, setLedgerSummary] = useState({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
  });
  const [ledgerDetails, setLedgerDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialFilterValues = {
    transaction_type: "all",
    head_id: "",
    start_date: "",
    end_date: "",
  };

  // Set the filters state with the defined initial values
  const [filters, setFilters] = useState(initialFilterValues);

  const transactionTypeOptions = [
    { value: "all", label: "All Transactions" },
    { value: "received", label: "Income" },
    { value: "payment", label: "Expense" },
  ];

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [incomeExpenseHeadsRes] = await Promise.all([
          getAllIncomesExpenses(),
        ]);
        const formattedIncomeExpenseHeads = (
          incomeExpenseHeadsRes.data || []
        ).map((head) => ({
          value: head.id,
          label: head.head_name,
        }));

        setIncomeExpenseHeadOptions(formattedIncomeExpenseHeads);
      } catch (error) {
        showToast.error("Failed to load initial form options.");
      }
    };
    loadInitialOptions();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await getLedger(currentPage, pageSize, filters);
        setLedgerDetails(res.details || []);
        setLedgerSummary(
          res.summary || { total_income: 0, total_expense: 0, net_balance: 0 }
        );
        setTotalPages(Math.ceil(res.total / pageSize));
        setTotalRecords(res.total || 0);
      } catch (err) {
        showToast.error(err.message || "Failed to fetch ledger data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentPage, pageSize, filters]);

  const columns = [
    { header: "Posting Date", accessor: "posting_date", sortable: true },
    {
      header: "Type",
      accessor: (row) =>
        row.transaction_type === "received" ? "Income" : "Expense",
      sortable: true,
    },

    {
      header: "Head",
      accessor: (row) => row.head_name,
      sortable: true,
    },
    {
      header: "Amount in BDT",
      accessor: (row) => `৳ ${formatNumber(row.amount_bdt)}`,
      sortable: true,
    },
    { header: "Note", accessor: "note", sortable: true },
  ];

  const csvHeaders = [
    { label: "Posting Date", key: "posting_date" },
    { label: "Transaction Type", key: "transaction_type" },
    { label: "Income Head", key: "income_head" },
    { label: "Expense Head", key: "expense_head" },
    { label: "Amount (BDT)", key: "amount_bdt" },
    { label: "Note", key: "note" },
  ];



  const formik = useFormik({
    initialValues: initialFilterValues,
    validationSchema: ledgerFilterValidationSchema,
    onSubmit: (values,{resetForm}) => {
      setFilters(values);
      setCurrentPage(1);
     resetForm({ values: initialFilterValues });
    },
  });
console.log("Formik Errors:", formik.errors);
 const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to the first page when page size changes
    };
  return (
    <div className='w-full bg-white rounded shadow border p-4'>
      <h2 className='text-lg font-semibold flex-grow mb-4'>
        Income / Expense Ledger
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto'>
            <SelectField
              label='Transaction Type'
              name='transaction_type'
              className='w-full sm:w-64'
              placeholder='Choose a country...'
              options={transactionTypeOptions}
              value={transactionTypeOptions.find(
                (option) => option.value === formik.values.transaction_type
              )}
              onChange={(selectedOption) =>
                formik.setFieldValue("transaction_type", selectedOption.value)
              }
            />
         

            {/* <SelectField
              label='Select Head'
              name='head_id'
              className='w-full sm:w-64'
              placeholder='Choose a Head'
              options={incomeExpenseHeadOptions}
              value={incomeExpenseHeadOptions.find(
                (option) => option.value === formik.values.head_id
              )}
              onChange={(selectedOption) =>
                formik.setFieldValue("head_id", selectedOption.value)
              }
            /> */}
            <div>

            <SelectField
              label='Select Head'
              name='head_id'
              className='w-full sm:w-64'
              placeholder='Choose a Head'
              options={incomeExpenseHeadOptions}
              value={
                formik.values.head_id
                  ? incomeExpenseHeadOptions.find(
                      (option) => option.value === formik.values.head_id
                    )
                  : null
              }
              onChange={(selectedOption) =>
                formik.setFieldValue(
                  "head_id",
                  selectedOption ? selectedOption.value : ""
                )
              }
            />
            </div>
             

            <div className="relative">
                <DatePickerInput
                 key={formik.values.start_date}
                  onDateChange={(date) => {
                    if (!date) {
                      formik.setFieldValue("start_date", "");
                      return;
                    }
                    const localDate = new Date(date);
                    const year = localDate.getFullYear();
                    const month = String(localDate.getMonth() + 1).padStart(2, "0");
                    const day = String(localDate.getDate()).padStart(2, "0");
                    formik.setFieldValue("start_date", `${year}-${month}-${day}`);
                    formik.setFieldTouched("start_date", true, false);
                  }}
                  placeholderText="Start Date"
                  initialDate={formik.values.start_date || null}
                />
                {formik.touched.start_date && formik.errors.start_date && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.start_date}
                  </p>
                )}
              </div> 

            

            <div className="relative">
                <DatePickerInput
                key={formik.values.end_date}
                  onDateChange={(date) => {
                    if (!date) {
                      formik.setFieldValue("end_date", "");
                      return;
                    }
                    const localDate = new Date(date);
                    const year = localDate.getFullYear();
                    const month = String(localDate.getMonth() + 1).padStart(2, "0");
                    const day = String(localDate.getDate()).padStart(2, "0");
                    formik.setFieldValue("end_date", `${year}-${month}-${day}`);
                    formik.setFieldTouched("end_date", true, false);
                  }}
                  placeholderText="End Date"
                  initialDate={formik.values.end_date || null}
                />
                {formik.touched.end_date && formik.errors.end_date && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.end_date}
                  </p>
                )}
              </div>



              {/* <div className='flex flex-col'>
              <input
                type='date'
                name='start_date'
                value={formik.values.start_date}
                onChange={formik.handleChange}
                className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500'
              />
            </div> 
             <div className='flex flex-col'>
              <input
                type='date'
                name='end_date'
                value={formik.values.end_date}
                onChange={formik.handleChange}
                className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-500'
              />
            </div> */}

          </div>
          {/* Filter Button */}
          <button
            type='submit'
            className='btn btn-primary border-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200'>
            Filter
          </button>
          <CSVLink
            data={ledgerDetails}
            headers={csvHeaders}
            filename={"ledger-data.csv"}
            className='btn btn-primary border-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200'>
            Export CSV
          </CSVLink>
        </div>
      </form>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='bg-green-100 p-4 rounded shadow'>
          <p className='text-sm'>Total Income</p>
          <h3 className='text-2xl font-bold text-green-800'>
            ৳ {formatNumber(ledgerSummary.total_income) || 0}
          </h3>
        </div>
        <div className='bg-red-100 p-4 rounded shadow'>
          <p className='text-sm'>Total Expense</p>
          <h3 className='text-2xl font-bold text-red-800'>
            ৳ {formatNumber(ledgerSummary.total_expense) || 0}
          </h3>
        </div>
        <div className='bg-blue-100 p-4 rounded shadow'>
          <p className='text-sm'>Net Balance</p>
          <h3 className='text-2xl font-bold text-blue-800'>
            ৳ {formatNumber(ledgerSummary.net_balance) || 0}
          </h3>
        </div>
      </div>

      <LedgerDataTable
        columns={columns}
        data={ledgerDetails}
        pageSize={pageSize}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Ledger;


