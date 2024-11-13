import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt'; // Import DataTables
import $ from 'jquery'; // Import jQuery
import { RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const ManageWorkDays = () => {
  DataTable.use(DT); // Initialize DataTables

  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("adminType") != "SUPERADMIN") {
      navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
    }
  }, [navigate]);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://serviceprovidersback.onrender.comapi/users/serviceproviders'); // API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setServiceProviders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setServiceProviders([]); // Empty array on error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const viewWorkDays = (id) => {
    navigate(`/userworkdays/${id}`); // Navigate to user work days view with service provider ID
  };

  const columns = [
    { title: 'Id', data: 'id', width: "60px" },
    {
      title: 'Profile',
      data: 'fld_profile_image',
      width: "100px",
      render: (data) => `
          <img src="${data && data.trim() !== "" ? `https://serviceprovidersback.onrender.comuploads/profileimg/${data}` : 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'}" 
          alt="Profile" style="width: 40px; height: auto; object-fit: cover;border-radius:50%" />
      `,
    },
    { title: 'Name', data: 'fld_name' },
    {
      title: 'Actions',
      render: (data, type, row) => `
        <button class="view-btn" data-id="${row._id}">View</button>
      `,
    },
  ];

  const handleRowClick = (e) => {
    const button = e.target;
    if (button.classList.contains('view-btn')) {
      const id = button.getAttribute('data-id');
      viewWorkDays(id);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-20 smt mr1">
      <div className="flex justify-content-between mb-4 but">
        <h1 className="text-xl font-bold text-gray-800">Manage Work Days</h1>
        <div className="flex justify-end">
          <button
            onClick={fetchServiceProviders}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
          >
            Refresh <RefreshCw className='ml-2 ic'/>
          </button>
        </div>
      </div>

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
          data={serviceProviders}
          columns={columns}
          options={{
            searching: true,
            paging: true,
            ordering: true,
            responsive: true,
            createdRow: (row) => {
              $(row).on('click', handleRowClick); // Handle row clicks
            },
          }}
          className="display bg-white rounded"
        />
      )}
    </div>
  );
};

export default ManageWorkDays;
