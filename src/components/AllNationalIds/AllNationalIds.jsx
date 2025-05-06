import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AllNationalIds() {
  const [nationalIds, setNationalIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      setError("No token provided. Please log in.");
      setLoading(false);
      return;
    }
    axios
      .get("https://knowledge-sharing-pied.vercel.app/admin/AllNationalIds", {
        headers: { token },
      })
      .then((res) => {
        setNationalIds(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching national IDs:", err);
        setError("Failed to fetch national IDs");
        setLoading(false);
      });
  }, [token]);

  const handleVerify = async (userId, doctorName) => {
    setLoadingVerify(userId);
    try {
      const res = await axios.put(
        `https://knowledge-sharing-pied.vercel.app/admin/verifyDoctor/${userId}`,
        {},
        { headers: { token } }
      );

      // Update the verified status in state
      setNationalIds((prev) =>
        prev.map((item) =>
          item._id === userId ? { ...item, isVerified: true } : item
        )
      );

      toast.success(`Doctor "${doctorName}" has been successfully verified.`);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to verify doctor.";
      toast.error(errorMsg);
    } finally {
      setLoadingVerify(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots height="80" width="80" color="#000" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">National IDs</h2>
      {nationalIds.length === 0 ? (
        <p>No national IDs available.</p>
      ) : (
        <ul>
          {nationalIds.map((item, index) => (
            <li key={item._id} className="mb-4">
              <div className="flex items-center space-x-4 p-10 border-b justify-between">
                <img
                  src={item.nationalID.url}
                  alt={`National ID ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-md"
                  loading="lazy"
                />

                <div className="flex-1">
                  <p className="font-semibold">Name: {item.name}</p>
                  <p>Email: {item.email}</p>
                </div>

                <button
                  onClick={() => handleVerify(item._id, item.name)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loadingVerify === item._id}
                >
                  {loadingVerify === item._id
                    ? "Verifying..."
                    : "Verify as a doctor"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
