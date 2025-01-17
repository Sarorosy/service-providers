import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'select2'; // Import Select2
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const AddServiceCharge = ({ onClose }) => {
    const [serviceProviders, setServiceProviders] = useState([]);
    const [formData, setFormData] = useState({
        fld_service_provider_id: '',
        fld_from_date: '',
        fld_to_date: '',
        fld_service_charge: ''
    });
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchServiceProviders();
    }, []);

    useEffect(() => {
        // Initialize Select2
        $('#serviceProvider').select2({
            placeholder: 'Select a service provider',
            allowClear: true,
            // Use the serviceProviders state to initialize the Select2 options
            data: serviceProviders.map(provider => ({
                id: provider._id, // Use _id as the value
                text: provider.fld_name // Display fld_name as the text
            }))
        }).on('change', function () {
            const selectedId = $(this).val(); // Get the selected _id
            const provider = serviceProviders.find(p => p._id === selectedId); // Find the provider by _id
            setFormData({ ...formData, fld_service_provider_id: selectedId }); // Set _id in form data
            setSelectedProvider(provider); // Update selected provider
        });

        return () => {
            $('#serviceProvider').select2('destroy'); // Cleanup
        };
    }, [serviceProviders]);

    const fetchServiceProviders = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://elementk.in/spbackend/api/users/serviceproviders');
            const data = await response.json();
            const options = data.map(provider => ({
                _id: provider._id, // Ensure _id is used here
                fld_name: provider.fld_name,
                fld_profile_image: provider.fld_profile_image
            }));
            setServiceProviders(options);
            // Initialize Select2 with the updated options
            $('#serviceProvider').select2({
                data: options.map(provider => ({
                    id: provider._id, // Use _id for Select2
                    text: provider.fld_name // Display fld_name
                })),
                placeholder: 'Select a service provider',
                allowClear: true,
            });
        } catch (error) {
            console.error('Error fetching service providers:', error);
        } finally {
            setLoading(false)
        }
    };

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
            const response = await fetch('https://elementk.in/spbackend/api/servicecharge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fld_service_provider_id: formData.fld_service_provider_id,
                    fld_from_date: formData.fld_from_date,
                    fld_to_date: formData.fld_to_date,
                    fld_service_charge: formData.fld_service_charge
                }),
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
            fld_service_provider_id: '',
            fld_from_date: '',
            fld_to_date: '',
            fld_service_charge: ''
        });
        setSelectedProvider(null);
        $('#serviceProvider').val(null).trigger('change'); // Reset Select2
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
                    <h2 className="text-2xl font-bold text-center">Add Service Charge</h2>
                    <button
                        onClick={onClose}
                        className="text-white py-2 px-2 rounded-full"
                    >
                        <CircleX className='colorr' />
                    </button>
                </div>

                <div className='db'>
                    <div className=''>
                        <form onSubmit={handleSubmit} className="grid">
                            {selectedProvider && (
                                <div className="mb-2">
                                    <div className="cent1 items-center">
                                        <img
                                            src={selectedProvider.fld_profile_image ? `https://elementk.in/spbackend/uploads/profileimg/${selectedProvider.fld_profile_image}` : 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'}
                                            alt={selectedProvider.text}
                                            className="w-16 h-16 rounded-full mr-2"
                                        />

                                        <span className="text-lg font-semibold">{selectedProvider.fld_name}</span>
                                    </div>
                                </div>
                            )}
                            {loading ? <RevolvingDot height="20" width="20" color="blue" ariaLabel="loading" /> : (<div className="mb-3">
                                <label htmlFor="serviceProvider" className="block text-sm font-semibold">Service Provider</label>
                                <select id="serviceProvider" className="w-full border border-gray-300 rounded form-control-sm">
                                    <option value="">Select a service provider</option>
                                </select>
                            </div>)}


                            <div className="mb-3">
                                <label htmlFor="fromDate" className="block text-sm font-semibold">From Date</label>
                                <input
                                    type="date"
                                    id="fromDate"
                                    name="fld_from_date"
                                    value={formData.fld_from_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded form-control-sm"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="toDate" className="block text-sm font-semibold">To Date</label>
                                <input
                                    type="date"
                                    id="toDate"
                                    name="fld_to_date"
                                    value={formData.fld_to_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded form-control-sm"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="serviceCharge" className="block text-sm font-semibold">Service Charge</label>
                                <input
                                    type="number"
                                    id="serviceCharge"
                                    name="fld_service_charge"
                                    value={formData.fld_service_charge}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded form-control-sm"
                                    max={100000}
                                    required
                                />
                            </div>
                        </form>
                        <div className='flex justify-end but mt-3'>
                            <button
                                type="submit"
                                className="text-white py-1 px-1 rounded col-span-2 flex items-center"
                                onClick={handleSubmit}
                            >
                                <Save className="mr-2 ic" />
                                Add Service Charge
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </motion.div>
    );
};

export default AddServiceCharge;
