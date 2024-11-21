import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import 'select2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const EditNotificationForm = ({ notificationId, onClose, after }) => {
    const [formData, setFormData] = useState({
        fld_title: '',
        fld_description: '',
        fld_due_date: '',
        location: [],
        fld_adminid: "1",
    });

    const [location, setLocation] = useState([]);
    const selectRef = useRef(null);
    const [selectAll, setSelectAll] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);

    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                const response = await fetch('https://serviceprovidersback.onrender.com/api/locations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLocation(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setLocation([]);
            }
        };

        fetchServiceProviders();
    }, []);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/notifications/${notificationId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedDueDate = data.fld_due_date ? data.fld_due_date.split('T')[0] : '';

                // Extract user IDs from the notification's location using _id
                const userIds = data.location.map(user => user._id);

                setFormData({
                    fld_title: data.fld_title,
                    fld_description: data.fld_description,
                    fld_due_date: formattedDueDate,
                    location: userIds,
                    fld_adminid: data.fld_adminid,
                });
            } catch (error) {
                console.error('Error fetching notification:', error);
            }
        };

        fetchNotification();
    }, [notificationId]);

    useEffect(() => {
        if (selectRef.current) {
            $(selectRef.current)
                .select2({
                    placeholder: "Select Location",
                    allowClear: true,
                })
                .val(formData.location) // Set initial selection
                .trigger('change');

            $(selectRef.current).on('change', (e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                setFormData((prevData) => ({
                    ...prevData,
                    location: selectedValues,
                }));
            });
        }

        return () => {
            if (selectRef.current) {
                $(selectRef.current).off('change');
            }
        };
    }, [location, formData.location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuillChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            fld_description: value,
        }));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            $(selectRef.current).val([]).trigger('change');
            setFormData(prevData => ({
                ...prevData,
                location: [],
            }));
        } else {
            const allProviderIds = location.map(provider => provider._id); // Use _id instead of id
            $(selectRef.current).val(allProviderIds).trigger('change');
            setFormData(prevData => ({
                ...prevData,
                location: allProviderIds,
            }));
        }
        setSelectAll(!selectAll);
    };
    const handleRadioChange = (e) => {
        setIsSelectAll(e.target.value === "selectAll");
        if (e.target.value === "selectAll") {
            // If 'Select All' is chosen, select all providers
            setFormData((prevData) => ({
                ...prevData,
                location: location.map(provider => provider._id.toString()),
            }));
            $(selectRef.current).val(location.map(provider => provider._id.toString())).trigger('change');
        } else {
            // If 'Select Specific' is chosen, reset the field
            setFormData((prevData) => ({
                ...prevData,
                location: [],
            }));
            $(selectRef.current).val([]).trigger('change');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/notifications/${notificationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success("Notification updated successfully!");

            onClose();
            after();
        } else {
            toast.error("Error updating notification!");
        }
    };

    const removeProvider = (providerId) => {
        setFormData((prevData) => {
            const updatedUserIds = prevData.location.filter(id => id !== providerId);
            $(selectRef.current).val(updatedUserIds).trigger('change'); // Update Select2
            return {
                ...prevData,
                location: updatedUserIds,
            };
        });
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
                    <h2 className="text-2xl font-bold mb-3 text-center">Edit Notification</h2>
                    <button
                        onClick={onClose}
                        className="text-white py-2 px-2 rounded-full"
                    >
                        <CircleX className='colorr' />
                    </button>
                </div>
                <div className='db'>
                    <div className=' n-popup-body'>
                        <form onSubmit={handleSubmit} className=''>
                            <div className='mx-auto bg-white p-6 rounded-lg '>
                                <div className='flex w-full justify-center'>
                                    <div className="mb-4 w-1/2 mx-1">
                                        <label className="block text-sm font-semibold mb-1" htmlFor="title">Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="fld_title"
                                            value={formData.fld_title}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded p-2 w-full form-control-sm"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4 w-1/2 mx-1">
                                        <label className="block text-sm font-semibold mb-1" htmlFor="dueDate">Due Date</label>
                                        <input
                                            type="date"
                                            id="dueDate"
                                            name="fld_due_date"
                                            value={formData.fld_due_date}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded p-2 w-full form-control-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4 fs">
                                    <label className="block text-sm font-semibold mb-1" htmlFor="description">Description</label>
                                    <ReactQuill
                                        value={formData.fld_description}
                                        onChange={handleQuillChange}
                                        theme="snow"
                                        className="w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-3 flex items-center justify-around">
                                    <label className="inline-flex items-center mr-6">
                                        <input
                                            type="radio"
                                            name="selectProvider"
                                            value="selectAll"
                                            checked={isSelectAll}
                                            onChange={handleRadioChange}
                                            className="form-radio"
                                        />
                                        <span className="ml-2 font-semibold text-sm">Select All Locations</span>
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <input
                                            type="radio"
                                            name="selectProvider"
                                            value="selectSpecific"
                                            checked={!isSelectAll}
                                            onChange={handleRadioChange}
                                            className="form-radio"
                                        />
                                        <span className="ml-2 font-semibold text-sm">Select Specific</span>
                                    </label>

                                </div>
                                <div className="mb-4 mt-3" style={{ display: isSelectAll ? 'none' : 'block' }}>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="serviceProvider">Select Service Provider</label>
                                    <select
                                        id="serviceProvider"
                                        name="location"
                                        multiple
                                        ref={selectRef}
                                        className="border border-gray-300 rounded p-2 w-full form-control-sm"
                                        required
                                    >
                                        {location.map((provider) => (
                                            <option key={provider._id} value={provider._id}> {/* Use _id instead of id */}
                                                {provider.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {formData.location.length > 0 && (
                                    <div className="mb-4 max-w-5xl mx-auto fthirteen">
                                        <label className="text-sm font-medium my-2 font-semibold">Selected Locations</label>
                                        <div className="flex flex-wrap mb-2 p-2 bg-gray-50 rounded-xl shadow-md">
                                            {formData.location.map((providerId) => {
                                                const provider = location.find(p => p._id === providerId); // Use _id for matching
                                                return (
                                                    provider ? (
                                                        <motion.div
                                                            key={provider._id}
                                                            initial={{ opacity: 1 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="flex items-center bg-white border border-gray-300 mb-2 mb-2 rounded-full py-1 px-1 mx-1 shadow-sm"
                                                        >

                                                            <span className="font-semibold">{provider.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProvider(provider._id)} // Use _id for removal
                                                                className="ml-2 text-red-500 hover:text-red-700"
                                                            >
                                                                <CircleX width="15" height="15" />
                                                            </button>
                                                        </motion.div>
                                                    ) : null
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end but">
                                    <button
                                        type="submit"
                                        className="text-white py-1 px-1 rounded hover:bg-blue-500 flex items-center text-sm"
                                    >
                                        <Save className="mr-1 ic" />
                                        Update Notification
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </motion.div>
    );
};

export default EditNotificationForm;
