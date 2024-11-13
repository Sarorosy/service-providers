import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import 'select2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const EditNotificationForm = ({ notificationId, onClose }) => {
    const [formData, setFormData] = useState({
        fld_title: '',
        fld_description: '',
        fld_due_date: '',
        fld_userid: [],
        fld_adminid: "1",
    });

    const [serviceProviders, setServiceProviders] = useState([]);
    const selectRef = useRef(null);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                const response = await fetch('https://serviceprovidersback.onrender.com/api/users/activeserviceproviders');
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
        const fetchNotification = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/notifications/${notificationId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedDueDate = data.fld_due_date ? data.fld_due_date.split('T')[0] : '';

                // Extract user IDs from the notification's fld_userid using _id
                const userIds = data.fld_userid.map(user => user._id);

                setFormData({
                    fld_title: data.fld_title,
                    fld_description: data.fld_description,
                    fld_due_date: formattedDueDate,
                    fld_userid: userIds,
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
                    placeholder: "Select providers",
                    allowClear: true,
                })
                .val(formData.fld_userid) // Set initial selection
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
        } else {
            toast.error("Error updating notification!");
        }
    };

    const removeProvider = (providerId) => {
        setFormData((prevData) => {
            const updatedUserIds = prevData.fld_userid.filter(id => id !== providerId);
            $(selectRef.current).val(updatedUserIds).trigger('change'); // Update Select2
            return {
                ...prevData,
                fld_userid: updatedUserIds,
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
                        <CircleX className='colorr'/>
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
                            <div className="mb-4 mt-3">
                                <label className="block text-sm font-semibold mb-1" htmlFor="serviceProvider">Select Service Provider</label>
                                <select
                                    id="serviceProvider"
                                    name="fld_userid"
                                    multiple
                                    ref={selectRef}
                                    className="border border-gray-300 rounded p-2 w-full form-control-sm"
                                    required
                                >
                                    {serviceProviders.map((provider) => (
                                        <option key={provider._id} value={provider._id}> {/* Use _id instead of id */}
                                            {provider.fld_username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.fld_userid.length > 0 && (
                                <div className="mb-4 max-w-5xl mx-auto fthirteen">
                                    <label className="text-sm font-medium my-2 font-semibold">Selected Service Providers</label>
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
                                                        className="flex items-center bg-white border border-gray-300 mb-2 mb-2 rounded-full py-1 px-1 mx-1 shadow-sm"
                                                    >
                                                        <img
                                                            src={provider.fld_profile_image && provider.fld_profile_image !== ""
                                                                ? 'https://serviceprovidersback.onrender.com/uploads/profileimg/' + provider.fld_profile_image
                                                                : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"}
                                                            alt={provider.fld_username || 'No Name'}
                                                            className="w-8 h-8 rounded-full border border-gray-200 mr-2"
                                                        />
                                                        <span className="font-semibold">{provider.fld_username}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProvider(provider._id)} // Use _id for removal
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            <CircleX width="15" height="15"/>
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
