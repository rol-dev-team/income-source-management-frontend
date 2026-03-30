



// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Calendar,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   CreditCard,
//   Building2,
//   PiggyBank,
//   Home,
//   ArrowUpRight,
//   ArrowDownRight,
//   Wallet,
//   BadgeDollarSign,
//   HandCoins,
//   Landmark,
//   Banknote,
//   LineChart as LineChartIcon,
//   Target,
// } from "lucide-react";

// import {
//   getAccountBalance,
//   getTotalIncomeExpense,
//   getTotalIncomeExpenseGraph,
//   getTotalRental,
//   getMontlyRentalGraph,
//   getInvestment,
//   getTotalLoan,
//   getCurrency,
//   financialSummary
// } from "../service/dashboardApi";
// import { showToast } from "../helper/toastMessage";


// const CustomTooltip = React.memo(({ active, payload, formatCurrency }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className='bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200'>
//         <p className='text-sm font-semibold text-gray-900 mb-2'>
//           {payload[0].payload.month || payload[0].payload.name}
//         </p>
//         {payload.map((entry, index) => (
//           <div
//             key={index}
//             className='flex items-center justify-between gap-4 text-sm'>
//             <div className='flex items-center gap-2'>
//               <div
//                 className='w-3 h-3 rounded-full'
//                 style={{ backgroundColor: entry.color }}></div>
//               <span className='text-gray-600'>{entry.name}:</span>
//             </div>
//             <span className='font-semibold text-gray-900'>
//               {formatCurrency(entry.value)}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
//   return null;
// });

// const SectionHeader = React.memo(
//   ({ icon: Icon, title, subtitle, children }) => (
//     <div className='flex items-center justify-between mb-6'>
//       <div className='flex items-center gap-3'>
//         <div className='p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl'>
//           <Icon className='w-6 h-6 text-blue-600' strokeWidth={2} />
//         </div>
//         <div>
//           <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
//           <p className='text-sm text-gray-500 mt-0.5'>{subtitle}</p>
//         </div>
//       </div>
//       {children}
//     </div>
//   )
// );

// const EnhancedStatCard = React.memo(
//   ({ icon: Icon, label, value, subtext, color = "blue", bgColor }) => (
//     <div className='flex items-center bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group'>
//       <div className='flex items-start space-x-2'>
//         <div
//           className={`p-2 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
//           <Icon className={`w-4 h-4 ${color}`} strokeWidth={2} />
//         </div>
//         <div className='space-y-1 '>
//           <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
//             {label}
//           </p>
//           <h3 className='text-2xl font-bold text-gray-900 tracking-tight'>
//             {value}
//           </h3>
//         </div>
//       </div>
//     </div>
//   )
// );

// const MetricCard = React.memo(
//   ({ label, value, color = "gray", subValue, icon: Icon }) => (
//     <div className='bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200'>
//       <div className='flex items-start justify-between mb-3'>
//         <div className='flex-1'>
//           <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
//             {label}
//           </p>
//           <p className={`text-2xl font-bold ${color}`}>{value}</p>
//           {subValue && <p className='text-xs text-gray-500 mt-1'>{subValue}</p>}
//         </div>
//         {Icon && (
//           <div
//             className={`p-2 rounded-lg ${
//               color.includes("green")
//                 ? "bg-green-50"
//                 : color.includes("red")
//                 ? "bg-red-50"
//                 : color.includes("yellow")
//                 ? "bg-yellow-50"
//                 : color.includes("blue")
//                 ? "bg-blue-50"
//                 : color.includes("purple")
//                 ? "bg-purple-50"
//                 : "bg-gray-50"
//             }`}>
//             <Icon className={`w-4 h-4 ${color}`} />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// );

// const DonutChart = React.memo(
//   ({ data, centerLabel, centerValue, formatCurrency }) => (
//     <div className='relative'>
//       <ResponsiveContainer width='100%' height={250}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx='50%'
//             cy='50%'
//             innerRadius={70}
//             outerRadius={95}
//             paddingAngle={3}
//             dataKey='value'>
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => formatCurrency(value)}
//             contentStyle={{
//               backgroundColor: "white",
//               border: "1px solid #E5E7EB",
//               borderRadius: "8px",
//               padding: "8px 12px",
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//       <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
//         <p className='text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1'>
//           {centerLabel}
//         </p>
//         <p className='text-xl font-bold text-gray-900'>{centerValue}</p>
//       </div>
//     </div>
//   )
// );


// const FinancialDashboard = () => {
//   const [accountBalance, setAccountBalance] = useState([]);
//   const [totalIncomeExpense, setTotalIncomeExpense] = useState({});
//   const [totalIncomeExpenseGraph, setTotalIncomeExpenseGraph] = useState([]);
//   const [totalRental, setTotalRental] = useState(0);
//   const [monthlyRentalGraph, setMonthlyRentalGraph] = useState([]);
//   const [investment, setInvestment] = useState([]);
//   const [totalLoan, setTotalLoan] = useState([]);
//   const [currency, setCurrency] = useState([]);
//   const [financialSummaryData, setFinancialSummaryData] = useState({
//     total_income_bdt: 0,
//     total_expense_bdt: 0,
//     net_profit_bdt: 0,
//     total_net_receivable_bdt: 0,
//     total_net_payable_bdt: 0
//   });
//   const [monthlyChartData, setMonthlyChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [otherIncomeExpenseFilter, setOtherIncomeExpenseFilter] = useState({filter:6});
//   const [rentalfilter, setRentalfilter] = useState({filter:6});
//   const [financialSummaryFilter, setFinancialSummaryFilter] = useState(0);
//   const [incomeExpenseFilter, setIncomeExpenseFilter] = useState("6months");
//   const [selectedRange, setSelectedRange] = useState("all_time");
  
//   const isTimeRangeSelected = selectedRange !== "all_time";

