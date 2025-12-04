import React, { useEffect, useState } from "react";
import {
  createAdvancedPayment,
  fetchAdvancedPaymentById,
  updateAdvancedPayment,
} from "../service/advancedPaymentApi";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSourceSubCategory } from "../service/sourceSubCategory";
import { fetchPointOfContactsBySubCatId } from "../service/pointOfContactApi";

const AdvancedPaymentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [pointOfContacts, setPointOfContacts] = useState([]);
  const [form, setForm] = useState({
    advanced_payment_type: "",
    sub_cat_id: "",
    point_of_contact_id: "",
    amount: "",
    auto_adjustment_amount: "",
    remaining_amount: "",
  });

  // Calculate remaining amount
  useEffect(() => {
    const amount = parseFloat(form.amount) || 0;
    const adjustment = parseFloat(form.auto_adjustment_amount) || 0;
    const remaining = (amount - adjustment).toFixed(2);

    setForm(prev => ({
      ...prev,
      remaining_amount: isNaN(remaining) ? "" : remaining,
    }));
  }, [form.amount, form.auto_adjustment_amount]);

  // Load subcategories on mount
  useEffect(() => {
    fetchSourceSubCategory()
      .then((res) => setSubCategories(res.data))
      .catch((err) => console.error("Failed to load subcategories", err));
  }, []);

  // Load advanced payment by ID
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchAdvancedPaymentById(id)
        .then((res) => {
          const data = res;
        
          if (data) {
            setForm({
              advanced_payment_type: data.advanced_payment_type || "",
              sub_cat_id: data.sub_cat_id?.toString() || "",
              point_of_contact_id: data.point_of_contact_id?.toString() || "",
              amount: data.amount?.toString() || "",
              auto_adjustment_amount: data.auto_adjustment_amount?.toString() || "",
              remaining_amount: data.remaining_amount?.toString() || "",
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load payment", err);
          alert("Failed to load payment data");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Load point of contacts when sub_cat_id changes
  useEffect(() => {
    if (form.sub_cat_id) {
      fetchPointOfContactsBySubCatId(form.sub_cat_id)
        .then((res) => setPointOfContacts(res.data))
        .catch((err) => console.error("Failed to load point of contacts", err));
    } else {
      setPointOfContacts([]);
    }
  }, [form.sub_cat_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "sub_cat_id" ? { point_of_contact_id: "" } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        auto_adjustment_amount: parseFloat(form.auto_adjustment_amount),
        remaining_amount: parseFloat(form.remaining_amount),
      };

      if (id) {
        await updateAdvancedPayment(id, payload);
        alert("Payment updated successfully!");
      } else {
        await createAdvancedPayment(payload);
        alert("Payment created successfully!");
      }

      navigate("/advanced-payments");
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container ">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          {/* <button
            onClick={() => navigate("/advanced-payments")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button> */}
          <h2 className="text-2xl font-bold text-gray-800">
            {id ? "Edit Advanced Payment" : "Create Advanced Payment"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Type */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Type</label> */}
              <select
                name="advanced_payment_type"
                value={form.advanced_payment_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Type</option>
                <option value="Advance">Advanced</option>
                <option value="Refund">Refund/Settlement</option>
              </select>
            </div>

            {/* Sub Category */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label> */}
              <select
                name="sub_cat_id"
                value={form.sub_cat_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subcat_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Point of Contact */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Point of Contact</label> */}
              <select
                name="point_of_contact_id"
                value={form.point_of_contact_id}
                onChange={handleChange}
                required
                disabled={!form.sub_cat_id}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Point of Contact</option>
                {pointOfContacts.map((poc) => (
                  <option key={poc.id || poc.point_of_contact_id} value={poc.id || poc.point_of_contact_id}>
                    {poc.contact_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label> */}
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Auto Adjustment */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Auto Adjustment</label> */}
              <input
                type="number"
                name="auto_adjustment_amount"
                value={form.auto_adjustment_amount}
                onChange={handleChange}
                placeholder="Enter auto adjustment amount"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Remaining Amount */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Remaining</label> */}
              <input
                type="number"
                name="remaining_amount"
                value={form.remaining_amount}
                placeholder="Remaining amount"
                readOnly
                className="w-full px-3 py-2 border bg-gray-100 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/advanced-payments")}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedPaymentForm;
