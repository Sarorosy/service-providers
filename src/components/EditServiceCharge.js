import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'select2';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';

const EditServiceCharge = ({ onClose, id }) => {
    const [serviceProviders, setServiceProviders] = useState([]);
    const [formData, setFormData] = useState({
        fld_service_provider_id: '',
        fld_from_date: '',
        fld_to_date: '',
        fld_service_charge: ''
    });
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        fetchServiceProviders();
        if (id) {
            fetchServiceCharge();
        }
    }, [id]);

    useEffect(() => {
        $('#serviceProvider').select2({
            placeholder: 'Select a service provider',
            allowClear: true,
            data: serviceProviders.map(provider => ({
                id: provider._id,
                text: provider.fld_name
            }))
        }).on('change', function () {
            const selectedId = $(this).val();
            const provider = serviceProviders.find(p => p._id === selectedId);
            setFormData(prevData => ({ ...prevData, fld_service_provider_id: selectedId }));
            setSelectedProvider(provider);
        });
    
        return () => {
            $('#serviceProvider').select2('destroy');
        };
    }, [serviceProviders]);
    
    useEffect(() => {
        if (serviceProviders.length > 0 && formData.fld_service_provider_id) {
            // Ensure Select2 is initialized and set the value after both are available
            $('#serviceProvider').val(formData.fld_service_provider_id).trigger('change');
        }
    }, [serviceProviders, formData.fld_service_provider_id]);
    

    const fetchServiceProviders = async () => {
        try {
            const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders');
            const data = await response.json();
            setServiceProviders(data);
        } catch (error) {
            console.error('Error fetching service providers:', error);
            toast.error('Error fetching service providers.');
        }
    };

    const fetchServiceCharge = async () => {
        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/servicecharge/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch service charge');
            }
            const data = await response.json();
    
            // Set form data with the fetched values
            setFormData({
                fld_service_provider_id: data?.fld_service_provider_id || '',
                fld_from_date: data?.fld_from_date?.split('T')[0] || '',
                fld_to_date: data?.fld_to_date?.split('T')[0] || '',
                fld_service_charge: data?.fld_service_charge || ''
            });
    
            // Ensure you wait until the serviceProviders are set before trying to find the selected provider
            const selectedProvider = serviceProviders.find(provider => provider._id === data.fld_service_provider_id);
            if (selectedProvider) {
                setSelectedProvider(selectedProvider);
                $('#serviceProvider').val(data.fld_service_provider_id).trigger('change'); // Set the selected provider in Select2
            } else {
                console.error('No matching provider found');
            }
        } catch (error) {
            console.error('Error fetching service charge:', error);
            toast.error('Error fetching service charge data.');
        }
    };
        

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/servicecharge/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fld_service_provider_id: formData.fld_service_provider_id,
                    fld_from_date: formData.fld_from_date,
                    fld_to_date: formData.fld_to_date,
                    fld_service_charge: formData.fld_service_charge
                }),
            });

            if (response.ok) {
                toast.success('Service charge updated successfully!');
                resetForm();
            } else {
                toast.error('Error updating service charge!');
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
        $('#serviceProvider').val(null).trigger('change');
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
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Service Charge</h2>

<div className='wen1 mx-auto bg-white p-6 rounded-lg shadow-md'>
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
                <div className="mb-4">
                    <label htmlFor="serviceProvider" className="block text-gray-700">Service Provider</label>
                    <select id="serviceProvider" className="w-full p-2 border border-gray-300 rounded">
                        <option value="">Select a service provider</option>
                    </select>
                </div>
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
                    className="bg-blue-700 text-white py-2 px-4 rounded w-40 flex float-right"
                >
                    <Save className="mr-2" />
                    Update 
                </button>
            </form></div>
            <ToastContainer />
        </motion.div>
    );
};

export default EditServiceCharge;
