import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { CircleX, MapPin } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { RevolvingDot } from 'react-loader-spinner';

const ViewHoliday = ({ onClose, holidayId }) => {
    const [holiday, setHoliday] = useState(null);
    const [locations, setLocations] = useState([]);

    // Fetch holiday data
    useEffect(() => {
        const fetchHoliday = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/holidays/${holidayId}`);
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
        const fetchlocations = async () => {
            try {
                const response = await fetch('https://serviceprovidersback.onrender.com/api/locations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLocations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setLocations([]);
            }
        };

        fetchlocations();
    }, []);

    // Function to get the locationname by matching the ID
    const getlocationnameById = (locationId) => {
        const location = locations.find((provider) => provider._id === locationId);
        return location ? location.name : 'Unknown Location';
    };




    return (
        <motion.div
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >
            <div className="wen2 mx-auto bg-white p-6 rounded-lg shadow-md">
                {!holiday ? (<div className="bg-white p-6 rounded shadow-lg text-center flex items-center justify-center">
                    <RevolvingDot
                        height={24}
                        // width="80"
                        // radius="9"
                        color="#007bff"
                        secondaryColor="#007bff"
                        ariaLabel="revolving-dot-loading"
                    />
                </div>) : (<>
                    <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                        <h2 className="text-2xl font-bold text-center">View Holiday</h2>
                        <button
                            onClick={onClose}
                            className="text-white py-2 px-2 rounded-full"
                        >
                            <CircleX className='colorr' />
                        </button>
                    </div>
                    <div className='db'>

                        <div className="n-popup-body n-vw-hlyd-pop-h">
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
                                    Assigned Locations:
                                    <span className="text-gray-600"> ({holiday.location.length})</span>
                                </h3>
                                <ul className="list-disc flex flex-wrap">
                                    {holiday.location.map((locationId) => (
                                        <li key={locationId} className="flex items-center mb-2 mr-4 border border-gray-300 rounded-full py-1 px-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
                                            <MapPin width={18} height={18} color='#000' className='mr-1' />
                                            <span className="text-gray-800 font-semibold">{getlocationnameById(locationId)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </>)}
            </div>

            <ToastContainer />
        </motion.div>
    );
};

export default ViewHoliday;
