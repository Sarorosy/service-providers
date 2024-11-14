import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery'; // Import jQuery
import { useNavigate } from 'react-router-dom';


import AddNotificationForm from '../components/AddNotificationForm';
import EditNotificationForm from '../components/EditNotificationForm';
import ViewNotification from '../components/ViewNotification';
import ConfirmationModal from '../components/ConfirmationModal';
import { BellPlus, RefreshCw, Eye, SettingsIcon, OctagonX, SquarePen } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const ManageNotifications = () => {
  DataTable.use(DT);

  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewNotificationData, setViewNotificationData] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // State to control edit form visibility
  const [notifications, setNotifications] = useState([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null); // To hold the selected notification ID
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("adminType") != "SUPERADMIN") {
      navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
    }
  }, [navigate]);

  const handleAddNotificationClick = () => {
    setIsFormOpen(true); // Open the form when button is clicked
  };

  const handleEditNotificationClick = (id) => {
    setSelectedNotificationId(id);
    setIsEditFormOpen(true); // Open the edit form
  };

  const handleCloseForm = () => {
    setIsFormOpen(false); // Close the add form
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false); // Close the edit form
    setSelectedNotificationId(null); // Reset selected notification ID
  };

  // Function to fetch notifications from the API
  const fetchNotifications = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await fetch('https://serviceprovidersback.onrender.com/api/notifications/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNotifications(data); // Assuming the API returns an array of notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Set to empty array on error
    } finally {
      setLoading(false); // Stop loading whether successful or not
    }
  };

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  const columns = [
    {
      title: 'Title',
      data: 'fld_title',
      orderable: false
    },
    {
      title: 'Description',
      data: 'fld_description',
      orderable: false,
      render: (data) => (data.length > 80 ? `${data.substring(0, 80)}...` : data), // Trim description
    },
    {
      title: 'Added On',
      data: 'fld_addedon',
      type: 'date',
      render: (data) => {
          const options = { day: '2-digit', month: 'short', year: 'numeric' };
          return new Date(data).toLocaleDateString('en-GB', options).replace(',', ''); // Customize locale and remove comma
      },
      
  },
  {
    title: 'Due Date',
    data: 'fld_due_date',
    type: 'date',
    render: (data) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(data).toLocaleDateString('en-GB', options).replace(',', ''); // Customize locale and remove comma
    },
    orderable: false
},
    {
      title: 'Actions',
      render: (data, type, row) => (
        `<button class="view-btn" data-id="${row._id}">View</button>
        <button class="edit-btn" data-id="${row._id}">Edit</button>
         <button class="delete-btn" data-id="${row._id}">Delete</button>`
      ),
      orderable: false
    },
  ];

  const handleEditButtonClick = (e, row) => {
    const button = e.target;
    if (button.classList.contains("edit-btn")) {
      const id = button.getAttribute("data-id");
      handleEditNotificationClick(id);
    }
  };
  const handleViewNotificationClick = (id) => {
    const notification = notifications.find((n) => n._id === id);
    if (notification) {
      setViewNotificationData(notification); // Set notification data to view
      setIsViewOpen(true); // Open view notification
    }
  };
  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewNotificationData(null); // Reset view data
  };


  // Function to handle delete button click
  const handleDeleteButtonClick = (e) => {
    const button = e.target;

    if (button.classList.contains("delete-btn")) {
      const id = button.getAttribute("data-id");
      setSelectedNotificationId(id); // Set selected notification ID
      setIsDeleteModalOpen(true); // Open delete confirmation modal
    }
  };

  const handleDeleteConfirmation = async () => {
    if (selectedNotificationId) {
      try {
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/notifications/${selectedNotificationId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log('Notification deleted successfully');
          fetchNotifications(); // Refresh notifications
        } else {
          console.error('Error deleting notification');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
      } finally {
        setIsDeleteModalOpen(false); // Close modal
        setSelectedNotificationId(null); // Reset selected ID
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-20 ">

      <div className="flex justify-content-between mb-6 but">
        <h1 className="text-xl font-bold text-gray-800">Manage Notifications</h1>

        <div className='col-md-4 flex justify-content-end'>
          <button
            onClick={fetchNotifications}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
          >
            Refresh <RefreshCw className='ml-2 ic'/>
          </button>
          <button
            onClick={handleAddNotificationClick}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center "
          >
            Add Notification <BellPlus className='ml-2 ic'/>
          </button>
        </div>
      </div>


      <AnimatePresence>
        {isFormOpen && <AddNotificationForm onClose={handleCloseForm} />}
        {isViewOpen && viewNotificationData && (
          <ViewNotification
            notificationId={viewNotificationData._id}
            onClose={handleCloseView}
          />
        )}
        {isEditFormOpen && <EditNotificationForm notificationId={selectedNotificationId} onClose={handleCloseEditForm} />}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen} // Pass isOpen prop
            onConfirm={handleDeleteConfirmation}
            onClose={() => setIsDeleteModalOpen(false)}
            content="Are you sure you want to delete this notification?"
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
            data={notifications}
            columns={columns}
            options={{
              searching: true,
              paging: true,
              ordering: true,
              responsive: true,
              createdRow: (row, data) => {
                $(row).on('click', (e) => {
                  const button = e.target;
                  if (button.classList.contains('view-btn')) {
                    const id = button.getAttribute('data-id');
                    handleViewNotificationClick(id);
                  }
                  handleEditButtonClick(e, data);
                  handleDeleteButtonClick(e); // Check for delete button click
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

export default ManageNotifications;
