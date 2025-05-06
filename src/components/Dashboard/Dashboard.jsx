import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import FlaggedPosts from "../FlaggedPosts/FlaggedPosts.jsx";
import AddProduct from "../AddProduct/AddProduct.jsx";
import AllNationalIds from "../AllNationalIds/AllNationalIds.jsx";
import AllProducts from "../AllProducts/AllProducts.jsx";
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("flagged");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const buttonClass = (tabName) =>
    `flex items-center gap-2 p-2 rounded hover:bg-blue-200 ${
      activeTab === tabName ? "bg-white shadow" : ""
    }`;
  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        "https://knowledge-sharing-pied.vercel.app/admin/createAdmin",
        { email, name },
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success("Admin created successfully!");
      setShowModal(false);
      setEmail("");
      setName("");
    } catch (error) {
      toast.error("Failed to create admin. Please check the data.");
    }
  };
  return (
    <div className="flex h-screen bg-gray-50 ">
      {/* Sidebar */}
      <div className="w-64 bg-blue-100 p-4 flex flex-col fixed left-0 top-0 bottom-0">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => setActiveTab("flagged")}
            className={buttonClass("flagged")}
          >
            📌 Flagged Posts
          </button>
          <button
            onClick={() => setActiveTab("allIds")}
            className={buttonClass("allIds")}
          >
            🆔 National IDs
          </button>
          <button
            onClick={() => setActiveTab("allProducts")}
            className={buttonClass("allProducts")}
          >
            🛍️ Products
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-200"
          >
            👤 Add Admin
          </button>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
          }}
          className="text-left p-2 rounded hover:bg-red-100 text-red-600 font-semibold"
        >
          🔁 Logout
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 overflow-y-auto w-full">
        {activeTab === "flagged" && <FlaggedPosts />}
        {activeTab === "allIds" && <AllNationalIds />}
        {activeTab === "allProducts" && <AllProducts />}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Admin</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-lg"
              >
                ✖
              </button>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Messages */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
