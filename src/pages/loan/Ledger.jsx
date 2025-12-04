import React, { useEffect, useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import { useFormik } from "formik";
import { showToast } from "../../helper/toastMessage";
import { formatNumber, capitalizeFirstLetter } from "../../helper/utility";
import LedgerDataTable from "../../components/common/LedgerDataTable";
import SelectField from "../../components/common/SelectField";
import {
    getAllLoanParties,
    getLedger,
    getLedgerSummary,
} from "../../service/loanApi";

const Ledger = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // FIX 1: pageSize changed from constant to state
    const [pageSize, setPageSize] = useState(10);

    const [incomeExpenseHeadOptions, setIncomeExpenseHeadOptions] = useState(
        []
    );
    const [ledgerSummary, setLedgerSummary] = useState({
        total_received: 0,
        total_payment: 0,
        balance: 0,
        loan_given: 0,
        loan_taken: 0,
        payable: 0,
        receivable: 0,
        loan_received: 0,
        loan_payment: 0,
    });
    const [ledgerDetails, setLedgerDetails] = useState([]);
    const [ledgerSummaryData, setLedgerSummaryData] = useState([]);
    const [summaryColumns, setSummaryColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Date setup for Emi Due Date conditional styling
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 (Jan) - 11 (Dec)
    const currentYear = today.getFullYear();

    const initialFilterValues = {
        transaction_type: "all",
        head_id: "",
        start_date: "",
        end_date: "",
        view_type: "summary",
        summary_transaction_type: "all",
    };
    const [filters, setFilters] = useState(initialFilterValues);

    const transactionTypeOptions = [
        { value: "all", label: "All Transactions" },
        { value: "loan_taken", label: "Loan Taken" },
        { value: "loan_given", label: "Loan Given" },
        { value: "loan_payment", label: "Loan Payment" },
        { value: "loan_received", label: "Loan Received" },
    ];

    const viewTypeOptions = [
        { value: "details", label: "Details" },
        { value: "summary", label: "Summary" },
    ];

    const summaryTransactionOptions = [
        { value: "all", label: "All Transactions" },
        { value: "loan_given", label: "Loan Given" },
        { value: "loan_taken", label: "Loan Taken" },
    ];

    // ADDED: Static "All Parties" option
    const partyOptions = [
        { value: "", label: "All Parties" }, // Empty string value for "All Parties"
    ];

    const entryTypeCustomize = (entryType) => {
        switch (entryType) {
            case "loan_taken":
                return "Loan Taken";
            case "loan_given":
                return "Loan Given";
            case "loan_payment":
                return "Loan Payment";
            case "loan_received":
                return "Loan Received";
            default:
                return entryType;
        }
    };

    // Columns for Details View
    const detailsColumns = [
        { header: "Posting Date", accessor: "posting_date", sortable: true },
        {
            header: "Trx Category",
            accessor: (row) => entryTypeCustomize(row.entry_type),
            sortable: true,
        },
        // {
        //     header: "Trx Type",
        //     accessor: (row) => capitalizeFirstLetter(row.transaction_type),
        //     sortable: true,
        // },
        { header: "Party", accessor: (row) => row.party_name, sortable: true },
        {
            header: "Amount in BDT",
            accessor: (row) => `৳ ${formatNumber(row.amount_bdt)}`,
            sortable: true,
        },
        {
            header: "Term (Months)",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received"
                    ? "--"
                    : row.term_in_month,
            sortable: true,
        },
        {
            header: "Remaining Term (Months)",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received"
                    ? "--"
                    : row.remaining_term,
            sortable: true,
        },
        {
            header: "Interest (%)",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received" ||
                row.interest_rate === null
                    ? "--"
                    : row.interest_rate,
            sortable: true,
        },
        // {
        //     header: "Installment Date",
        //     accessor: "installment_date",
        //     sortable: true,
        // },

        {
            header: "Emi",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received" ||
                row.emi === null
                    ? "--"
                    : row.emi,
            sortable: true,
        },

        {
            header: "Last Payment Date",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received" ||
                row.last_payment_date === null
                    ? "--"
                    : row.last_payment_date,
            sortable: true,
        },

        // MODIFIED: Apply red highlighting if the due date is in the current month
        {
            header: "Emi Due Date",
            accessor: (row) => {
                const dueDate = row.next_due_date;
                const isLoanTrx =
                    row.entry_type !== "loan_payment" &&
                    row.entry_type !== "loan_received";

                if (!isLoanTrx || dueDate === null) return "--";

                try {
                    const dateObject = new Date(dueDate);
                    if (isNaN(dateObject)) return dueDate; // Handle invalid date string

                    const dueMonth = dateObject.getMonth();
                    const dueYear = dateObject.getFullYear();

                    // Check if the due date is in the current month of the current year
                    if (dueMonth === currentMonth && dueYear === currentYear) {
                        return (
                            <span className="text-red-600 font-semibold bg-red-100 p-1 rounded">
                                {dueDate}
                            </span>
                        );
                    }
                } catch (e) {
                    return dueDate;
                }

                return dueDate;
            },
            sortable: true,
        },

        // MODIFIED: Emi Due Amount - Removed red highlighting in Details View
        {
            header: "Emi Due Amount",
            accessor: (row) => {
                const amount = row.total_due_amount;
                const isLoanTrx =
                    row.entry_type !== "loan_payment" &&
                    row.entry_type !== "loan_received";

                if (!isLoanTrx || amount === null) return "--";

                // Removed the red highlighting condition, just return the amount.
                return amount;
            },
            sortable: true,
        },
        // MODIFIED: Conditional styling for 'Emi Adjusted Amount' cell (Details View)
        {
            header: "Emi Adjusted Amount",
            accessor: (row) => {
                const amount = row.emi_adjustment_amount; // Assuming this key is correct for details view
                const isLoanTrx =
                    row.entry_type !== "loan_payment" &&
                    row.entry_type !== "loan_received";

                if (!isLoanTrx || amount === null) return "--";

                const adjustedAmount = parseFloat(amount);

                if (adjustedAmount < 0) {
                    return (
                        <span className="text-red-600 font-semibold bg-red-100 p-1 rounded">
                            {amount}
                        </span>
                    );
                } else if (adjustedAmount > 0) {
                    return (
                        <span className="text-green-600 font-semibold bg-green-100 p-1 rounded">
                            {amount}
                        </span>
                    );
                }

                return amount;
            },
            sortable: true,
        },
        {
            header: "Payable / Receivable",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received" ||
                row["Payable / Receivable"] === null
                    ? "--"
                    : row["Payable / Receivable"],
            sortable: true,
        },
        {
            header: "Note",
            accessor: (row) =>
                row.entry_type === "loan_payment" ||
                row.entry_type === "loan_received" ||
                row.note === null
                    ? "--"
                    : row.note,
            sortable: true,
        },
    ];

    const csvHeaders = [
        { label: "Posting Date", key: "posting_date" },
        { label: "Transaction Type", key: "transaction_type" },
        { label: "Party", key: "party_name" },
        { label: "Amount (BDT)", key: "amount_bdt" },
        { label: "Note", key: "note" },
    ];

    // NEW FUNCTION: Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to the first page when page size changes
    };

    // NEW FUNCTION: Calculate summary from filtered details data
    const calculateDetailsSummary = (detailsData) => {
        if (!detailsData || detailsData.length === 0) {
            return {
                total_received: 0,
                total_payment: 0,
                balance: 0,
                loan_given: 0,
                loan_taken: 0,
                payable: 0,
                receivable: 0,
                loan_received: 0,
                loan_payment: 0,
            };
        }

        const summary = {
            total_received: 0,
            total_payment: 0,
            balance: 0,
            loan_given: 0,
            loan_taken: 0,
            payable: 0,
            receivable: 0,
            loan_received: 0,
            loan_payment: 0,
        };

        detailsData.forEach((item) => {
            const amount = parseFloat(item.amount_bdt) || 0;

            switch (item.entry_type) {
                case "loan_taken":
                    summary.loan_taken += amount;
                    break;
                case "loan_given":
                    summary.loan_given += amount;
                    break;
                case "loan_received":
                    summary.loan_received += amount;
                    summary.total_received += amount;
                    break;
                case "loan_payment":
                    summary.loan_payment += amount;
                    summary.total_payment += amount;
                    break;
            }

            // Calculate payable/receivable if available in the data
            if (item["Payable / Receivable"]) {
                const payableReceivable =
                    parseFloat(item["Payable / Receivable"]) || 0;
                if (payableReceivable > 0) {
                    summary.receivable += payableReceivable;
                } else if (payableReceivable < 0) {
                    summary.payable += Math.abs(payableReceivable);
                }
            }
        });

        summary.balance = summary.total_received - summary.total_payment;

        return summary;
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const loadInitialOptions = async () => {
            try {
                const [incomeExpenseHeadsRes] = await Promise.all([
                    getAllLoanParties(),
                ]);
                const formattedIncomeExpenseHeads = (
                    incomeExpenseHeadsRes.data || []
                ).map((head) => ({
                    value: head.id,
                    label: head.party_name,
                }));

                // MODIFIED: Combine static "All Parties" with API parties
                const allOptions = [
                    ...partyOptions,
                    ...formattedIncomeExpenseHeads,
                ];

                setIncomeExpenseHeadOptions(allOptions);
            } catch (error) {
                showToast.error("Failed to load initial form options.");
            }
        };
        loadInitialOptions();
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                // IMPORTANT: Use the state variable `pageSize` here
                if (filters.view_type === "details") {
                    const res = await getLedger(currentPage, pageSize, filters);
                    const detailsData = res.details || [];

                    // Set ledger details
                    setLedgerDetails(detailsData);

                    // FIX: Calculate summary from the filtered details data
                    const calculatedSummary =
                        calculateDetailsSummary(detailsData);

                    // If API provides summary, use it, otherwise use calculated summary
                    const finalSummary = res.summary
                        ? {
                              ...calculatedSummary,
                              ...res.summary, // API summary takes precedence
                          }
                        : calculatedSummary;

                    setLedgerSummary(finalSummary);

                    setTotalRecords(res.total || 0);
                    setTotalPages(Math.ceil((res.total || 0) / pageSize));
                } else if (filters.view_type === "summary") {
                    const summaryFilters = {
                        ...filters,
                        transaction_type:
                            filters.summary_transaction_type === "all"
                                ? "all"
                                : filters.summary_transaction_type,
                        summary_transaction_type:
                            filters.summary_transaction_type,
                    };

                    const res = await getLedgerSummary(
                        currentPage,
                        pageSize,
                        summaryFilters
                    );
                    const data = res.data || [];
                    const summary = res.summary || {
                        loan_given: 0,
                        loan_taken: 0,
                        loan_received: 0,
                        loan_payment: 0,
                        payable: 0,
                        receivable: 0,
                        total_received: 0,
                        total_payment: 0,
                        emi_due_amount: 0,
                        receivable_emi: 0,
                        payable_emi: 0,
                        receivable_emi_due: 0,
                        payable_emi_due: 0,
                    };

                    setLedgerSummaryData(data);
                    setLedgerDetails([]);
                    setTotalRecords(res.total || 0);
                    setTotalPages(Math.ceil((res.total || 0) / pageSize));

                    if (data.length > 0) {
                        const cols = Object.keys(data[0]).map((key) => ({
                            header: key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase()),
                            // MODIFIED: Conditional styling for 'Emi Due Amount' and 'Emi Adjusted Amount' in Summary View
                            accessor: (row) => {
                                if (key === "entry_type")
                                    return entryTypeCustomize(row[key]);
                                if (key === "transaction_type")
                                    return capitalizeFirstLetter(row[key]);
                                if (key === "amount_bdt")
                                    return `৳ ${formatNumber(row[key])}`;
                                if (key === "last_payment_date")
                                    return row[key] ? row[key] : "--";

                                // NEW LOGIC: Apply red highlighting if next_due_date is in the current month in Summary Table
                                if (key === "next_due_date") {
                                    const dueDate = row[key];
                                    if (
                                        dueDate === null ||
                                        dueDate === undefined
                                    )
                                        return "--";

                                    try {
                                        const dateObject = new Date(dueDate);
                                        if (isNaN(dateObject)) return dueDate;

                                        const dueMonth = dateObject.getMonth();
                                        const dueYear =
                                            dateObject.getFullYear();

                                        if (
                                            dueMonth === currentMonth &&
                                            dueYear === currentYear
                                        ) {
                                            return (
                                                <span className="text-red-600 font-semibold bg-red-100 p-1 rounded">
                                                    {dueDate}
                                                </span>
                                            );
                                        }
                                    } catch (e) {
                                        return dueDate;
                                    }

                                    return dueDate;
                                }

                                // MODIFIED: Emi Due Amount - Removed red highlighting in Summary View
                                if (key === "emi_due_amount") {
                                    const amount = row[key];
                                    if (amount === null) return "--";
                                    // The amount is returned without any conditional styling wrapper
                                    return amount;
                                }

                                // Highlight logic for Emi Adjusted Amount
                                if (key === "emi_adjusted_amount") {
                                    const amount = row[key];
                                    if (amount === null) return "--";
                                    // Remove commas for proper float parsing
                                    const adjustedAmount = parseFloat(
                                        String(amount).replace(/,/g, "")
                                    );
                                    if (adjustedAmount < 0) {
                                        return (
                                            <span className="text-red-600 font-semibold bg-red-100 p-1 rounded">
                                                {amount}
                                            </span>
                                        );
                                    } else if (adjustedAmount > 0) {
                                        return (
                                            <span className="text-green-600 font-semibold bg-green-100 p-1 rounded">
                                                {amount}
                                            </span>
                                        );
                                    }
                                    return amount;
                                }

                                return row[key] ?? "--";
                            },
                            sortable: true,
                        }));
                        setSummaryColumns(cols);
                    }

                    setLedgerSummary({
                        total_received: summary.loan_received || 0,
                        total_payment: summary.loan_payment || 0,
                        balance:
                            (summary.loan_received || 0) -
                            (summary.loan_payment || 0),
                        loan_given: summary.loan_given || 0,
                        loan_taken: summary.loan_taken || 0,
                        payable: summary.payable || 0,
                        receivable: summary.receivable || 0,
                        emi_due_amount: summary.emi_due_amount || 0,
                        receivable_emi: summary.receivable_emi || 0,
                        payable_emi: summary.payable_emi || 0,
                        receivable_emi_due: summary.receivable_emi_due || 0,
                        payable_emi_due: summary.payable_emi_due || 0,
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
            const submittedValues = {
                ...values,
                transaction_type:
                    values.view_type === "summary"
                        ? values.summary_transaction_type === "all"
                            ? "all"
                            : values.summary_transaction_type
                        : values.transaction_type,
            };
            setFilters(submittedValues);
            setCurrentPage(1);
        },
    });

    const handleSummaryTransactionChange = (selectedOption) => {
        const newValue = selectedOption.value;
        formik.setFieldValue("summary_transaction_type", newValue);
        formik.setFieldValue(
            "transaction_type",
            newValue === "all" ? "all" : newValue
        );
        setFilters((prev) => ({
            ...prev,
            summary_transaction_type: newValue,
            transaction_type: newValue === "all" ? "all" : newValue,
        }));
        setCurrentPage(1);
    };

    const handleViewTypeChange = (selectedOption) => {
        const newViewType = selectedOption.value;
        formik.setFieldValue("view_type", newViewType);

        if (newViewType === "summary") {
            formik.setFieldValue("summary_transaction_type", "all");
            formik.setFieldValue("transaction_type", "all");
            setFilters((prev) => ({
                ...prev,
                view_type: newViewType,
                summary_transaction_type: "all",
                transaction_type: "all",
            }));
        } else {
            formik.setFieldValue("transaction_type", "all");
            setFilters((prev) => ({
                ...prev,
                view_type: newViewType,
                transaction_type: "all",
            }));
        }
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-white rounded shadow border p-4">
            <h2 className="text-lg font-semibold flex-grow mb-4">
                Loan Ledger
            </h2>

            <form onSubmit={formik.handleSubmit}>
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

                        {formik.values.view_type === "details" && (
                            <>
                                <SelectField
                                    label="Transaction Type"
                                    name="transaction_type"
                                    className="w-full sm:w-56"
                                    options={transactionTypeOptions}
                                    value={transactionTypeOptions.find(
                                        (opt) =>
                                            opt.value ===
                                            formik.values.transaction_type
                                    )}
                                    onChange={(selectedOption) =>
                                        formik.setFieldValue(
                                            "transaction_type",
                                            selectedOption.value
                                        )
                                    }
                                />
                                <SelectField
                                    label="Select Head"
                                    name="head_id"
                                    className="w-full sm:w-56"
                                    options={incomeExpenseHeadOptions}
                                    value={incomeExpenseHeadOptions.find(
                                        (opt) =>
                                            opt.value === formik.values.head_id
                                    )}
                                    onChange={(selectedOption) =>
                                        formik.setFieldValue(
                                            "head_id",
                                            selectedOption.value
                                        )
                                    }
                                />
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
                            </>
                        )}

                        {formik.values.view_type === "summary" && (
                            <SelectField
                                label="Transaction Type"
                                name="summary_transaction_type"
                                className="w-full sm:w-56"
                                options={summaryTransactionOptions}
                                value={summaryTransactionOptions.find(
                                    (opt) =>
                                        opt.value ===
                                        (formik.values
                                            .summary_transaction_type || "all")
                                )}
                                onChange={handleSummaryTransactionChange}
                            />
                        )}
                    </div>

                    <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                            type="submit"
                            className="btn btn-primary border-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                        >
                            Filter
                        </button>
                        {formik.values.view_type === "details" && (
                            <CSVLink
                                data={ledgerDetails}
                                headers={csvHeaders}
                                filename={"ledger-data.csv"}
                                className="btn btn-primary border-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                            >
                                Export CSV
                            </CSVLink>
                        )}
                    </div>
                </div>
            </form>

            {/* Summary Cards */}
            {filters.view_type === "details" ? (
                // Details View Summary Cards - Now properly reflects filtered data
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-purple-100 p-4 rounded shadow">
                        <p className="text-sm">Loan Taken</p>
                        <h3 className="text-2xl font-bold text-purple-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.loan_taken || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-red-100 p-4 rounded shadow">
                        <p className="text-sm">Total Payment</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.loan_payment || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-blue-100 p-4 rounded shadow">
                        <p className="text-sm">Payable</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.payable || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <p className="text-sm">EMI</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.payable_emi || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-orange-100 p-4 rounded shadow">
                        <p className="text-sm">EMI Due Amount</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.payable_emi_due || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded shadow">
                        <p className="text-sm">Loan Given</p>
                        <h3 className="text-2xl font-bold text-yellow-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.loan_given || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <p className="text-sm">Total Received</p>
                        <h3 className="text-2xl font-bold text-green-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.loan_received || 0)
                            )}
                        </h3>
                    </div>

                    <div className="bg-red-100 p-4 rounded shadow">
                        <p className="text-sm">Receivable</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.receivable || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-orange-100 p-4 rounded shadow">
                        <p className="text-sm">EMI</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.receivable_emi || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <p className="text-sm">EMI Due Amount</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.receivable_emi_due || 0)
                            )}
                        </h3>
                    </div>
                </div>
            ) : (
                // Summary View Summary Cards
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-purple-100 p-4 rounded shadow">
                        <p className="text-sm">Loan Taken</p>
                        <h3 className="text-2xl font-bold text-purple-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.loan_taken || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-red-100 p-4 rounded shadow">
                        <p className="text-sm">Total Payment</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.total_payment || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-blue-100 p-4 rounded shadow">
                        <p className="text-sm">Payable</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.payable || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <p className="text-sm">EMI</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.payable_emi || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-orange-100 p-4 rounded shadow">
                        <p className="text-sm">EMI Due Amount</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.payable_emi_due || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded shadow">
                        <p className="text-sm">Loan Given</p>
                        <h3 className="text-2xl font-bold text-yellow-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.loan_given || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <p className="text-sm">Total Received</p>
                        <h3 className="text-2xl font-bold text-green-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.total_received || 0)
                            )}
                        </h3>
                    </div>

                    <div className="bg-red-100 p-4 rounded shadow">
                        <p className="text-sm">Receivable</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.receivable || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-orange-100 p-4 rounded shadow">
                        <p className="text-sm">EMI</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.receivable_emi || 0)
                            )}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded shadow">
                        <p className="text-sm">EMI Due Amount</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {formatNumber(
                                Math.floor(ledgerSummary.receivable_emi_due || 0)
                            )}
                        </h3>
                    </div>
                </div>
            )}

            {/* Ledger Table - Details View */}
            {formik.values.view_type === "details" && (
                <LedgerDataTable
                    columns={detailsColumns}
                    data={ledgerDetails}
                    pageSize={pageSize}
                    loading={isLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

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
        </div>
    );
};

export default Ledger;



