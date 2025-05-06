import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function AdminForgetPasssword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://knowledge-sharing-pied.vercel.app/admin/forgetPassword",
        { email }
      );
      toast.success("Reset code sent to your email");
      setTimeout(() => {
        navigate("/admin/resetPassword");
      }, 500);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forget Password
        </h2>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email :
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md transition text-white ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
}
