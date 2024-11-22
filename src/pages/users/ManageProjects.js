import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import AddProject from '../../components/AddProject'; // Import AddProject component
import EditProject from '../../components/EditProject'; // Import EditProject component
import ConfirmationModal from '../../components/ConfirmationModal'; // Import ConfirmationModal

const ManageProjects = () => {
  DataTable.use(DT);

  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchProjects = async () => {
    const userId = sessionStorage.getItem('userId'); // Get userId from session storage
    setLoading(true);
    try {
      const response = await fetch(`https://serviceprovidersback.onrender.com/api/projects/user/${userId}`);
      if (!response.ok) {
        throw new Error('Error fetching projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
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
    setSelectedProject(null);
  };

  const handleEditButtonClick = (project) => {
    setSelectedProject(project);
    setIsEditFormOpen(true);
  };

  const handleDeleteButtonClick = (project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProject) {
      try {
        const response = await fetch(`https://serviceprovidersback.onrender.com/api/projects/${selectedProject._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the project');
        }

        setProjects((prev) => prev.filter((project) => project._id !== selectedProject._id));
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`https://serviceprovidersback.onrender.com/api/projects/${id}/status`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle status');
      }

      const updatedProject = await response.json(); // Assuming the updated project is returned
      setProjects((prev) =>
        prev.map((project) =>
          project._id == id ? {...project , status : !currentStatus} : project
        )
      );
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const columns = [
    {
      title: 'Project Name',
      data: 'fld_title',
      width: "50%",
    },
    {
        title: 'Added On',
        data: 'fld_addedon',
       // width: "120px",
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
    // {
    //     title: 'Status',
    //     data: 'status',
    //     width: "10%",
    //     render: (data) => {
    //       if (data) {
    //         // For Active
    //         return `<p class="n-sp-active">Active</p>`;
    //       } else {
    //         // For Inactive
    //         return `<p class="n-sp-inactive">Inactive</p>`;
    //       }
    //     },
    //   },
    {
      title: 'Actions',
      width: "120px",
      render: (data, type, row) => (
        `<div style="">
           <button class="edit-btn" data-id="${row._id}">Edit</button>
           <button class="delete-btn" data-id="${row._id}" >Delete</button>
           </div>`
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-20 mrf">
      <div className="flex justify-content-between mb-6 but">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">Manage Projects</h1>
        <div className='flex justify-content-end'>
          <button
            onClick={fetchProjects}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
          >
            <RefreshCw className="mr-2 ic" />
            Refresh
          </button>
          <button
            onClick={handleAddButtonClick}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center"
          >
            <PlusCircle className="mr-2 ic" />
            Add Project
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <RevolvingDot height="30" width="30" color="#3b82f6" ariaLabel="loading" />
        </div>
      ) : (
        <DataTable
          data={projects}
          columns={columns}
          options={{
            searching: true,
            paging: true,
            ordering: true,
            order: [[1, 'Desc']],
            createdRow: (row, data) => {
              $(row).on('click', '.edit-btn', () => handleEditButtonClick(data));
              $(row).on('click', '.delete-btn', () => handleDeleteButtonClick(data));
             
            },
          }}
        />
      )}
      <AnimatePresence>
        {isFormOpen && <AddProject onClose={handleCloseForm} onRefresh={fetchProjects} />}
        {isEditFormOpen && (
          <EditProject
            projectId={selectedProject._id}
            onClose={handleEditFormClose}
            onRefresh={fetchProjects}
          />
        )}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onConfirm={handleDelete}
            onClose={() => setIsDeleteModalOpen(false)}
            content="Are you sure you want to delete this project?"
            isReversible={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;
