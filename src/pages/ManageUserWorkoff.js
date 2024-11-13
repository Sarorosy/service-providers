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
                fetch(`https://serviceprovidersback.onrender.comapi/manageworkoffs/${serviceProviderId}`),
                fetch('https://serviceprovidersback.onrender.comapi/users/serviceproviders/')
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
            const response = await fetch(`https://serviceprovidersback.onrender.comapi/manageworkoffs/${selectedWorkoffId}`, {
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
            render: (data) => `<div style="width: 100%; font-size: 12px;">${getServiceProviderName(data)}</div>`,
        },
        {
            title: 'Workoff Start Date',
            data: 'fld_workoffs_startdate',
            width: "150px",
            render: (data) => `<div style="width: 100%; font-size: 12px;">${new Date(data).toLocaleDateString()}</div>`,
        },
        {
            title: 'Workoff End Date',
            data: 'fld_workoffs_enddate',
            width: "150px",
            render: (data) => `<div style="width: 100%; font-size: 12px;">${new Date(data).toLocaleDateString()}</div>`,
        },
        {
            title: 'Total Workoffs',
            data: 'fld_total_no_of_work_offs',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 12px;">${data}</div>`,
        },
        {
            title: 'Workoffs Availed',
            data: 'fld_work_offs_availed',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 12px;">${data}</div>`,
        },
        {
            title: 'Workoffs Balance',
            data: 'fld_work_offs_balance',
            width: "100px",
            render: (data) => `<div style="width: 100%; font-size: 12px;">${data}</div>`,
        },
        {
            title: 'Actions',
            width: "100px",
            render: (data, type, row) => (
                `<div style="width: 100%; font-size: 12px;">
                    <button class="delete-btn" data-id="${row._id}" style="margin-left: 10px;">Delete</button>
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
            <div className='went mx-auto bg-white p-6 rounded-lg shadow-md'>
                <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                <h1 className="text-xl font-bold text-gray-800">Manage Workoff Details</h1>
                    <button
                        onClick={onClose}
                        className="text-white mr-2"
                    >
                        <CircleX className='colorr'/>
                    </button>
                </div>
                    
                <div className=' n-popup-body'>
                    <div className='flex justify-content-end mb-6 but'>
                        <div className='flex float-right'>
                            <button
                                onClick={fetchData}
                                className="bg-blue-600 text-white px-1 py-1 rounded flex items-center mr-2 text-sm"
                            >
                                <RefreshCw className="mr-2 ic" />
                                Refresh
                            </button>
                            <button
                                onClick={handleAddButtonClick}
                                className="bg-blue-600 text-white px-1 py-1 rounded flex items-center text-sm"
                            >
                                <PlusCircle className="mr-2 ic" />
                                Add Workoff
                            </button>
                        </div>
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
                </div>
            </div>

        </motion.div>
    );
};

export default ManageUserWorkoff;
