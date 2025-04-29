import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationEmail, setActivationEmail] = useState("");
  const [isActivated, setIsActivated] = useState(false);
  const [activationFailed, setActivationFailed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, login } = useAuth();

  // Get the return URL from location state or default to home
  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleActivationComplete = async () => {
    try {
      // Get the stored credentials from localStorage
      const storedCredentials = localStorage.getItem("tempCredentials");
      if (storedCredentials) {
        const { email, password } = JSON.parse(storedCredentials);

        // Attempt to login with stored credentials
        const response = await axios.post(
          "https://knowledge-sharing-pied.vercel.app/user/login",
          { email, password }
        );

        if (response.data.success) {
          // Update auth context with token and user data from API
          await login(email, password, response.data.token, response.data.user);

          // Redirect to home page
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      toast.error("Please login manually");
      navigate("/login");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Attempt login directly
        const response = await axios.post(
          "https://knowledge-sharing-pied.vercel.app/user/login",
          values
        );

        if (response.data.success) {
          // Update auth context with token and user data from API
          await login(
            values.email,
            values.password,
            response.data.token,
            response.data.user
          );
          navigate(from);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error;

        if (errorMessage === "You have to activate your account first!") {
          setIsActivating(true);
          setActivationEmail(values.email);
          setActivationFailed(false);
          setIsActivated(false);

          // Poll for account activation every 10 seconds
          const checkActivation = async () => {
            try {
              const activationCheck = await axios.post(
                "https://knowledge-sharing-pied.vercel.app/user/login",
                values
              );

              if (activationCheck.data.success) {
                clearInterval(pollInterval);
                setIsActivated(true);
                setActivationFailed(false);

                // Update auth context with token and user data from API
                await login(
                  values.email,
                  values.password,
                  activationCheck.data.token,
                  activationCheck.data.user
                );

                // Redirect to home page
                navigate("/");
                return;
              }
            } catch (checkError) {
              if (
                checkError.response?.data?.error !==
                "You have to activate your account first!"
              ) {
                clearInterval(pollInterval);
                setIsActivating(false);
                setActivationFailed(true);
              }
            }
          };

          // Start polling
          const pollInterval = setInterval(checkActivation, 10000); // Poll every 10 seconds

          // Stop polling after 5 minutes
          setTimeout(() => {
            clearInterval(pollInterval);
            if (isActivating && !isActivated) {
              setActivationFailed(true);
            }
          }, 300000); // 5 minutes timeout
        } else if (errorMessage === "Invalid email or password") {
          toast.error("Invalid email or password. Please try again.");
        } else if (errorMessage === "Account is not activated") {
          toast.error("Please check your email to verify your account first.");
        } else {
          toast.error(errorMessage || "Login failed");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  if (isActivating) {
    return (
      <div className="min-h-screen bg-[#E3ECE7 flex flex-col justify-center py-10 sm:px-6 lg:px-8 ]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!isActivated ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Check your email
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  We've sent a verification link to {activationEmail}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please click the link in your email to activate your account.
                </p>
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Waiting for activation...
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Account Activated!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your account has been successfully activated.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Home Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3ECE7 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forget-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
