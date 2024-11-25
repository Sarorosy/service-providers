import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import { CircleX, PlusCircle, RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal'; // Import your ConfirmationModal

const ManageEndServices = () => {
    DataTable.use(DT);

    const [serviceRequests, setServiceRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null); // For selected request
    const [adminComments, setAdminComments] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [formname, setFormName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("adminType") !== "SUPERADMIN") {
            navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
        }
    }, [navigate]);

    // Fetch service requests data
    const fetchServiceRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://serviceprovidersback.onrender.com/api/endservices/requests');
            const data = await response.json();
            setServiceRequests(data);

        } catch (error) {
            console.error('Error fetching service requests:', error);
        }
    };
    useEffect(() => {
        

        fetchServiceRequests();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setUsers([]);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const getusernameById = (userId) => {
        const user = users.find((provider) => provider._id === userId);
        return user ? user.fld_name : 'Unknown User';
    };
    const handleApproveClick = (request) => {
        setSelectedRequest(request);
        setFormName('Approve Form');
        setStatus('Approved'); // Set status as "Approve"
        setIsModalOpen(true); // Open modal
    };

    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setFormName('Reject Form');
        setStatus('Rejected'); // Set status as "Reject"
        setIsModalOpen(true); // Open modal
    };
    const handleModalSubmit = async () => {
        const updatedRequest = {
            ...selectedRequest,
            status: status,
            admin_comments: adminComments,
        };

        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/endservices/update/${selectedRequest._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRequest),
            });

            if (!response.ok) {
                throw new Error('Failed to update service request');
            }

            // Update the service request in the list
            setServiceRequests((prev) =>
                prev.map((req) =>
                    req._id === selectedRequest._id ? { ...req, ...updatedRequest } : req
                )
            );

            setIsModalOpen(false); // Close the modal after submission
        } catch (error) {
            console.error('Error updating service request:', error);
        }
    };
    const columns = [
        {
          title: 'Name',
          data: 'sp_id',
          render: (data) => `<div>${getusernameById(data._id)}</div>`,
        },
        {
          title: 'Reason',
          data: 'reason',
          render: (data) => `<div>${data}</div>`,
        },
        {
          title: 'Proposed End Date',
          data: 'proposed_end_date',
          render: (data) => `<div>${new Date(data).toLocaleDateString()}</div>`,
        },
        {
          title: 'Status',
          data: 'status',
          render: (data) => {
            return `<div class="font-semibold ${data === 'Pending' ? 'text-yellow-500' : data === 'Approved' ? 'text-green-600' : 'text-red-600'}">${data}</div>`;
          },
        },
        {
          title: 'Actions',
          render: (data, type, row) => {
            if (row.status === 'Pending') {
              return `
                <div>
                  <button class="approve-btn greenbt px-1" data-id="${row._id}">Approve</button>
                  <button class="reject-btn redbt px-1" data-id="${row._id}">Reject</button>
                </div>
              `;
            } else {
              return `<div>Action Done</div>`;
            }
          },
        },
      ];
      

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-20">
            <div className="flex justify-end but">
                    <button
                        onClick={()=> {fetchServiceRequests() }}
                        className="text-white py-0 px-1 rounded transition duration-200 flex items-center mr-2"
                    >
                        Refresh <RefreshCw className='ml-2 ic' />
                    </button>
                    
                </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage End Service Requests</h2>
            {loading ? (
                <div className="flex justify-center">
                    <RevolvingDot height="10" width="10" color="#3b82f6" ariaLabel="loading" />
                </div>
            ) : (
                <DataTable
                    data={serviceRequests}
                    columns={columns}
                    options={{
                        searching: false,
                        paging: true,
                        ordering: false,
                        order: [[2, 'desc']],
                        createdRow: (row, data) => {
                            $(row).on('click', '.approve-btn', () => handleApproveClick(data, 'Approved'));
                            $(row).on('click', '.reject-btn', () => handleRejectClick(data, 'Rejected'));
                        },
                    }}
                />
            )}

            {/* Modal for Admin Comments */}
            <AnimatePresence>
                {isModalOpen && (
                    <ConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        showbuttons='no'
                        content={
                            <>
                                <div className="mb-3">
                                    <div className='d-flex justify-content-between align-items-center mb-4 border-bottom pb-2'>
                                        <div className='f-20'>
                                            {formname}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="text-white py-2 rounded-full"
                                            >
                                            <CircleX className='colorr' />
                                        </button>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <label htmlFor="adminComments" className="block mb-0 text-left f-15">Admin Comments</label>
                                        <textarea
                                            id="adminComments"
                                            value={adminComments}
                                            onChange={(e) => setAdminComments(e.target.value)}
                                            className="border rounded p-2 w-full"
                                            rows="2"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={handleModalSubmit}
                                        className="bg-green-600 text-white px-2 py-1 f-12 rounded-md lh-0"
                                    >
                                        Submit
                                    </button>

                                </div>
                            </>
                        }
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageEndServices;