//   // Fetch all dashboard data including financial summary
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const [
//           accountBalanceRes,
//           totalIncomeExpenseRes,
//           totalIncomeExpenseGraphRes,
//           totalRentalRes,
//           monthlyRentalGraphRes,
//           investmentRes,
//           loanRes,
//           currencyRes,
//           financialSummaryRes
//         ] = await Promise.all([
//           getAccountBalance(),
//           getTotalIncomeExpense(otherIncomeExpenseFilter.filter),
//           getTotalIncomeExpenseGraph(otherIncomeExpenseFilter.filter),
//           getTotalRental(),
//           getMontlyRentalGraph(rentalfilter.filter),
//           getInvestment(),
//           getTotalLoan(),
//           getCurrency(),
//           financialSummary(financialSummaryFilter)
//         ]);
        
//         setAccountBalance(accountBalanceRes.data);
//         setTotalIncomeExpense(totalIncomeExpenseRes.data[0]);
//         setTotalIncomeExpenseGraph(totalIncomeExpenseGraphRes.data);
//         setTotalRental(totalRentalRes.data[0]);
//         setMonthlyRentalGraph(monthlyRentalGraphRes.data);
//         setInvestment(investmentRes.data[0]);
//         setTotalLoan(loanRes.data[0]);
//         setCurrency(currencyRes.summary);
//         setFinancialSummaryData(financialSummaryRes.summary || {
//           total_income_bdt: 0,
//           total_expense_bdt: 0,
//           net_profit_bdt: 0,
//           total_net_receivable_bdt: 0,
//           total_net_payable_bdt: 0
//         });

//       } catch (err) {
//         console.error(err);
//         showToast.error("Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [financialSummaryFilter, otherIncomeExpenseFilter, rentalfilter]);

//  // Separate effect to refetch only financial summary when filter changes
// useEffect(() => {
//     const fetchFinancialSummary = async () => {
//       try {
//         const financialSummaryRes = await financialSummary(financialSummaryFilter);
//         setFinancialSummaryData(financialSummaryRes.summary || {
//           total_income_bdt: 0,
//           total_expense_bdt: 0,
//           net_profit_bdt: 0,
//           total_net_receivable_bdt: 0,
//           total_net_payable_bdt: 0
//         });
//         // Set the monthly chart data
//         setMonthlyChartData(financialSummaryRes.monthly_data || []);
//       } catch (err) {
//         console.error(err);
//         showToast.error("Failed to load financial summary data.");
//       }
//     };

//     fetchFinancialSummary();
//   }, [financialSummaryFilter]);

//   // --- MEMOIZED FORMATTER FUNCTIONS (useCallback) ---
//   const formatCurrency = useCallback((value) => {
//     if (value >= 1000000) {
//       return `৳ ${(value / 1000000).toFixed(2)}M`;
//     }
//     return `৳ ${(value / 1000).toFixed(0)}k`;
//   }, []);

//   const formatCurrencyLarge = useCallback((value) => {
//     const num = Number(value) || 0;
//     return new Intl.NumberFormat("en-BD", {
//       style: "currency",
//       currency: "BDT",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     })
//       .format(num)
//       .replace("BDT", "৳");
//   }, []);


//   // const incomeExpenseData = useMemo(
//   //   () => [
//   //     {
//   //       month: "May",
//   //       income: 450000,
//   //       expense: 320000,
//   //       payable: 80000,
//   //       receivable: 120000,
//   //     },
//   //     {
//   //       month: "Jun",
//   //       income: 520000,
//   //       expense: 380000,
//   //       payable: 95000,
//   //       receivable: 140000,
//   //     },
//   //     {
//   //       month: "Jul",
//   //       income: 480000,
//   //       expense: 350000,
//   //       payable: 75000,
//   //       receivable: 110000,
//   //     },
//   //     {
//   //       month: "Aug",
//   //       income: 550000,
//   //       expense: 420000,
//   //       payable: 100000,
//   //       receivable: 150000,
//   //     },
//   //     {
//   //       month: "Sep",
//   //       income: 580000,
//   //       expense: 450000,
//   //       payable: 90000,
//   //       receivable: 130000,
//   //     },
//   //     {
//   //       month: "Oct",
//   //       income: 620000,
//   //       expense: 480000,
//   //       payable: 85000,
//   //       receivable: 145000,
//   //     },
//   //   ],
//   //   []
//   // );


//   const incomeExpenseData = useMemo(() => {
//     // If we have monthly data from API, use it
//     if (monthlyChartData && monthlyChartData.length > 0) {
//       return monthlyChartData;
//     }
    
//     // Fallback to empty array or some default data
//     return [];
//   }, [monthlyChartData]);

//   const currencyBusiness = useMemo(
//     () => ({
//       total: {
//         buy: 1500000,
//         sell: 2000000,
//         margin: 500000,
//         payment: 2300000,
//         received: 2200000,
//         payable: 100000,
//       },
//       last30Days: {
//         buy: 300000,
//         sell: 450000,
//         margin: 150000,
//         payment: 420000,
//         received: 400000,
//         payable: 20000,
//       },
//     }),
//     []
//   );

//   const loanTakenData = useMemo(() => {
//     if (!totalLoan) return [];
//     return [
//       { name: "Principal", value: parseFloat(totalLoan.loan_taken_principal), color: "#3B82F6" },
//       { name: "Paid", value: parseFloat(totalLoan.loan_taken_paid), color: "#22C55E" },
//       { name: "Payable", value: parseFloat(totalLoan.loan_taken_payable_receivable), color: "#FACC15" },
//       { name: "Due Amount", value: parseFloat(totalLoan.loan_taken_emi_due), color: "#EF4444" },
//       { name: "EMI Amount", value: parseFloat(totalLoan.payable_emi), color: "#3B82F6" },
//     ];
//   }, [totalLoan]);

//   const loanGivenData = useMemo(() => {
//     if (!totalLoan) return [];
//     return [
//       { name: "Principal", value: parseFloat(totalLoan.loan_given_principal), color: "#3B82F6" },
//       { name: "Paid", value: parseFloat(totalLoan.loan_given_paid), color: "#22C55E" },
//       { name: "Receivable", value: parseFloat(totalLoan.loan_given_payable_receivable), color: "#FACC15" },
//       { name: "Due Amount", value: parseFloat(totalLoan.loan_given_emi_due), color: "#EF4444" },
//       { name: "EMI Amount", value: parseFloat(totalLoan.receivable_emi), color: "#3B82F6" },
//     ];
//   }, [totalLoan]);

//   const investmentData = useMemo(() => [
//     { name: "Principal", value: parseFloat(investment.principal_amount), color: "#3B82F6" },
//     { name: "Returned Amount", value: parseFloat(investment.investment_return), color: "#22C55E" },
//     { name: "Profit", value: parseFloat(investment.investment_profit), color: "#2563EB" },
//     { name: "Receivable", value: parseFloat(investment.receivable), color: "#FACC15" },
//   ], [investment]);

//   const rentalData = useMemo(
//     () => [
//       { month: "May", receivable: 45000, received: 42000, due: 3000 },
//       { month: "Jun", receivable: 45000, received: 45000, due: 0 },
//       { month: "Jul", receivable: 48000, received: 45000, due: 3000 },
//       { month: "Aug", receivable: 48000, received: 48000, due: 0 },
//       { month: "Sep", receivable: 50000, received: 47000, due: 3000 },
//       { month: "Oct", receivable: 50000, received: 50000, due: 0 },
//     ],
//     []
//   );

//   // --- DERIVED DATA (THE MEMOIZATION THAT MATTERS HERE) ---
//   const data = useMemo(() => {
//     return isTimeRangeSelected
//       ? currencyBusiness.last30Days
//       : currencyBusiness.total;
//   }, [isTimeRangeSelected, currencyBusiness]);

//   // --- CHART TOOLTIP COMPONENT PROPS ---
//   const memoizedIncomeExpenseTooltip = useMemo(
//     () => <CustomTooltip formatCurrency={formatCurrencyLarge} />,
//     [formatCurrencyLarge]
//   );

//   const memoizedOtherIncomeExpenseTooltip = useMemo(
//     () => <CustomTooltip formatCurrency={formatCurrencyLarge} />,
//     [formatCurrencyLarge]
//   );

//   const memoizedRentalTooltip = useMemo(
//     () => <CustomTooltip formatCurrency={formatCurrency} />,
//     [formatCurrency]
//   );

//   // Determine profit color based on value
//   const getProfitColor = (profit) => {
//     const profitValue = parseFloat(profit) || 0;
//     return profitValue >= 0 ? "text-green-600" : "text-red-600";
//   };

//   const getProfitBgColor = (profit) => {
//     const profitValue = parseFloat(profit) || 0;
//     return profitValue >= 0 ? "bg-green-50" : "bg-red-50";
//   };

//   const getProfitIcon = (profit) => {
//     const profitValue = parseFloat(profit) || 0;
//     return profitValue >= 0 ? TrendingUp : TrendingDown;
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>


//       <div className='space-y-8'>
//         {/* Income vs Expense Section */}
//         <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
//           <SectionHeader
//             icon={Banknote}
//             title='Overall Income vs Expense'
//             subtitle='Financial performance overview and trend analysis'>
//             <div className="flex gap-3">
//               <select
//                 value={financialSummaryFilter}
//                 onChange={(e) => setFinancialSummaryFilter(Number(e.target.value))}
//                 className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition'>
//                 <option value={3}>Last 3 Months</option>
//                 <option value={6}>Last 6 Months</option>
//                 <option value={12}>Last 12 Months</option>
//                 <option value={0}>All Time</option>
//               </select>
//             </div>
//           </SectionHeader>

//           <div className='grid sm:grid-cols-1 md:grid-cols-5 gap-5 mb-7'>
//             <EnhancedStatCard
//               icon={TrendingUp}
//               label='Total Income'
//               value={formatCurrencyLarge(financialSummaryData.total_income_bdt)}
//               color='text-green-600'
//               bgColor='bg-green-50'
//             />
//             <EnhancedStatCard
//               icon={TrendingDown}
//               label='Total Expense'
//               value={formatCurrencyLarge(financialSummaryData.total_expense_bdt)}
//               color='text-red-600'
//               bgColor='bg-red-50'
//             />
            
//             <EnhancedStatCard
//               icon={HandCoins}
//               label='Receivable'
//               value={formatCurrencyLarge(financialSummaryData.total_net_receivable_bdt)}
//               color='text-blue-600'
//               bgColor='bg-blue-50'
//             />
//             <EnhancedStatCard
//               icon={Wallet}
//               label='Payable'
//               value={formatCurrencyLarge(financialSummaryData.total_net_payable_bdt)}
//               color='text-yellow-600'
//               bgColor='bg-yellow-50'
//             />

//             <EnhancedStatCard
//               icon={getProfitIcon(financialSummaryData.net_profit_bdt)}
//               label='Margin'
//               value={formatCurrencyLarge(financialSummaryData.net_profit_bdt)}
//               color={getProfitColor(financialSummaryData.net_profit_bdt)}
//               bgColor={getProfitBgColor(financialSummaryData.net_profit_bdt)}
//             />
//           </div>

//           <div className='bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100'>
//             {incomeExpenseData.length > 0 ? (
//               <ResponsiveContainer width='100%' height={350}>
//                 <LineChart
//                   data={incomeExpenseData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
//                   <XAxis
//                     dataKey='month'
//                     stroke='#6B7280'
//                     style={{ fontSize: "13px", fontWeight: "500" }}
//                     tickLine={false}
//                   />
//                   <YAxis
//                     stroke='#6B7280'
//                     style={{ fontSize: "13px", fontWeight: "500" }}
//                     tickFormatter={(value) => `৳${value / 1000}k`}
//                     tickLine={false}
//                   />
//                   <Tooltip content={memoizedIncomeExpenseTooltip} />
//                   <Legend
//                     wrapperStyle={{
//                       fontSize: "13px",
//                       fontWeight: "500",
//                       paddingTop: "20px",
//                     }}
//                     iconType='circle'
//                   />
//                   <Line
//                     type='monotone'
//                     dataKey='income'
//                     stroke='#22C55E'
//                     strokeWidth={3}
//                     name='Income'
//                     dot={{ fill: "#22C55E", strokeWidth: 2, r: 5 }}
//                     activeDot={{ r: 7 }}
//                   />
//                   <Line
//                     type='monotone'
//                     dataKey='expense'
//                     stroke='#EF4444'
//                     strokeWidth={3}
//                     name='Expense'
//                     dot={{ fill: "#EF4444", strokeWidth: 2, r: 5 }}
//                     activeDot={{ r: 7 }}
//                   />
//                   {/* <Line
//                     type='monotone'
//                     dataKey='payable'
//                     stroke='#FACC15'
//                     strokeWidth={3}
//                     name='Payable'
//                     dot={{ fill: "#FACC15", strokeWidth: 2, r: 5 }}
//                     activeDot={{ r: 7 }}
//                   /> */}
//                   {/* <Line
//                     type='monotone'
//                     dataKey='receivable'
//                     stroke='#2563EB'
//                     strokeWidth={3}
//                     name='Receivable'
//                     dot={{ fill: "#2563EB", strokeWidth: 2, r: 5 }}
//                     activeDot={{ r: 7 }}
//                   /> */}
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex items-center justify-center h-64">
//                 <p className="text-gray-500">No data available for the selected period</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Account Balance Section */}
//         <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
//           <SectionHeader
//             icon={Building2}
//             title='Account Balance'
//             subtitle='Available funds across all payment channels'
//           />

//           <div className='overflow-hidden rounded-xl border border-gray-200'>
//             <table className='w-full'>
//               <thead>
//                 <tr className='bg-gradient-to-r from-gray-50 to-gray-100'>
//                   <th className='text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider'>
//                     Channel Name
//                   </th>
//                   <th className='text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider'>
//                     Account Number
//                   </th>
//                   <th className='text-right py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider'>
//                     Balance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className='bg-white divide-y divide-gray-200'>
//                 {accountBalance.filter((item)=>item.method_name !== "TOTAL").map((account, index) => (
//                   <tr
//                     key={index}
//                     className='hover:bg-gray-50 transition-colors'>
//                     <td className='py-5 px-6'>
//                       <div className='flex items-center gap-3'>
//                         <div
//                           className={`p-2 rounded-lg ${
//                             account.method_name === "cash"
//                               ? "bg-green-50"
//                               : account.method_name === "bank"
//                               ? "bg-blue-50"
//                               : "bg-purple-50"
//                           }`}>
//                           {account.method_name === "cash" ? (
//                             <Wallet className={`w-4 h-4 text-green-600`} />
//                           ) : account.method_name === "bank" ? (
//                             <Landmark className={`w-4 h-4 text-blue-600`} />
//                           ) : (
//                             <Banknote className={`w-4 h-4 text-purple-600`} />
//                           )}
//                         </div>
//                         <span className='font-semibold text-gray-900 text-base'>
//                           {account.method_name}
//                         </span>
//                       </div>
//                     </td>
//                     <td className='py-5 px-6'>
//                       <span className='text-gray-600 font-mono text-sm tracking-wide'>
//                         {["cash", "wallet"].includes(account.method_name.toLowerCase()) 
//                           ? "--" 
//                           : account.account_info}
//                       </span>
//                     </td>
//                     <td className='py-5 px-6 text-right'>
//                       <span className='font-bold text-gray-900 text-lg'>
//                         {formatCurrencyLarge(account.balance)}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {accountBalance
//                   .filter(acc => acc.method_name === "TOTAL")
//                   .map((totalRow, index) => (
//                     <tr key={index} className='bg-gradient-to-r from-blue-50 to-indigo-50'>
//                       <td colSpan='2' className='py-5 px-6 font-bold text-gray-900 text-base'>
//                         TOTAL BALANCE
//                       </td>
//                       <td className='py-5 px-6 text-right font-bold text-2xl text-blue-600'>
//                         {formatCurrencyLarge(Number(totalRow.balance || 0))}
//                       </td>
//                       <td></td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Other Income/Expense Section */}
//         <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
//           <SectionHeader
//             icon={TrendingUp}
//             title='Other Income / Expense'
//             subtitle='Additional financial activities and miscellaneous transactions'>
//             <select
//               value={otherIncomeExpenseFilter.filter}
//               onChange={(e) => setOtherIncomeExpenseFilter({ filter: e.target.value })} 
//               className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition'>
//               <option value='6'>Last 6 Months</option>
//               <option value='12'>Last 12 Months</option>
//               <option value='all'>All</option>
//             </select>
//           </SectionHeader>

//           <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-5 mb-7'>
//             <MetricCard
//               label='Available Balance'
//               value={formatCurrencyLarge(totalIncomeExpense?.available_balance)}
//               subValue='Total accumulated funds'
//               color='text-blue-600'
//               icon={Wallet}
//             />
//             <MetricCard
//               label='Total Income'
//               value={formatCurrencyLarge(totalIncomeExpense?.total_received)}
//               subValue='Cumulative earnings'
//               color='text-green-600'
//               icon={TrendingUp}
//             />
//             <MetricCard
//               label='Total Expense'
//               value={formatCurrencyLarge(totalIncomeExpense?.total_payment)}
//               subValue='Cumulative spending'
//               color='text-red-600'
//               icon={TrendingDown}
//             />
//           </div>

//           <div className='bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100'>
//             <ResponsiveContainer width='100%' height={320}>
//               <BarChart
//                 data={totalIncomeExpenseGraph}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                 <CartesianGrid
//                   strokeDasharray='3 3'
//                   stroke='#E5E7EB'
//                   vertical={false}
//                 />
//                 <XAxis
//                   dataKey='month'
//                   stroke='#6B7280'
//                   style={{ fontSize: "13px", fontWeight: "500" }}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   stroke='#6B7280'
//                   style={{ fontSize: "13px", fontWeight: "500" }}
//                   tickLine={false}
//                 />
//                 <Tooltip content={memoizedOtherIncomeExpenseTooltip} />
//                 <Legend
//                   wrapperStyle={{
//                     fontSize: "13px",
//                     fontWeight: "500",
//                     paddingTop: "15px",
//                   }}
//                   iconType='circle'
//                 />
//                 <Bar
//                   dataKey='total_received'
//                   fill='#22C55E'
//                   name='Income'
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={60}
//                 />
//                 <Bar
//                   dataKey='total_payment'
//                   fill='#EF4444'
//                   name='Expense'
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={60}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Currency Business Section */}
//         <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
//           <div className='flex items-center justify-between'>
//             <SectionHeader
//               icon={CreditCard}
//               title='Currency Business'
//               subtitle='Foreign exchange and currency trading operations'
//             />

