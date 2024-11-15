import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const AddUserServiceCharge = ({ onClose, serviceProviderId }) => {
    const [formData, setFormData] = useState({
        fld_service_provider_id: serviceProviderId,
        fld_from_date: '',
        fld_to_date: '',
        fld_service_charge: ''
    });
    const [loading, setLoading] = useState(false);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const fetchServiceProviders = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders');
            const data = await response.json();
            setServiceProviders(data);
            const matchedProvider = data.find(provider => provider._id === serviceProviderId);
            setSelectedProvider(matchedProvider);
        } catch (error) {
            console.error('Error fetching service providers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceProviders();
    }, [serviceProviderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.fld_service_charge > 100000) {
                toast.error("Value must be less than or equal to 100000");
                return; 
            }
            const response = await fetch('https://serviceprovidersback.onrender.com/api/servicecharge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Service charge added successfully!');
                resetForm();
            } else {
                toast.error('Error adding service charge!');
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const resetForm = () => {
        setFormData({
            fld_service_provider_id: serviceProviderId,
            fld_from_date: '',
            fld_to_date: '',
            fld_service_charge: ''
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
        <div className="wen3 mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                <h2 className="text-2xl font-bold">Add Service Charge</h2>
                <button
                    onClick={onClose}
                    className=" "
                >
                    <CircleX />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="">
                {loading ? (
                    <RevolvingDot height="20" width="20" color="blue" ariaLabel="loading" />
                ) : selectedProvider ? (
                    <div className="mb-4 text-gray-700">
                        <label>Service Provider</label>
                        <div className="flex items-center p-2 border border-gray-300 rounded bg-gray-100">
                            <img
                                src={
                                    selectedProvider.fld_profile_image && selectedProvider.fld_profile_image.trim() !== ""
                                        ? `https://serviceprovidersback.onrender.com/uploads/profileimg/${selectedProvider.fld_profile_image}`
                                        : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
                                }
                                alt="Profile"
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <span>{selectedProvider.fld_name}</span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 text-gray-700">No matching provider found.</div>
                )}

                <div className="mb-4">
                    <label htmlFor="fromDate" className="block text-gray-700">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        name="fld_from_date"
                        value={formData.fld_from_date}
                        onChange={(e) => {
                            handleInputChange(e);
                            document.getElementById('toDate').min = e.target.value; // Dynamically set min for toDate
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded form-control-sm"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="toDate" className="block text-gray-700">To Date</label>
                    <input
                        type="date"
                        id="toDate"
                        name="fld_to_date"
                        value={formData.fld_to_date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded form-control-sm"
                        required
                        min={formData.fld_from_date || new Date().toISOString().split('T')[0]} 
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="serviceCharge" className="block text-gray-700">Service Charge</label>
                    <input
                        type="number"
                        id="serviceCharge"
                        name="fld_service_charge"
                        value={formData.fld_service_charge}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded form-control-sm"
                        required
                        min={100}
                    />
                </div>
                <div className='flex justify-end but mt-3'>
                    <button
                        type="submit"
                        className="text-white py-1 px-1 rounded col-span-2 flex items-center"
                    >
                        <Save className="mr-2 ic"/>
                        Add Service Charge
                    </button>
                </div>    
            </form>
        </div>
            <ToastContainer />
        </motion.div>
    );
};

export default AddUserServiceCharge;
