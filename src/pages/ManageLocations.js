import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery'; // Import jQuery
import { useNavigate } from 'react-router-dom';
import AddLocation from '../components/AddLocations';
import EditLocation from '../components/EditLocation';
import ConfirmationModal from '../components/ConfirmationModal';
import { BellPlus, CalendarPlus, RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const ManageLocations = () => {
    DataTable.use(DT);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [locations, setLocations] = useState([]);  // Renamed from holidays to locations
    const [selectedLocationId, setSelectedLocationId] = useState(null);  // Renamed from selectedHolidayId to selectedLocationId
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("adminType") !== "SUPERADMIN" && sessionStorage.getItem("adminType") !== "SUBADMIN") {
            navigate("/dashboard"); // Redirect to dashboard if not SUPERADMIN
        }
    }, [navigate]);

    const handleAddLocationClick = () => {
        setIsFormOpen(true);
    };

    const handleEditLocationClick = (id) => {
        setSelectedLocationId(id);
        setIsEditFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const handleCloseEditForm = () => {
        setIsEditFormOpen(false);
        setSelectedLocationId(null);
    };

    // Function to fetch locations from the API
    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://elementk.in/spbackend/api/locations/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch locations when the component mounts
    useEffect(() => {
        fetchLocations();
    }, []);

    const columns = [
        {
            title: 'Name',
            data: 'name',
            orderable: false
        },
        {
            title: 'Added On',
            data: 'addedon',
            type: 'date',
            render: (data) => {
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return new Date(data).toLocaleDateString('en-GB', options).replace(',', ''); // Customize locale and remove comma
            }
        },
        {
            title: 'Actions',
            width: '150px',
            render: (data, type, row) => {
              // Check if the user is a SUPERADMIN or has the respective permissions
              const canEdit = sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("location_edit_access") === "true";
              const canDelete = sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("location_delete_access") === "true";
          
              return `
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
            handleEditLocationClick(id);
        }
    };

    // Function to handle delete button click
    const handleDeleteButtonClick = (e) => {
        const button = e.target;
        if (button.classList.contains("delete-btn")) {
            const id = button.getAttribute("data-id");
            setSelectedLocationId(id);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirmation = async () => {
        if (selectedLocationId) {
            try {
                const response = await fetch(`https://elementk.in/spbackend/api/locations/${selectedLocationId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log('Location deleted successfully');
                    fetchLocations(); // Refresh locations
                } else {
                    console.error('Error deleting location');
                }
            } catch (error) {
                console.error('Error deleting location:', error);
            } finally {
                setIsDeleteModalOpen(false);
                setSelectedLocationId(null);
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-20">

            <div className="flex justify-content-between mb-6 but">
                <h1 className="text-xl font-bold text-gray-800">Manage Locations</h1>

                <div className="flex justify-end">
                    <button
                        onClick={fetchLocations}
                        className="text-white py-0 px-1 rounded transition duration-200 flex items-center mr-2"
                    >
                        Refresh <RefreshCw className='ml-2 ic' />
                    </button>
                    {(sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("location_add_access") == 'true') && (
            
                    <button
                        onClick={handleAddLocationClick}
                        className="text-white py-0 px-1 rounded transition duration-200 flex items-center"
                    >
                        Add Location <CalendarPlus className='ml-2 ic' />
                    </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isFormOpen && <AddLocation onClose={handleCloseForm} after={fetchLocations} />}
                {isEditFormOpen && <EditLocation locationId={selectedLocationId} onClose={handleCloseEditForm} after={fetchLocations} />}
                {isDeleteModalOpen && (
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onConfirm={handleDeleteConfirmation}
                        onClose={() => setIsDeleteModalOpen(false)}
                        content="Are you sure you want to delete this location?"
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
                        data={locations}
                        columns={columns}
                        options={{
                            searching: true,
                            paging: true,
                            ordering: true,
                            responsive: true,
                            order: [[1, 'desc']],
                            createdRow: (row, data) => {
                                $(row).on('click', '.edit-btn', (e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    handleEditButtonClick(e, data._id);
                                });
                                $(row).on('click', '.delete-btn', (e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    setSelectedLocationId(data._id);
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

export default ManageLocations;
