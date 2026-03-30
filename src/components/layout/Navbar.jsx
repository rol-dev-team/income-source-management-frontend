// src/components/layout/Navbar.jsx
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { menus } from "./MenuItems"; // Assuming this exists for mobile nav
import { useNavigate, NavLink } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../App";
import { logoutUser } from "../../service/authApi";
import { showToast } from "../../helper/toastMessage";
import { clearTokens } from "../../service/tokenService";

// Now receives mobileMenuOpen and toggleMobileMenu from MainLayout
const Navbar = ({ toggleMobileMenu, mobileMenuOpen }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem("info");
      setProfileOpen(false);
      clearTokens();
      navigate("/login");
    } catch (error) {
      showToast.error(error);
    }
  };

  return (
    <>
      <div className='bg-white p-3 flex justify-between items-center border-b-2 border-gray-200'>
        {/* Mobile Menu Toggle */}
        <div className='md:hidden'>
          {/* Uses the toggleMobileMenu prop from MainLayout */}
          <button onClick={toggleMobileMenu}>
            {/* Shows XMark when mobileMenuOpen is true, else Bars3Icon */}
            {mobileMenuOpen ? (
              <XMarkIcon className='h-6 w-6 text-gray-700' />
            ) : (
              <Bars3Icon className='h-6 w-6 text-gray-700' />
            )}
          </button>
        </div>

        <div className='flex items-center'>
          {/* Your Logo/Brand Here */}
          {/* <img
            src='https://www.earth.net.bd/_next/static/media/test.924edafc.png'
            alt='Earth Logo'
            className='h-8 w-auto'
          /> */}
        </div>

        <div ref={profileRef} className='relative'>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className='rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center cursor-pointer'>
            👤
          </div>
          {profileOpen && (
            <div className='absolute right-0 mt-2 w-64 bg-white rounded shadow-md p-4 z-50 text-sm'>
              <div className='mb-2'>
                <strong>{user?.name}</strong>
                <div className='text-gray-500 text-xs'>{user?.email}</div>
              </div>
              <hr className='my-2' />
              <button
                onClick={() => alert("Change Password Clicked")}
                className='w-full text-left px-2 py-1 hover:bg-gray-100'>
                🔑 Change Password
              </button>
              <button
                onClick={handleLogout}
                className='w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500'>
                🔓 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Menu (Rendered by MainLayout's mobileMenuOpen logic) */}
      {/* This mobile menu should now be part of the Sidebar or removed if Sidebar handles all nav */}
      {/* If this section is meant to be a *separate* mobile menu in the Navbar,
          then MainLayout would need to pass a specific prop for its visibility.
          Given your MainLayout structure, it seems the mobile sidebar IS the mobile menu.
          So, consider removing this section from Navbar if Sidebar handles all mobile navigation.
          For now, I'll keep it here, but emphasize the potential redundancy. */}
      {mobileMenuOpen && ( // This now relies on mobileMenuOpen from MainLayout
        <div className='bg-[#0B2B48] text-white px-4 py-3 space-y-2 md:hidden'>
          {menus.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              // When an item is clicked, it should also close the mobile menu
              onClick={toggleMobileMenu} // Call toggle to close
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-700 transition ${
                  isActive ? "bg-blue-800" : ""
                }`
              }>
              <item.icon className='h-5 w-5' />
              <span className='text-sm'>{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
