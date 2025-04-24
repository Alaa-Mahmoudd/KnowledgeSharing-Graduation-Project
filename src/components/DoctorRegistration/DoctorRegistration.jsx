import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const DoctorRegistration = ({ userData, onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        nationalId: Yup.string()
            .required('National ID is required')
            .matches(/^\d{10}$/, 'National ID must be 10 digits'),
        specialization: Yup.string()
            .required('Specialization is required'),
        licenseNumber: Yup.string()
            .required('License number is required'),
        yearsOfExperience: Yup.number()
            .required('Years of experience is required')
            .min(0, 'Years of experience cannot be negative')
            .max(50, 'Years of experience seems too high'),
        hospital: Yup.string()
            .required('Hospital name is required'),
        phoneNumber: Yup.string()
            .required('Phone number is required')
            .matches(/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number'),
        address: Yup.string()
            .required('Address is required'),
    });

    const formik = useFormik({
        initialValues: {
            nationalId: '',
            specialization: '',
            licenseNumber: '',
            yearsOfExperience: '',
            hospital: '',
            phoneNumber: '',
            address: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const formData = new FormData();

                // Add all doctor-specific fields
                Object.keys(values).forEach(key => {
                    formData.append(key, values[key]);
                });

                // Add the user data from previous registration
                Object.keys(userData).forEach(key => {
                    if (key !== 'profileImage' || userData[key]) {
                        formData.append(key, userData[key]);
                    }
                });

                const response = await axios.post(
                    'https://knowledge-sharing-pied.vercel.app/doctor/register',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.data.success) {
                    toast.success('Doctor registration successful! Please check your email to activate your account.');
                    navigate('/login');
                }
            } catch (error) {
                toast.error(error.response?.data?.error || 'Registration failed');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Complete Doctor Registration
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                                National ID
                            </label>
                            <div className="mt-1">
                                <input
                                    id="nationalId"
                                    name="nationalId"
                                    type="text"
                                    {...formik.getFieldProps('nationalId')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.nationalId && formik.errors.nationalId && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.nationalId}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                                Specialization
                            </label>
                            <div className="mt-1">
                                <input
                                    id="specialization"
                                    name="specialization"
                                    type="text"
                                    {...formik.getFieldProps('specialization')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.specialization && formik.errors.specialization && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.specialization}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                                License Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    type="text"
                                    {...formik.getFieldProps('licenseNumber')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.licenseNumber}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                                Years of Experience
                            </label>
                            <div className="mt-1">
                                <input
                                    id="yearsOfExperience"
                                    name="yearsOfExperience"
                                    type="number"
                                    {...formik.getFieldProps('yearsOfExperience')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.yearsOfExperience && formik.errors.yearsOfExperience && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.yearsOfExperience}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                                Hospital
                            </label>
                            <div className="mt-1">
                                <input
                                    id="hospital"
                                    name="hospital"
                                    type="text"
                                    {...formik.getFieldProps('hospital')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.hospital && formik.errors.hospital && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.hospital}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    {...formik.getFieldProps('phoneNumber')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    {...formik.getFieldProps('address')}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {formik.touched.address && formik.errors.address && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.address}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorRegistration; 