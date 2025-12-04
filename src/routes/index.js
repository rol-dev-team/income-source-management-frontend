import { lazy } from "react";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  BookOpenIcon,
  DocumentChartBarIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export const routes = [
  {
    path: "/login",
    component: lazy(() => import("../pages/Login")),
    protected: false,
    layout: "none",
  },
  {
    path: "/",
    component: lazy(() => import("../pages/Dashboard")),
    protected: true,
  },
  {
    path: "/ledger",
    component: lazy(() => import("../pages/BankLedger")),
    protected: true,
  },
  {
    path: "/bank-deposit",
    component: lazy(() => import("../pages/bank-deposit/DepositPosting")),
    protected: true,
  },
  {
    path: "/bank-deposit-create",
    component: lazy(() => import("../pages/bank-deposit/CreateBankDeposit")),
    protected: true,
  },
  {
    path: "/transfer",
    component: lazy(() => import("../pages/transfer/TransferPage")),
    protected: true,
  },
  {
    path: "/transfer/create",
    component: lazy(() => import("../pages/transfer/CreateTransferPage")),
    protected: true,
  },
  {
    path: "/currency-trading/currency",
    component: lazy(() => import("../pages/currency-trading/CurrencyPage")),
    protected: true,
    icon: CurrencyDollarIcon, // Add the icon here
  },
  {
    path: "/currency-trading/create",
    component: lazy(() =>
      import("../pages/currency-trading/CreateCurrencyPage")
    ),
    protected: true,
    icon: CurrencyDollarIcon, // Add the icon here
  },
  {
    path: "/currency-trading/party",
    component: lazy(() => import("../pages/currency-trading/PartyPage")),
    protected: true,
    icon: UserGroupIcon,
  },
  {
    path: "/currency-trading/create-party",
    component: lazy(() => import("../pages/currency-trading/CreatePartyPage")),
    protected: true,
    icon: UserGroupIcon,
  },

  {
    path: "/currency-trading/pnl",
    component: lazy(() => import("../pages/currency-trading/CurrencyPnLPage")),
    protected: true,
    icon: UserGroupIcon,
  },

  // {
  //   path: "/currency-trading/ledger",
  //   component: lazy(() => import("../pages/currency-trading/LedgerPage")),
  //   protected: true,
  //   icon: BookOpenIcon,
  // },
  {
    path: "/currency-ledger",
    component: lazy(() => import("../pages/CurrencyLedgerPage")),
    protected: true,
    icon: BookOpenIcon, // Add the icon here
  },
  {
    path: "/currency-trading/report",
    component: lazy(() => import("../pages/currency-trading/ReportPage")),
    protected: true,
    icon: DocumentChartBarIcon, // Add the icon here
  },
  {
    path: "/currency-trading/posting",
    component: lazy(() => import("../pages/currency-trading/PostingPage")),
    protected: true,
    icon: ClipboardDocumentListIcon, // Add the icon here
  },
  {
    path: "/currency-trading/create-posting",
    component: lazy(() =>
      import("../pages/currency-trading/CreatePostingPage")
    ),
    protected: true,
    icon: ClipboardDocumentListIcon, // Add the icon here
  },
  {
    path: "/posting",
    component: lazy(() => import("../pages/PostingTable")),
    protected: true,
  },
  {
    path: "/posting/create",
    component: lazy(() => import("../pages/PostingCreate.jsx")),
    protected: true,
  },

  {
    path: "/advanced-payments",
    component: lazy(() => import("../pages/AdvancedPaymentList")),
    protected: true,
  },
  {
    path: "/advanced-payments/create",
    component: lazy(() => import("../pages/AdvancedPaymentForm")),
    protected: true,
  },
  {
    path: "/advanced-payments/edit/:id",
    component: lazy(() => import("../pages/AdvancedPaymentForm")),
    protected: true,
  },

  {
    path: "/settings",
    component: lazy(() => import("../pages/Settings")),
    protected: true,
  },
  {
    path: "/settings/users",
    component: lazy(() => import("../pages/settings/UsersPage")),
    protected: true,
  },
  {
    path: "/settings/create-user",
    component: lazy(() => import("../pages/settings/CreateUserPage")),
    protected: true,
  },
  {
    path: "/settings/payment-channels",
    component: lazy(() => import("../pages/settings/PaymentChannelsPage")),
    protected: true,
  },
  {
    path: "/settings/create-payment-channel",
    component: lazy(() => import("../pages/settings/CreatePaymentChannelPage")),
    protected: true,
  },
  {
    path: "/settings/account-numbers",
    component: lazy(() => import("../pages/settings/AccountNumberPage")),
    protected: true,
  },
  {
    path: "/settings/create-account-number",
    component: lazy(() => import("../pages/settings/CreateAccountNumberPage")),
    protected: true,
  },
  {
    path: "/settings/source",
    component: lazy(() => import("../pages/SourcePage")),
    protected: true,
  },
  {
    path: "/settings/point-of-contact",
    component: lazy(() => import("../pages/PointOfContactPage")),
    protected: true,
  },
  {
    path: "/settings/source-category",
    component: lazy(() => import("../pages/SourceCategoryPage")),
    protected: true,
  },
  {
    path: "/settings/sub-category",
    component: lazy(() => import("../pages/SubCategoryPage")),
    protected: true,
  },
  {
    path: "/settings/sub-category-details",
    component: lazy(() => import("../pages/SubCategoryDetailsPage")),
    protected: true,
  },

  {
    path: "/settings/expense-type",
    component: lazy(() => import("../pages/ExpenseTypePage")),
    protected: true,
  },

  {
    path: "/settings/payment-channel-details",
    component: lazy(() => import("../pages/PaymentChannelDetails")),
    protected: true,
  },
  {
    path: "/settings/account-number",
    component: lazy(() => import("../pages/AccountNumber")),
    protected: true,
  },

  {
    path: "/settings/transaction-type",
    component: lazy(() => import("../pages/TransactionTypePage")),
    protected: true,
  },

  {
    path: "/income-expense/head",
    component: lazy(() =>
      import("../pages/income-expense/IncomeExpenseHeadPage")
    ),
    protected: true,
  },
  {
    path: "/income-expense/head-create",
    component: lazy(() =>
      import("../pages/income-expense/CreateIncomeExpenseHeadPage")
    ),
    protected: true,
  },

  {
    path: "/income-expense/postings",
    component: lazy(() => import("../pages/income-expense/PostingPage")),
    protected: true,
  },
  {
    path: "/income-expense/postings-create",
    component: lazy(() => import("../pages/income-expense/CreatePostingPage")),
    protected: true,
  },
  {
    path: "/income-expense/ledger",
    component: lazy(() => import("../pages/income-expense/Ledger")),
    protected: true,
  },

  // Loan
  {
    path: "/loan/head",
    component: lazy(() => import("../pages/loan/HeadPostingPage.jsx")),
    protected: true,
  },
  {
    path: "/loan/head-create",
    component: lazy(() => import("../pages/loan/CreateHeadPage.jsx")),
    protected: true,
  },

  {
    path: "/loan/postings",
    component: lazy(() => import("../pages/loan/PostingPage.jsx")),
    protected: true,
  },
  {
    path: "/loan/postings-create",
    component: lazy(() => import("../pages/loan/CreatePostingPage.jsx")),
    protected: true,
  },
  {
    path: "/loan/ledger",
    component: lazy(() => import("../pages/loan/Ledger.jsx")),
    protected: true,
  },
  // Investment
  {
    path: "/investment/head",
    component: lazy(() => import("../pages/investment/HeadPostingPage.jsx")),
    protected: true,
  },
  {
    path: "/investment/head-create",
    component: lazy(() => import("../pages/investment/CreateHeadPage.jsx")),
    protected: true,
  },

  {
    path: "/investment/postings",
    component: lazy(() => import("../pages/investment/PostingPage.jsx")),
    protected: true,
  },
  {
    path: "/investment/postings-create",
    component: lazy(() => import("../pages/investment/CreatePostingPage.jsx")),
    protected: true,
  },
  {
    path: "/investment/ledger",
    component: lazy(() => import("../pages/investment/Ledger.jsx")),
    protected: true,
  },

  // Rental
  {
    path: "/rental/party",
    component: lazy(() => import("../pages/rental/PartyPostingPage.jsx")),
    protected: true,
  },
  {
    path: "/rental/party-create",
    component: lazy(() => import("../pages/rental/CreatePartyPage.jsx")),
    protected: true,
  },

  {
    path: "/rental/house",
    component: lazy(() => import("../pages/rental/HousePostingPage.jsx")),
    protected: true,
  },
  {
    path: "/rental/house-create",
    component: lazy(() => import("../pages/rental/CreateHousePage.jsx")),
    protected: true,
  },

  {
    path: "/rental/postings",
    component: lazy(() => import("../pages/rental/PostingPage.jsx")),
    protected: true,
  },
  {
    path: "/rental/postings-create",
    component: lazy(() => import("../pages/rental/CreatePostingPage.jsx")),
    protected: true,
  },

  {
    path: "/rental/house-party-mapping",
    component: lazy(() =>
      import("../pages/rental/HousePartyMappingPostingPage.jsx")
    ),
    protected: true,
  },
  {
    path: "/rental/house-party-mapping-create",
    component: lazy(() =>
      import("../pages/rental/CreateHousePartyMappingPage.jsx")
    ),
    protected: true,
  },
  
  {
    path: "/rental/ledger",
    component: lazy(() => import("../pages/rental/Ledger.jsx")),
    protected: true,
  },

  // rent mapping
  {
    path: "/rental/mapping",
    component: lazy(() =>
      import("../pages/rental/RentalMappingPostingPage.jsx")
    ),
    protected: true,
  },
  {
    path: "/rental/mapping-create",
    component: lazy(() =>
      import("../pages/rental/CreateRentalMappingPage.jsx")
    ),
    protected: true,
  },
];
