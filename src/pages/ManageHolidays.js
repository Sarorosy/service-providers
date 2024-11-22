import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery'; // Import jQuery
import { useNavigate } from 'react-router-dom';

import AddHolidayForm from '../components/AddHolidayForm';
import EditHolidayForm from '../components/EditHolidayForm';
import ViewHoliday from '../components/ViewHoliday';
import ConfirmationModal from '../components/ConfirmationModal';
import { BellPlus, CalendarPlus, RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const ManageHolidays = () => {
    DataTable.use(DT);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewHolidayData, setViewHolidayData] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [selectedHolidayId, setSelectedHolidayId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("adminType") != "SUPERADMIN" && sessionStorage.getItem("adminType") != "SUBADMIN") {
            navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
        }
    }, [navigate]);

    const handleAddHolidayClick = () => {
        setIsFormOpen(true);
    };

    const handleEditHolidayClick = (id) => {
        setSelectedHolidayId(id);
        setIsEditFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        
    };

    const handleCloseEditForm = () => {
        setIsEditFormOpen(false);
        setSelectedHolidayId(null);
    };

    // Function to fetch holidays from the API
    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://serviceprovidersback.onrender.com/api/holidays/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setHolidays(data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
            setHolidays([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch holidays when the component mounts
    useEffect(() => {
        fetchHolidays();
    }, []);

    const columns = [
        {
            title: 'Title',
            data: 'fld_title',
            orderable: false
        },
        {
            title: 'Holiday Date',
            data: 'fld_holiday_date',
            type: 'date',
            orderable: false,
            render: (data) => {
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return new Date(data).toLocaleDateString('en-GB', options).replace(',', ''); // Customize locale and remove comma
            },
            
        },
        {
            title: 'Added On',
            data: 'fld_addedon',
            type: 'date',
            render: (data) => {
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return new Date(data).toLocaleDateString('en-GB', options).replace(',', ''); // Customize locale and remove comma
            }
        },
        {
            title: 'Status',
            data: 'status',
            render: (data) => {
                const isActive = data === 'Active'; // Check if status is Active
                return `
                <span class="${isActive ? 'activeclass' : 'inactiveclass'}">
                  ${data}
                </span>
              `;
            },
            orderable: false
        },
        {
            title: 'Actions',
            render: (data, type, row) => {
              // Check if the user is a SUPERADMIN or has the respective permissions
              const canEdit = sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("holiday_edit_access") === "true";
              const canDelete = sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("holiday_delete_access") === "true";
          
              return `
                <button class="view-btn" data-id="${row._id}">View</button>
                ${canEdit ? `<button class="edit-btn" data-id="${row._id}">Edit</button>` : ''}
                ${canDelete ? `<button class="delete-btn" data-id="${row._id}">Delete</button>` : ''}
              `;
            },
            orderable: false
          },
          
    ];

    const handleEditButtonClick = (e, row) => {
        const button = e.target;
        if (button.classList.contains("edit-btn")) {
            const id = button.getAttribute("data-id");
            handleEditHolidayClick(id);
        }
    };

    const handleViewHolidayClick = (id) => {
        const holiday = holidays.find((h) => h._id === id);
        if (holiday) {
            setViewHolidayData(holiday);
            setIsViewOpen(true);
        }
    };

    const handleCloseView = () => {
        setIsViewOpen(false);
        setViewHolidayData(null);
    };

    // Function to handle delete button click
    const handleDeleteButtonClick = (e) => {
        const button = e.target;
        if (button.classList.contains("delete-btn")) {
            const id = button.getAttribute("data-id");
            setSelectedHolidayId(id);
            setIsDeleteModalOpen(true);
            handleDeleteConfirmation()
        }
    };

    const handleDeleteConfirmation = async () => {
        if (selectedHolidayId) {
            try {
                const response = await fetch(`https://serviceprovidersback.onrender.com/api/holidays/${selectedHolidayId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log('Holiday deleted successfully');
                    fetchHolidays(); // Refresh holidays
                } else {
                    console.error('Error deleting holiday');
                }
            } catch (error) {
                console.error('Error deleting holiday:', error);
            } finally {
                setIsDeleteModalOpen(false);
                setSelectedHolidayId(null);
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-20 ">

            <div className="flex justify-content-between mb-6 but">
                <h1 className="text-xl font-bold text-gray-800">Manage Holidays</h1>

                <div className="flex justify-end">
                    <button
                        onClick={fetchHolidays}
                        className="text-white py-0 px-1 rounded transition duration-200 flex items-center mr-2"
                    >
                        Refresh <RefreshCw className='ml-2 ic' />
                    </button>
                    {(sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("holiday_add_access") == 'true') && (
            
                    <button
                        onClick={handleAddHolidayClick}
                        className="text-white py-0 px-1 rounded transition duration-200 flex items-center"
                    >
                        Add Holiday <CalendarPlus className='ml-2 ic' />
                    </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isFormOpen && <AddHolidayForm onClose={handleCloseForm} after={fetchHolidays}/>}
                {isViewOpen && viewHolidayData && (
                    <ViewHoliday
                        holidayId={viewHolidayData._id}
                        onClose={handleCloseView}
                    />
                )}
                {isEditFormOpen && <EditHolidayForm holidayId={selectedHolidayId} onClose={handleCloseEditForm} after={fetchHolidays} />}
                {isDeleteModalOpen && (
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onConfirm={handleDeleteConfirmation}
                        onClose={() => setIsDeleteModalOpen(false)}
                        content="Are you sure you want to delete this holiday?"
                        isReversible={true}
                    />
                )}
            </AnimatePresence>

            <div className="mt-4">
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
                    <DataTable
                        data={holidays}
                        columns={columns}
                        options={{
                            searching: true,
                            paging: true,
                            ordering: true,
                            responsive: true,
                            order: [[2, 'desc']],
                            createdRow: (row, data) => {
                                // Attach event listeners to the buttons
                                $(row).on('click', '.view-btn', (e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    handleViewHolidayClick(data._id);
                                });
                                $(row).on('click', '.edit-btn', (e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    handleEditButtonClick(e, data._id);
                                });
                                $(row).on('click', '.delete-btn', (e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    setSelectedHolidayId(data._id);
                                    setIsDeleteModalOpen(true);
                                });
                            },
                        }}
                        className="display bg-white rounded"
                    />
                )}
            </div>
        </div>
    );
};

export default ManageHolidays;
