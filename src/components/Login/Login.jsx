import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext.jsx';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationEmail, setActivationEmail] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, handleLogin } = useAuth();

  // Get the return URL from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Attempt login directly
        const response = await axios.post(
          'https://knowledge-sharing-pied.vercel.app/user/login',
          values
        );

        if (response.data.success) {
          console.log('Complete login response:', response); // Debug log
          console.log('Login response data:', response.data); // Debug log
          console.log('Login token:', response.data.token); // Debug log

          // Store the token
          localStorage.setItem('token', response.data.token);

          // Use the auth context to handle login with token
          handleLogin(response.data.token);
          toast.success('Login successful!');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error;

        if (errorMessage === 'You have to activate your account first!') {
          setIsActivating(true);
          setActivationEmail(values.email);
          const loadingToast = toast.loading('Waiting for account activation...');

          // Poll for account activation every 5 seconds
          const checkActivation = async () => {
            try {
              const activationCheck = await axios.post(
                'https://knowledge-sharing-pied.vercel.app/user/login',
                values
              );

              if (activationCheck.data.success) {
                toast.dismiss(loadingToast);
                setIsActivated(true);
                localStorage.setItem('token', activationCheck.data.token);
                handleLogin(activationCheck.data.token);
              }
            } catch (checkError) {
              if (checkError.response?.data?.error !== 'You have to activate your account first!') {
                toast.dismiss(loadingToast);
                toast.error('Activation check failed. Please try logging in again.');
                setIsActivating(false);
              }
            }
          };

          // Start polling
          const pollInterval = setInterval(checkActivation, 5000);

          // Stop polling after 5 minutes (300000 ms)
          setTimeout(() => {
            clearInterval(pollInterval);
            if (isActivating) {
              toast.dismiss(loadingToast);
              toast.error('Activation timeout. Please try logging in again.');
              setIsActivating(false);
            }
          }, 300000);
        } else if (errorMessage === 'Invalid email or password') {
          toast.error('Invalid email or password. Please try again.');
        } else if (errorMessage === 'Account is not activated') {
          toast.error('Please activate your account first. Check your email for activation link.');
        } else {
          toast.error(errorMessage || 'Login failed');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleActivationComplete = () => {
    handleLogin(localStorage.getItem('token'));
  };

  if (isActivating) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!isActivated ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Check your email</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We've sent a verification link to {activationEmail}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please click the link in your email to activate your account.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Account Activated!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your account has been successfully activated.
                </p>
                <button
                  onClick={handleActivationComplete}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps('password')}
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
                  <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
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
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
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