import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  CircleX,Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EditLocation = ({ locationId,onClose,after }) => {
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/locations/${locationId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFormData({
                    name: data.name,
                    description: data.description,
                });
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchLocation();
    }, [locationId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/locations/${locationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success("Location updated successfully!");
            onClose();
            after();
        } else {
            toast.error("Error updating location!");
        }
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
                    <h2 className="text-2xl font-bold text-center">Edit Location</h2>   
                    <button
                        onClick={onClose}
                        className="text-white py-2 px-2 rounded-full"
                    >
                        <CircleX className='colorr'/>
                    </button>
                </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="block">Location Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="flex justify-end but">
                <button type="submit" className="text-white py-1 px-1 rounded flex items-center">
                    <Save className="mr-1 ic" /> Update Location
                </button>
                </div>
            </form>
            <ToastContainer />
        </div>
        </motion.div>
    );
};

export default EditLocation;
