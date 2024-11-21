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
        fld_reason: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reasonError, setReasonError] = useState('');
    const [workoffs, setWorkoffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myworkoffs, setMyWorkoffs] = useState([]);

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
        fetch(`https://serviceprovidersback.onrender.com/api/manageworkoffs/first/${userId}`)
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
    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        fetch(`https://serviceprovidersback.onrender.com/api/workoffs/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                setMyWorkoffs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching workoffs:', error);
                setLoading(false);
            });
    }, []);
    const getFormattedStartDate = () => {
        // Step 1: Check if workoffs.fld_workoffs_startdate is available
        const startDate = workoffs?.fld_workoffs_startdate;
        if (startDate && startDate !== '') {
            const date = new Date(startDate);
            return date.toISOString().split('T')[0]; // returns the date in 'yyyy-mm-dd' format
        }    

        // Step 2: If workoffs.fld_workoffs_startdate is empty or null, check sessionStorage.startDate
        const sessionStartDate = sessionStorage.getItem("startDate");
        if (sessionStartDate && sessionStartDate !== '') {
            const date = new Date(sessionStartDate);
            return date.toISOString().split('T')[0];
        }
    
        // Step 3: If both are empty or null, use today's date
        const today = new Date();
        return today.toISOString().split('T')[0]; 
    };
    
    

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

    const handleStartDateChange = (e) => {
        const { value } = e.target;
        setWorkoff((prevState) => ({
          ...prevState,
          fld_start_date: value,
          fld_end_date: value, // Optionally, you can set the end date to be the same as the start date
        }));
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
            const response = await fetch('https://serviceprovidersback.onrender.com/api/workoffs', {
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
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >
            <div className="wen mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                    <h2 className="text-2xl font-bold text-center">Add Work Off</h2>
                    <button
                        onClick={onClose}
                        className="text-white py-2 px-2 rounded-full"
                    >
                        <CircleX className='colorr' />
                    </button>
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
                                onChange={handleStartDateChange}
                                min={getFormattedStartDate()}
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
                                min={workoff.fld_start_date}
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
                    <div className='flex justify-end'>
                        <div className='but'>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white px-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <RevolvingDot height="20" width="20" color="white" ariaLabel="loading" /> : 'Add Work Off'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </motion.div>
    );
};

export default AddWorkOffs;
