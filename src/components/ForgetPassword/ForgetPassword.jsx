import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [forgetCode, setForgetCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post(
          'https://knowledge-sharing-pied.vercel.app/user/forgetPassword',
          values
        );

        if (response.data.success) {
          setForgetCode(response.data.forgetCode);
          setShowCodeDialog(true);
          toast.success('Reset code sent successfully!');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to process request');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      const response = await axios.post(
        'https://knowledge-sharing-pied.vercel.app/user/forgetPassword',
        { email: formik.values.email }
      );

      if (response.data.success) {
        setForgetCode(response.data.forgetCode);
        toast.success('New reset code sent successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (enteredCode === forgetCode) {
      // Store the data in sessionStorage before navigation
      sessionStorage.setItem('resetPasswordData', JSON.stringify({
        email: formik.values.email,
        forgetCode: forgetCode
      }));
      setShowCodeDialog(false);
      navigate('/reset-password');
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>
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
                    autoComplete="email"
                    {...formik.getFieldProps('email')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={showCodeDialog} onClose={() => setShowCodeDialog(false)}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Reset Code</h3>
          <p className="text-sm text-gray-500 mb-4">
            Please enter the code sent to your email.
          </p>
          <input
            type="text"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
            placeholder="Enter code"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {resendLoading ? 'Resending...' : 'Resend Code'}
            </button>
            <button
              onClick={() => setShowCodeDialog(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyCode}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ForgetPassword; 