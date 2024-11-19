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
            const response = await fetch('https://serviceprovidersback.onrender.com/api/projects', {
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
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >
            <div className="wen3 mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                <h2 className="text-2xl font-bold text-center">Add Project</h2>
                <button
                    onClick={onClose}
                    className="text-white py-2 px-2 rounded-full"
                >
                    <CircleX className='colorr' />
                </button>
            </div>
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
                <div className='flex justify-end'>
                    <div className='but'>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white px-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Add Project'}
                        </button>
                    </div>
                </div>
            </form>
            </div>
        </motion.div>
    );
};

export default AddProject;
