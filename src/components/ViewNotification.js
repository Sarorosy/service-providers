import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { CircleX } from 'lucide-react';
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
                const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setServiceProviders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setServiceProviders([]);
            }finally{
                setLoading(false)
            }
        };

        fetchServiceProviders();
    }, []);

    // Function to get the username by matching the ID
    const getUsernameById = (userId) => {
        const user = serviceProviders.find((provider) => provider._id === userId._id); // Match based on the user object
        return user ? user.fld_username : 'Unknown User'; // Assuming 'fld_username' is the correct field
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
<h2 className="text-2xl font-bold mb-4">View Notification</h2>
<div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Notification Details</h2>

    <div className="flex flex-wrap -mx-4 mb-6">
        <div className="mb-4 px-4 flex items-center">
            <h3 className="text-lg font-semibold text-gray-700">Title:</h3>
            <p className="text-gray-800 ml-2">{notification.fld_title}</p>
        </div>
        <div className="mb-4 px-4 flex items-center">
            <h3 className="text-lg font-semibold text-gray-700">Due Date:</h3>
            <p className="text-gray-800 ml-2">
                {new Date(notification.fld_due_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
            </p>
        </div>
    </div>

    <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Description:</h3>
        <div className="border border-gray-300 rounded p-4 bg-gray-50">
            <div
                dangerouslySetInnerHTML={{ __html: notification.fld_description }}
                className="text-gray-800"
            />
        </div>
    </div>

    <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Assigned Users: {notification.fld_userid.length}</h3>
        <ul className="list-disc pl-6 flex flex-wrap">
            {notification.fld_userid.map((user) => ( // Map over the user objects
                <li key={user._id} className="flex items-center mb-2 mr-4 border border-gray-300 rounded-full p-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
                    <img
                        src={getProfileImage(user)}
                        alt={getUsernameById(user)}
                        className="w-10 h-10 rounded-full border border-gray-200 mr-2"
                    />
                    <span className="text-gray-800 font-medium">{getUsernameById(user)}</span>
                </li>
            ))}
        </ul>
    </div>
</div>
</>
            )}
            

            <ToastContainer />
        </motion.div>
    );
};

export default ViewNotification;
