import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
export default function Navbar() {
  return (
    <div>
      <nav className="border-b">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <span className=" text-lg font-bold text-black ">
            Accessible Health Hub
          </span>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  ">
              <NavLink
                to={"/"}
                className="text-md text-black font-normal hover:text-[#7A9EB8]"
              >
                Home
              </NavLink>
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
              <NavLink
                to={"/knowledgeCorner"}
                className="text-md text-black font-normal hover:text-[#7A9EB8]"
              >
                Post
              </NavLink>

              <NavLink
                to={"/profile"}
                className="text-md text-black font-normal hover:text-[#7A9EB8]"
              >
                Profile
              </NavLink>
              <NavLink
                to={"/dashboard"}
                className="text-md text-black font-normal hover:text-[#7A9EB8]"
              >
                Dashboard
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
