import React, { useEffect, useState } from 'react';
import { RevolvingDot } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';
import $ from 'jquery';
import 'select2';

const EditWorkSummary = ({ workSummary, onClose , after}) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`https://elementk.in/spbackend/api/projects/user/${userId}`);
                const data = await response.json();
                setProjects(data); // Assuming the API returns a list of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [userId]);

    useEffect(() => {
        // Initialize Select2
        $('#project-select').select2({
            placeholder: 'Select a project',
            allowClear: true,
        }).on('change', function() {
            setSelectedProjectId($(this).val());
        });

        // Cleanup Select2 on component unmount
        return () => {
            $('#project-select').select2('destroy');
        };
    }, [projects]);

    useEffect(() => {
        const fetchWorkSummary = async () => {
            try {
                const response = await fetch(`https://elementk.in/spbackend/api/worksummaries/${workSummary._id}`);
                const data = await response.json();

                if (data) {
                    setSelectedProjectId(data.fld_projectid);
                    setDescription(data.fld_description);
                }
            } catch (error) {
                console.error('Error fetching work summary:', error);
            }
        };

        fetchWorkSummary();
    }, [workSummary]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedWorkSummary = {
            fld_projectid: selectedProjectId,
            fld_addedon: new Date().toISOString(), // Today's date
            fld_adminid: userId, // Admin ID from session storage
            fld_description: description,
            status: 'Active', // Hidden input value
        };

        try {
            const response = await fetch(`https://elementk.in/spbackend/api/worksummaries/${workSummary._id}`, {
                method: 'PUT', // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedWorkSummary),
            });

            if (!response.ok) {
                throw new Error('Error updating work summary');
            }

            alert('Work summary updated successfully');
            onClose(); // Close the modal upon successful submission
            after();
        } catch (error) {
            console.error('Error updating work summary:', error);
            alert('Failed to update work summary');
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
            <div className="wen mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                <h2 className="text-2xl font-bold text-center">Edit Work Summary</h2>
                <button
                    onClick={onClose}
                    className="text-white py-2 px-2 rounded-full"
                >
                    <CircleX className='colorr' />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className="mb-4 col-md-6">
                        <label htmlFor="project-select" className="block mb-2">Select Project:</label>
                        <select
                            id="project-select"
                            value={selectedProjectId}
                            required
                            className="border rounded p-2 w-full "
                        >
                            <option value="" disabled>Select a project</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.fld_title} {/* Adjust to your project title field */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 col-md-6">
                        <label className="block mb-2">Added On:</label>
                        <input
                            type="text"
                            value={new Date().toLocaleDateString('en-US')} // Today's date in 'MM/DD/YYYY' format
                            readOnly
                            className="border rounded w-full bg-gray-200 form-control-sm"
                        />
                    </div>
                </div>
                <input type="hidden" name="fld_adminid" value={userId} />
                <input type="hidden" name="status" value="Active" />
                <div className="mb-4">
                    <label htmlFor="fld_description" className="block mb-2">Description:</label>
                    <textarea
                        id="fld_description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="border rounded p-2 w-full"
                        rows="4"
                    />
                </div>
                <div className='flex justify-end'>
                    <div className='but'>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white px-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Update Work Summary'}
                        </button>
                    </div>
                </div>
            </form>
            </div>
        </motion.div>
    );
};

export default EditWorkSummary;
