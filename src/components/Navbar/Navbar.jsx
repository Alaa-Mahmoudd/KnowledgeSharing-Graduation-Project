import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { useAuth } from "../../Context/AuthContext";
import { FiSearch } from "react-icons/fi";

export default function Navbar() {
  const { isAuthenticated, handleLogout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };
  // if (user && user.role !== "user" && user.role !== "doctor") {
  //   return null;
  // }
  return (
    <div>
      <nav className="border-b bg-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo and Search */}
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-black">
              Accessible Health Hub
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Links */}
          <div
            className="hidden md:flex md:items-center md:space-x-8"
            id="navbar-user"
          >
            <NavLink
              to={"/"}
              className="text-md text-black font-normal hover:text-[#7A9EB8]"
            >
              Home
            </NavLink>

            {!isAuthenticated ? (
              <>
                <NavLink
                  to={"/login"}
                  className="text-md text-black font-normal hover:text-[#7A9EB8]"
                >
                  Login
                </NavLink>
                <NavLink
                  to={"/register"}
                  className="text-md text-black font-normal hover:text-[#7A9EB8]"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={"/post"}
                  className="text-md text-black font-normal hover:text-[#7A9EB8]"
                >
                  Read
                </NavLink>
                <NavLink
                  to={"/shop"}
                  className="text-md text-black font-normal hover:text-[#7A9EB8]"
                >
                  Shop
                </NavLink>

                {/* Logout and Hamburger button in one row */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogoutClick}
                    className="text-md text-black font-normal hover:text-[#7A9EB8]"
                  >
                    Logout
                  </button>

                  <button
                    data-collapse-toggle="navbar-hamburger"
                    type="button"
                    className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-hamburger"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 17 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 1h15M1 7h15M1 13h15"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
