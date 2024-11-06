import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { CircleX } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const ViewHoliday = ({ onClose, holidayId }) => {
    const [holiday, setHoliday] = useState(null);
    const [serviceProviders, setServiceProviders] = useState([]);

    // Fetch holiday data
    useEffect(() => {
        const fetchHoliday = async () => {
            try {
                const response = await fetch(`https://service-providers-panel.vercel.app/api/holidays/${holidayId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch holiday');
                }
                const data = await response.json();
                setHoliday(data);
            } catch (error) {
                console.error('Error fetching holiday:', error);
                toast.error('Failed to load holiday.');
            }
        };

        fetchHoliday();
    }, [holidayId]);

    // Fetch service providers
    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                const response = await fetch('https://service-providers-panel.vercel.app/api/users/serviceproviders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setServiceProviders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setServiceProviders([]);
            }
        };

        fetchServiceProviders();
    }, []);

    // Function to get the username by matching the ID
    const getUsernameById = (userId) => {
        const user = serviceProviders.find((provider) => provider._id === userId);
        return user ? user.fld_username : 'Unknown User';
    };

    const getProfileImage = (userId) => {
        const user = serviceProviders.find((provider) => provider._id === userId);
        if (user && user.fld_profile_image) {
            return `https://service-providers-panel.vercel.app/uploads/profileimg/${user.fld_profile_image}`;
        }
        return 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg';
    };

    if (!holiday) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl">Loading...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-sky-50 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white py-2 px-2 rounded-full"
            >
                <CircleX className='colorr'/>
            </button>
            <div className='db'>
                <h2 className="text-2xl font-bold mb-3 text-center">View Holiday</h2>
                <div className="wen mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-md font-bold mb-3">Holiday Details</h2>

                    <div className="flex flex-wrap -mx-4 mb-2">
                        <div className="mb-4 px-3 flex items-center">
                            <h4 className="text-sm font-semibold">Title:</h4>
                            <p className="text-gray-800 text-sm ml-2">{holiday.fld_title}</p>
                        </div>
                        <div className="mb-4 px-3 flex items-center">
                            <h4 className="text-sm font-semibold">Holiday Date:</h4>
                            <p className="text-gray-800 text-sm ml-2">
                                {new Date(holiday.fld_holiday_date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="fthirteen">
                        <h3 className="text-md font-semibold mb-3">
                            Assigned Users:
                            <span className="text-gray-600"> ({holiday.fld_userid.length})</span>
                        </h3>
                        <ul className="list-disc flex flex-wrap">
                            {holiday.fld_userid.map((userId) => (
                                <li key={userId} className="flex items-center mb-2 mr-4 border border-gray-300 rounded-full py-1 px-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
                                    <img
                                        src={getProfileImage(userId)}
                                        alt={getUsernameById(userId)}
                                        className="w-8 h-8 rounded-full border border-gray-200 mr-2"
                                    />
                                    <span className="text-gray-800 font-semibold">{getUsernameById(userId)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div></div>

            <ToastContainer />
        </motion.div>
    );
};

export default ViewHoliday;
