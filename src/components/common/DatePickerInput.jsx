// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// /**
//  * A reusable date picker component using react-datepicker.
//  *
//  * @param {object} props - The component's props.
//  * @param {Date} [props.initialDate=new Date()] - The initial date for the picker.
//  * @param {function} [props.onDateChange] - A callback function that receives the selected date.
//  * @param {object} [props.pickerProps={}] - Additional props to pass directly to the react-datepicker component.
//  */
// const DatePickerInput = ({
//   initialDate = new Date(),
//   onDateChange,
//   pickerProps = {},
// }) => {
//   const [selectedDate, setSelectedDate] = useState(initialDate);

//   const handleChange = (date) => {
//     setSelectedDate(date);
//     if (onDateChange) {
//       onDateChange(date);
//     }
//   };

//   return (
//     <DatePicker
//       selected={selectedDate}
//       onChange={handleChange}
//       {...pickerProps}
//     />
//   );
// };

// export default DatePickerInput;

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Import necessary functions from date-fns
import { getYear, getMonth } from 'date-fns';

// --- Helper Functions and Constants ---

// 1. A simple 'range' function (since it's not a standard JS function)
// Creates an array of numbers from 'start' up to (but not including) 'end', with a step.
const range = (start, end, step = 1) => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + i * step);
};

// 2. Month Names
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// 3. The list of years for the dropdown (from 1990 to the current year)
const years = range(1990, getYear(new Date()), 1);

// --- The Custom Header Component ---

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div
    style={{
      margin: 10,
      display: 'flex',
      justifyContent: 'space-between', // Better spacing for buttons and selects
      alignItems: 'center',
      padding: '0 5px',
    }}
  >
    {/* Previous Month Button */}
    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
      {'<'}
    </button>

    {/* Year Dropdown */}
    <select
      value={getYear(date)}
      onChange={({ target: { value } }) => changeYear(+value)}
      style={{ margin: '0 5px' }}
    >
      {/* We need to reverse the order so the newest year is at the top */}
      {[...years].reverse().map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    {/* Month Dropdown */}
    <select
      value={MONTHS[getMonth(date)]}
      onChange={({ target: { value } }) => changeMonth(MONTHS.indexOf(value))}
      style={{ margin: '0 5px' }}
    >
      {MONTHS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    {/* Next Month Button */}
    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
      {'>'}
    </button>
  </div>
);

// --- Reusable Component with Custom Header Logic ---

/**
 * A reusable DatePicker component that uses a Custom Header
 * with Year and Month select menus.
 * * @param {object} props - Component props.
 * @param {Date} [props.initialDate=new Date()] - The initial date.
 * @param {function} [props.onDateChange] - Callback when a date is selected.
 */
const DatePickerInput = ({
  // initialDate = new Date(),
  initialDate = '',
  onDateChange,
  placeholderText = '',
}) => {
  // const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate ? new Date(initialDate) : null);

  // Sync with props change (Formik value change)
  useEffect(() => {
    setSelectedDate(initialDate ? new Date(initialDate) : null);
  }, [initialDate]);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <DatePicker
      renderCustomHeader={CustomHeader}
      selected={selectedDate}
      onChange={handleChange}
      placeholderText={placeholderText}
      showPopperArrow={false}
      shouldCloseOnSelect={true}
      className="w-full h-10 border border-gray-300 rounded-md px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      wrapperClassName="w-full"
    />
  );
};

export default DatePickerInput;
