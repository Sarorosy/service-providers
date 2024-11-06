import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import { PlusCircle, RefreshCw, CircleX } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import AddServiceCharge from '../components/AddUserServiceCharge';
import EditServiceCharge from '../components/EditServiceCharge'; // Import the EditServiceCharge component
import ConfirmationModal from '../components/ConfirmationModal'; // Import your ConfirmationModal
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ManageUserServiceCharge = ({ serviceProviderId, onClose }) => {
  DataTable.use(DT);

  const [serviceCharges, setServiceCharges] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // State for edit form
  const [loading, setLoading] = useState(true);
  const [selectedServiceCharge, setSelectedServiceCharge] = useState(null); // State for selected service charge
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("adminType") != "SUPERADMIN") {
      navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
    }
  }, [navigate]);


  const handleAddButtonClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
    setSelectedServiceCharge(null); // Reset selected service charge
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [serviceChargeResponse, serviceProviderResponse] = await Promise.all([
        fetch(`https://serviceprovidersback.onrender.com/api/servicecharge/user/${serviceProviderId}`),
        fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders/')
      ]);

      if (!serviceChargeResponse.ok || !serviceProviderResponse.ok) {
        throw new Error('Error fetching data');
      }

      const [serviceChargesData, serviceProvidersData] = await Promise.all([
        serviceChargeResponse.json(),
        serviceProviderResponse.json()
      ]);

      setServiceCharges(serviceChargesData);
      setServiceProviders(serviceProvidersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setServiceCharges([]);
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getServiceProviderName = (providerId) => {
    const provider = serviceProviders.find((sp) => sp._id === providerId);
    return provider ? provider.fld_name : 'Unknown';
  };

  const handleEditButtonClick = (serviceCharge) => {
    setSelectedServiceCharge(serviceCharge); // Set the selected service charge for editing
    setIsEditFormOpen(true); // Open the edit form
  };

  const handleDeleteButtonClick = (serviceCharge) => {
    setSelectedServiceCharge(serviceCharge);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedServiceCharge) {
      try {
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/servicecharge/${selectedServiceCharge._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the service charge');
        }

        // Update the state to remove the deleted service charge
        setServiceCharges((prev) =>
          prev.filter((serviceCharge) => serviceCharge._id !== selectedServiceCharge._id)
        );
      } catch (error) {
        console.error('Error deleting service charge:', error);
      } finally {
        setIsDeleteModalOpen(false); // Close the modal
        setSelectedServiceCharge(null); // Reset selected service charge
      }
    }
  };

  const handleUpdateServiceCharge = (updatedServiceCharge) => {
    setServiceCharges((prev) =>
      prev.map((serviceCharge) =>
        serviceCharge._id === updatedServiceCharge._id ? updatedServiceCharge : serviceCharge
      )
    );
  };

  const columns = [
    {
      title: 'Service Provider',
      data: 'fld_service_provider_id',
      width: "150px",
      render: (data) => `<div style="width: 100%; font-size: 12px;">${getServiceProviderName(data)}</div>`,
    },
    {
      title: 'Service Charge',
      data: 'fld_service_charge',
      width: "100px",
      render: (data) => `<div style="width: 100%; font-size: 12px;">${data}</div>`,
    },
    {
      title: 'From Date',
      data: 'fld_from_date',
      width: "100px",
      render: (data) => `<div style="width: 100%; font-size: 12px;">${new Date(data).toLocaleDateString()}</div>`,
    },
    {
      title: 'To Date',
      data: 'fld_to_date',
      width: "100px",
      render: (data) => `<div style="width: 100%; font-size: 12px;">${new Date(data).toLocaleDateString()}</div>`,
    },
    {
      title: 'Actions',
      width: "100px",
      render: (data, type, row) => (
        `<div style="width: 100%; font-size: 12px;">
           <button class="edit-btn" data-id="${row._id}">Edit</button>
           <button class="delete-btn" data-id="${row._id}" style="margin-left: 10px;">Delete</button>
         </div>`
      ),
    },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-blue-100 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
    >
    <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white py-2 px-2 rounded-full"
          >
            <CircleX className='colorr'/>
          </button>

      <div className="went mt-5 mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-content-between but">
          <h1 className="text-xl font-bold text-gray-800">Manage Service Charges</h1>
      
          <div className='flex float-right'>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-2 py-1 rounded flex items-center mr-2"
            >
              <RefreshCw className="mr-2 ic" />
              Refresh
            </button>
            <button
              onClick={handleAddButtonClick}
              className="bg-blue-600 text-white px-2 py-1 rounded flex items-center"
            >
              <PlusCircle className="mr-2 ic" />
              Add Service Charge
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <RevolvingDot height="30" width="30" color="blue" ariaLabel="loading" />
          </div>
        ) : (
          <DataTable
            data={serviceCharges}
            columns={columns}
            options={{
              searching: false,
              paging: true,
              ordering: true,
              order: [[0, 'asc']],
              createdRow: (row, data) => {
                $(row).on('click', '.edit-btn', () => handleEditButtonClick(data));
                $(row).on('click', '.delete-btn', () => handleDeleteButtonClick(data));
              },
            }}
          />
        )}
        <AnimatePresence>
          {isFormOpen && <AddServiceCharge onClose={handleCloseForm} serviceProviderId={serviceProviderId} />}
          {isEditFormOpen && (
            <EditServiceCharge
              id={selectedServiceCharge._id}
              onClose={handleEditFormClose}
              onUpdate={handleUpdateServiceCharge}
            />
          )}
          {isDeleteModalOpen && (
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onConfirm={handleDelete}
              onClose={() => setIsDeleteModalOpen(false)}
              content="Are you sure you want to delete this service charge?"
              isReversible={true}
            />
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default ManageUserServiceCharge;
