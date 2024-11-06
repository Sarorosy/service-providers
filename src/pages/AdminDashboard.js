// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { BarElement, Title, Tooltip, Legend, Chart as ChartJS, CategoryScale, LinearScale } from 'chart.js';
import { UsersRound, BellRing, Calendar1 } from 'lucide-react'; // Importing Lucide icons
import { useNavigate } from 'react-router-dom';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    notifications: [],
    holidays: [],
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your endpoints
        const [serviceProvidersResponse, holidaysResponse, notificationsResponse] = await Promise.all([
          axios.get('https://serviceprovidersback.onrender.com/api/users/serviceproviders'),
          axios.get('https://serviceprovidersback.onrender.com/api/holidays'),
          axios.get('https://serviceprovidersback.onrender.com/api/notifications'),
        ]);

        const serviceProviders = serviceProvidersResponse.data;
        const holidays = holidaysResponse.data;

        // Get current date
        const today = new Date();

        // Filter holidays to get only upcoming holidays
        const upcomingHolidays = holidays.filter(holiday => new Date(holiday.fld_holiday_date) >= today);

        // Set state based on fetched data
        setData({
          totalUsers: serviceProviders.length,
          activeUsers: serviceProviders.filter(sp => sp.status === 'Active').length,
          inactiveUsers: serviceProviders.filter(sp => sp.status === 'Inactive').length,
          notifications: notificationsResponse.data,
          holidays: upcomingHolidays, // Store the array of upcoming holidays
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("adminType") != "SUPERADMIN") {
      navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
    }
  }, [navigate]);

  // const chartData = {
  //   labels: ['Total Users', 'Active Users', 'Inactive Users', 'Notifications', 'Holidays'],
  //   datasets: [
  //     {
  //       label: 'Counts',
  //       data: [
  //         data.totalUsers,
  //         data.activeUsers,
  //         data.inactiveUsers,
  //         data.notifications,
  //         data.holidays,
  //       ],
  //       backgroundColor: [
  //         'rgba(75, 192, 192, 0.6)',
  //         'rgba(54, 162, 235, 0.6)',
  //         'rgba(255, 99, 132, 0.6)',
  //         'rgba(255, 206, 86, 0.6)',
  //         'rgba(153, 102, 255, 0.6)',
  //       ],
  //     },
  //   ],
  // };

  return (
    <div className="p-4">
      <div>

        <div className='flex gap-3 col-md-12 mb-2'>
          <div className='flex flex-col col-md-4'>
            <div className="bg-blue-100 shadow-md rounded px-3 py-3 flex">
              <UsersRound className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-sm font-bold">Total Users</h2>
                <p className="text-2xl">{data.totalUsers}</p>
              </div>
            </div>
            <button className="cent bg-blue-500 ded1 text-white font-bold py-2 px-4 hover:bg-blue-600" onClick={() => { navigate('/manage-service-provider') }}>
              Manage Service Providers
            </button>
          </div>

          <div className="bg-green-100 shadow-md rounded p-3 flex dbox">
            <UsersRound className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-sm font-bold">Active Users</h2>
              <p className="text-2xl">{data.activeUsers}</p>
              <button className="bg-green-500 text-white font-bold py-1 px-2 rounded hover:bg-green-600 mt-1 ded" onClick={() => { navigate('/manage-service-provider/active') }}>
                View
              </button>
            </div>
          </div>

            <div className="bg-red-100 shadow-md rounded p-3 flex dbox">
              <UsersRound className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h2 className="text-sm font-bold">Inactive Users</h2>
                <p className="text-2xl">{data.inactiveUsers}</p>
                <button className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-600 mt-1 ded" onClick={() => { navigate('/manage-service-provider/inactive') }}>
                  View
                </button>
              </div>
            </div>

        </div>

        <div className='flex gap-3 col-md-12'>
        <div className='flex flex-col col-md-4'>
          <div className="bg-yellow-100 shadow-md rounded p-3 flex">
            <BellRing className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h2 className="text-sm font-bold">Notifications</h2>
              <p className="text-2xl">{data.notifications.length}</p>
            </div>


          </div>
          {data.notifications.slice(0, 3).map(notification => (
            <div key={notification._id} className="bg-purple-50 p-3 rounded mt-2 shadow-md">
              <h3 className="text-sm font-semibold">{notification.fld_title}</h3>
              <p className="text-gray-600">
                {/* Format the date correctly */}
                {new Date(notification.fld_addedon).toLocaleDateString()}
              </p>
            </div>
          ))}
          <button className="cent ded1 bg-orange-500 text-white font-bold py-2 px-4 hover:bg-orange-600" onClick={() => { navigate('/manage-notifications') }}>
            Manage Notifications
          </button>
        </div>

        <div className='flex flex-col col-md-7'>
          <div className="bg-purple-100 shadow-md rounded p-3 flex">
            <Calendar1 className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h2 className="text-sm font-bold">Upcoming Holidays</h2>
              <p className="text-2xl">{data.holidays.length}</p>

            </div>
          </div>
          {data.holidays.slice(0, 3).map(holiday => (
            <div key={holiday._id} className="bg-purple-50 p-3 rounded mt-2 shadow-md">
              <h3 className="text-sm font-semibold">{holiday.fld_title}</h3>
              <p className="text-gray-600">
                {/* Format the date correctly */}
                {new Date(holiday.fld_holiday_date).toLocaleDateString()}
              </p>
            </div>
          ))}
          <button className="bg-green-500 text-white font-bold py-2 px-4 hover:bg-green-600 ded1 cent" onClick={() => { navigate('/manage-holidays') }}>
            Manage Holidays
          </button>
        </div>
</div>


        {/* <div className="col-span-2 bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold">Dashboard Chart</h2>
          <Bar data={chartData} options={{ responsive: true }} />
        </div> */}
      </div>

    </div>
  );
};

export default AdminDashboard;
