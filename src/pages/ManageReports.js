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
    if (sessionStorage.getItem("adminType") !== "SUPERADMIN") {
      navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users/serviceproviders'); // API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const usersData = await response.json();

      // Fetch last report for each user and sort by fld_addedon
      const usersWithLastReport = await Promise.all(usersData.map(async (user) => {
        const reportResponse = await fetch(`http://localhost:5000/api/worksummaries/user/${user._id}`);
        const reports = reportResponse.ok ? await reportResponse.json() : [];

        // Sort reports by fld_addedon in descending order
        const sortedReports = reports.sort((a, b) => new Date(b.fld_addedon) - new Date(a.fld_addedon));
        
        const lastReport = sortedReports.length > 0 ? sortedReports[0] : null; // Get the most recent report
        const lastReportDesc = lastReport ? lastReport.fld_description : 'No Report'; // Get description or set to 'No Report'
        
        return { ...user, lastReportDesc, lastReportDate: lastReport ? lastReport.fld_addedon : null }; // Combine user data with last report details
      }));

      // Sort users by the last report date in descending order
      const sortedUsers = usersWithLastReport.sort((a, b) => new Date(b.lastReportDate) - new Date(a.lastReportDate));
      
      setUsers(sortedUsers);
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

  const viewReport = (id) => {
    navigate(`/report/${id}`); // Navigate to report page with user ID
  };

  const columns = [
    
    {
      title: 'Profile',
      data: 'fld_profile_image',
      width: "100px",
      render: (data) => `
          <img src="${data && data.trim() !== "" ? `http://localhost:5000/uploads/profileimg/${data}` : 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'}" 
          alt="Profile" style="width: 40px; height: 40px; object-fit: cover;border-radius:50%" />
      `,
      orderable: false
    },
    { title: 'Name', data: 'fld_name', orderable: false },
    {
      title: 'Last Report',
      data: 'lastReportDesc',
      render: (data) => {
        return data && data.length > 50 ? `${data.substring(0, 50)}...` : data;
      },
      orderable: false
    },
    {
      title: 'Added On', // New column for added date
      data: 'lastReportDate', // The fld_addedon value
      render: (data, type) => {
        if (type === 'display') {
          return data
            ? new Date(data).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            : 'No Date'; // Format date for display or show 'No Date'
        }
        return data ? new Date(data).getTime() : 0; // Use timestamp for sorting or return 0 if no date
      },
      orderable: true // Enable sorting for this column
    },
    {
      title: 'Actions',
      render: (data, type, row) => `
        <button class="view-btn" data-id="${row._id}">View All</button>
      `,
      orderable: false
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
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-20 smt mr">
      <div className="flex justify-content-between mb-6 but">
        <h1 className="text-xl font-bold text-gray-800">Manage Reports</h1>
        <div className="flex justify-end">
          <button
            onClick={fetchUsers}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
          >
            Refresh <RefreshCw className="ml-2 ic" />
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
            order: [[3, 'desc']], // Set the default sorting by 'Added On' column (index 4)
          }}
          className="display bg-white rounded"
        />
      )}
    </div>
  );
};

export default ManageReports;
