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
      const response = await fetch('https://serviceprovidersback.onrender.com/api/projects');
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
      const response = await fetch(`https://serviceprovidersback.onrender.com/api/worksummaries/user/${userId}`);
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
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/worksummaries/${selectedWorkSummary._id}`, {
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
      const response = await fetch(`https://serviceprovidersback.onrender.com/api/worksummaries/${id}/status`, {
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
      width: "400px",
      render: (data) => {
        const project = projects.find((proj) => proj._id == data);
        const title = project ? project.fld_title : 'Unknown Project'; 
        return title ? title : 'No Title'; 
      },
    },
    {
      title: 'Added On',
      data: 'fld_addedon',
      width: "200px",
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
        `<div style="">
           <button class="edit-btn" data-id="${row._id}">Edit</button>
           <button class="delete-btn" data-id="${row._id}">Delete</button>
           </div>`
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-20 mrf">
      <div className="flex justify-content-between mb-6 but">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">Manage Work Summaries</h1>
        <div className='flex justify-content-end'>
          <button
            onClick={fetchData}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
          >
            <RefreshCw className="mr-1 ic" />
            Refresh
          </button>
          <button
            onClick={handleAddButtonClick}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center"
          >
            <PlusCircle className="mr-1 ic" />
            Add Work Summary
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && <AddWorkSummary onClose={handleCloseForm} fetchData={fetchData} />}
        {isEditFormOpen && (
          <EditWorkSummary
            onClose={handleEditFormClose}
            fetchData={fetchData}
            workSummary={selectedWorkSummary}
            after={fetchData}
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
