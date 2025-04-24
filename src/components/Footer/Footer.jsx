import React from "react";

export default function Footer() {
  return (
    <div className="bg-[#E3ECE7] border-t">
      <footer className=" m-4 ">
        <div className="w-full mx-auto p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-[#5F85A3] sm:text-center font-bold ">
            © 2025 Accessible Health Hub . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 text-[#5F85A3]"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 text-[#5F85A3]"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 text-[#5F85A3]"
              >
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline text-[#5F85A3]">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