//             {/* <select
//               className='w-40 p-2 border border-indigo-300 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors'
//               value={selectedRange}
//               onChange={(e) => setSelectedRange(e.target.value)}>
//               <option value='all_time'>Total Overview</option>
//               <option value='1_month'>Last 1 Month</option>
//               <option value='3_months'>Last 3 Months</option>
//               <option value='6_months'>Last 6 Months</option>
//             </select> */}
//           </div>

//           <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
//             <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2'>
//               <div className='grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4'>
//                 <div className='p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     <Banknote className='w-4 h-4 text-indigo-600' />
//                     <p className='text-xs text-indigo-700 font-semibold uppercase tracking-wide'>
//                       Currency Buy
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-indigo-700'>
//                     {formatCurrencyLarge(currency.buy)}
//                   </p>
//                   <p className='text-xs text-indigo-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "Recent purchases"
//                       : "Total purchased"}
//                   </p>
//                 </div>

//                 <div className='p-5 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     <ArrowDownRight className='w-4 h-4 text-teal-600' />
//                     <p className='text-xs text-teal-700 font-semibold uppercase tracking-wide'>
//                       Currency Sell
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-teal-700'>
//                       {formatCurrencyLarge(currency.sell)}
//                   </p>
//                   <p className='text-xs text-teal-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "Recent foreign sold"
//                       : "Total foreign sold"}
//                   </p>
//                 </div>

