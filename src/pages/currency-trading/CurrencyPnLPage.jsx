import React, { useState, useEffect } from "react";
import {
  getAllCurrencies,
  getAllCurrencyParties,
  getCurrencyAnalysis,
} from "../../service/currency-trading/currencyApi";

const CurrencyPnLPage = () => {
  // State for filters, data, and dropdown options
  const [filters, setFilters] = useState({
    currency_id: "",
    currency_party_id: "",
  });
  const [data, setData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial data fetch for dropdowns on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [currenciesRes, partiesRes] = await Promise.all([
          getAllCurrencies(),
          getAllCurrencyParties(),
        ]);

        setCurrencies(currenciesRes?.data || []);
        setParties(partiesRes?.data || []);
      } catch (err) {
        console.error("Initial dropdown data load failed:", err);
        setError("Failed to load initial data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to fetch analysis data whenever filters or dropdown data change
  useEffect(() => {
    // We only fetch if we have the dropdown data loaded
    if (currencies.length > 0 || parties.length > 0) {
      fetchAnalysisData(filters);
    }
  }, [filters, currencies, parties]); // This is the key change to trigger auto-filtering

  /**
   * Fetches and transforms the currency analysis data.
   * @param {object} currentFilters The filters to apply to the API call.
   */
  const fetchAnalysisData = async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCurrencyAnalysis(currentFilters);

      // Create maps for quick lookup
      const partyMap = parties.reduce((map, party) => {
        map[party.id] = party.party_name;
        return map;
      }, {});

      const currencyMap = currencies.reduce((map, currency) => {
        map[currency.id] = currency.currency;
        return map;
      }, {});

      // Transform API data
      const transformedData = (response?.data || []).map((item) => ({
        ...item,
        currency_name: currencyMap[item.currency_id] || "N/A",
        currency_party_name: partyMap[item.currency_party_id] || "N/A",
        total_buy_amount_bdt: parseFloat(item.total_buy_amount_bdt || 0),
        total_buy_currency_amount: parseFloat(
          item.total_buy_currency_amount || 0
        ),
        total_sell_amount_bdt: parseFloat(item.total_sell_amount_bdt || 0),
        total_sell_currency_amount: parseFloat(
          item.total_sell_currency_amount || 0
        ),
        avg_buy_rate: parseFloat(item.avg_buy_rate || 0),
        avg_sell_rate: parseFloat(item.avg_sell_rate || 0),
        pnl_rate: parseFloat(item.pnl_rate || 0),
        pnl_amount: parseFloat(item.pnl_amount || 0),
        remaining_currency_amount: parseFloat(
          item.remaining_currency_amount || 0
        ),
      }));

      setData(transformedData);
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("Failed to load analysis data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes and trigger a new fetch
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Update the state, which will automatically trigger the useEffect hook
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    const resetFilters = { currency_id: "", currency_party_id: "" };
    setFilters(resetFilters);
  };

  // Format currency values
  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format rate values
  const formatRate = (value) => {
    return parseFloat(value).toFixed(4);
  };

  return (
    <div className='container mx-auto p-4 font-sans'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>
        Currency Profit & Loss Analysis
      </h1>

      {/* Error Display */}
      {error && (
        <div className='mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm'>
          <p>{error}</p>
        </div>
      )}

      {/* Filters Section */}
      <div className='bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Currency Filter */}
          <div>
            <select
              name='currency_id'
              value={filters.currency_id}
              onChange={handleFilterChange}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors'
              disabled={loading}>
              <option value=''>All Currencies</option>
              {currencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Party Filter */}
          <div>
            <select
              name='currency_party_id'
              value={filters.currency_party_id}
              onChange={handleFilterChange}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors'
              disabled={loading}>
              <option value=''>All Parties</option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.party_name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className='flex items-end space-x-2'>
            {/* The "Apply Filters" button is no longer needed for auto-filtering, but we can keep it as a redundant manual option. */}
            <button
              type='button'
              onClick={handleReset}
              className='w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 disabled:bg-gray-100 transition-colors'
              disabled={loading}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
        {loading ? (
          <div className='p-8 text-center text-gray-500'>Loading data...</div>
        ) : error ? (
          <div className='p-8 text-center text-red-500 font-medium'>
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            No records found matching your criteria
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Currency
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Party
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total Buy (BDT)
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total Buy (FC)
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total Sell (BDT)
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total Sell (FC)
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Avg Buy Rate
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Avg Sell Rate
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    P&L Rate
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    P&L Amount
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Remaining FC
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.map((item, index) => (
                  <tr
                    key={`${item.currency_id}-${index}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {item.currency_name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {item.currency_party_name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatCurrency(item.total_buy_amount_bdt)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatCurrency(item.total_buy_currency_amount)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatCurrency(item.total_sell_amount_bdt)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatCurrency(item.total_sell_currency_amount)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatRate(item.avg_buy_rate)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatRate(item.avg_sell_rate)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.pnl_rate >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      {formatRate(item.pnl_rate)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.pnl_amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      {formatCurrency(item.pnl_amount)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.remaining_currency_amount >= 0
                          ? "text-gray-500"
                          : "text-red-600"
                      }`}>
                      {formatCurrency(item.remaining_currency_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyPnLPage;
