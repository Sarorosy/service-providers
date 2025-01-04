import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX,Save } from 'lucide-react';
import { motion } from 'framer-motion';

const AddLocation = ({ onClose, after }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://elementk.in/spbackend/api/locations/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success("Location added successfully!");
            onClose();
            after();
        } else {
            toast.error("Error adding location!");
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
          <h2 className="text-2xl font-bold text-center f-20">Add Location</h2>
          <button
            onClick={onClose}
            className="text-white py-2 px-2 rounded-full "
          >
            <CircleX className='colorr'/>
          </button>
        </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="block text-sm font-medium mb-1">Location Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border p-2 w-full form-controlborder border-gray-300 rounded w-full text-sm form-control-sm"
                        required
                    />
                </div>
                <div className='but d-flex justify-content-end'>
                <button type="submit" className="bg-blue-600 text-white py-1 px-1 rounded flex items-center">
                    <Save className="mr-1 ic" /> Add Location
                </button>
                </div>
            </form>
            <ToastContainer />
            </div>
      <ToastContainer />
    </motion.div>
    );
};

export default AddLocation;
