import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import { useFormik } from "formik";
import { showToast } from "../../helper/toastMessage";
import { formatNumber, capitalizeFirstLetter } from "../../helper/utility";
import LedgerDataTable from "../../components/common/LedgerDataTable";
import SelectField from "../../components/common/SelectField";
import { getAllLoanParties, getLedger } from "../../service/loanApi";
import {
  getAllInvestmentParties,
  getInvestmentLedger,
} from "../../service/investmentApi";

const Ledger = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
    // start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    // end_date: dayjs().format("YYYY-MM-DD"),
    start_date: "",
    end_date: "",
  };

  // Set the filters state with the defined initial values
  const [filters, setFilters] = useState(initialFilterValues);

  const transactionTypeOptions = [
    { value: "all", label: "All Transactions" },
    { value: "investment", label: "Investment" },
    { value: "investment_return", label: "Investment Return" },
    { value: "investment_profit", label: "Investment Profit" },
  ];

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [incomeExpenseHeadsRes] = await Promise.all([
          getAllInvestmentParties(),
        ]);
        const formattedIncomeExpenseHeads = (
          incomeExpenseHeadsRes.data || []
        ).map((head) => ({
          value: head.id,
          label: head.party_name,
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
        const res = await getInvestmentLedger(currentPage, pageSize, filters);
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

  const columns = [
    { header: "Posting Date", accessor: "posting_date", sortable: true },
    {
      header: "Trx Category",
      accessor: (row) => entryTypeCustomize(row.entry_type),
      sortable: true,
    },
    {
      header: "Trx Type",
      accessor: (row) => capitalizeFirstLetter(row.transaction_type),
      sortable: true,
    },

    {
      header: "Party",
      accessor: (row) => row.party_name,
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
    { label: "Party", key: "party_name" },
    { label: "Amount (BDT)", key: "amount_bdt" },
    { label: "Note", key: "note" },
  ];
  const formik = useFormik({
    initialValues: initialFilterValues,
    onSubmit: (values, { resetForm }) => {
      setFilters(values);
      setCurrentPage(1);
      setFilters(values);
      resetForm({
        values: {
          transaction_type: "all",
          head_id: "",
          start_date: "",
          end_date: "",
        },
      });
    },
  });

  const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); 
    };
  return (
    <div className='w-full bg-white rounded shadow border p-4'>
      <h2 className='text-lg font-semibold flex-grow mb-4'>
        Investment Ledger
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
            <SelectField
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
            />
            <div className='flex flex-col'>
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
            </div>
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
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-green-100 p-4 rounded shadow'>
          <p className='text-sm'>Total Investment</p>
          <h3 className='text-2xl font-bold text-green-800'>
            ৳ {formatNumber(ledgerSummary.total_investment) || 0}
          </h3>
        </div>
        <div className='bg-red-100 p-4 rounded shadow'>
          <p className='text-sm'>Total Returned</p>
          <h3 className='text-2xl font-bold text-red-800'>
            ৳ {formatNumber(ledgerSummary.total_returned) || 0}
          </h3>
        </div>
        <div className='bg-blue-100 p-4 rounded shadow'>
          <p className='text-sm'>Profit</p>
          <h3 className='text-2xl font-bold text-blue-800'>
            ৳ {formatNumber(ledgerSummary.total_profit) || 0}
          </h3>
        </div>
        <div className='bg-blue-100 p-4 rounded shadow'>
          <p className='text-sm'>Receivable</p>
          <h3 className='text-2xl font-bold text-blue-800'>
            ৳ {formatNumber(ledgerSummary.balance) || 0}
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