import React, { useEffect, useState } from 'react';
import { RevolvingDot } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';
import $ from 'jquery';

const AddProject = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = sessionStorage.getItem('userId');

    const addedOn = new Date().toISOString(); // Today's date in ISO format
    const status = 'Active'; // Default status

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newProject = {
            fld_title: title,
            fld_adminid: userId,
            fld_addedon: addedOn,
            status: status,
        };

        try {
            const response = await fetch('https://serviceprovidersback.onrender.comapi/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            if (!response.ok) {
                throw new Error('Error adding project');
            }

            //alert('Project added successfully');
            onClose(); // Close the modal upon successful submission
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Failed to add project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-sky-50 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
        >
            <h2 className="text-2xl mb-4">Add Project</h2>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-2 rounded-full"
            >
                <CircleX />
            </button>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="fld_title" className="block mb-2">Project Title:</label>
                    <input
                        type="text"
                        id="fld_title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="border rounded p-2 w-full"
                    />
                </div>
                <input type="hidden" name="fld_adminid" value={userId} />
                <input type="hidden" name="fld_addedon" value={addedOn} />
                <input type="hidden" name="status" value={status} />
                <div className="mb-4 hidden">
                    <label className="block mb-2">Added On:</label>
                    <input
                        type="text"
                        value={new Date().toLocaleDateString('en-US')} // Today's date in 'MM/DD/YYYY' format
                        readOnly
                        className="border rounded p-2 w-full bg-gray-200"
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Add Project'}
                </button>
            </form>
        </motion.div>
    );
};

export default AddProject;
