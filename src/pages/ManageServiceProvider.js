import React, { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt'; // Import DataTables
import $ from 'jquery'; // Import jQuery
import { RevolvingDot } from 'react-loader-spinner';
import AddServiceProvider from '../components/AddServiceProvider';
import ViewServiceProvider from '../components/ViewServiceProvider';
import EditServiceProvider from '../components/EditServiceProvider';
import UserWorkDays from '../components/UserWorkDays';
import { AnimatePresence } from 'framer-motion';
import { RefreshCw, UserPlus2 } from 'lucide-react';
import ManageUserWorkoff from './ManageUserWorkoff';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ManageServiceProvider = () => {
    DataTable.use(DT); // Initialize DataTables

    const [serviceProviders, setServiceProviders] = useState([]); // State to hold service providers data
    const [loading, setLoading] = useState(true); // Loading state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isworkdaysopen, setIsworkdaysopen] = useState(false);
    const [isWorkoffOpen, setIsWorkoffOpen] = useState(false);
    const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
    const [filterActive, setFilterActive] = useState(false); // State for active filter
    const [filterInactive, setFilterInactive] = useState(false);
    const location = useLocation(); // Get the location object
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Extract the last part of the path
    const status = location.pathname.split('/').pop();

    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("adminType") != "SUPERADMIN" && sessionStorage.getItem("adminType") !== "SUBADMIN") {
            navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
        }
    }, [navigate]);

    // Fetch service providers data
    const fetchServiceProviders = async () => {
        setLoading(true); // Start loading
        let url; // Default URL

        if (status === 'active' || filterActive) {
            url = 'https://elementk.in/spbackend/api/users/activeserviceproviders';
        } else if (status === 'inactive' || filterInactive) {
            url = 'https://elementk.in/spbackend/api/users/inactiveserviceproviders';
        } else {
            url = 'https://elementk.in/spbackend/api/users/serviceproviders'; // Default URL for all service providers
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch service providers');
            }
            const data = await response.json();
            if (sessionStorage.getItem("adminType") === "SUBADMIN") {
                const filteredData = data.filter(provider => provider.fld_admin_type !== "SUBADMIN");
                setServiceProviders(filteredData); // Set filtered service providers data
            } else {
                setServiceProviders(data); // Set the service providers data without filtering
            }
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

    useEffect(() => {
        // Bind the toggle status button click event after the DataTable renders
        $(document).on('click', '.toggle-status-button', function() {
            const button = $(this);
            const id = button.data('id');
            const currentStatus = button.data('current-status');
            
            handleToggleStatus(id, currentStatus); // Call the toggle status handler
        });
    }, [serviceProviders])

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
                    ? `https://elementk.in/spbackend/uploads/profileimg/${data}`
                    : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg";

                // Return an HTML string for the image
                return `<img src="${imageUrl}" alt="Profile" class="w-10 h-auto rounded-full border border-gray-200" />`;
            },
            orderable: false
        },

        {
            title: 'Name',
            data: 'fld_name', // Field for the name
            width: '100px',
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 12px; overflow-wrap: break-word;">
                    <span style="font-size: 12px;">${data}</span>
                </div>`
            ),
            orderable: false
        },
        {
            title: 'Username / Email',
            data: null, // No direct data mapping
            width: '180px',

            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span style="font-weight:600;">${data.fld_username}</span>
                    <span style="font-size: 12px;">${data.fld_email}</span>
                </div>`
            ),
            orderable: false
        },
        {
            title: 'Password',
            data: 'fld_decrypt_password', // Field for the password
            width: '120px',
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 11px; overflow-wrap: break-word;">
                    <span style="font-size: 12px;">${data}</span>
                </div>`
            ),
            orderable: false
        },
        {
            title: 'UserType',
            data: 'fld_admin_type', // Field for the password
            width: '80px',
            render: (data) => {
                let displayValue = '';
                
                // Check if the value is "SERVICE_PROVIDER" and display "SP", otherwise display "SUBAdmin"
                if (data === "SERVICE_PROVIDER") {
                    displayValue = "SP";
                } else {
                    displayValue = "SUBADMIN";
                }
        
                return (
                    `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;text-align:center">
                        <span style="font-size: 12px;">${displayValue}</span>
                    </div>`
                );
            },
            orderable: false
        },
        {
            title: 'Phone',
            data: 'fld_phone', // Field for the phone number
            width: '85px',
            render: (data) => (
                `<div style="display: flex; flex-direction: column; font-size: 13px; overflow-wrap: break-word;">
                    <span style="font-size: 12px;">${data}</span>
                </div>`
            ),
            orderable: false
        },
        {
            title: 'Added On',
            data: 'fld_addedon',
            width: '100px',
            type: 'date',
            render: (data) => {
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return new Date(data).toLocaleDateString('en-GB', options).replace(',', ''); // Customize locale and remove comma
            }
        },
        {
            title: 'Status',
            data: 'status',
            width: "60px",
            render: (data, type, row) => {
                const statusBadge = data === "Active"
                    ? `<p class="n-sp-active">Active</p>`
                    : `<p class="n-sp-inactive">Inactive</p>`;
        
                return `
                    <div class="flex flex-col items-center">
                        <button class="toggle-status-button text-purple-500 mt-1" data-id="${row._id}" data-current-status="${data}">
                            ${statusBadge}
                        </button>
                    </div>
                `;
            },
            orderable: false
        },
        
        {
            title: 'Action',
            data: null,
            width: '90px',
            render: (data) => {
                const canDelete = sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("user_delete_access") === "true";
                return `
                    <div class="">
                        <button class="view-button " data-id="${data._id}">View</button>
                        <button class="workoff-button" data-id="${data._id}">Workoff</button>
                         <button class="workdays-button " data-id="${data._id}">WorkDays</button>
                         ${canDelete ? `<button class="delete-button" data-id="${data._id}">Delete</button>` : ''}
                    </div>
                `;
            },
            orderable: false
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

    const handleDeleteButtonClick = (user) => {
        setSelectedUser(user); // Set the selected user to delete
        setIsDeleteModalOpen(true); // Open the delete confirmation modal
      };
    
      const handleDelete = async () => {
        if (selectedUser) {
          try {
            const response = await fetch(`https://elementk.in/spbackend/api/users/${selectedUser}`, {
              method: 'DELETE',
            });
    
            if (!response.ok) {
              throw new Error('Failed to delete service provider');
            }
    
            // Update the state to remove the deleted user
            
            toast.success('Service Provider deleted successfully.');
            setTimeout(()=>{
                fetchServiceProviders();
            }, 1000);
          } catch (error) {
            console.error('Error deleting service provider:', error);
            toast.error('Failed to delete service provider.');
          } finally {
            setIsDeleteModalOpen(false); // Close the modal
            setSelectedUser(null); // Reset selected user
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

    const handleworkdays = (id) => {
        const selected = serviceProviders.find((sp) => sp._id === id); // Find the selected service provider by ID
        setSelectedServiceProvider(selected); // Set selected service provider
        setIsworkdaysopen(true); // Open the view modal
    };

    const handleCloseView = () => {
        setIsViewOpen(false); // Close the view modal
    };
    const handleCloseWorkDays = () => {
        setIsworkdaysopen(false); // Close the view modal
    };
    const handleCloseEdit = () => {
        setIsEditOpen(false); // Close the edit modal
    };
    const handleCloseWorkoff = () => {
        setIsWorkoffOpen(false); // Close the edit modal
    };

    const handleToggleStatus = (id, currentStatus) => {
        // Show confirmation modal
        setShowModal(true);
        setPendingAction({ id, currentStatus });
    };

    const confirmAction = async () => {
        const { id, currentStatus } = pendingAction;
        try {
            const response = await fetch(`https://elementk.in/spbackend/api/users/${id}/status`, {
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
        setShowModal(false); // Close the modal
    };

    const cancelAction = () => {
        setShowModal(false); // Just close the modal
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-20">
            <div className="flex justify-content-between mb-3 but">
                <h1 className="text-xl font-bold text-gray-800">Manage Service Providers</h1>
                <div className="flex justify-end">
                    <button
                        onClick={fetchServiceProviders}
                        className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
                    >
                        Refresh <RefreshCw className='ml-2 ic' />
                    </button>
                    {(sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("user_add_access") == 'true') && (
            
                    <button onClick={handleAddServiceProviderClick} className="flex items-center text-white text-sm py-0 px-1 rounded transition duration-200">
                        Add Service Provider <UserPlus2 className="ml-2 ic" />
                    </button>
                    )}
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
                {isworkdaysopen && <UserWorkDays serviceProviderId={selectedServiceProvider._id} onClose={handleCloseWorkDays} />}
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
                            //ordering: true,
                            order: [[6, 'desc']], // Sort by the "Added On" column in descending order
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
                                    if (button.classList.contains('workdays-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleworkdays(id, data.status);

                                    }
                                    if (button.classList.contains('toggle-status-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleToggleStatus(id, data.status);

                                    }
                                    if (button.classList.contains('delete-button')) {
                                        const id = button.getAttribute('data-id');
                                        handleDeleteButtonClick(id);
                                    }


                                });
                            },
                        }}
                        className="display text-xsm datatables rounded"
                    />
                    {showModal && (
                <ConfirmationModal
                isOpen={showModal}
                content="Are you sure you want to toggle the status?"
                    onConfirm={confirmAction}
                    onClose={cancelAction}
                />
            )}

{isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          content="Are you sure you want to delete this service provider?"
          isReversible={true}
        />
      )}
       <ToastContainer />
                </div>
            )}
        </div>
    );
};

export default ManageServiceProvider;
