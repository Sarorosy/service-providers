// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { BarElement, Title, Tooltip, Legend, Chart as ChartJS, CategoryScale, LinearScale } from 'chart.js';
import { UsersRound, BellRing, Calendar1, Users, UserCheck, UserMinus } from 'lucide-react'; // Importing Lucide icons
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
            <div className="bg-blue-100 shadow-md rounded px-3 py-3 text-center frbox">
              <Users className="h-10 w-10 text-blue-600 mx-auto my-1" />
              <div>
                <p className="text-2xl">{data.totalUsers}</p>
                <h2 className="text-sm font-bold">Total Users</h2>
                {/* <div class="chart-wrapper mt-3 mx-3" style="height: 70px;"><canvas data-testid="canvas" height="70" role="img" width="298" style="height: 70px; display: block; box-sizing: border-box; width: 298px;"></canvas><div class="chartjs-tooltip" style="opacity: 0; left: 213px; top: 133.712px;"><table style="margin: 0px;"><thead class="chartjs-tooltip-header"><tr class="chartjs-tooltip-header-item" style="border-width: 0px;"><th style="border-width: 0px;">May</th></tr></thead><tbody class="chartjs-tooltip-body"><tr class="chartjs-tooltip-body-item"><td style="border-width: 0px;"><span style="background: rgb(88, 86, 214); border-color: rgba(255, 255, 255, 0.55); border-width: 2px; margin-right: 10px; height: 10px; width: 10px; display: inline-block;"></span>My First dataset: 51</td></tr></tbody></table></div></div> */}
              </div>
            </div>
            <button className="cent bg-blue-500 ded1 text-white font-bold py-2 px-4 hover:bg-blue-600" onClick={() => { navigate('/manage-service-provider') }}>
              Manage Service Providers
            </button>
          </div>

          <div className='dbox'>
            <div className="bg-green-100 shadow-md rounded px-3 py-3 text-center frbox">
              <UserCheck className="h-10 w-10 text-green-600 mx-auto my-1" />
              <div>
                <p className="text-2xl">{data.activeUsers}</p>
                <h2 className="text-sm font-bold">Active Users</h2>
              </div>
            </div>
            <button className="border-0 col-md-12 bg-green-500 text-white font-bold py-1 px-2 hover:bg-green-600 ded " onClick={() => { navigate('/manage-service-provider/active') }}>
              View
            </button>
          </div>

          <div className='dbox'>
          <div className="bg-red-100 shadow-md rounded p-3 text-center frbox">
            <UserMinus className="h-10 w-10 text-red-600 mx-auto my-1" />
            <div>
              <p className="text-2xl">{data.inactiveUsers}</p>
              <h2 className="text-sm font-bold">Inactive Users</h2>
            </div>
          </div>
          <button className="border-0 col-md-12 bg-red-500 text-white font-bold py-1 px-2 hover:bg-red-600 ded" onClick={() => { navigate('/manage-service-provider/inactive') }}>
                View
              </button>
          </div>

        </div>

        <div className='flex gap-3 col-md-12 mt-5'>
          <div className='flex flex-col col-md-5 bgyy'>
            <div className="bg-yellow-100 shadow-md rounded px-3 py-2 flex">
              <BellRing className="h-6 w-6 text-yellow-600 mr-3" />
              <div className='flex sl'>
              <h2 className="text-md font-semibold mr-1">{data.notifications.length}</h2>
                <h2 className="text-md font-semibold">Notifications</h2>
              </div>


            </div>
            {data.notifications.slice(0, 3).map(notification => (
              <div key={notification._id} className="bg-white p-3">
                <h3 className="text-sm font-semibold">{notification.fld_title}</h3>
                <p className="text-gray-600">
                  {/* Format the date correctly */}
                  {new Date(notification.fld_addedon).toLocaleDateString()}
                </p>
              </div>
            ))}
            <button className="cent ded1 bg-yellow-100 font-bold py-2 px-4 hover:bg-orange-600" onClick={() => { navigate('/manage-notifications') }}>
              Manage Notifications
            </button>
          </div>



          <div className='flex flex-col col-md-6 bgpp'>
            <div className="bg-purple-100 shadow-md px-3 py-2 flex ">
              <Calendar1 className="h-6 w-6 text-purple-600 mr-3" />
              <div className='flex sl'>
              <h2 className="text-md font-semibold mr-1">{data.holidays.length}</h2>
                <h2 className="text-sm font-bold">Upcoming Holidays</h2>

              </div>
            </div>
            {data.holidays.slice(0, 3).map(holiday => (
              <div key={holiday._id} className="bg-white p-3 ">
                <h3 className="text-sm font-semibold">{holiday.fld_title}</h3>
                <p className="text-gray-600">
                  {/* Format the date correctly */}
                  {new Date(holiday.fld_holiday_date).toLocaleDateString()}
                </p>
              </div>
            ))}
            <button className="bg-purple-100  font-bold py-2 px-4 ded1 cent" onClick={() => { navigate('/manage-holidays') }}>
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
