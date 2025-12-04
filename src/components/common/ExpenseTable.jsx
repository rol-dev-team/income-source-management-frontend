const ExpenseTable = ({ expenseData, onDelete }) => {
  const headers = [
    "Source Name",
    "Category",
    "SubCategory",
    "Expense Type",
    "Payment Method",
    "Received Account",
    "From Account",
    "Amount",
    "Exchange Rate",
    "Date",
    "Actions",
  ];

  return (
    <div className='mt-8'>
      <h4 className='text-md font-semibold mb-2'>Added Expenses</h4>
      <div className='overflow-x-auto rounded-lg shadow-md'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {expenseData.map((expense) => (
              // Use the unique 'id' from the expense object as the key
              <tr key={expense.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.sourceName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.categoryName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.subCategoryName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.expenseType}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.paymentMethod}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.recivedAccount}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.fromAccount}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.total_amount}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.exchange_rate}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.posting_date}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {expense.note || "N/A"}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  <button
                    onClick={() => onDelete(expense.id)} // Pass the unique id to the onDelete function
                    className='text-red-600 hover:text-red-800'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
