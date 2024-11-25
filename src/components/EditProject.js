import React, { useEffect, useState } from 'react';
import { RevolvingDot } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';

const EditProject = ({ projectId, onClose }) => {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/projects/${projectId}`);
                const data = await response.json();
                setTitle(data.fld_title); // Assuming the API returns a project with fld_title
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedProject = {
            fld_title: title,
            fld_adminid: userId,
            fld_addedon: new Date().toISOString(), // Current date in ISO format
            status: 'Active', // Assuming status is also set to 'Active'
        };

        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/projects/${projectId}`, {
                method: 'PUT', // Use PUT for updating the project
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject),
            });

            if (!response.ok) {
                throw new Error('Error updating project');
            }

            //alert('Project updated successfully');
            onClose(); // Close the modal upon successful submission
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project');
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
            <div className="n-wen mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                    <h2 className="text-2xl font-bold text-center f-20">Edit Project</h2>
                    <button
                        onClick={onClose}
                        className="text-white py-2 px-2 rounded-full"
                    >
                        <CircleX className='colorr' />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fld_title" className="block text-sm font-medium mb-1">Project Title:</label>
                        <input
                            type="text"
                            id="fld_title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border rounded p-2 w-full form-control-sm"
                        />
                    </div>
                    <input type="hidden" name="fld_adminid" value={userId} />
                    <input type="hidden" name="status" value="Active" />
                    <div className='flex justify-end'>
                        <div className='but'>
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white px-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Update Project'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default EditProject;
