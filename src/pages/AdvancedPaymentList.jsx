import React, { useEffect, useState } from "react";
import {
  fetchAdvancedPayments,
  deleteAdvancedPayment,
} from "../service/advancedPaymentApi";
import { useNavigate } from "react-router-dom";

const AdvancedPaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdvancedPayments(1, 100);
      
      // Debugging logs
      console.log('Full response:', res);
      console.log('Response data:', res.data);
      
      // Handle different response structures
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data?.data)) {
        data = res.data.data;
      } else if (Array.isArray(res)) {
        data = res;
      }
      
      console.log('Extracted data:', data);
      setPayments(data);
    } catch (err) {
      console.error("Failed to load payments", err);
      setError("Failed to load payments. Please try again.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deleteAdvancedPayment(id);
        await loadPayments(); // Reload data after deletion
      } catch (error) {
        console.error("Failed to delete payment", error);
        setError("Failed to delete payment. Please try again.");
      }
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Advanced Payments</h2>
        <button
          onClick={() => navigate("/advanced-payments/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No advanced payments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point of Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Adj.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.advanced_payment_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.subcat_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.contact_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${parseFloat(p.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(p.auto_adjustment_amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${parseFloat(p.remaining_amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/advanced-payments/edit/${p.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          {/* <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedPaymentList;