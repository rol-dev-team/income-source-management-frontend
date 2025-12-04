import React, { useEffect, useState } from "react";
import {
    fetchBankLedgerSummary,
    fetchBankLedgerDetails,
} from "../service/bankLedgerApi";
import {
    getAllCurrencies,
    getAllCurrencyParties,
} from "../service/currency-trading/currencyApi";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import { capitalizeFirstLetter } from "../helper/utility";
import {
    fetchAllAccountNumber,
    fetchAccountNumberByChannelId,
} from "../service/accountNumberApi";
import { fetchAllPaymentChannels } from "../service/paymentChannelDetailsApi";

const BankLedger = () => {
    // State for data and loading
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({});
    const [payable, setPayable] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({});

    // State for dropdown options
    const [currencies, setCurrencies] = useState([]);
    const [currencyParties, setCurrencyParties] = useState([]);
    const [accountNumbers, setAccountNumbers] = useState([]);
    const [paymentChannels, setPaymentChannels] = useState([]);

    // State for filters
    const [filters, setFilters] = useState({
        currency_id: "",
        currency_party_id: "",
        transaction_type: "",
        start_date: "",
        end_date: "",
        ac_no: "",
        payment_channel_id: "",
    });

    // State for view and pagination
    const [view, setView] = useState("summary");
    const [accountSummary, setAccountSummary] = useState([]);
    const [pageSize, setPageSize] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);

    // Format numbers with Indian locale
    const formatNumber = (value) => {
        if (value === null || value === undefined) return "";
        const num = Number(value);
        const isInteger = num % 1 === 0;
        return isInteger
            ? num.toLocaleString("en-IN")
            : num.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });
    };

    // Fetch dropdown options
    const fetchDropdownData = async () => {
        try {
            const [currencyRes, partyRes, accountNumberRes, paymentChannelRes] =
                await Promise.all([
                    getAllCurrencies(),
                    getAllCurrencyParties(),
                    fetchAllAccountNumber(),
                    fetchAllPaymentChannels(),
                ]);
            setCurrencies(currencyRes.data || []);
            setCurrencyParties(partyRes.data || []);
            setAccountNumbers(accountNumberRes.data || []);
            setPaymentChannels(paymentChannelRes.data || []);
        } catch (error) {
            console.error("Error fetching dropdown data", error);
        }
    };

    // Check if cash is selected
    const isCashSelected = () => {
        if (!filters.payment_channel_id) return false;
        const selectedChannel = paymentChannels.find(
            (channel) => channel.id === Number(filters.payment_channel_id)
        );
        return selectedChannel?.method_name.toLowerCase() === "cash";
    };

    // Fetch account numbers by payment channel
    const fetchAccountNumbersByChannel = async (channelId) => {
        try {
            if (!channelId) {
                const res = await fetchAllAccountNumber();
                setAccountNumbers(res.data || []);
                return;
            }
            const res = await fetchAccountNumberByChannelId(channelId);
            setAccountNumbers(res.data || []);
        } catch (error) {
            console.error("Error fetching account numbers by channel", error);
        }
    };

    // Fetch ledger data based on current view
    const fetchData = async () => {
        setLoading(true);
        try {
            let data;
            if (view === "summary") {
                data = await fetchBankLedgerSummary(filters);
            } else {
                data = await fetchBankLedgerDetails(filters);
            }

            setRows(data.rows);
            setSummary(data.summary);
            setPayable(data.payable);
            setAccountSummary(data.account_summary || []);

            if (data.date_range) {
                setDateRange(data.date_range);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize dropdown data
    useEffect(() => {
        fetchDropdownData();
    }, []);

    // Handle view changes
    // useEffect(() => {
    //     if (view === "details" && !filters.start_date && !filters.end_date) {
    //         // Set default dates for details view
    //         setFilters((prev) => ({
    //             ...prev,
    //             start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    //             end_date: dayjs().format("YYYY-MM-DD"),
    //         }));
    //     } else {
    //         // For summary view or when dates exist, just fetch data
    //         fetchData();
    //     }
    // }, [view]);

    useEffect(() => {
        fetchData();
    }, [view]);

    // Handle filter changes with debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [filters]);

    // Handle payment channel change
    const handlePaymentChannelChange = (e) => {
        const channelId = e.target.value;
        setFilters((prev) => ({
            ...prev,
            payment_channel_id: channelId,
            ac_no: "",
        }));
        fetchAccountNumbersByChannel(channelId);
    };

    // Handle generic filter changes
    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Clear date filters
    const clearDateFilters = () => {
        setFilters((prev) => ({
            ...prev,
            start_date: "",
            end_date: "",
        }));
    };

    // Pagination logic
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentRows = rows.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(rows.length / pageSize);

    // CSV export setup
    const csvHeaders =
        view === "summary"
            ? [
                  { label: "Payment Channel", key: "payment_channel" },
                  { label: "Account Name", key: "account_name" },
                  { label: "Account Number", key: "account_number" },
                  { label: "Payment (BDT)", key: "payment_amount" },
                  { label: "Received (BDT)", key: "received_amount" },
                  { label: "Balance (BDT)", key: "balance" },
              ]
            : [
                  { label: "Posting Date", key: "posting_date" },
                  { label: "Transaction Category", key: "entry_type" },
                  { label: "Transaction Type", key: "transaction_type" },
                  { label: "Amount (BDT)", key: "amount_bdt" },
                  { label: "Payment Channel", key: "payment_channel" },
                  { label: "Account Name", key: "account_name" },
                  { label: "Account Number", key: "account_number" },
                  { label: "Party", key: "party_name" },
                  { label: "Party Account", key: "party_account" },
                  { label: "Note", key: "note" },
              ];

    const csvData =
        view === "summary"
            ? rows.map((row) => {
                  const balance = row.received_amount - row.payment_amount;
                  return {
                      payment_channel:
                          row.payment_channel_details?.method_name || "N/A",
                      account_name: row.account_number?.ac_name || "N/A",
                      account_number: row.account_number?.ac_no || "N/A",
                      payment_amount:
                          row.payment_amount > 0
                              ? formatNumber(row.payment_amount)
                              : "-",
                      received_amount:
                          row.received_amount > 0
                              ? formatNumber(row.received_amount)
                              : "-",
                      balance: formatNumber(balance),
                  };
              })
            : rows.map((row) => {
                  // Debugging: Log the row to see its structure
                  console.log("Detail row:", row);

                  return {
                      posting_date:
                          dayjs(row.posting_date).format("YYYY-MM-DD") || "",
                      entry_type: row.entry_type || "N/A",
                      transaction_type: capitalizeFirstLetter(
                          row.transaction_type || ""
                      ),
                      amount_bdt: formatNumber(row.amount_bdt || 0),
                      payment_channel:
                          row.payment_channel_details?.method_name ||
                          row.payment_channel_id ||
                          "N/A",
                      account_name:
                          row.account_number?.ac_name ||
                          row.account_id ||
                          "N/A",
                      account_number:
                          row.account_number?.ac_no || row.account_id || "N/A",
                      //   party_name:
                      //       row.currency_party?.party_name ||
                      //       row.currency_party_id ||
                      //       "N/A",
                      party_name: row.party_name || "N/A",
                      party_account: row.party_account_number || "N/A",
                      note: row.note || "",
                  };
              });

    // Add this debug line to check the final CSV data
    console.log("CSV Data to export:", csvData);

    return (
        <div className="w-full bg-white rounded shadow border p-4">
            <h2 className="text-lg font-semibold flex-grow mb-4">
                Bank Ledger
            </h2>

            {/* View Selector */}

            {/* Filters */}
            {/* <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-2 mb-6 items-center">
                
                <div className="col-span-1">
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className="w-full border rounded p-1 text-sm"
                    >
                        <option value="summary">Summary</option>
                        <option value="details">Details</option>
                    </select>
                </div>

                
                <div className="col-span-1">
                    <select
                        value={filters.payment_channel_id}
                        onChange={handlePaymentChannelChange}
                        className="w-full border rounded p-1 text-sm"
                    >
                        <option value="">All Payment Channels</option>
                        {paymentChannels.map((channel) => (
                            <option key={channel.id} value={channel.id}>
                                {channel.method_name}
                            </option>
                        ))}
                    </select>
                </div>

               
                <div className="col-span-1">
                    <select
                        value={filters.ac_no}
                        onChange={(e) =>
                            handleFilterChange("ac_no", e.target.value)
                        }
                        className={`w-full border rounded p-1 text-sm ${
                            isCashSelected()
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                        }`}
                        disabled={isCashSelected()}
                    >
                        <option value="">All Account Numbers</option>
                        {accountNumbers.map((account) => (
                            <option key={account.id} value={account.ac_no}>
                                {account.ac_name} - {account.ac_no}
                            </option>
                        ))}
                    </select>
                </div>

              
                <div className="col-span-2 flex items-center gap-1">
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) =>
                            handleFilterChange("start_date", e.target.value)
                        }
                        className="border rounded p-1 text-sm w-full"
                    />
                    <span className="text-sm">to</span>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) =>
                            handleFilterChange("end_date", e.target.value)
                        }
                        className="border rounded p-1 text-sm w-full"
                    />
                    <button
                        onClick={clearDateFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-2 py-1 rounded whitespace-nowrap"
                    >
                        Clear
                    </button>
                </div>

                
                <div className="col-span-1">
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`bank_ledger_${view}_${dayjs().format(
                            "YYYY-MM-DD"
                        )}.csv`}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium p-1 rounded shadow transition duration-300 text-center block"
                    >
                        Export CSV
                    </CSVLink>
                </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-2 mb-6 items-center">
                {/* View Selector - Always col-span-1 */}
                <div className="col-span-1">
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className="w-full border rounded p-1 text-sm"
                    >
                        <option value="summary">Summary</option>
                        <option value="details">Details</option>
                    </select>
                </div>

                {/* Payment Channel Dropdown - Always col-span-1 */}
                <div className="col-span-1">
                    <select
                        value={filters.payment_channel_id}
                        onChange={handlePaymentChannelChange}
                        className="w-full border rounded p-1 text-sm"
                    >
                        <option value="">All Payment Channels</option>
                        {paymentChannels.map((channel) => (
                            <option key={channel.id} value={channel.id}>
                                {channel.method_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Account Number Dropdown - Always col-span-1 */}
                <div className="col-span-1">
                    <select
                        value={filters.ac_no}
                        onChange={(e) =>
                            handleFilterChange("ac_no", e.target.value)
                        }
                        className={`w-full border rounded p-1 text-sm ${
                            isCashSelected()
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                        }`}
                        disabled={isCashSelected()}
                    >
                        <option value="">All Account Numbers</option>
                        {accountNumbers.map((account) => (
                            <option key={account.id} value={account.ac_no}>
                                {account.ac_name} - {account.ac_no}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Picker - Only in details view, col-span-2 */}
                {view === "details" && (
                    <div className="col-span-2 flex items-center gap-1">
                        <input
                            type="date"
                            value={filters.start_date}
                            onChange={(e) =>
                                handleFilterChange("start_date", e.target.value)
                            }
                            className="border rounded p-1 text-sm w-full"
                        />
                        <span className="text-sm">to</span>
                        <input
                            type="date"
                            value={filters.end_date}
                            onChange={(e) =>
                                handleFilterChange("end_date", e.target.value)
                            }
                            className="border rounded p-1 text-sm w-full"
                        />
                        <button
                            onClick={clearDateFilters}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-2 py-1 rounded whitespace-nowrap"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Export Button - Dynamic sizing */}
                <div
                    className={`${
                        view === "details"
                            ? "col-span-1"
                            : "col-span-1 md:col-start-5 lg:col-start-5"
                    }`}
                >
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`bank_ledger_${view}_${dayjs().format(
                            "YYYY-MM-DD"
                        )}.csv`}
                        className={`bg-green-600 hover:bg-green-700 text-white text-sm font-medium p-1 rounded shadow transition duration-300 text-center block ${
                            view === "summary" ? "w-32" : "w-full"
                        }`}
                    >
                        Export CSV
                    </CSVLink>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-yellow-100 p-4 rounded shadow">
                    <p className="text-sm">Payment</p>
                    <h3 className="text-2xl font-bold text-yellow-800">
                        ৳ {formatNumber(summary.payment) || 0}
                    </h3>
                </div>
                <div className="bg-purple-100 p-4 rounded shadow">
                    <p className="text-sm">Received</p>
                    <h3 className="text-2xl font-bold text-purple-800">
                        ৳ {formatNumber(summary.received) || 0}
                    </h3>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm">Balance</p>
                    <h3 className="text-2xl font-bold text-blue-800">
                        ৳ {formatNumber(payable)}
                    </h3>
                </div>
            </div>

            {/* Account-wise Summary (only in summary view) */}
            {view === "summary" && accountSummary.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">
                        Account-wise Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {accountSummary.map((account) => (
                            <div
                                key={account.account_number_id}
                                className="bg-gray-50 p-3 rounded shadow"
                            >
                                <h4 className="font-medium">
                                    {account.account_number?.ac_name ||
                                        "Unknown Account"}{" "}
                                    ({account.account_number?.ac_no || "N/A"})
                                </h4>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-red-50 p-2 rounded">
                                        <p className="text-xs">Payment</p>
                                        <p className="font-bold">
                                            ৳{" "}
                                            {formatNumber(
                                                account.payment_total
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded">
                                        <p className="text-xs">Received</p>
                                        <p className="font-bold">
                                            ৳{" "}
                                            {formatNumber(
                                                account.received_total
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            {view === "details" ? (
                                <>
                                    <th className="p-2 border">Posting Date</th>
                                    <th className="p-2 border">Trx Category</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">Amount (BDT)</th>
                                    <th className="p-2 border">
                                        Payment Channel
                                    </th>
                                    <th className="p-2 border">My A/C Name</th>
                                    <th className="p-2 border">My A/C No</th>
                                    <th className="p-2 border">Party</th>
                                    <th className="p-2 border">Party A/C</th>
                                    <th className="p-2 border">Note</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-2 border">
                                        Payment Channel
                                    </th>
                                    <th className="p-2 border">My A/C Name</th>
                                    <th className="p-2 border">My A/C No</th>
                                    <th className="p-2 border">
                                        Payment (BDT)
                                    </th>
                                    <th className="p-2 border">
                                        Received (BDT)
                                    </th>
                                    <th className="p-2 border">Balance</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={view === "details" ? 9 : 6}
                                    className="text-center p-4"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : currentRows.length > 0 ? (
                            currentRows.map((row) => {
                                if (view === "details") {
                                    return (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-2 border">
                                                {row.posting_date}
                                            </td>
                                            {/* <td className="p-2 border">
                                                {row.entry_type}
                                            </td> */}
                                            <td className="p-2 border">
                                                {row.entry_type
                                                    ? row.entry_type
                                                          .split("_") // split by underscore
                                                          .map(
                                                              (word) =>
                                                                  word
                                                                      .charAt(0)
                                                                      .toUpperCase() +
                                                                  word.slice(1)
                                                          ) // capitalize each word
                                                          .join("_") // join back with underscore
                                                    : ""}
                                            </td>

                                            <td className="p-2 border">
                                                {capitalizeFirstLetter(
                                                    row.transaction_type
                                                )}
                                            </td>
                                            <td className="p-2 border">
                                                ৳ {formatNumber(row.amount_bdt)}
                                            </td>
                                            <td className="p-2 border">
                                                {row.payment_channel_details
                                                    ?.method_name ||
                                                    row.payment_channel_id}
                                            </td>
                                            <td className="p-2 border">
                                                {row.account_number?.ac_name ||
                                                    row.account_id}
                                            </td>
                                            <td className="p-2 border">
                                                {row.account_number?.ac_no ||
                                                    row.account_id}
                                            </td>
                                            {/* <td className="p-2 border">
                                                {row.currency_party
                                                    ?.party_name ||
                                                    row.currency_party_id}
                                            </td> */}
                                            <td className="p-2 border">
                                                {row.party_name || "N/A"}
                                            </td>

                                            <td className="p-2 border">
                                                {row.party_account_number}
                                            </td>
                                            <td className="p-2 border">
                                                {row.note}
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    const balance =
                                        row.received_amount -
                                        row.payment_amount;
                                    return (
                                        <tr
                                            key={`${row.account_number?.ac_no}-${row.payment_channel_details?.id}`}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-2 border">
                                                {row.payment_channel_details
                                                    ?.method_name || "N/A"}
                                            </td>
                                            <td className="p-2 border">
                                                {row.account_number?.ac_name ||
                                                    "N/A"}
                                            </td>
                                            <td className="p-2 border">
                                                {row.account_number?.ac_no ||
                                                    "N/A"}
                                            </td>
                                            <td className="p-2 border">
                                                {row.payment_amount > 0
                                                    ? `৳ ${formatNumber(
                                                          row.payment_amount
                                                      )}`
                                                    : "-"}
                                            </td>
                                            <td className="p-2 border">
                                                {row.received_amount > 0
                                                    ? `৳ ${formatNumber(
                                                          row.received_amount
                                                      )}`
                                                    : "-"}
                                            </td>
                                            <td
                                                className={`p-2 border ${
                                                    balance > 0
                                                        ? "text-green-600"
                                                        : balance < 0
                                                        ? "text-red-600"
                                                        : ""
                                                }`}
                                            >
                                                ৳ {formatNumber(balance)}
                                            </td>
                                        </tr>
                                    );
                                }
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={view === "details" ? 9 : 6}
                                    className="text-center p-4"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    <label className="mr-2">Rows per page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded p-1"
                    >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="border px-2 py-1 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="border px-2 py-1 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankLedger;
