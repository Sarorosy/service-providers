import React, { useState, useEffect } from 'react';
import { RevolvingDot } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';

const AddWorkOffs = ({ onClose }) => {
    const [workoff, setWorkoff] = useState({
        fld_adminid: sessionStorage.getItem('userId'), // Get userId from session storage
        fld_work_off_added_by: sessionStorage.getItem('adminType'),
        fld_start_date: '',
        fld_start_half: 'First Half', // Dropdown for half-day selection
        fld_end_date: '',
        fld_end_half: 'First Half', // Dropdown for half-day selection
        fld_duration: 0,
        fld_leave_type: 'Unpaid', // Default leave type
        fld_reason: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reasonError, setReasonError] = useState('');
    const [workoffs, setWorkoffs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        calculateDuration();
    }, [workoff.fld_start_date, workoff.fld_start_half, workoff.fld_end_date, workoff.fld_end_half]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkoff((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://service-providers-panel.vercel.app/api/manageworkoffs/first/${userId}`)
            .then(response => response.json())
            .then(data => {
                setWorkoffs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching manage workoffs:', error);
                setLoading(false);
            });
    }, []);

    const calculateDuration = () => {
        if (workoff.fld_start_date && workoff.fld_end_date) {
            const startDate = new Date(workoff.fld_start_date);
            const endDate = new Date(workoff.fld_end_date);

            // Set time based on half selection
            startDate.setHours(workoff.fld_start_half === 'First Half' ? 0 : 12); // 0:00 for first half, 12:00 for second half
            endDate.setHours(workoff.fld_end_half === 'First Half' ? 0 : 12); // 0:00 for first half, 12:00 for second half

            // Calculate duration in days
            let duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Duration in days

            // Adjust duration based on conditions
            if (startDate.toDateString() === endDate.toDateString()) {
                // Same day
                if (workoff.fld_start_half === 'First Half' && workoff.fld_end_half === 'First Half') {
                    duration = 0.5; // Same day, First Half to First Half
                } else if (workoff.fld_start_half === 'First Half' && workoff.fld_end_half === 'Second Half') {
                    duration = 1; // Same day, First Half to Second Half
                } else if (workoff.fld_start_half === 'Second Half' && workoff.fld_end_half === 'First Half') {
                    duration = 0; // Invalid, can't go from Second Half to First Half on the same day
                } else {
                    duration = 0.5; // Same day, Second Half to Second Half
                }
            }

            setWorkoff((prev) => ({ ...prev, fld_duration: duration })); // Set the calculated duration
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (workoff.fld_reason.split(' ').length < 20) {
            setReasonError('Reason must be at least 20 words.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('https://service-providers-panel.vercel.app/api/workoffs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoff),
            });

            if (!response.ok) {
                throw new Error('Error adding workoff');
            }

            alert('Workoff added successfully');
            onClose(); // Close the form after submission
        } catch (error) {
            console.error('Error adding workoff:', error);
            alert('Failed to add workoff');
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
            <h2 className="text-2xl mb-4">Add Work Off</h2>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-2 rounded-full"
            ><CircleX /></button>

            <div className="bg-white shadow-md rounded-lg p-4 mb-5">
                <ul className="space-y-4">
                    <li key={workoffs._id} className="text-gray-800 border-b pb-2">
                        <div className="flex justify-between">
                            <div className="flex flex-col items-center w-1/3 bg-blue-100 text-blue-800 rounded-lg">
                                <div className="p-4 w-full text-center">
                                    Total
                                </div>
                                <span className="font-semibold text-2xl">{workoffs.fld_total_no_of_work_offs}</span>
                            </div>
                            <div className="flex flex-col items-center w-1/3 bg-green-100 text-green-800 rounded-lg">
                                <div className="p-4 w-full text-center">
                                    Availed
                                </div>
                                <span className="font-semibold text-2xl">{workoffs.fld_work_offs_availed}</span>
                            </div>
                            <div className="flex flex-col items-center w-1/3 bg-yellow-100 text-yellow-800 rounded-lg">
                                <div className="p-4 w-full text-center">
                                    Balance
                                </div>
                                <span className="font-semibold text-2xl">{workoffs.fld_work_offs_balance}</span>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="fld_adminid" value={workoff.fld_adminid} />

                {/* Grid Container for Two Columns */}
                <div className="grid grid-cols-2 gap-4 mb-4">

                    {/* Start Date Field */}
                    <div>
                        <label htmlFor="fld_start_date" className="block mb-2">Start Date:</label>
                        <input
                            type="date"
                            id="fld_start_date"
                            name="fld_start_date"
                            value={workoff.fld_start_date}
                            onChange={handleChange}
                            required
                            className="border rounded p-2 w-full"
                        />
                        <select
                            name="fld_start_half"
                            value={workoff.fld_start_half}
                            onChange={handleChange}
                            className="border rounded p-2 mt-2 w-full"
                        >
                            <option value="First Half">First Half</option>
                            <option value="Second Half">Second Half</option>
                        </select>
                    </div>

                    {/* End Date Field */}
                    <div>
                        <label htmlFor="fld_end_date" className="block mb-2">End Date:</label>
                        <input
                            type="date"
                            id="fld_end_date"
                            name="fld_end_date"
                            value={workoff.fld_end_date}
                            onChange={handleChange}
                            required
                            className="border rounded p-2 w-full"
                        />
                        <select
                            name="fld_end_half"
                            value={workoff.fld_end_half}
                            onChange={handleChange}
                            className="border rounded p-2 mt-2 w-full"
                        >
                            <option value="First Half">First Half</option>
                            <option value="Second Half">Second Half</option>
                        </select>
                    </div>

                    {/* Duration Field */}
                    <div>
                        <label htmlFor="fld_duration" className="block mb-2">Duration (days):</label>
                        <input
                            type="number"
                            id="fld_duration"
                            name="fld_duration"
                            value={workoff.fld_duration}
                            readOnly
                            className="border rounded p-2 w-full bg-gray-100"
                        />
                    </div>

                    {/* Leave Type Field */}
                    <div>
                        <label htmlFor="fld_leave_type" className="block mb-2">Leave Type:</label>
                        <select
                            name="fld_leave_type"
                            value={workoff.fld_leave_type}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                        >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>

                    {/* Reason Field */}
                    <div className="col-span-2"> {/* Span across both columns */}
                        <label htmlFor="fld_reason" className="block mb-2">Reason (at least 20 words):</label>
                        <textarea
                            id="fld_reason"
                            name="fld_reason"
                            value={workoff.fld_reason}
                            onChange={handleChange}
                            required
                            className={`border rounded p-2 w-full ${reasonError ? 'border-red-500' : ''}`}
                            rows="4"
                        />
                        {reasonError && <p className="text-red-500">{reasonError}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Add Work Off'}
                </button>
            </form>

        </motion.div>
    );
};

export default AddWorkOffs;
