import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EndServices = () => {
    const [reason, setReason] = useState('');
    const [proposedEndDate, setProposedEndDate] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingRequest, setExistingRequest] = useState(null);
    const userId = sessionStorage.getItem('userId');

    const fetchExistingRequest = async () => {
        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/endservices/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setExistingRequest(data);
            } else {
                throw new Error('Failed to fetch existing requests');
            }
        } catch (error) {
            //toast.error(error.message || 'Something went wrong while fetching requests');
        }
    };
    useEffect(() => {
        

        fetchExistingRequest();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('https://serviceprovidersback.onrender.com/api/endservices/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sp_id: userId,
                    reason,
                    proposed_end_date: proposedEndDate,
                    comments,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            } else {
                toast.success('End service request submitted successfully');
                setReason('');
                setProposedEndDate('');
                setComments('');
                setExistingRequest({
                    reason,
                    proposed_end_date: proposedEndDate,
                    comments,
                    status: 'Pending',
                });
                fetchExistingRequest()
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (existingRequest && existingRequest.length > 0) {
        const request = existingRequest[0]; // Access the first item in the array

        return (
            <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
                <h2 className="text-2xl font-semibold mb-4 f-20">Your Existing End Service Request</h2>
            <div className="w-full max-w-lg mx-auto p-6 bg-indigo-50 rounded-lg shadow-md">
                {/* <h2 className="text-3xl font-bold text-black-600 mb-6 border-b pb-2 f-20">Your Existing End Service Request</h2> */}

                <div className="space-y-4">
                    <div>
                        <p className="text-gray-700 text-sm font-medium">Reason</p>
                        <p className="text-gray-900 ">{request.reason}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">Proposed End Date</p>
                        <p className="text-gray-900 ">
                            {new Date(request.proposed_end_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">Comments</p>
                        <p className="text-gray-900 ">{request.comments || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">Status</p>
                        <p
                            style={{
                                color: request.status === 'Pending'
                                    ? 'orange !important'
                                    : request.status === 'Approved'
                                        ? 'green !important'
                                        : 'red !important',
                                fontWeight: '400',
                                
                            }}
                        >
                            {request.status}
                        </p>

                    </div>
                    {request.status === 'Approved' || request.status === 'Rejected' ? (
                    <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-2 rounded-md">
                        <p className="text-gray-700 text-sm font-medium">Admin comments</p>
                        <p className="text-gray-900 ">{request.admin_comments || 'N/A'}</p>
                    </div>
                ) : null}

                </div>

                {request.status === 'Pending' || request.status === 'Approved' ? (
                    <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-2 rounded-md">
                        <p className="text-blue-600 text-sm font-medium">
                            You cannot submit a new request until the current one is resolved.
                        </p>
                    </div>
                ) : null}

                <ToastContainer />
            </div>
            </div>
        );
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
            <h2 className="text-2xl font-semibold mb-4 f-20">End My Services</h2>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='bg-light p-4 '>
                        <form onSubmit={handleSubmit} className='row'>
                            <div className="col-md-12">
                                <div className="mb-4">
                                    <label htmlFor="proposedEndDate" className="block text-sm font-medium mb-1">Proposed End Date (Optional)</label>
                                    <input
                                        type="date"
                                        id="proposedEndDate"
                                        value={proposedEndDate}
                                        min={today}
                                        onChange={(e) => setProposedEndDate(e.target.value)}
                                        className="border rounded p-2 w-full form-control-sm"
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason for Ending Services</label>
                                    <textarea
                                        id="reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                        className="border rounded p-2 w-full"
                                        rows="1"
                                        placeholder="Provide your reason..."
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label htmlFor="comments" className="block text-sm font-medium mb-1 ">Additional Comments (Optional)</label>
                                    <textarea
                                        id="comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        className="border rounded p-2 w-full"
                                        rows="1"
                                        placeholder="Provide any additional information..."
                                    ></textarea>
                                </div>
                            
                                <div className='d-flex justify-content-end align-items-end but'>
                                    <div className=''>
                                        <button
                                        type="submit"
                                        className={`bg-blue-600 text-white px-2  f-12 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EndServices;
