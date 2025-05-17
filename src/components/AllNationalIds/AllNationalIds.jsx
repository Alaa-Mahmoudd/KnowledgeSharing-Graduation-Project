import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdmin } from "../../Context/AdminContext.jsx";

export default function AllNationalIds() {
  const [nationalIds, setNationalIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(null);
  const { admin } = useAdmin(); // Get admin data from context
  const token = admin?.token; // Use token from context instead of localStorage

  useEffect(() => {
    if (!token) {
      setError("No token provided. Please log in.");
      setLoading(false);
      return;
    }

    const fetchNationalIds = async () => {
      try {
        const res = await axios.get(
          "https://knowledge-sharing-pied.vercel.app/admin/AllNationalIds",
          { headers: { token } }
        );
        setNationalIds(res.data.data);
      } catch (err) {
        console.error("Error fetching national IDs:", err);
        setError(err.response?.data?.message || "Failed to fetch national IDs");
      } finally {
        setLoading(false);
      }
    };

    fetchNationalIds();
  }, [token]);

  const handleVerify = async (userId, doctorName) => {
    setLoadingVerify(userId);
    try {
      await axios.put(
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">National IDs Verification</h2>
      {nationalIds.length === 0 ? (
        <p className="text-gray-500">No national IDs available for verification.</p>
      ) : (
        <div className="space-y-4">
          {nationalIds.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <img
                  src={item.nationalID.url}
                  alt={`National ID of ${item.name}`}
                  className="w-full md:w-48 h-48 object-contain rounded-md border"
                  loading="lazy"
                />

                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-lg">Name: {item.name}</p>
                  <p className="text-gray-600">Email: {item.email}</p>
                  <p className="text-gray-600">
                    Status: {item.isVerified ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-yellow-500">Pending Verification</span>
                    )}
                  </p>
                </div>

                {!item.isVerified && (
                  <button
                    onClick={() => handleVerify(item._id, item.name)}
                    disabled={loadingVerify === item._id}
                    className={`px-4 py-2 rounded-md text-white ${loadingVerify === item._id
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      } transition-colors`}
                  >
                    {loadingVerify === item._id ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Verifying...
                      </span>
                    ) : (
                      "Verify as Doctor"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}