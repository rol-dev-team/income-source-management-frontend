import {
  Squares2X2Icon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  GlobeAltIcon,
  FolderIcon,
  FolderOpenIcon,
  DocumentMagnifyingGlassIcon,
  BanknotesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../App";

export const menus = [
  {
    name: "Dashboard",
    path: "/",
    icon: Squares2X2Icon,
  },
  {
    name: "Bank Ledger",
    path: "/ledger",
    icon: DocumentTextIcon,
  },
  {
    name: "Deposit",
    path: "/bank-deposit",
    icon: DocumentTextIcon,
  },
  {
    name: "Transfer",
    path: "/transfer",
    icon: DocumentTextIcon,
  },
  {
    name: "Currency Trading",
    path: "#",
    icon: ClipboardDocumentListIcon,
    children: [
      {
        name: "Posting",
        path: "/currency-trading/posting",
        icon: ClipboardDocumentListIcon,
      },

      {
        name: "Party Ledger",
        path: "/currency-ledger",
        icon: BanknotesIcon,
      },
      {
        name: "Add Currency",
        path: "/currency-trading/currency",
        icon: UserGroupIcon,
      },
      {
        name: "Add Party",
        path: "/currency-trading/party",
        icon: UserCircleIcon,
      },
      {
        name: "Profit & Loss",
        path: "/currency-trading/pnl",
        icon: UserCircleIcon,
      },
    ],
  },
  {
    name: "Income & Expense",
    path: "#",
    icon: ClipboardDocumentListIcon,
    children: [
      {
        name: "Posting",
        path: "/income-expense/postings",
        icon: ClipboardDocumentListIcon,
      },
      {
        name: "Ledger",
        path: "/income-expense/ledger",
        icon: ClipboardDocumentListIcon,
      },

      {
        name: "Add Head",
        path: "/income-expense/head",
        icon: BanknotesIcon,
      },
    ],
  },

  {
    name: "Loan",
    path: "#",
    icon: ClipboardDocumentListIcon,
    children: [
      {
        name: "Posting",
        path: "/loan/postings",
        icon: ClipboardDocumentListIcon,
      },
      {
        name: "Ledger",
        path: "/loan/ledger",
        icon: ClipboardDocumentListIcon,
      },

      {
        name: "Add Party",
        path: "/loan/head",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    name: "Investment",
    path: "#",
    icon: ClipboardDocumentListIcon,
    children: [
      {
        name: "Posting",
        path: "/investment/postings",
        icon: ClipboardDocumentListIcon,
      },
      {
        name: "Ledger",
        path: "/investment/ledger",
        icon: ClipboardDocumentListIcon,
      },

      {
        name: "Add Party",
        path: "/investment/head",
        icon: BanknotesIcon,
      },
    ],
  },

  {
    name: "Rental",
    path: "#",
    icon: ClipboardDocumentListIcon,
    children: [
      {
        name: "Posting",
        path: "/rental/postings",
        icon: ClipboardDocumentListIcon,
      },
      {
        name: "Ledger",
        path: "/rental/ledger",
        icon: ClipboardDocumentListIcon,
      },

      {
        name: "Party Mapping",
        path: "/rental/house-party-mapping",
        icon: BanknotesIcon,
      },
      {
        name: "Rent Mapping",
        path: "/rental/mapping",
        icon: BanknotesIcon,
      },
      {
        name: "Add Party",
        path: "/rental/party",
        icon: BanknotesIcon,
      },
      {
        name: "Add House",
        path: "/rental/house",
        icon: BanknotesIcon,
      },
    ],
  },

  //  {
  //   name: "Posting",
  //   path: "#",
  //   icon: ClipboardDocumentListIcon,
  //   children: [
  //     {
  //       name: "Income",
  //       path: "/posting/create?mode=1",
  //       icon: UserGroupIcon,
  //     },
  //     {
  //       name: "Expense",
  //       path: "/posting/create?mode=2",
  //       icon: UserCircleIcon,
  //     },
  //     {
  //       name: "Advanced",
  //       path: "/advanced-payments",
  //       icon: BanknotesIcon,
  //     },
  //     {
  //       name: "Posting Details",
  //       path: "/posting",
  //       icon: ClipboardDocumentListIcon,
  //     },
  //       ]
  // },

  {
    name: "Settings",
    path: "/settings",
    icon: Cog6ToothIcon,
    children: [
      {
        name: "Users",
        path: "/settings/users",
        icon: UserGroupIcon,
      },
      {
        name: "Payment Channel",
        path: "/settings/payment-channels",
        icon: UserCircleIcon,
      },
      {
        name: "Account Number",
        path: "/settings/account-numbers",
        icon: UserCircleIcon,
      },
      // {
      //   name: "Transaction",
      //   path: "/settings/transaction-type",
      //   icon: UserCircleIcon,
      // },
      // {
      //   name: "Source",
      //   path: "/settings/source",
      //   icon: GlobeAltIcon,
      // },
      // {
      //   name: "Category",
      //   path: "/settings/source-category",
      //   icon: FolderIcon,
      // },
      // {
      //   name: "Sub-category",
      //   path: "/settings/sub-category",
      //   icon: FolderOpenIcon,
      // },
      // {
      //   name: "Sub-category Details",
      //   path: "/settings/sub-category-details",
      //   icon: DocumentMagnifyingGlassIcon,
      // },
      // {
      //   name: "Expense Type",
      //   path: "/settings/expense-type",
      //   icon: BanknotesIcon,
      // },
      // {
      //   name: "Point of Contact",
      //   path: "/settings/point-of-contact",
      //   icon: UserCircleIcon,
      // },
      // {
      //   name: "Payment mode",
      //   path: "/settings/payment-channel",
      //   icon: UserCircleIcon,
      // },
      // {
      //   name: "Payment Channel",
      //   path: "/settings/payment-channel-details",
      //   icon: UserCircleIcon,
      // },
      // {
      //   name: "Account Number",
      //   path: "/settings/account-number",
      //   icon: UserCircleIcon,
      // },
    ],
  },
];
