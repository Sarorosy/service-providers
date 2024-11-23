import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { CircleX, MapPin, Pin } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { RevolvingDot } from 'react-loader-spinner';

const ViewNotification = ({ onClose, notificationId }) => {
    const [notification, setNotification] = useState(null);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch notification data
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/notifications/${notificationId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch notification');
                }
                const data = await response.json();
                setNotification(data);
            } catch (error) {
                console.error('Error fetching notification:', error);
                toast.error('Failed to load notification.');
            }
        };

        fetchNotification();
    }, [notificationId]);

    // Fetch service providers
    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://serviceprovidersback.onrender.com/api/locations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setServiceProviders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setServiceProviders([]);
            } finally {
                setLoading(false)
            }
        };

        fetchServiceProviders();
    }, []);

    // Function to get the username by matching the ID
    const getLocationnameById = (userId) => {
        const user = serviceProviders.find((provider) => provider._id === userId._id); // Match based on the user object
        return user ? user.name : 'Unknown Location'; // Assuming 'fld_username' is the correct field
    };

    const getProfileImage = (userId) => {
        const user = serviceProviders.find((provider) => provider._id === userId._id);
        if (user && user.fld_profile_image && user.fld_profile_image !== '') {
            return `https://serviceprovidersback.onrender.com/uploads/profileimg/${user.fld_profile_image}`;
        }
        return 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg';
    };



    return (
        <motion.div
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >
            <div className="wen mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                <h2 className="text-xl font-bold">View Notification</h2>
                <button
                    onClick={onClose}
                    className="text-white"
                >
                    <CircleX className='colorr'/>
                </button>
            </div>
            {!notification ? (
                <div className="flex justify-center mt-10">
                    <RevolvingDot
                        visible={true}
                        height="50"
                        width="50"
                        color="#3b82f6" // Tailwind blue-600
                        ariaLabel="revolving-dot-loading"
                    />
                </div>
            ) : (
                <>
                    <div className='db'>
                    <div className=' n-popup-body vw-ntf-pop-h'>
                        <div className="">
                            <h2 className="font-bold mb-3">Notification Details</h2>

                            <div className="flex flex-wrap -mx-4">
                                <div className="mb-4 px-3 flex items-center">
                                    <h4 className="text-sm font-semibold">Title:</h4>
                                    <p className="text-gray-800 text-sm ml-2">{notification.fld_title}</p>
                                </div>
                                <div className="mb-4 px-3 flex items-center">
                                    <h4 className="text-sm font-semibold">Due Date:</h4>
                                    <p className="text-gray-800 text-sm ml-2">
                                        {new Date(notification.fld_due_date).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold mb-2">Description:</h3>
                                <div className="border border-gray-300 rounded qledit">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: notification.fld_description }}
                                        className="text-gray-800 fs"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 fthirteen">
                                <h3 className="text-sm font-semibold mb-4">Assigned Locations: {notification.location.length}</h3>
                                <ul className="list-disc flex flex-wrap">
                                    {notification.location.map((user) => ( // Map over the user objects
                                        <li key={user._id} className="flex items-center mb-2 mr-4 border border-gray-300 rounded-full px-1 py-1 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
                                            <MapPin width={18} height={18} color='#000' className='mr-1'/>
                                            <span className="text-gray-800 font-semibold">{getLocationnameById(user)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                </>
            )}
            </div>


            <ToastContainer />
        </motion.div>
    );
};

export default ViewNotification;
