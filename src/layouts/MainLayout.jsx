// src/layouts/MainLayout.jsx
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useState } from "react"; // Import useState

const MainLayout = ({
  children,
  // mobileMenuOpen, // No longer received as prop, managed internally
  // toggleMobileMenu, // No longer received as prop, managed internally
  // closeMobileMenu, // No longer received as prop, managed internally
}) => {
  // Manage mobile menu state internally
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      {" "}
      {/* Added overflow-hidden to prevent body scroll when sidebar is open */}
      {/* Desktop Sidebar */}
      <div className='hidden md:block'>
        <Sidebar />
      </div>
      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* The Sidebar component itself needs to be styled for mobile (e.g., fixed position, z-index, width) */}
          <Sidebar mobile onClose={closeMobileMenu} />
          <div
            className='fixed inset-0 bg-black opacity-50 md:hidden z-40' // Added z-index for overlay
            onClick={closeMobileMenu}
          />
        </>
      )}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {" "}
        {/* Added overflow-hidden to the main content wrapper */}
        <Navbar
          toggleMobileMenu={toggleMobileMenu}
          mobileMenuOpen={mobileMenuOpen} // Pass the state down
        />
        {/* The main content area should have its own scroll if needed */}
        <div className='flex-1 overflow-y-auto bg-gray-50 p-4'>
          {" "}
          {/* Use flex-1 and overflow-y-auto for content scrolling */}
          {children}
        </div>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default MainLayout;
