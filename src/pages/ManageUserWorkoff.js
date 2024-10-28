import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import ConfirmationModal from '../components/ConfirmationModal';
import $ from 'jquery';
import { PlusCircle, RefreshCw, CircleX } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import AddWorkoff from '../components/AddWorkoff';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ManageUserWorkoff = ({ onClose, serviceProviderId }) => {
    DataTable.use(DT);
    const { id } = useParams();
    const [workoffData, setWorkoffData] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWorkoffId, setSelectedWorkoffId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            
            const [workoffResponse, serviceProviderResponse] = await Promise.all([
                fetch(`https://serviceprovidersback.onrender.com/api/manageworkoffs/${serviceProviderId}`),
                fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders/')
            ]);

            if (!workoffResponse.ok || !serviceProviderResponse.ok) {
                throw new Error('Error fetching data');
            }

            const [workoffData, serviceProvidersData] = await Promise.all([
                workoffResponse.json(),
                serviceProviderResponse.json()
            ]);

            setWorkoffData(workoffData);
            setServiceProviders(serviceProvidersData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setWorkoffData([]);
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

    const handleAddButtonClick = () => {
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const handleDeleteButtonClick = (e) => {
        const button = e.target;
        if (button.classList.contains("delete-btn")) {
            const id = button.getAttribute("data-id");
            setSelectedWorkoffId(id);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDelete = async () => {
        if (!selectedWorkoffId) return;

        try {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/manageworkoffs/${selectedWorkoffId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting workoff');
            }

            setWorkoffData((prevData) => prevData.filter((item) => item._id !== selectedWorkoffId));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting workoff:', error);
        }
    };

    const columns = [
        {
            title: 'Admin ID',
            data: 'fld_adminid',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 13px;">${getServiceProviderName(data)}</div>`,
        },
        {
            title: 'Workoff Start Date',
            data: 'fld_workoffs_startdate',
            width: "150px",
            render: (data) => `<div style="width: 100%; font-size: 13px;">${new Date(data).toLocaleDateString()}</div>`,
        },
        {
            title: 'Workoff End Date',
            data: 'fld_workoffs_enddate',
            width: "150px",
            render: (data) => `<div style="width: 100%; font-size: 13px;">${new Date(data).toLocaleDateString()}</div>`,
        },
        {
            title: 'Total Workoffs',
            data: 'fld_total_no_of_work_offs',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 13px;">${data}</div>`,
        },
        {
            title: 'Workoffs Availed',
            data: 'fld_work_offs_availed',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 13px;">${data}</div>`,
        },
        {
            title: 'Workoffs Balance',
            data: 'fld_work_offs_balance',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 13px;">${data}</div>`,
        },
        {
            title: 'Actions',
            width: "100px",
            render: (data, type, row) => (
                `<div style="width: 100%; font-size: 13px;">
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
            className="bg-sky-50 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
        >
            <h2 className="text-2xl mb-4">Manage Workoff Details</h2>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-2 rounded-full"
            ><CircleX /></button>
            <div className='flex float-right'>
                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mb-4 mr-2"
                >
                    <RefreshCw className="mr-2" />
                    Refresh
                </button>
                <button
                    onClick={handleAddButtonClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mb-4"
                >
                    <PlusCircle className="mr-2" />
                    Add Workoff
                </button>
            </div>
            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <RevolvingDot
                        height="100"
                        width="100"
                        radius="6"
                        color="blue"
                        secondaryColor="gray"
                        ariaLabel="revolving-dot-loading"
                        visible={true}
                    />
                </div>
            ) : (
                <DataTable
                    data={workoffData}
                    columns={columns}
                    options={{
                        paging: true,
                        searching: true,
                        ordering: true,
                        createdRow: (row, data) => {
                            $(row).on('click', (e) => {
                              const button = e.target;
                            
                              handleDeleteButtonClick(e); // Check for delete button click
                            });
                          },
                    }}
                    
                />
            )}
            <AnimatePresence>
                {isFormOpen && <AddWorkoff serviceProviderId={serviceProviderId} onClose={handleCloseForm} />}
                {isDeleteModalOpen && (
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onConfirm={handleDelete}
                        onClose={() => setIsDeleteModalOpen(false)}
                        content="Are you sure you want to delete this workoff?"
                        isReversible={true}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageUserWorkoff;
