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
        fetch(`https://elementk.in/spbackend/api/servicecharge/user/${serviceProviderId}`),
        fetch('https://elementk.in/spbackend/api/users/serviceproviders/')
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
  const getServiceProviderProfile = (providerId) => {
    const provider = serviceProviders.find((sp) => sp._id === providerId);
    return provider ? provider.fld_profile_image : 'Unknown';
  };
  const getServiceProviderStatus = (providerId) => {
    const provider = serviceProviders.find((sp) => sp._id === providerId);
    return provider ? provider.status : 'unknown';
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
        const response = await fetch(`https://elementk.in/spbackend/api/servicecharge/${selectedServiceCharge._id}`, {
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
      title: 'Service Charge',
      data: 'fld_service_charge',
      width: "100px",
      orderable: false,
      render: (data) => `<div style="width: 100%; font-size: 12px;">${data}</div>`,
    },
    {
      title: 'From Date',
      data: 'fld_from_date',
      width: "100px",
      orderable: false,
      render: (data) => `<div style="width: 100%; font-size: 12px;">${new Date(data).toLocaleDateString()}</div>`,
    },
    {
      title: 'To Date',
      data: 'fld_to_date',
      width: "100px",
      orderable: false,
      render: (data) => `<div style="width: 100%; font-size: 12px;">${new Date(data).toLocaleDateString()}</div>`,
    },
    {
      title: 'Actions',
      width: "100px",
      orderable: false,
      render: (data, type, row) => (
        `<div style="width: 100%; font-size: 12px;">
           <button class="edit-btn" data-id="${row._id}">Edit</button>
           <button class="delete-btn" data-id="${row._id}">Delete</button>
         </div>`
      ),
    },
  ];

  return (
    <motion.div
      // initial={{ x: '100%' }}
      // animate={{ x: 0 }}
      // exit={{ x: '100%' }}
      // transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
    >

      <div className="n-wenn mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
          <h1 className="text-xl font-bold text-gray-800 flex items-center">Manage <img
            src={
              getServiceProviderProfile(serviceProviderId)
                ? `https://elementk.in/spbackend/uploads/profileimg/${getServiceProviderProfile(serviceProviderId)}`
                : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
            }
            alt="Service Provider Profile"
            class=" mx-2 w-10 h-10 rounded-full border border-gray-200"
          /> <h2 style={{ color: "#2d6a9d", marginRight: "5px" }} >{getServiceProviderName(serviceProviderId)}</h2> Service Charges</h1>
          <button
            onClick={onClose}
            className="text-white mr-2"
          >
            <CircleX className='colorr' />
          </button>
        </div>
        <div className=' n-popup-body serv-pop-h'>
          <div className="flex justify-content-end but">

            <div className='flex float-right'>
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-2 py-1 rounded flex items-center mr-2"
              >
                <RefreshCw className="mr-2 ic" />
                Refresh
              </button>
              {getServiceProviderStatus(serviceProviderId) === "Active" && (
                <button
                  onClick={handleAddButtonClick}
                  className="bg-blue-600 text-white px-2 py-1 rounded flex items-center"
                >
                  <PlusCircle className="mr-2 ic" />
                  Add Service Charge
                </button>
              )}
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
                ordering:false,
                
                createdRow: (row, data) => {
                  $(row).on('click', '.edit-btn', () => handleEditButtonClick(data));
                  $(row).on('click', '.delete-btn', () => handleDeleteButtonClick(data));
                },
              }}
            />
          )}
          <AnimatePresence>
            {isFormOpen && <AddServiceCharge onClose={handleCloseForm} serviceProviderId={serviceProviderId} after={fetchData}/>}
            {isEditFormOpen && (
              <EditServiceCharge
                id={selectedServiceCharge._id}
                onClose={handleEditFormClose}
                onUpdate={handleUpdateServiceCharge}
                after={fetchData}
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
      </div>

    </motion.div>
  );
};

export default ManageUserServiceCharge;
