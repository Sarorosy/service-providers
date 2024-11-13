import React, { useState } from 'react';
import { RevolvingDot } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';

const AddWorkoff = ({ serviceProviderId, onClose }) => {
    const [workoff, setWorkoff] = useState({
        fld_adminid: serviceProviderId,
        fld_workoffs_startdate: '',
        fld_workoffs_enddate: '',
        fld_total_no_of_work_offs: '',
        fld_work_offs_availed: 0,
        fld_work_offs_balance: 0,
        fld_addedon: new Date().toISOString(), // Set current date as added on
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkoff((prev) => ({
            ...prev,
            [name]: value,
            fld_work_offs_balance: name === 'fld_total_no_of_work_offs' ? value : prev.fld_work_offs_balance, // Update balance if total work offs change
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('https://serviceprovidersback.onrender.com/api/manageworkoffs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoff),
            });

            if (!response.ok) {
                throw new Error('Error adding workoff');
            }

            onClose();
        } catch (error) {
            console.error('Error adding workoff:', error);
            alert('Failed to add workoff');
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
                    <h2 className="text-xl font-bold text-gray-800">Add Workoff</h2>
                    <button
                        onClick={onClose}
                        className=""
                    ><CircleX /></button>
                </div>
                <div className=' n-popup-body ad-work-h'>
                    <div className='row justify-content-center'>
                        <div className='col-md-12'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="fld_workoffs_start_date" className="block mb-2">Workoff Start Date:</label>
                                    <input
                                        type="date"
                                        id="fld_workoffs_start_date"
                                        name="fld_workoffs_startdate"
                                        value={workoff.fld_workoffs_start_date}
                                        onChange={handleChange}
                                        required
                                        className="border rounded w-full form-control-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="fld_workoffs_end_date" className="block mb-2">Workoff End Date:</label>
                                    <input
                                        type="date"
                                        id="fld_workoffs_end_date"
                                        name="fld_workoffs_enddate"
                                        value={workoff.fld_workoffs_end_date}
                                        onChange={handleChange}
                                        required
                                        className="border rounded w-full form-control-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="fld_total_no_of_work_offs" className="block mb-2">Total Workoffs:</label>
                                    <input
                                        type="number"
                                        id="fld_total_no_of_work_offs"
                                        name="fld_total_no_of_work_offs"
                                        value={workoff.fld_total_no_of_work_offs}
                                        onChange={handleChange}
                                        required
                                        className="border rounded w-full form-control-sm"
                                    />
                                </div>
                                <input
                                    type="hidden"
                                    name="fld_addedon"
                                    value={workoff.fld_addedon}
                                />
                                <div className='d-flex justify-content-end but '>
                                    <button
                                        type="submit"
                                        className={`bg-blue-600 text-sm text-white px-2 py-1 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Add Workoff'}
                                    </button>
                                </div>   
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </motion.div>
    );
};

export default AddWorkoff;
