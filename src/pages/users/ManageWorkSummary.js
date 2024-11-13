import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import AddWorkSummary from '../../components/AddWorkSummary';
import EditWorkSummary from '../../components/EditWorkSummary';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageWorkSummary = () => {
  DataTable.use(DT);

  const [workSummaries, setWorkSummaries] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWorkSummary, setSelectedWorkSummary] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://serviceprovidersback.onrender.com//api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projectData = await response.json();
      setProjects(projectData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddButtonClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
    setSelectedWorkSummary(null);
  };

  const fetchData = async () => {
    setLoading(true);
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await fetch(`https://serviceprovidersback.onrender.com//api/worksummaries/user/${userId}`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setWorkSummaries(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setWorkSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditButtonClick = (workSummary) => {
    setSelectedWorkSummary(workSummary);
    setIsEditFormOpen(true);
  };

  const handleDeleteButtonClick = (workSummary) => {
    setSelectedWorkSummary(workSummary);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedWorkSummary) {
      try {
        const response = await fetch(`https://serviceprovidersback.onrender.com//api/worksummaries/${selectedWorkSummary._id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete the work summary');
        }
        setWorkSummaries((prev) =>
          prev.filter((workSummary) => workSummary._id !== selectedWorkSummary._id)
        );
      } catch (error) {
        console.error('Error deleting work summary:', error);
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedWorkSummary(null);
      }
    }
  };

  const handleUpdateWorkSummary = (updatedWorkSummary) => {
    setWorkSummaries((prev) =>
      prev.map((workSummary) =>
        workSummary._id === updatedWorkSummary._id ? updatedWorkSummary : workSummary
      )
    );
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`https://serviceprovidersback.onrender.com//api/worksummaries/${id}/status`, {
        method: 'PATCH',
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle status');
      }
  
      // Update the local state to reflect the new status
      setWorkSummaries((prev) =>
        prev.map((workSummary) =>
          workSummary._id === id ? { ...workSummary, status: !currentStatus } : workSummary
        )
      );
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };
  
  

  const columns = [
    {
      title: 'Project',
      data: 'fld_projectid',
      width: "200px",
      render: (data) => {
        const project = projects.find((proj) => proj._id == data);
        const title = project ? project.fld_title : 'Unknown Project'; 
        return title ? title : 'No Title'; 
      },
    },
    {
      title: 'Added On',
      data: 'fld_addedon',
      width: "70px",
      render: (data, type) => {
        if (type === 'display') {
          return data ? new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }).format(new Date(data)) : 'No Date';
        }
        return data ? new Date(data).getTime() : 0;
      },
    },
    {
        title: 'Description',
        data: 'fld_description',
        width: "100px"
      },
      
    {
      title: 'Actions',
      width: "100px",
      render: (data, type, row) => (
        `<div style="width: 100%;display:flex;flex-direction:column;">
           <button class="edit-btn" data-id="${row._id}">Edit</button>
           <button class="delete-btn" data-id="${row._id}" style="margin-top: 10px;">Delete</button>
           </div>`
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Manage Work Summaries</h2>
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
          Add Work Summary
        </button>
      </div>
      <AnimatePresence>
        {isFormOpen && <AddWorkSummary onClose={handleCloseForm} fetchData={fetchData} />}
        {isEditFormOpen && (
          <EditWorkSummary
            onClose={handleEditFormClose}
            fetchData={fetchData}
            workSummary={selectedWorkSummary}
            onUpdate={handleUpdateWorkSummary}
          />
        )}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Work Summary"
            message={`Are you sure you want to delete the work summary "${selectedWorkSummary?.fld_summary}"?`}
          />
        )}
      </AnimatePresence>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RevolvingDot height="100" width="100" color="#3b82f6" />
        </div>
      ) : (
        <DataTable
          data={workSummaries}
          columns={columns}
          options={{
            searching: false,
            paging: true,
            ordering: true,
           order: [[1, 'Desc']],
            createdRow: (row, data) => {
              $(row).on('click', '.edit-btn', () => handleEditButtonClick(data));
              $(row).on('click', '.delete-btn', () => handleDeleteButtonClick(data));
              $(row).on('click', '.toggle-status-btn', () => {
                const currentStatus = data.status; // Get current status
                toggleStatus(data._id, currentStatus); // Pass id and current status
              });
            },
          }}
        />
      )}
    </div>
  );
};

export default ManageWorkSummary;