//                 <div className='p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     {isTimeRangeSelected ? (
//                       <TrendingUp className='w-4 h-4 text-green-600' />
//                     ) : (
//                       <LineChartIcon className='w-4 h-4 text-green-600' />
//                     )}
//                     <p className='text-xs text-green-700 font-semibold uppercase tracking-wide'>
//                       Margin
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-green-700'>
//                     {formatCurrencyLarge(currency.pnl_amount)}
//                   </p>
//                   <p className='text-xs text-green-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "Recent profit/loss"
//                       : "Net profit/loss"}
//                   </p>
//                 </div>

//                 <div className='p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     {isTimeRangeSelected ? (
//                       <TrendingUp className='w-4 h-4 text-blue-600' />
//                     ) : (
//                       <LineChartIcon className='w-4 h-4 text-blue-600' />
//                     )}
//                     <p className='text-xs text-blue-700 font-semibold uppercase tracking-wide'>
//                       Balance
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-blue-700'>
//                     {formatCurrencyLarge(currency.balance)}
//                   </p>
//                   <p className='text-xs text-blue-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "Recent profit/loss"
//                       : "Net Balance"}
//                   </p>
//                 </div>

//                 <div className='p-5 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     <Wallet className='w-4 h-4 text-red-600' />
//                     <p className='text-xs text-red-700 font-semibold uppercase tracking-wide'>
//                       Payment
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-red-700'>
//                    {formatCurrencyLarge(currency.payment)}
//                   </p>
//                   <p className='text-xs text-red-600 mt-1'>
//                     {isTimeRangeSelected ? "This month paid" : "Total paid out"}
//                   </p>
//                 </div>

//                 <div className='p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     <ArrowUpRight className='w-4 h-4 text-purple-600' />
//                     <p className='text-xs text-purple-700 font-semibold uppercase tracking-wide'>
//                       Received
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-purple-700'>
//                    {formatCurrencyLarge(currency.received)}
//                   </p>
//                   <p className='text-xs text-purple-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "This month collected"
//                       : "Total collected"}
//                   </p>
//                 </div>

//                 <div className='p-5 bg-gradient-to-br from-yellow-50 to-white rounded-xl border border-yellow-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     <HandCoins className='w-4 h-4 text-yellow-600' />
//                     <p className='text-xs text-yellow-700 font-semibold uppercase tracking-wide'>
//                       Payable
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-yellow-700'>
//                     {formatCurrencyLarge(currency.payable)}
//                   </p>
//                   <p className='text-xs text-yellow-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "Pending liabilities"
//                       : "Outstanding liabilities"}
//                   </p>
//                 </div>
//                 <div className='p-5 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-sm hover:shadow-lg transition-all'>
//                   <div className='flex items-center gap-2 mb-2'>
//                     <HandCoins className='w-4 h-4 text-red-600' />
//                     <p className='text-xs text-red-700 font-semibold uppercase tracking-wide'>
//                       Receivable
//                     </p>
//                   </div>
//                   <p className='text-2xl font-bold text-red-700'>
//                     {formatCurrencyLarge(currency.receivable)}
//                   </p>
//                   <p className='text-xs text-red-600 mt-1'>
//                     {isTimeRangeSelected
//                       ? "Pending liabilities"
//                       : "Outstanding receivables"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Loan and Investment Section */}
//         <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
//           {/* Loan Taken */}
//           <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all'>
//             <div className='flex items-center gap-3 mb-6'>
//               <div className='p-2.5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl'>
//                 <CreditCard className='w-6 h-6 text-red-600' strokeWidth={2} />
//               </div>
//               <div>
//                 <h2 className='text-lg font-bold text-gray-900'>Loan Taken</h2>
//                 <p className='text-xs text-gray-500 mt-0.5'>
//                   Outstanding liabilities
//                 </p>
//               </div>
//             </div>
//             <DonutChart
//               data={loanTakenData}
//               centerValue={formatCurrencyLarge(totalLoan.loan_taken_principal)}
//               formatCurrency={formatCurrencyLarge}
//             />
//             <div className='mt-3 space-y-2 pt-4 border-t border-gray-100'>
//               {loanTakenData.map((item, index) => (
//                 <div
//                   key={index}
//                   className='flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors'>
//                   <div className='flex items-center gap-2.5'>
//                     <div
//                       className='w-3 h-3 rounded-full shadow-sm'
//                       style={{ backgroundColor: item.color }}></div>
//                     <span className='text-gray-700 font-medium'>
//                       {item.name}
//                     </span>
//                   </div>
//                   <span className='font-bold text-gray-900'>
//                     {formatCurrencyLarge(item.value)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Loan Given */}
//           <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all'>
//             <div className='flex items-center gap-3 mb-6'>
//               <div className='p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl'>
//                 <Banknote className='w-6 h-6 text-green-600' strokeWidth={2} />
//               </div>
//               <div>
//                 <h2 className='text-lg font-bold text-gray-900'>Loan Given</h2>
//                 <p className='text-xs text-gray-500 mt-0.5'>
//                   Outstanding receivables
//                 </p>
//               </div>
//             </div>
//             <ResponsiveContainer width='100%' height={250}>
//               <PieChart>
//                 <Pie
//                   data={loanGivenData}
//                   cx='50%'
//                   cy='50%'
//                   outerRadius={90}
//                   dataKey='value'
//                   label={false}>
//                   {loanGivenData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value) => formatCurrencyLarge(value)}
//                   contentStyle={{
//                     backgroundColor: "white",
//                     border: "1px solid #E5E7EB",
//                     borderRadius: "8px",
//                     padding: "8px 12px",
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className='mt-3 space-y-2 pt-4 border-t border-gray-100'>
//               {loanGivenData.map((item, index) => (
//                 <div
//                   key={index}
//                   className='flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors'>
//                   <div className='flex items-center gap-2.5'>
//                     <div
//                       className='w-3 h-3 rounded-full shadow-sm'
//                       style={{ backgroundColor: item.color }}></div>
//                     <span className='text-gray-700 font-medium'>
//                       {item.name}
//                     </span>
//                   </div>
//                   <span className='font-bold text-gray-900'>
//                     {formatCurrencyLarge(item.value)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Investment */}
//           <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all'>
//             <div className='flex items-center gap-3 mb-6'>
//               <div className='p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl'>
//                 <HandCoins className='w-6 h-6 text-blue-600' strokeWidth={2} />
//               </div>
//               <div>
//                 <h2 className='text-lg font-bold text-gray-900'>Investment</h2>
//                 <p className='text-xs text-gray-500 mt-0.5'>
//                   Portfolio overview
//                 </p>
//               </div>
//             </div>
//             <DonutChart
//               data={investmentData}
//               centerValue={formatCurrencyLarge(investmentData[0]?.value || 0)}
//               formatCurrency={formatCurrencyLarge}
//             />
//             <div className='mt-3 space-y-2 pt-4 border-t border-gray-100'>
//               {investmentData.map((item, index) => (
//                 <div
//                   key={index}
//                   className='flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors'>
//                   <div className='flex items-center gap-2.5'>
//                     <div
//                       className='w-3 h-3 rounded-full shadow-sm'
//                       style={{ backgroundColor: item.color }}></div>
//                     <span className='text-gray-700 font-medium'>
//                       {item.name}
//                     </span>
//                   </div>
//                   <span className='font-bold text-gray-900'>
//                     {formatCurrencyLarge(item.value)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Rental Section */}
//         <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
//           <SectionHeader
//             icon={Home}
//             title='Rental / Scheduled'
//             subtitle='Property income and security deposit management'>
//             <select
//               value={rentalfilter.filter}
//               onChange={(e) => setRentalfilter({filter: e.target.value})}
//               className='hidden px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition'>
//               <option value='6'>Last 6 Months</option>
//               <option value='12'>Last 12 Months</option>
//               <option value='all'>All</option>
//             </select>
//           </SectionHeader>

