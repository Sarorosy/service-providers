import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt'; // Import DataTables
import $ from 'jquery'; // Import jQuery
import { RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
const ManageReports = () => {
  DataTable.use(DT); // Initialize DataTables

  
    

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("adminType") != "SUPERADMIN") {
        navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
    }
}, [navigate]);

const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await fetch('https://serviceprovidersback.onrender.com/api/users/serviceproviders'); // API endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const usersData = await response.json();
    
    // Fetch last report for each user
    const usersWithLastReport = await Promise.all(usersData.map(async (user) => {
      const reportResponse = await fetch(`https://serviceprovidersback.onrender.com/api/worksummaries/user/${user._id}`);
      const reports = reportResponse.ok ? await reportResponse.json() : [];
      const lastReport = reports.length > 0 ? reports[reports.length - 1] : null; // Get the last report if it exists
      const lastReportDesc = lastReport ? lastReport.fld_description : 'No Report'; // Get description or set to 'No Report'
      return { ...user, lastReportDesc }; // Combine user data with last report description
    }));

    setUsers(usersWithLastReport);
  } catch (error) {
    console.error('Error fetching users:', error);
    setUsers([]); // Empty array on error
  } finally {
    setLoading(false); // Stop loading indicator
  }
};

useEffect(() => {
  fetchUsers();
}, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const viewReport = (id) => {
    navigate(`/report/${id}`); // Navigate to report page with user ID
  };

  const columns = [
    { title: 'Id', data: 'id' ,width:"60px"},
    {
      title: 'Profile',
      data: 'fld_profile_image',
      width: "100px",
      render: (data) => `
          <img src="${data && data.trim() !== "" ? `https://serviceprovidersback.onrender.com/uploads/profileimg/${data}` : 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'}" 
          alt="Profile" style="width: 50px; height: auto; object-fit: cover;border-radius:50%" />
      `,
  },
    { title: 'Name', data: 'fld_name' },
    {
      title: 'Last Report',
      data: 'lastReportDesc',
      render: (data) => {
        // Trim to 20 characters and append ellipsis if necessary
        return data && data.length > 50 ? `${data.substring(0, 50)}...` : data;
      },
    },
    {
      title: 'Actions',
      render: (data, type, row) => `
        <button class="view-btn" data-id="${row._id}">View All</button>
      `,
    },
  ];

  const handleRowClick = (e) => {
    const button = e.target;
    if (button.classList.contains('view-btn')) {
      const id = button.getAttribute('data-id');
      viewReport(id);
    }
  };
  const handleRefresh = () => {
    fetchUsers();
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Reports</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center mr-2"
        >
          Refresh <RefreshCw className='ml-2' />
        </button>
        
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
          data={users}
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
          className="display bg-white rounded-lg shadow-sm z-1"
        />
      )}
    </div>
  );
};

export default ManageReports;
