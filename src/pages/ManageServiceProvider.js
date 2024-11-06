import React, { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt'; // Import DataTables
import $ from 'jquery'; // Import jQuery
import { RevolvingDot } from 'react-loader-spinner';
import AddServiceProvider from '../components/AddServiceProvider';
import ViewServiceProvider from '../components/ViewServiceProvider';
import EditServiceProvider from '../components/EditServiceProvider';

import { AnimatePresence } from 'framer-motion';
import { RefreshCw, UserPlus2 } from 'lucide-react';
import ManageUserWorkoff from './ManageUserWorkoff';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ManageServiceProvider = () => {
    DataTable.use(DT); // Initialize DataTables

    const [serviceProviders, setServiceProviders] = useState([]); // State to hold service providers data
    const [loading, setLoading] = useState(true); // Loading state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isWorkoffOpen, setIsWorkoffOpen] = useState(false);
    const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
    const [filterActive, setFilterActive] = useState(false); // State for active filter
    const [filterInactive, setFilterInactive] = useState(false);
    const location = useLocation(); // Get the location object

    // Extract the last part of the path
    const status = location.pathname.split('/').pop();

    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("adminType") != "SUPERADMIN") {
            navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
        }
    }, [navigate]);

    // Fetch service providers data
    const fetchServiceProviders = async () => {
        setLoading(true); // Start loading
        let url; // Default URL

        if (status === 'active' || filterActive) {
            url = 'https://serviceprovidersback.onrender.com/api/users/activeserviceproviders';
        } else if (status === 'inactive' || filterInactive) {
            url = 'https://serviceprovidersback.onrender.com/api/users/inactiveserviceproviders';
        } else {
            url = 'https://serviceprovidersback.onrender.com/api/users/serviceproviders'; // Default URL for all service providers
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch service providers');
            }
            const data = await response.json();
            setServiceProviders(data); // Set the service providers data
        } catch (error) {
            console.error('Error fetching service providers:', error);
            setServiceProviders([]); // Set to empty array on error
        } finally {
            setLoading(false); // Stop loading
        }
    };
    useEffect(() => {


        fetchServiceProviders();

    }, [status, filterActive, filterInactive]);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        // Determine the new filter state
        let newFilterActive = filterActive;
        let newFilterInactive = filterInactive;

        if (value === 'active') {
            newFilterActive = checked;
            newFilterInactive = false; // Uncheck inactive if active is checked
        } else if (value === 'inactive') {
            newFilterInactive = checked;
            newFilterActive = false; // Uncheck active if inactive is checked
        }

        // Set the new filter states
        setFilterActive(newFilterActive);
        setFilterInactive(newFilterInactive);

        // Navigate based on the new filter states
        if (newFilterActive) {
            navigate('/manage-service-provider/active');
        } else if (newFilterInactive) {
            navigate('/manage-service-provider/inactive');
        } else {
            navigate('/manage-service-provider'); // Reset to default when both are unchecked
        }
    };

    // Define columns for the DataTable
    const columns = [
        {
            title: 'Image',
            data: 'fld_profile_image',
            width: '50px',
            render: (data) => {
                const imageUrl = (data && data.trim() !== "")
                    ? `https://serviceprovidersback.onrender.com/uploads/profileimg/${data}`
                    : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg";

                // Return an HTML string for the image
                return `<img src="${imageUrl}" alt="Profile" class="w-10 h-10 rounded-full border border-gray-200" />`;
            },
        },

        {
            title: 'Name',
            data: 'fld_name', // Field for the name
            width: '100px',
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span>${data}</span>
                </div>`
            ),
        },
        {
            title: 'Username / Email',
            data: null, // No direct data mapping
            width: '150px',

            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span style="font-weight:600;">${data.fld_username}</span>
                    <span style="font-size: 14px;">${data.fld_email}</span>
                </div>`
            ),
        },
        {
            title: 'Password',
            data: 'fld_decrypt_password', // Field for the password
            width: '120px',
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span>${data}</span>
                </div>`
            ),
        },
        {
            title: 'Phone',
            data: 'fld_phone', // Field for the phone number
            width: '100px',
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span>${data}</span>
                </div>`
            ),
        },
        {
            title: 'Added On',
            data: 'fld_addedon', // Field for the added date
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span>${new Date(data).toLocaleDateString('en-US')}</span>
                </div>`
            ),
            width: '80px',

        },
        {
            title: 'Status',
            data: 'status',
            width: "80px",
            render: (data) => {
                if (data == "Active") {
                    // For Active
                    return `<span style="background-color: lightgreen; color: green; padding: 5px; border-radius: 5px;">Active</span>`;
                } else {
                    // For Inactive
                    return `<span style="background-color: lightcoral; color: red; padding: 5px; border-radius: 5px;">Inactive</span>`;
                }
            },
        },
        {
            title: 'Action',
            data: null,
            width: '90px',
            render: (data) => {
                return `
                    <div class="flex flex-col">
                        <button class="view-button text-green-500 " data-id="${data._id}">View</button>
                        <button class="workoff-button text-blue-500 " data-id="${data._id}">Workoff</button>
                         <button class="toggle-status-button text-purple-500 " data-id="${data._id}">Status</button>
                        <button class="delete-button text-red-500 " data-id="${data._id}">Delete</button>
                    </div>
                `;
            },
        },
    ];


    const handleEdit = (id) => {
        const selected = serviceProviders.find((sp) => sp._id === id); // Find the selected service provider by ID
        setSelectedServiceProvider(selected); // Set selected service provider
        setIsEditOpen(true); // Open the edit modal
    };
    const handleWorkoff = (id) => {
        const selected = serviceProviders.find((sp) => sp._id === id); // Find the selected service provider by ID
        setSelectedServiceProvider(selected); // Set selected service provider
        setIsWorkoffOpen(true); // Open the edit modal
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service provider?')) {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/users/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete service provider');
                }
                fetchServiceProviders();
                alert('Service Provider deleted successfully.');
            } catch (error) {
                console.error('Error deleting service provider:', error);
                alert('Failed to delete service provider.');
            }
        }
    };
    const handleAddServiceProviderClick = () => {
        setIsFormOpen(true); // Open the Add Service Provider form
    };

    const handleCloseForm = () => {
        setIsFormOpen(false); // Close the form
    };

    const handleView = (id) => {
        const selected = serviceProviders.find((sp) => sp._id === id); // Find the selected service provider by ID
        setSelectedServiceProvider(selected); // Set selected service provider
        setIsViewOpen(true); // Open the view modal
    };

    const handleCloseView = () => {
        setIsViewOpen(false); // Close the view modal
    };
    const handleCloseEdit = () => {
        setIsEditOpen(false); // Close the edit modal
    };
    const handleCloseWorkoff = () => {
        setIsWorkoffOpen(false); // Close the edit modal
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/users/${id}/status`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Failed to toggle status');
            }

            // Update the local state to reflect the new status
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            setServiceProviders((prev) =>
                prev.map((prov) =>
                    prov._id === id ? { ...prov, status: newStatus } : prov
                )
            );
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    }
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-content-between mb-3 but">
                <h1 className="text-xl font-bold text-gray-800">Manage Service Providers</h1>
                <div className="flex justify-end">
                    <button
                        onClick={fetchServiceProviders}
                        className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
                    >
                        Refresh <RefreshCw className='ml-2 ic' />
                    </button>
                    <button onClick={handleAddServiceProviderClick} className="flex items-center text-white text-sm py-0 px-1 rounded transition duration-200">
                        Add Service Provider <UserPlus2 className="ml-2 ic" />
                    </button>
                </div>
            </div>
            <div id="checklist">
                <input
                    checked={filterActive}
                    value="active"
                    name="active"
                    type="checkbox"
                    id="active"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="active" className='act'>Active</label>
                <input
                    checked={filterInactive}
                    value="inactive"
                    name="inactive"
                    type="checkbox"
                    id="inactive"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="inactive"  className='inact'>Inactive</label>
            </div>

            <AnimatePresence>
                {isFormOpen && <AddServiceProvider onClose={handleCloseForm} />}
                {isViewOpen && <ViewServiceProvider serviceProviderId={selectedServiceProvider._id} onClose={handleCloseView} />}
                {isEditOpen && <EditServiceProvider serviceProviderId={selectedServiceProvider._id} onClose={handleCloseEdit} />}
                {isWorkoffOpen && <ManageUserWorkoff serviceProviderId={selectedServiceProvider._id} onClose={handleCloseWorkoff} />}
            </AnimatePresence>
            {loading ? (
                <div className="flex justify-center mt-10">
                    <RevolvingDot
                        visible={true}
                        height="50"
                        width="50"
                        color="#3b82f6" // Tailwind blue-600
                        ariaLabel="revolving-dot-loading"
                    />
                </div>
            ) : (
                <div className="table-container mt-1">
                    <DataTable
                        data={serviceProviders}
                        columns={columns}
                        options={{
                            searching: true,
                            paging: true,
                            ordering: true,
                            order: [[5, 'desc']], // Sort by the "Added On" column in descending order
                            responsive: true,
                            className: 'display bg-white rounded-lg shadow-sm',
                            createdRow: (row, data) => {
                                $(row).on('click', (e) => {
                                    const button = e.target;
                                    if (button.classList.contains('view-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleView(id);
                                    }

                                    if (button.classList.contains('workoff-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleWorkoff(id);
                                    }
                                    if (button.classList.contains('toggle-status-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleToggleStatus(id, data.status);

                                    }
                                    if (button.classList.contains('delete-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleDelete(id);
                                    }


                                });
                            },
                        }}
                        className="display text-xsm datatables rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default ManageServiceProvider;