//           <div className='grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-5 mb-7'>
//             <MetricCard
//               label='Monthly Income'
//               value={formatCurrencyLarge(totalRental?.total_monthly_rent)}
//               subValue='Current rent collection'
//               color='text-green-600'
//               icon={TrendingUp}
//             />
//             <MetricCard
//               label='Security Money'
//               value={formatCurrencyLarge(totalRental?.total_security_money)}
//               subValue='Total deposits held'
//               color='text-blue-600'
//               icon={Wallet}
//             />
//             <MetricCard
//               label='Security Refund'
//               value={formatCurrencyLarge(totalRental?.total_refund_security_money)}
//               subValue='Refunded to tenants'
//               color='text-orange-600'
//               icon={ArrowUpRight}
//             />
//             <MetricCard
//               label='Auto Adjusted'
//               value={formatCurrencyLarge(totalRental?.total_remaining_security_money)}
//               subValue='Currently held'
//               color='text-purple-600'
//               icon={PiggyBank}
//             />
//           </div>

//           <div className='hidden bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100'>
//             <ResponsiveContainer width='100%' height={320}>
//               <BarChart
//                 data={rentalData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                 <CartesianGrid
//                   strokeDasharray='3 3'
//                   stroke='#E5E7EB'
//                   vertical={false}
//                 />
//                 <XAxis
//                   dataKey='month'
//                   stroke='#6B7280'
//                   style={{ fontSize: "13px", fontWeight: "500" }}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   stroke='#6B7280'
//                   style={{ fontSize: "13px", fontWeight: "500" }}
//                   tickFormatter={(value) => `৳${value / 1000}k`}
//                   tickLine={false}
//                 />
//                 <Tooltip content={memoizedRentalTooltip} />
//                 <Legend
//                   wrapperStyle={{
//                     fontSize: "13px",
//                     fontWeight: "500",
//                     paddingTop: "15px",
//                   }}
//                   iconType='circle'
//                 />
//                 <Bar
//                   dataKey='receivable'
//                   fill='#2563EB'
//                   name='Receivable'
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={50}
//                 />
//                 <Bar
//                   dataKey='received'
//                   fill='#22C55E'
//                   name='Received'
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={50}
//                 />
//                 <Bar
//                   dataKey='due'
//                   fill='#EF4444'
//                   name='Due'
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={50}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinancialDashboard;






import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Building2,
  PiggyBank,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BadgeDollarSign,
  HandCoins,
  Landmark,
  Banknote,
  LineChart as LineChartIcon,
  Target,
} from "lucide-react";

import {
  getAccountBalance,
  getTotalIncomeExpense,
  getTotalIncomeExpenseGraph,
  getTotalRental,
  getMontlyRentalGraph,
  getInvestment,
  getTotalLoan,
  getCurrency,
  financialSummary
} from "../service/dashboardApi";
import { showToast } from "../helper/toastMessage";

// =========================================================
// 1. MEMOIZED HELPER COMPONENTS (DEFINED OUTSIDE)
// =========================================================

const CustomTooltip = React.memo(({ active, payload, formatCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200'>
        <p className='text-sm font-semibold text-gray-900 mb-2'>
          {payload[0].payload.month || payload[0].payload.name}
        </p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className='flex items-center justify-between gap-4 text-sm'>
            <div className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: entry.color }}></div>
              <span className='text-gray-600'>{entry.name}:</span>
            </div>
            <span className='font-semibold text-gray-900'>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
});

const SectionHeader = React.memo(
  ({ icon: Icon, title, subtitle, children }) => (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl'>
          <Icon className='w-6 h-6 text-blue-600' strokeWidth={2} />
        </div>
        <div>
          <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
          <p className='text-sm text-gray-500 mt-0.5'>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
);

const EnhancedStatCard = React.memo(
  ({ icon: Icon, label, value, subtext, color = "blue", bgColor }) => (
    <div className='flex items-center bg-white rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group'>
      <div className='flex items-start space-x-2'>
        <div
          className={`p-2 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-4 h-4 ${color}`} strokeWidth={2} />
        </div>
        <div className='space-y-1 '>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
            {label}
          </p>
          <h3 className='text-2xl font-bold text-gray-900 tracking-tight'>
            {value}
          </h3>
        </div>
      </div>
    </div>
  )
);

const MetricCard = React.memo(
  ({ label, value, color = "gray", subValue, icon: Icon }) => (
    <div className='bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
            {label}
          </p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subValue && <p className='text-xs text-gray-500 mt-1'>{subValue}</p>}
        </div>
        {Icon && (
          <div
            className={`p-2 rounded-lg ${
              color.includes("green")
                ? "bg-green-50"
                : color.includes("red")
                ? "bg-red-50"
                : color.includes("yellow")
                ? "bg-yellow-50"
                : color.includes("blue")
                ? "bg-blue-50"
                : color.includes("purple")
                ? "bg-purple-50"
                : "bg-gray-50"
            }`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        )}
      </div>
    </div>
  )
);

const DonutChart = React.memo(
  ({ data, centerLabel, centerValue, formatCurrency }) => (
    <div className='relative'>
      <ResponsiveContainer width='100%' height={250}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={70}
            outerRadius={95}
            paddingAngle={3}
            dataKey='value'>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
        <p className='text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1'>
          {centerLabel}
        </p>
        <p className='text-xl font-bold text-gray-900'>{centerValue}</p>
      </div>
    </div>
  )
);

// =========================================================
// 2. MAIN COMPONENT (FINANCIAL DASHBOARD)
// =========================================================

const FinancialDashboard = () => {
  const [accountBalance, setAccountBalance] = useState([]);
  const [totalIncomeExpense, setTotalIncomeExpense] = useState({});
  const [totalIncomeExpenseGraph, setTotalIncomeExpenseGraph] = useState([]);
  const [totalRental, setTotalRental] = useState(0);
  const [monthlyRentalGraph, setMonthlyRentalGraph] = useState([]);
  const [investment, setInvestment] = useState([]);
  const [totalLoan, setTotalLoan] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [financialSummaryData, setFinancialSummaryData] = useState({
    total_income_bdt: 0,
    total_expense_bdt: 0,
    net_profit_bdt: 0,
    total_net_receivable_bdt: 0,
    total_net_payable_bdt: 0
  });
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherIncomeExpenseFilter, setOtherIncomeExpenseFilter] = useState({filter:6});
  const [rentalfilter, setRentalfilter] = useState({filter:6});
  const [financialSummaryFilter, setFinancialSummaryFilter] = useState(0);
  const [incomeExpenseFilter, setIncomeExpenseFilter] = useState("6months");
  const [selectedRange, setSelectedRange] = useState("all_time");
  
  const isTimeRangeSelected = selectedRange !== "all_time";

  // Fetch all dashboard data including financial summary
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          accountBalanceRes,
          totalIncomeExpenseRes,
          totalIncomeExpenseGraphRes,
          totalRentalRes,
          monthlyRentalGraphRes,
          investmentRes,
          loanRes,
          currencyRes,
          financialSummaryRes
        ] = await Promise.all([
          getAccountBalance(),
          getTotalIncomeExpense(otherIncomeExpenseFilter.filter),
          getTotalIncomeExpenseGraph(otherIncomeExpenseFilter.filter),
          getTotalRental(),
          getMontlyRentalGraph(rentalfilter.filter),
          getInvestment(),
          getTotalLoan(),
          getCurrency(),
          financialSummary(financialSummaryFilter)
        ]);
        
        setAccountBalance(accountBalanceRes.data);
        setTotalIncomeExpense(totalIncomeExpenseRes.data[0]);
        setTotalIncomeExpenseGraph(totalIncomeExpenseGraphRes.data);
        setTotalRental(totalRentalRes.data[0]);
        setMonthlyRentalGraph(monthlyRentalGraphRes.data);
        setInvestment(investmentRes.data[0]);
        setTotalLoan(loanRes.data[0]);
        setCurrency(currencyRes.summary);
        setFinancialSummaryData(financialSummaryRes.summary || {
          total_income_bdt: 0,
          total_expense_bdt: 0,
          net_profit_bdt: 0,
          total_net_receivable_bdt: 0,
          total_net_payable_bdt: 0
        });

      } catch (err) {
        console.error(err);
        showToast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [financialSummaryFilter, otherIncomeExpenseFilter, rentalfilter]);

 // Separate effect to refetch only financial summary when filter changes
useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        const financialSummaryRes = await financialSummary(financialSummaryFilter);
        setFinancialSummaryData(financialSummaryRes.summary || {
          total_income_bdt: 0,
          total_expense_bdt: 0,
          net_profit_bdt: 0,
          total_net_receivable_bdt: 0,
          total_net_payable_bdt: 0
        });
        // Set the monthly chart data
        setMonthlyChartData(financialSummaryRes.monthly_data || []);
      } catch (err) {
        console.error(err);
        showToast.error("Failed to load financial summary data.");
      }
    };

    fetchFinancialSummary();
  }, [financialSummaryFilter]);

  // --- MEMOIZED FORMATTER FUNCTIONS (useCallback) ---
  const formatCurrency = useCallback((value) => {
    if (value >= 1000000) {
      return `৳ ${(value / 1000000).toFixed(2)}M`;
    }
    return `৳ ${(value / 1000).toFixed(0)}k`;
  }, []);

  const formatCurrencyLarge = useCallback((value) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace("BDT", "৳");
  }, []);


  // const incomeExpenseData = useMemo(
  //   () => [
  //     {
  //       month: "May",
  //       income: 450000,
  //       expense: 320000,
  //       payable: 80000,
  //       receivable: 120000,
  //     },
  //     {
  //       month: "Jun",
  //       income: 520000,
  //       expense: 380000,
  //       payable: 95000,
  //       receivable: 140000,
  //     },
  //     {
  //       month: "Jul",
  //       income: 480000,
  //       expense: 350000,
  //       payable: 75000,
  //       receivable: 110000,
  //     },
  //     {
  //       month: "Aug",
  //       income: 550000,
  //       expense: 420000,
  //       payable: 100000,
  //       receivable: 150000,
  //     },
  //     {
  //       month: "Sep",
  //       income: 580000,
  //       expense: 450000,
  //       payable: 90000,
  //       receivable: 130000,
  //     },
  //     {
  //       month: "Oct",
  //       income: 620000,
  //       expense: 480000,
  //       payable: 85000,
  //       receivable: 145000,
  //     },
  //   ],
  //   []
  // );


  const incomeExpenseData = useMemo(() => {
    // If we have monthly data from API, use it
    if (monthlyChartData && monthlyChartData.length > 0) {
      return monthlyChartData;
    }
    
    // Fallback to empty array or some default data
    return [];
  }, [monthlyChartData]);

  const currencyBusiness = useMemo(
    () => ({
      total: {
        buy: 1500000,
        sell: 2000000,
        margin: 500000,
        payment: 2300000,
        received: 2200000,
        payable: 100000,
      },
      last30Days: {
        buy: 300000,
        sell: 450000,
        margin: 150000,
        payment: 420000,
        received: 400000,
        payable: 20000,
      },
    }),
    []
  );

  const loanTakenData = useMemo(() => {
    if (!totalLoan) return [];
    return [
      { name: "Principal", value: parseFloat(totalLoan.loan_taken_principal), color: "#3B82F6" },
      { name: "Paid", value: parseFloat(totalLoan.loan_taken_paid), color: "#22C55E" },
      { name: "Payable", value: parseFloat(totalLoan.loan_taken_payable_receivable), color: "#FACC15" },
      { name: "Due Amount", value: parseFloat(totalLoan.loan_taken_emi_due), color: "#EF4444" },
      { name: "EMI Amount", value: parseFloat(totalLoan.payable_emi), color: "#3B82F6" },
    ];
  }, [totalLoan]);

  const loanGivenData = useMemo(() => {
    if (!totalLoan) return [];
    return [
      { name: "Principal", value: parseFloat(totalLoan.loan_given_principal), color: "#3B82F6" },
      { name: "Paid", value: parseFloat(totalLoan.loan_given_paid), color: "#22C55E" },
      { name: "Receivable", value: parseFloat(totalLoan.loan_given_payable_receivable), color: "#FACC15" },
      { name: "Due Amount", value: parseFloat(totalLoan.loan_given_emi_due), color: "#EF4444" },
      { name: "EMI Amount", value: parseFloat(totalLoan.receivable_emi), color: "#3B82F6" },
    ];
  }, [totalLoan]);

  const investmentData = useMemo(() => [
    { name: "Principal", value: parseFloat(investment.principal_amount), color: "#3B82F6" },
    { name: "Returned Amount", value: parseFloat(investment.investment_return), color: "#22C55E" },
    { name: "Profit", value: parseFloat(investment.investment_profit), color: "#2563EB" },
    { name: "Receivable", value: parseFloat(investment.receivable), color: "#FACC15" },
  ], [investment]);

  const rentalData = useMemo(
    () => [
      { month: "May", receivable: 45000, received: 42000, due: 3000 },
      { month: "Jun", receivable: 45000, received: 45000, due: 0 },
      { month: "Jul", receivable: 48000, received: 45000, due: 3000 },
      { month: "Aug", receivable: 48000, received: 48000, due: 0 },
      { month: "Sep", receivable: 50000, received: 47000, due: 3000 },
      { month: "Oct", receivable: 50000, received: 50000, due: 0 },
    ],
    []
  );

  // --- DERIVED DATA (THE MEMOIZATION THAT MATTERS HERE) ---
  const data = useMemo(() => {
    return isTimeRangeSelected
      ? currencyBusiness.last30Days
      : currencyBusiness.total;
  }, [isTimeRangeSelected, currencyBusiness]);

  // --- CHART TOOLTIP COMPONENT PROPS ---
  const memoizedIncomeExpenseTooltip = useMemo(
    () => <CustomTooltip formatCurrency={formatCurrencyLarge} />,
    [formatCurrencyLarge]
  );

  const memoizedOtherIncomeExpenseTooltip = useMemo(
    () => <CustomTooltip formatCurrency={formatCurrencyLarge} />,
    [formatCurrencyLarge]
  );

  const memoizedRentalTooltip = useMemo(
    () => <CustomTooltip formatCurrency={formatCurrency} />,
    [formatCurrency]
  );

  // Determine profit color based on value
  const getProfitColor = (profit) => {
    const profitValue = parseFloat(profit) || 0;
    return profitValue >= 0 ? "text-green-600" : "text-red-600";
  };

  const getProfitBgColor = (profit) => {
    const profitValue = parseFloat(profit) || 0;
    return profitValue >= 0 ? "bg-green-50" : "bg-red-50";
  };

  const getProfitIcon = (profit) => {
    const profitValue = parseFloat(profit) || 0;
    return profitValue >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>


      <div className='space-y-8'>
        {/* Income vs Expense Section */}
        <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
          <SectionHeader
            icon={Banknote}
            title='Overall Income vs Expense'
            subtitle='Financial performance overview and trend analysis'>
            <div className="flex gap-3">
              <select
                value={financialSummaryFilter}
                onChange={(e) => setFinancialSummaryFilter(Number(e.target.value))}
                className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition'>
                <option value={3}>Last 3 Months</option>
                <option value={6}>Last 6 Months</option>
                <option value={12}>Last 12 Months</option>
                <option value={0}>All Time</option>
              </select>
            </div>
          </SectionHeader>

          <div className='grid sm:grid-cols-1 md:grid-cols-5 gap-5 mb-7'>
            <EnhancedStatCard
              icon={TrendingUp}
              label='Total Income'
              value={formatCurrencyLarge(financialSummaryData.total_income_bdt)}
              color='text-green-600'
              bgColor='bg-green-50'
            />
            <EnhancedStatCard
              icon={TrendingDown}
              label='Total Expense'
              value={formatCurrencyLarge(financialSummaryData.total_expense_bdt)}
              color='text-red-600'
              bgColor='bg-red-50'
            />
            
            <EnhancedStatCard
              icon={HandCoins}
              label='Receivable'
              value={formatCurrencyLarge(financialSummaryData.total_net_receivable_bdt)}
              color='text-blue-600'
              bgColor='bg-blue-50'
            />
            <EnhancedStatCard
              icon={Wallet}
              label='Payable'
              value={formatCurrencyLarge(financialSummaryData.total_net_payable_bdt)}
              color='text-yellow-600'
              bgColor='bg-yellow-50'
            />

            <EnhancedStatCard
              icon={getProfitIcon(financialSummaryData.net_profit_bdt)}
              label='Margin'
              value={formatCurrencyLarge(financialSummaryData.net_profit_bdt)}
              color={getProfitColor(financialSummaryData.net_profit_bdt)}
              bgColor={getProfitBgColor(financialSummaryData.net_profit_bdt)}
            />
          </div>

          <div className='bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100'>
            {incomeExpenseData.length > 0 ? (
              <ResponsiveContainer width='100%' height={350}>
                <LineChart
                  data={incomeExpenseData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
                  <XAxis
                    dataKey='month'
                    stroke='#6B7280'
                    style={{ fontSize: "13px", fontWeight: "500" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke='#6B7280'
                    style={{ fontSize: "13px", fontWeight: "500" }}
                    tickFormatter={(value) => `৳${value / 1000}k`}
                    tickLine={false}
                  />
                  <Tooltip content={memoizedIncomeExpenseTooltip} />
                  <Legend
                    wrapperStyle={{
                      fontSize: "13px",
                      fontWeight: "500",
                      paddingTop: "20px",
                    }}
                    iconType='circle'
                  />
                  <Line
                    type='monotone'
                    dataKey='income'
                    stroke='#22C55E'
                    strokeWidth={3}
                    name='Income'
                    dot={{ fill: "#22C55E", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='expense'
                    stroke='#EF4444'
                    strokeWidth={3}
                    name='Expense'
                    dot={{ fill: "#EF4444", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  {/* <Line
                    type='monotone'
                    dataKey='payable'
                    stroke='#FACC15'
                    strokeWidth={3}
                    name='Payable'
                    dot={{ fill: "#FACC15", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  /> */}
                  {/* <Line
                    type='monotone'
                    dataKey='receivable'
                    stroke='#2563EB'
                    strokeWidth={3}
                    name='Receivable'
                    dot={{ fill: "#2563EB", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  /> */}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No data available for the selected period</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Balance Section */}
        <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
          <SectionHeader
            icon={Building2}
            title='Account Balance'
            subtitle='Available funds across all payment channels'
          />

          <div className='overflow-hidden rounded-xl border border-gray-200'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-gray-50 to-gray-100'>
                  <th className='text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Channel Name
                  </th>
                  <th className='text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Account Number
                  </th>
                  <th className='text-right py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {accountBalance.filter((item)=>item.method_name !== "TOTAL").map((account, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-50 transition-colors'>
                    <td className='py-5 px-6'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-lg ${
                            account.method_name === "cash"
                              ? "bg-green-50"
                              : account.method_name === "bank"
                              ? "bg-blue-50"
                              : "bg-purple-50"
                          }`}>
                          {account.method_name === "cash" ? (
                            <Wallet className={`w-4 h-4 text-green-600`} />
                          ) : account.method_name === "bank" ? (
                            <Landmark className={`w-4 h-4 text-blue-600`} />
                          ) : (
                            <Banknote className={`w-4 h-4 text-purple-600`} />
                          )}
                        </div>
                        <span className='font-semibold text-gray-900 text-base'>
                          {account.method_name}
                        </span>
                      </div>
                    </td>
                    <td className='py-5 px-6'>
                      <span className='text-gray-600 font-mono text-sm tracking-wide'>
                        {account.account_info}
                      </span>
                    </td>
                    <td className='py-5 px-6 text-right'>
                      <span className='font-bold text-gray-900 text-lg'>
                        {formatCurrencyLarge(account.balance)}
                      </span>
                    </td>
                  </tr>
                ))}
                {accountBalance
                  .filter(acc => acc.method_name === "TOTAL")
                  .map((totalRow, index) => (
                    <tr key={index} className='bg-gradient-to-r from-blue-50 to-indigo-50'>
                      <td colSpan='2' className='py-5 px-6 font-bold text-gray-900 text-base'>
                        TOTAL BALANCE
                      </td>
                      <td className='py-5 px-6 text-right font-bold text-2xl text-blue-600'>
                        {formatCurrencyLarge(Number(totalRow.balance || 0))}
                      </td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Income/Expense Section */}
        <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
          <SectionHeader
            icon={TrendingUp}
            title='Other Income / Expense'
            subtitle='Additional financial activities and miscellaneous transactions'>
            <select
              value={otherIncomeExpenseFilter.filter}
              onChange={(e) => setOtherIncomeExpenseFilter({ filter: e.target.value })} 
              className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition'>
              <option value='6'>Last 6 Months</option>
              <option value='12'>Last 12 Months</option>
              <option value='all'>All</option>
            </select>
          </SectionHeader>

          <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-5 mb-7'>
            <MetricCard
              label='Available Balance'
              value={formatCurrencyLarge(totalIncomeExpense?.available_balance)}
              subValue='Total accumulated funds'
              color='text-blue-600'
              icon={Wallet}
            />
            <MetricCard
              label='Total Income'
              value={formatCurrencyLarge(totalIncomeExpense?.total_received)}
              subValue='Cumulative earnings'
              color='text-green-600'
              icon={TrendingUp}
            />
            <MetricCard
              label='Total Expense'
              value={formatCurrencyLarge(totalIncomeExpense?.total_payment)}
              subValue='Cumulative spending'
              color='text-red-600'
              icon={TrendingDown}
            />
          </div>

          <div className='bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100'>
            <ResponsiveContainer width='100%' height={320}>
              <BarChart
                data={totalIncomeExpenseGraph}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#E5E7EB'
                  vertical={false}
                />
                <XAxis
                  dataKey='month'
                  stroke='#6B7280'
                  style={{ fontSize: "13px", fontWeight: "500" }}
                  tickLine={false}
                />
                <YAxis
                  stroke='#6B7280'
                  style={{ fontSize: "13px", fontWeight: "500" }}
                  tickLine={false}
                />
                <Tooltip content={memoizedOtherIncomeExpenseTooltip} />
                <Legend
                  wrapperStyle={{
                    fontSize: "13px",
                    fontWeight: "500",
                    paddingTop: "15px",
                  }}
                  iconType='circle'
                />
                <Bar
                  dataKey='total_received'
                  fill='#22C55E'
                  name='Income'
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <Bar
                  dataKey='total_payment'
                  fill='#EF4444'
                  name='Expense'
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Currency Business Section */}
        <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between'>
            <SectionHeader
              icon={CreditCard}
              title='Currency Business'
              subtitle='Foreign exchange and currency trading operations'
            />

            {/* <select
              className='w-40 p-2 border border-indigo-300 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors'
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}>
              <option value='all_time'>Total Overview</option>
              <option value='1_month'>Last 1 Month</option>
              <option value='3_months'>Last 3 Months</option>
              <option value='6_months'>Last 6 Months</option>
            </select> */}
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2'>
              <div className='grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4'>
                <div className='p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Banknote className='w-4 h-4 text-indigo-600' />
                    <p className='text-xs text-indigo-700 font-semibold uppercase tracking-wide'>
                      Currency Buy
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-indigo-700'>
                    {formatCurrencyLarge(currency.buy)}
                  </p>
                  <p className='text-xs text-indigo-600 mt-1'>
                    {isTimeRangeSelected
                      ? "Recent purchases"
                      : "Total purchased"}
                  </p>
                </div>

                <div className='p-5 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowDownRight className='w-4 h-4 text-teal-600' />
                    <p className='text-xs text-teal-700 font-semibold uppercase tracking-wide'>
                      Currency Sell
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-teal-700'>
                      {formatCurrencyLarge(currency.sell)}
                  </p>
                  <p className='text-xs text-teal-600 mt-1'>
                    {isTimeRangeSelected
                      ? "Recent foreign sold"
                      : "Total foreign sold"}
                  </p>
                </div>

                <div className='p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    {isTimeRangeSelected ? (
                      <TrendingUp className='w-4 h-4 text-green-600' />
                    ) : (
                      <LineChartIcon className='w-4 h-4 text-green-600' />
                    )}
                    <p className='text-xs text-green-700 font-semibold uppercase tracking-wide'>
                      Margin
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-green-700'>
                    {formatCurrencyLarge(currency.pnl_amount)}
                  </p>
                  <p className='text-xs text-green-600 mt-1'>
                    {isTimeRangeSelected
                      ? "Recent profit/loss"
                      : "Net profit/loss"}
                  </p>
                </div>

                <div className='p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    {isTimeRangeSelected ? (
                      <TrendingUp className='w-4 h-4 text-blue-600' />
                    ) : (
                      <LineChartIcon className='w-4 h-4 text-blue-600' />
                    )}
                    <p className='text-xs text-blue-700 font-semibold uppercase tracking-wide'>
                      Balance
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-blue-700'>
                    {formatCurrencyLarge(currency.balance)}
                  </p>
                  <p className='text-xs text-blue-600 mt-1'>
                    {isTimeRangeSelected
                      ? "Recent profit/loss"
                      : "Net Balance"}
                  </p>
                </div>

                <div className='p-5 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Wallet className='w-4 h-4 text-red-600' />
                    <p className='text-xs text-red-700 font-semibold uppercase tracking-wide'>
                      Payment
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-red-700'>
                   {formatCurrencyLarge(currency.payment)}
                  </p>
                  <p className='text-xs text-red-600 mt-1'>
                    {isTimeRangeSelected ? "This month paid" : "Total paid out"}
                  </p>
                </div>

                <div className='p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowUpRight className='w-4 h-4 text-purple-600' />
                    <p className='text-xs text-purple-700 font-semibold uppercase tracking-wide'>
                      Received
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-purple-700'>
                   {formatCurrencyLarge(currency.received)}
                  </p>
                  <p className='text-xs text-purple-600 mt-1'>
                    {isTimeRangeSelected
                      ? "This month collected"
                      : "Total collected"}
                  </p>
                </div>

                <div className='p-5 bg-gradient-to-br from-yellow-50 to-white rounded-xl border border-yellow-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    <HandCoins className='w-4 h-4 text-yellow-600' />
                    <p className='text-xs text-yellow-700 font-semibold uppercase tracking-wide'>
                      Payable
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-yellow-700'>
                    {formatCurrencyLarge(currency.payable)}
                  </p>
                  <p className='text-xs text-yellow-600 mt-1'>
                    {isTimeRangeSelected
                      ? "Pending liabilities"
                      : "Outstanding liabilities"}
                  </p>
                </div>
                <div className='p-5 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-sm hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-2 mb-2'>
                    <HandCoins className='w-4 h-4 text-red-600' />
                    <p className='text-xs text-red-700 font-semibold uppercase tracking-wide'>
                      Receivable
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-red-700'>
                    {formatCurrencyLarge(currency.receivable)}
                  </p>
                  <p className='text-xs text-red-600 mt-1'>
                    {isTimeRangeSelected
                      ? "Pending liabilities"
                      : "Outstanding receivables"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loan and Investment Section */}
        <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
          {/* Loan Taken */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl'>
                <CreditCard className='w-6 h-6 text-red-600' strokeWidth={2} />
              </div>
              <div>
                <h2 className='text-lg font-bold text-gray-900'>Loan Taken</h2>
                <p className='text-xs text-gray-500 mt-0.5'>
                  Outstanding liabilities
                </p>
              </div>
            </div>
            <DonutChart
              data={loanTakenData}
              centerValue={formatCurrencyLarge(totalLoan.loan_taken_principal)}
              formatCurrency={formatCurrencyLarge}
            />
            <div className='mt-3 space-y-2 pt-4 border-t border-gray-100'>
              {loanTakenData.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <div className='flex items-center gap-2.5'>
                    <div
                      className='w-3 h-3 rounded-full shadow-sm'
                      style={{ backgroundColor: item.color }}></div>
                    <span className='text-gray-700 font-medium'>
                      {item.name}
                    </span>
                  </div>
                  <span className='font-bold text-gray-900'>
                    {formatCurrencyLarge(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Given */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl'>
                <Banknote className='w-6 h-6 text-green-600' strokeWidth={2} />
              </div>
              <div>
                <h2 className='text-lg font-bold text-gray-900'>Loan Given</h2>
                <p className='text-xs text-gray-500 mt-0.5'>
                  Outstanding receivables
                </p>
              </div>
            </div>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={loanGivenData}
                  cx='50%'
                  cy='50%'
                  outerRadius={90}
                  dataKey='value'
                  label={false}>
                  {loanGivenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrencyLarge(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='mt-3 space-y-2 pt-4 border-t border-gray-100'>
              {loanGivenData.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <div className='flex items-center gap-2.5'>
                    <div
                      className='w-3 h-3 rounded-full shadow-sm'
                      style={{ backgroundColor: item.color }}></div>
                    <span className='text-gray-700 font-medium'>
                      {item.name}
                    </span>
                  </div>
                  <span className='font-bold text-gray-900'>
                    {formatCurrencyLarge(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investment */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl'>
                <HandCoins className='w-6 h-6 text-blue-600' strokeWidth={2} />
              </div>
              <div>
                <h2 className='text-lg font-bold text-gray-900'>Investment</h2>
                <p className='text-xs text-gray-500 mt-0.5'>
                  Portfolio overview
                </p>
              </div>
            </div>
            <DonutChart
              data={investmentData}
              centerValue={formatCurrencyLarge(investmentData[0]?.value || 0)}
              formatCurrency={formatCurrencyLarge}
            />
            <div className='mt-3 space-y-2 pt-4 border-t border-gray-100'>
              {investmentData.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <div className='flex items-center gap-2.5'>
                    <div
                      className='w-3 h-3 rounded-full shadow-sm'
                      style={{ backgroundColor: item.color }}></div>
                    <span className='text-gray-700 font-medium'>
                      {item.name}
                    </span>
                  </div>
                  <span className='font-bold text-gray-900'>
                    {formatCurrencyLarge(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rental Section */}
        <div className='bg-white rounded-2xl p-7 shadow-sm border border-gray-100'>
          <SectionHeader
            icon={Home}
            title='Rental / Scheduled'
            subtitle='Property income and security deposit management'>
            <select
              value={rentalfilter.filter}
              onChange={(e) => setRentalfilter({filter: e.target.value})}
              className='hidden px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition'>
              <option value='6'>Last 6 Months</option>
              <option value='12'>Last 12 Months</option>
              <option value='all'>All</option>
            </select>
          </SectionHeader>

          <div className='grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-5 mb-7'>
            <MetricCard
              label='Monthly Income'
              value={formatCurrencyLarge(totalRental?.total_monthly_rent)}
              subValue='Current rent collection'
              color='text-green-600'
              icon={TrendingUp}
            />
            <MetricCard
              label='Security Money'
              value={formatCurrencyLarge(totalRental?.total_security_money)}
              subValue='Total deposits held'
              color='text-blue-600'
              icon={Wallet}
            />
            <MetricCard
              label='Security Refund'
              value={formatCurrencyLarge(totalRental?.total_refund_security_money)}
              subValue='Refunded to tenants'
              color='text-orange-600'
              icon={ArrowUpRight}
            />
            <MetricCard
              label='Auto Adjusted'
              value={formatCurrencyLarge(totalRental?.total_remaining_security_money)}
              subValue='Currently held'
              color='text-purple-600'
              icon={PiggyBank}
            />
          </div>

          <div className='hidden bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100'>
            <ResponsiveContainer width='100%' height={320}>
              <BarChart
                data={rentalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#E5E7EB'
                  vertical={false}
                />
                <XAxis
                  dataKey='month'
                  stroke='#6B7280'
                  style={{ fontSize: "13px", fontWeight: "500" }}
                  tickLine={false}
                />
                <YAxis
                  stroke='#6B7280'
                  style={{ fontSize: "13px", fontWeight: "500" }}
                  tickFormatter={(value) => `৳${value / 1000}k`}
                  tickLine={false}
                />
                <Tooltip content={memoizedRentalTooltip} />
                <Legend
                  wrapperStyle={{
                    fontSize: "13px",
                    fontWeight: "500",
                    paddingTop: "15px",
                  }}
                  iconType='circle'
                />
                <Bar
                  dataKey='receivable'
                  fill='#2563EB'
                  name='Receivable'
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey='received'
                  fill='#22C55E'
                  name='Received'
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey='due'
                  fill='#EF4444'
                  name='Due'
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;