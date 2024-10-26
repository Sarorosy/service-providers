import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Briefcase, Landmark, Image } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';



const ViewServiceProvider = ({ serviceProviderId, onClose }) => {
    const { id } = useParams(); // Get the service provider ID from URL params
    const [serviceProvider, setServiceProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceProvider = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/users/${serviceProviderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch User');
                }
                const data = await response.json();
                setServiceProvider(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching service provider:', error);
                setError('Failed to load service provider details.');
                setLoading(false);
            }
        };

        fetchServiceProvider();
    }, [id, serviceProviderId]);

    if (loading) {
        return <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-blue-100 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
        >
            <RevolvingDot
                visible={true}
                height="50"
                width="50"
                color="#3b82f6" // Tailwind blue-600
                ariaLabel="revolving-dot-loading"
            />
        </motion.div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const imageUrl = (type, fileName) => {
        return fileName && fileName !== ''
            ? `https://serviceprovidersback.onrender.com/uploads/${type}/${fileName}`
            : null;
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-blue-100 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-2 rounded-full"
            >
                <CircleX />
            </button>
            <h2 className="text-2xl font-bold mb-4">Service Provider Details</h2>
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information Section */}
                    <div className="p-6 shadow-lg rounded-lg bg-white transition-transform transform hover:border hover:border-blue-300">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Personal Info */}
                            Personal Information
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Username:</strong>
                                <span className="text-left">{serviceProvider.fld_username}</span>
                            </p>
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Name:</strong>
                                <span className="text-left">{serviceProvider.fld_name}</span>
                            </p>
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Email:</strong>
                                <span className="text-left">{serviceProvider.fld_email}</span>
                            </p>
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Contact No.:</strong>
                                <span className="text-left">{serviceProvider.fld_phone}</span>
                            </p>
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Password:</strong>
                                <span className="text-left">{serviceProvider.fld_decrypt_password}</span>
                            </p>
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Address:</strong>
                                <span className="text-left">{serviceProvider.fld_address}</span>
                            </p>
                            <p className="text-gray-800 flex justify-between text-left">
                                <strong>Gender:</strong>
                                <span className="text-left">{serviceProvider.fld_gender}</span>
                            </p>
                        </div>

                    </div>

                    {/* Work Profile Section */}
                    <div className="p-6 shadow-lg rounded-lg bg-white transition-transform transform hover:border hover:border-blue-300">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Work Profile */}
                            Work Profile
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <p className="text-gray-800 flex justify-between text-left"><strong>Work Profile:</strong> {serviceProvider.fld_designation}</p>
                            <p className="text-gray-800 flex justify-between text-left"><strong>Aadhar No.:</strong> {serviceProvider.fld_aadhar}</p>
                            <p className="text-gray-800 flex justify-between text-left"><strong>Start Date:</strong> {new Date(serviceProvider.fld_start_date).toLocaleDateString()}</p>
                            <p className="text-gray-800 flex justify-between text-left"><strong>End Date:</strong> {new Date(serviceProvider.fld_end_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="p-6 shadow-lg rounded-lg bg-white transition-transform transform hover:border hover:border-blue-300">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <Landmark className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Bank Details */}
                            Bank Details
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <p className="text-gray-800 flex justify-between text-left"><strong>Bank Name:</strong> {serviceProvider.fld_bankname}</p>
                            <p className="text-gray-800 flex justify-between text-left"><strong>Account No.:</strong> {serviceProvider.fld_accountno}</p>
                            <p className="text-gray-800 flex justify-between text-left"><strong>Branch:</strong> {serviceProvider.fld_branch}</p>
                            <p className="text-gray-800 flex justify-between text-left"><strong>IFSC Code:</strong> {serviceProvider.fld_ifsc}</p>
                        </div>
                    </div>

                    {/* Profile Image Section */}
                    <div className="p-6 shadow-lg rounded-lg bg-white transition-transform transform hover:border hover:border-blue-300">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <Image className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Profile Image */}
                            Profile Image
                        </h3>
                        <img
                            src={
                                serviceProvider.fld_profile_image && serviceProvider.fld_profile_image.trim() !== ""
                                    ? `https://serviceprovidersback.onrender.com/uploads/profileimg/${serviceProvider.fld_profile_image}`
                                    : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
                            }
                            alt="Profile"
                            className="w-1/3 h-auto object-cover rounded-lg shadow-md"
                        />

                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {serviceProvider.fld_aadharcard && (
                        <div className="p-4 shadow rounded-lg bg-gray-50 hover:border hover:border-blue-300">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Aadhar Card</h3>
                            <img
                                src={`https://serviceprovidersback.onrender.com/uploads/aadharcard/${serviceProvider.fld_aadharcard}`}
                                alt="Aadhar Card"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}
                    {serviceProvider.fld_pancard && (
                        <div className="p-4 shadow rounded-lg bg-gray-50 hover:border hover:border-blue-300">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">PAN Card</h3>
                            <img
                                src={`https://serviceprovidersback.onrender.com/uploads/pancard/${serviceProvider.fld_pancard}`}
                                alt="PAN Card"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}
                    {serviceProvider.fld_cancelledchequeimage && (
                        <div className="p-4 shadow rounded-lg bg-gray-50 hover:border hover:border-blue-300">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Cancelled Cheque</h3>
                            <img
                                src={`https://serviceprovidersback.onrender.com/uploads/cancelledchequeimage/${serviceProvider.fld_cancelledchequeimage}`}
                                alt="Cancelled Cheque"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </motion.div>
    );
};

export default ViewServiceProvider;
