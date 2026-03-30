import React, { useState } from 'react';

const DeleteRestorePage = () => {
  const [selectedPostingType, setSelectedPostingType] = useState('');
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const postingOptions = [
    {
      value: 'currency-trading',
      label: 'Currency Trading',
      path: () => import('../currency-trading/PostingPage'),
      route: '/currency-trading/posting'
    },
    {
      value: 'bank-deposit',
      label: 'Bank Deposit',
      path: () => import('../bank-deposit/DepositPosting'),
      route: '/posting'
    },
    {
      value: 'income-expense',
      label: 'Income & Expense',
      path: () => import('../income-expense/PostingPage'),
      route: '/income-expense/postings'
    },
    {
      value: 'loan',
      label: 'Loan',
      path: () => import('../loan/PostingPage.jsx'),
      route: '/loan/postings'
    },
    {
      value: 'investment',
      label: 'Investment',
      path: () => import('../investment/PostingPage.jsx'),
      route: '/investment/postings'
    },
    {
      value: 'rental',
      label: 'Rental',
      path: () => import('../rental/PostingPage.jsx'),
      route: '/rental/postings'
    }
  ];

  
  const handlePostingTypeChange = (event) => {
    const value = event.target.value;
    setSelectedPostingType(value);
    
    if (value) {
      setLoading(true);
      setComponent(null);
      
      const selectedOption = postingOptions.find(opt => opt.value === value);
      
      if (!selectedOption) {
        console.error('Selected option not found');
        setLoading(false);
        return;
      }

      // Dynamically import the component
      selectedOption.path()
        .then(module => {
          setComponent(() => {
            // Return a wrapper component that passes the required props
            const OriginalComponent = module.default;
            return function WrappedComponent() {
              return (
                <OriginalComponent 
                  isDeleteRestoreMode={true}
                  defaultFilterStatus="approved"
                />
              );
            };
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading component:', error);
          setComponent(null);
          setLoading(false);
        });
    } else {
      setComponent(null);
    }
  };

  // Get the current selected option
  const getSelectedOption = () => {
    return postingOptions.find(opt => opt.value === selectedPostingType);
  };

  return (
    <div className="w-full bg-white rounded shadow border px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delete & Restore Records
        </h1>
        {/* <p className="text-gray-600">
          Select a posting type to view and manage (delete/restore) records
        </p> */}
      </div>
      
      {/* Selection Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="w-full">
          {/* <label 
            htmlFor="posting-type-select" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Posting Type
          </label> */}
          <select
            id="posting-type-select"
            value={selectedPostingType}
            onChange={handlePostingTypeChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Feature</option>
            {postingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* {selectedPostingType && getSelectedOption() && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Currently viewing: <span className="font-semibold">{getSelectedOption().label}</span>
              </p>
            </div>
          )} */}
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading posting records...</p>
        </div>
      )}
      
      {/* Dynamically loaded component area */}
      {Component && !loading ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <Component />
          </div>
        </div>
      ) : !loading && !Component ? (
        <div className="bg-gray-50 rounded-lg shadow p-12 text-center">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Posting Type Selected
          </h3>
          {/* <p className="text-gray-500 mb-4">
            Select a posting type from the dropdown above to view records
          </p>
          <p className="text-sm text-gray-400">
            You can delete or restore records from the selected posting type
          </p> */}
        </div>
      ) : null}
    </div>
  );
};

export default DeleteRestorePage;