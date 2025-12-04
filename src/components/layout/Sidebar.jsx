import { useContext } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline"; // Add icons
import { NavLink } from "react-router-dom";
import { menus } from "./MenuItems"; // Your menu items
import { useState } from "react"; // Import useState
import { useLocation } from "react-router-dom";
import chairmanSir from "../../assets/images/chairman-sir.jpg";
import { AuthContext } from "../../App";

const Sidebar = ({ mobile, onClose }) => {
  const location = useLocation();
  const sidebarClasses = mobile
    ? "fixed inset-y-0 left-0 w-35 bg-[#0B2B48] text-white z-50 transform transition-transform duration-300 ease-in-out"
    : "w-35 bg-[#0B2B48] text-white p-2 shrink-0"; // Desktop sidebar classes, added shrink-0

  const [openNestedMenu, setOpenNestedMenu] = useState(null);

  const handleToggleNestedMenu = (itemName) => {
    setOpenNestedMenu(openNestedMenu === itemName ? null : itemName);
  };

  const { user } = useContext(AuthContext);


  const menu = menus.filter(item => {
    if (item.name === "Settings" && user?.role === "user") {
      return false; 
    }
    return true;
  });

  return (
    <div className={sidebarClasses}>
      {mobile && (
        <button onClick={onClose} className='absolute top-4 right-4 text-white'>
          <XMarkIcon className='h-6 w-6' />
        </button>
      )}
      <div className='p-2 overflow-y-auto h-screen'>
        {" "}
        {/* Make sidebar content scrollable if it overflows */}
        <h2 className='text-xl font-bold mb-6 flex justify-center'>
          <img
            src={chairmanSir}
            alt='person'
            className='w-[48px] h-[48px] rounded-full border-2 border-gray-300 object-cover'
          />
        </h2>
        <nav>
          {menu.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div
                  onClick={() => handleToggleNestedMenu(item.name)}
                  className='flex items-center justify-between gap-3 px-3 py-2 rounded hover:bg-blue-700 transition cursor-pointer'>
                  <div className='flex items-center gap-3'>
                    <item.icon className='h-5 w-5' />
                    <span className='text-sm'>{item.name}</span>
                  </div>
                  {openNestedMenu === item.name ? (
                    <ChevronUpIcon className='h-5 w-5' />
                  ) : (
                    <ChevronDownIcon className='h-5 w-5' />
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  // Close mobile sidebar on navigation if it's a mobile sidebar
                  onClick={mobile ? onClose : undefined}
                  className={() => {
                    const currentPath = location.pathname + location.search;
                    const isExactMatch = currentPath === item.path;
                    return `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-700 transition ${
                        isExactMatch ? "bg-blue-800" : ""
                    }`;
                  }}
                >


                  <item.icon className='h-5 w-5' />
                  <span className='text-sm'>{item.name}</span>
                </NavLink>
              )}

              {item.children && openNestedMenu === item.name && (
                <div className='pt-2 space-y-2'>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.path}
                      onClick={mobile ? onClose : undefined} // Close mobile sidebar on child navigation
                      className={() => {
                        const currentPath = location.pathname + location.search;
                        const isExactMatch = currentPath === item.path;
                        return `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-700 transition ${
                            isExactMatch ? "bg-blue-800" : ""
                        }`;
                      }}
                    >
                      <child.icon className='h-5 w-5' />
                      <span className='text-sm'>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
