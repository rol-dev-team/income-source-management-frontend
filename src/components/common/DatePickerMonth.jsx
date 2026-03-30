import React, { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerMonth = ({ value, onChange,placeholderTextValue }) => {
  // Only re-calculate selectedDate when value changes
  const selectedDate = useMemo(() => {
    if (!value) return null;
    const [year, month] = value.split("-");
    return new Date(Number(year), Number(month) - 1);
  }, [value]);

  const handleChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      onChange(`${year}-${month}`);
    } else {
      onChange("");
    }
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat='MM/yyyy'
      showMonthYearPicker
      placeholderText={placeholderTextValue}
      className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
                 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
    />
  );
};

export default DatePickerMonth;
