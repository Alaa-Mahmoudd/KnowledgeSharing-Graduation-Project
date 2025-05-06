import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://knowledge-sharing-pied.vercel.app/admin/login",
        { email, password }
      );
      localStorage.setItem("adminToken", "noteApp__" + res.data.token);
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3/4 transform -translate-y-1/2 cursor-pointer text-gray-500 text-xl"
          >
            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
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
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-7">
          <Link
            to="/admin/forgetPassword"
            className="font-semibold p-2 text-blue-700"
          >
            Forget Your Password ?
          </Link>
        </p>
      </form>
    </div>
  );
}
