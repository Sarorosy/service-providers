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
            const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders');
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
        }finally{
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
            const response = await fetch('https://serviceprovidersback.onrender.com/api/servicecharge', {
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
            <h2 className="text-2xl font-bold mb-4">Add Service Charge</h2>

            {selectedProvider && (
                <div className="mb-4 flex items-center justify-between p-4 border border-gray-300 rounded bg-white shadow">
                    <div className="flex items-center">
                        <img
                            src={selectedProvider.fld_profile_image ? `https://serviceprovidersback.onrender.com/uploads/profileimg/${selectedProvider.fld_profile_image}` : 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'}
                            alt={selectedProvider.text}
                            className="w-16 h-16 rounded-full mr-4"
                        />

                        <span className="text-lg font-semibold">{selectedProvider.fld_name}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {loading ? <RevolvingDot height="20" width="20" color="blue" ariaLabel="loading" /> : (<div className="mb-4">
                    <label htmlFor="serviceProvider" className="block text-gray-700">Service Provider</label>
                    <select id="serviceProvider" className="w-full p-2 border border-gray-300 rounded">
                        <option value="">Select a service provider</option>
                    </select>
                </div>)}
                

                <div className="mb-4">
                    <label htmlFor="fromDate" className="block text-gray-700">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        name="fld_from_date"
                        value={formData.fld_from_date}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
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
                        className="w-full p-2 border border-gray-300 rounded"
                        required
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
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded col-span-2"
                >
                    <Save className="mr-2" />
                    Add Service Charge
                </button>
            </form>
            <ToastContainer />
        </motion.div>
    );
};

export default AddServiceCharge;
