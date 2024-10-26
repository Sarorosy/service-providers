import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import 'select2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { RevolvingDot } from 'react-loader-spinner';

const EditHolidayForm = ({ holidayId, onClose }) => {
    const [formData, setFormData] = useState({
        fld_title: '',
        fld_holiday_date: '',
        fld_userid: [], // Keep this for selected user IDs (now using _id)
        fld_adminid: "1",
    });

    const [serviceProviders, setServiceProviders] = useState([]);
    const selectRef = useRef(null);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders');
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

    useEffect(() => {
        const fetchHoliday = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/holidays/${holidayId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFormData({
                    ...data,
                    fld_holiday_date: data.fld_holiday_date.split('T')[0], // Format date
                });
            } catch (error) {
                console.error('Error fetching holiday:', error);
            }finally{
                setLoading(false)
            }
        };

        fetchHoliday();
    }, [holidayId]);

    useEffect(() => {
        if (selectRef.current) {
            $(selectRef.current)
                .select2({
                    placeholder: "Select providers",
                    allowClear: true,
                })
                .val(formData.fld_userid)
                .trigger('change');

            $(selectRef.current).on('change', (e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                setFormData((prevData) => ({
                    ...prevData,
                    fld_userid: selectedValues,
                }));
            });
        }

        return () => {
            if (selectRef.current) {
                $(selectRef.current).off('change');
            }
        };
    }, [serviceProviders, formData.fld_userid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            $(selectRef.current).val([]).trigger('change');
            setFormData(prevData => ({
                ...prevData,
                fld_userid: [],
            }));
        } else {
            const allProviderIds = serviceProviders.map(provider => provider._id); // Use _id instead of id
            $(selectRef.current).val(allProviderIds).trigger('change');
            setFormData(prevData => ({
                ...prevData,
                fld_userid: allProviderIds,
            }));
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/holidays/${holidayId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success("Holiday updated successfully!");
            onClose();
        } else {
            toast.error("Error updating holiday!");
        }
    };

    const removeProvider = (providerId) => {
        setFormData((prevData) => {
            const updatedUserIds = prevData.fld_userid.filter(id => id !== providerId);
            $(selectRef.current).val(updatedUserIds).trigger('change');
            return {
                ...prevData,
                fld_userid: updatedUserIds,
            };
        });
    };

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
                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-2 rounded-full"
            >
                <CircleX />
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Holiday</h2>
            {(loading) ? (
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
                <form onSubmit={handleSubmit} className='max-w-5xl mx-auto mt-2'>
                <div className='flex w-full justify-center'>
                    <div className="mb-4 w-1/2 mx-1">
                        <label className="block text-sm font-semibold mb-1" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="fld_title"
                            value={formData.fld_title}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4 w-1/2 mx-1">
                        <label className="block text-sm font-semibold mb-1" htmlFor="holidayDate">Holiday Date</label>
                        <input
                            type="date"
                            id="holidayDate"
                            name="fld_holiday_date"
                            value={formData.fld_holiday_date}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="mr-2"
                    />
                    <label htmlFor="selectAll" className="text-sm font-semibold">Select All Service Providers</label>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1" htmlFor="serviceProvider">
                        Select Service Provider
                    </label>
                    <select
                        id="serviceProvider"
                        name="fld_userid"
                        multiple
                        ref={selectRef}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    >
                        {serviceProviders.map((provider) => (
                            <option key={provider._id} value={provider._id}> {/* Use _id here */}
                                {provider.fld_name}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.fld_userid.length > 0 && (
                    <div className="mb-4 max-w-5xl mx-auto">
                        <label className="text-sm font-medium my-3">Selected Service Providers</label>
                        <div className="flex flex-wrap mb-2 p-2 bg-gray-50 rounded-xl shadow-md">
                            {formData.fld_userid.map((providerId) => {
                                const provider = serviceProviders.find(p => p._id === providerId); // Use _id for matching
                                return (
                                    provider ? (
                                        <motion.div
                                            key={provider._id}
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-center mr-2 mb-2 px-2 py-1 border border-gray-300 rounded-full"
                                        >
                                            <img 
                          src={provider.fld_profile_image && provider.fld_profile_image !== "" 
                            ? 'https://serviceprovidersback.onrender.com/uploads/profileimg/' + provider.fld_profile_image 
                            : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"} 
                          alt={provider.fld_username || 'No Name'}
                          className="w-10 h-10 rounded-full border border-gray-200"
                        />
                                            <span>{provider.fld_name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeProvider(provider._id)} // Use _id when removing
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <CircleX size={18} />
                                            </button>
                                        </motion.div>
                                    ) : null
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded flex items-center"
                    >
                        <Save className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </form>
            )}
            <ToastContainer />
        </motion.div>
    );
};

export default EditHolidayForm;
