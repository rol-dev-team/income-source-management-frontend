import React, { useEffect, useState } from "react";
import {
    fetchCurrencyPostings,
    fetchCurrencyLedgerSummaryPostings,
} from "../service/currencyLedgerApi";
import {
    getAllCurrencies,
    getAllCurrencyParties,
} from "../service/currency-trading/currencyApi";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import { capitalizeFirstLetter } from "../helper/utility";

const CurrencyLedgerPage = () => {
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({});
    const [currencySummary, setCurrencySummary] = useState(null);
    const [payable, setPayable] = useState(0);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("details");
    const [dateRange, setDateRange] = useState({});

    const [currencies, setCurrencies] = useState([]);
    const [currencyParties, setCurrencyParties] = useState([]);

    const [filters, setFilters] = useState({
        currency_id: "",
        currency_party_id: "",
        transaction_type: "",
        start_date: "",
        end_date: "",
        ac_no: "",
        payment_channel_id: "",
        group_by: "", // Summary By dropdown
    });

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === "") return "";
        const num = Number(value);
        if (Number.isNaN(num)) return value;
        return num.toLocaleString("en-IN", {
            minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
            maximumFractionDigits: 2,
        });
    };

    const getCurrencyName = (currency, fallbackId) => {
        if (!currency) return fallbackId || "";
        if (typeof currency === "string") return currency;
        if (typeof currency === "object") {
            return (
                currency.currency ||
                currency.name ||
                currency.title ||
                fallbackId ||
                ""
            );
        }
        return fallbackId || "";
    };

    const getSummaryLabel = (row) => {
        if (!row) return "N/A";
        if (row.currency)
            return typeof row.currency === "string"
                ? row.currency
                : getCurrencyName(row.currency, row.currency_id);
        return (
            row.currency_name ||
            row.party ||
            row.party_name ||
            row.currency_id ||
            "N/A"
        );
    };

    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchDropdownData = async () => {
        try {
            const [currencyRes, partyRes] = await Promise.all([
                getAllCurrencies(),
                getAllCurrencyParties(),
            ]);
            setCurrencies(currencyRes.data || []);
            setCurrencyParties(partyRes.data || []);
        } catch (error) {
            console.error("Error fetching dropdown data", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (view === "summary") {
                // Don't fetch if Summary By not selected
                if (!filters.group_by) {
                    setRows([]);
                    setSummary({});
                    setCurrencySummary(null);
                    setPayable(0);
                    return;
                }

                const data = await fetchCurrencyLedgerSummaryPostings(filters);
                setRows(data.rows || []);
                setSummary(data.summary || {});
                setCurrencySummary(data.currency_summary || null);
                setPayable(data.summary?.payable || 0);
                setDateRange(data.date_range || {});
            } else {
                const data = await fetchCurrencyPostings(filters);
                setRows(data.rows || []);
                setSummary(data.summary || {});
                setCurrencySummary(data.currency_summary || null);
                setPayable(data.summary?.payable || 0);
                setDateRange(data.date_range || {});
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filters, view]);

    useEffect(() => {
        if (view === "summary") {
            setFilters((prev) => ({ ...prev, start_date: "", end_date: "" }));
        } else {
            // setFilters((prev) => ({
            //     ...prev,
            //     start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
            //     end_date: dayjs().format("YYYY-MM-DD"),
            // }));
        }
    }, [view]);

    useEffect(() => {
        if (view === "summary") {
            // Summary view: clear date filters (or keep empty)
            setFilters((prev) => ({
                ...prev,
                start_date: "",
                end_date: "",
                currency_id: "",
                currency_party_id: "",
            }));
        } else {
            // Details view: reset filters to default values
            setFilters({
                currency_id: "",
                currency_party_id: "",
                transaction_type: "",
                start_date: "",
                end_date: "",
                ac_no: "",
                payment_channel_id: "",
                group_by: "", // hide summary filters
            });
        }
    }, [view]);

    const selectedCurrency = currencies.find(
        (c) => c.id === Number(filters.currency_id)
    );

    const clearDateFilters = () => {
        setFilters((prev) => ({ ...prev, start_date: "", end_date: "" }));
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleViewChange = (newView) => {
        setView(newView);
        if (newView === "summary") {
            setFilters((prev) => ({
                ...prev,
                currency_id: "",
                currency_party_id: "",
            }));
        }
    };

    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentRows = rows.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.max(Math.ceil(rows.length / pageSize), 1);

    const isCurrencyGrouping =
        view === "summary" && filters.group_by === "currency";
    const isPartyGrouping = view === "summary" && filters.group_by === "party";

    const csvHeaders =
        view === "summary"
            ? isCurrencyGrouping
                ? [
                      { label: "Currency", key: "currency" },
                      { label: "Currency Buy", key: "currency_amount_buy" },
                      { label: "Currency Sell", key: "currency_amount_sell" },
                      { label: "Balance", key: "balance" },
                  ]
                : [
                      { label: "Party", key: "party" },
                      { label: "Payment (BDT)", key: "payment_bdt" },
                      { label: "Received (BDT)", key: "received_bdt" },
                      //   { label: "Currency Buy", key: "currency_buy" },
                      //   { label: "Currency Sell", key: "currency_sell" },
                      { label: "Balance", key: "balance" },
                  ]
            : [
                  { label: "Posting Date", key: "posting_date" },
                  { label: "Transaction Type", key: "transaction_type" },
                  { label: "Currency", key: "currency_name" },
                  { label: "Currency Amount", key: "currency_amount" },
                  { label: "Exchange Rate", key: "exchange_rate" },
                  { label: "Amount (BDT)", key: "amount_bdt" },
                  { label: "Payment Channel", key: "payment_channel_name" },
                  { label: "Account Name/No", key: "account_name_no" },
                  { label: "Party", key: "party_name" },
              ];

    const csvData =
        view === "summary"
            ? rows.map((row) => {
                  if (isCurrencyGrouping) {
                      const balance =
                          (row.currency_amount_buy || 0) -
                          (row.currency_amount_sell || 0);
                      return {
                          currency: getSummaryLabel(row),
                          currency_amount_buy:
                              row.currency_amount_buy !== undefined
                                  ? formatNumber(row.currency_amount_buy)
                                  : "N/A",
                          currency_amount_sell:
                              row.currency_amount_sell !== undefined
                                  ? formatNumber(row.currency_amount_sell)
                                  : "N/A",
                          balance: formatNumber(balance),
                      };
                  } else {
                      const balance =
                          (row.received_bdt || 0) - (row.payment_bdt || 0);
                      return {
                          party: row.party || row.party_name || "N/A",
                          payment_bdt:
                              row.payment_bdt > 0
                                  ? formatNumber(row.payment_bdt)
                                  : "-",
                          received_bdt:
                              row.received_bdt > 0
                                  ? formatNumber(row.received_bdt)
                                  : "-",
                      };
                  }
              })
            : rows.map((row) => ({
                  posting_date: row.posting_date,
                  transaction_type: capitalizeFirstLetter(row.transaction_type),
                  currency_name: getCurrencyName(row.currency, row.currency_id),
                  currency_amount: row.currency_amount,
                  exchange_rate: row.exchange_rate,
                  amount_bdt: row.amount_bdt,
                  payment_channel_name: row.payment_channel_details
                      ? row.payment_channel_details.method_name
                      : row.payment_channel_id,
                  account_name_no: row.account_number
                      ? `${row.account_number.ac_name} (${row.account_number.ac_no})`
                      : row.account_id,
                  party_name: row.currency_party
                      ? row.currency_party.party_name
                      : row.currency_party_id,
              }));

    return (
        <div className="w-full bg-white rounded shadow border p-4">
            <h2 className="text-lg font-semibold flex-grow mb-4">
                Currency Ledger
            </h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-6 items-center">
                <div className="col-span-1">
                    <select
                        value={view}
                        onChange={(e) => handleViewChange(e.target.value)}
                        className="w-full border rounded p-1 text-sm"
                    >
                        <option value="summary">Summary</option>
                        <option value="details">Details</option>
                    </select>
                </div>

                {/* Summary By dropdown */}
                {view === "summary" && (
                    <div className="col-span-1">
                        <select
                            value={filters.group_by || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFilters((prev) => ({
                                    ...prev,
                                    group_by: value,
                                    currency_id:
                                        value === "party"
                                            ? ""
                                            : prev.currency_id,
                                    currency_party_id:
                                        value === "currency"
                                            ? ""
                                            : prev.currency_party_id,
                                }));
                            }}
                            className="w-full border rounded p-1 text-sm"
                        >
                            <option value="">Select Summary Type</option>
                            <option value="currency">Currency</option>
                            <option value="party">Party</option>
                        </select>
                    </div>
                )}
                {/* Currency dropdown - only show if group_by is currency or empty */}
                {(!filters.group_by || filters.group_by === "currency") && (
                    <div className="col-span-1">
                        <select
                            value={filters.currency_id}
                            onChange={(e) =>
                                handleFilterChange(
                                    "currency_id",
                                    e.target.value
                                )
                            }
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1"
                        >
                            <option value="">All Currencies</option>
                            {currencies.map((currency) => (
                                <option key={currency.id} value={currency.id}>
                                    {currency.currency ||
                                        currency.name ||
                                        currency.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Currency dropdown - only show if group_by is currency or empty */}
                {(!filters.group_by || filters.group_by === "party") && (
                    <div className="col-span-1">
                        <select
                            value={filters.currency_party_id}
                            onChange={(e) =>
                                handleFilterChange(
                                    "currency_party_id",
                                    e.target.value
                                )
                            }
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1"
                        >
                            <option value="">All Parties</option>
                            {currencyParties.map((party) => (
                                <option key={party.id} value={party.id}>
                                    {party.party_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-2 py-1 rounded"
                        >
                            Clear
                        </button>
                    </div>
                )}
                <div
                    className={
                        view === "details"
                            ? "col-span-1"
                            : "col-span-1 md:col-start-6 lg:col-start-6"
                    }
                >
                    <button
                        onClick={() => fetchData()}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium p-1 rounded shadow mr-2"
                    >
                        Apply
                    </button>
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`currency_ledger_${view}_${dayjs().format(
                            "YYYY-MM-DD"
                        )}.csv`}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium p-1 rounded shadow inline-block"
                    >
                        Export CSV
                    </CSVLink>
                </div>
            </div>

            {/* Currency Summary */}
            {view === "details" && filters.currency_id && currencySummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-100 p-4 rounded shadow">
                        <p className="text-sm">Currency Buy</p>
                        <h3 className="text-2xl font-bold text-indigo-800">
                            {selectedCurrency?.currency}{" "}
                            {formatNumber(currencySummary.currency_buy)}
                        </h3>
                    </div>
                    <div className="bg-pink-100 p-4 rounded shadow">
                        <p className="text-sm">Currency Sell</p>
                        <h3 className="text-2xl font-bold text-pink-800">
                            {selectedCurrency?.currency}{" "}
                            {formatNumber(currencySummary.currency_sell)}
                        </h3>
                    </div>
                    <div className="bg-teal-100 p-4 rounded shadow">
                        <p className="text-sm">Balance</p>
                        <h3 className="text-2xl font-bold text-teal-800">
                            {selectedCurrency?.currency}{" "}
                            {formatNumber(currencySummary.remain_currency)}
                        </h3>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {["buy", "sell", "payment", "received"].map((key, idx) => (
                    <div
                        key={key}
                        className={`bg-${
                            ["green", "red", "yellow", "purple"][idx]
                        }-100 p-4 rounded shadow`}
                    >
                        <p className="text-sm">{capitalizeFirstLetter(key)}</p>
                        <h3
                            className={`text-2xl font-bold text-${
                                ["green", "red", "yellow", "purple"][idx]
                            }-800`}
                        >
                            ৳ {formatNumber(summary[key] || 0)}
                        </h3>
                    </div>
                ))}
                <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm">Payable</p>
                    <h3 className="text-2xl font-bold text-blue-800">
                        ৳ {formatNumber(payable)}
                    </h3>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            {view === "summary" ? (
                                isCurrencyGrouping ? (
                                    <>
                                        <th className="p-2 border">Currency</th>
                                        <th className="p-2 border">
                                            Currency Buy
                                        </th>
                                        <th className="p-2 border">
                                            Currency Sell
                                        </th>
                                        <th className="p-2 border">Balance</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-2 border">Party</th>
                                        <th className="p-2 border">
                                            Buy (Currency)
                                        </th>
                                        <th className="p-2 border">
                                            Sell (Currency)
                                        </th>
                                        <th className="p-2 border">
                                            Payment (BDT)
                                        </th>
                                        <th className="p-2 border">
                                            Received (BDT)
                                        </th>

                                        <th className="p-2 border">Payable</th>
                                    </>
                                )
                            ) : (
                                <>
                                    <th className="p-2 border">Posting Date</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">Currency</th>
                                    <th className="p-2 border">
                                        Currency Amount
                                    </th>
                                    <th className="p-2 border">
                                        Exchange Rate
                                    </th>
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
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={view === "summary" ? 4 : 12}
                                    className="text-center p-4"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : currentRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={view === "summary" ? 4 : 12}
                                    className="text-center p-4"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            currentRows.map((row, index) => {
                                if (view === "summary") {
                                    const balance = isCurrencyGrouping
                                        ? (row.currency_amount_buy || 0) -
                                          (row.currency_amount_sell || 0)
                                        : (row.received_bdt || 0) -
                                          (row.payment_bdt || 0);
                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-2 border">
                                                {isCurrencyGrouping
                                                    ? getSummaryLabel(row)
                                                    : row.party ||
                                                      row.party_name ||
                                                      "N/A"}
                                            </td>
                                            {!isCurrencyGrouping && (
                                                <>
                                                    <td className="p-2 border">
                                                        {row.currency_buy
                                                            ? formatNumber(
                                                                  row.currency_buy
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="p-2 border">
                                                        {row.currency_sell
                                                            ? formatNumber(
                                                                  row.currency_sell
                                                              )
                                                            : "-"}
                                                    </td>
                                                </>
                                            )}
                                            <td className="p-2 border">
                                                {isCurrencyGrouping
                                                    ? formatNumber(
                                                          row.currency_amount_buy
                                                      )
                                                    : row.payment_bdt > 0
                                                    ? formatNumber(
                                                          row.payment_bdt
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="p-2 border">
                                                {isCurrencyGrouping
                                                    ? formatNumber(
                                                          row.currency_amount_sell
                                                      )
                                                    : row.received_bdt > 0
                                                    ? formatNumber(
                                                          row.received_bdt
                                                      )
                                                    : "-"}
                                            </td>

                                            {isCurrencyGrouping && (
                                                <td
                                                    className={`p-2 border ${
                                                        row.balance > 0
                                                            ? "text-green-600"
                                                            : row.balance < 0
                                                            ? "text-red-600"
                                                            : ""
                                                    }`}
                                                >
                                                    {formatNumber(row.balance)}
                                                </td>
                                            )}

                                            {!isCurrencyGrouping && (
                                                <>
                                                    <td className="p-2 border">
                                                        {row.balanceParty
                                                            ? formatNumber(
                                                                  row.balanceParty
                                                              )
                                                            : "-"}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr
                                            key={row.id || index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-2 border">
                                                {row.posting_date}
                                            </td>
                                            <td className="p-2 border">
                                                {capitalizeFirstLetter(
                                                    row.transaction_type
                                                )}
                                            </td>
                                            <td className="p-2 border">
                                                {getCurrencyName(
                                                    row.currency,
                                                    row.currency_id
                                                )}
                                            </td>
                                            <td className="p-2 border">
                                                {formatNumber(
                                                    row.currency_amount
                                                )}
                                            </td>
                                            <td className="p-2 border">
                                                ৳{" "}
                                                {formatNumber(
                                                    row.exchange_rate
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
                                            <td className="p-2 border">
                                                {row.currency_party
                                                    ?.party_name ||
                                                    row.currency_party_id}
                                            </td>
                                            <td className="p-2 border">
                                                {row.party_account_number ||
                                                    "-"}
                                            </td>
                                            <td className="p-2 border">
                                                {row.note || "-"}
                                            </td>
                                        </tr>
                                    );
                                }
                            })
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

export default CurrencyLedgerPage;
