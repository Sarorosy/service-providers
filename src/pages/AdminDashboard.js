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
    // Get the first element with class 'whitee' and set its background color
    const whiteeElement = document.getElementsByClassName('whitee')[0];
    if (whiteeElement) {
      whiteeElement.style.backgroundColor = 'white';
    }
  
    // Reset background color on cleanup
    return () => {
      if (whiteeElement) {
        whiteeElement.style.backgroundColor = '';
      }
    };
  }, []);
  


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
    if (sessionStorage.getItem("adminType") !== "SUPERADMIN" && sessionStorage.getItem("adminType") !== "SUBADMIN") {
      navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN or SUBADMIN
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
    <>
    <div className="p-2">
      <div>
        <div className="page-header py-3 mb-1">
						<h4 className="page-title h5">Dashboard</h4>
        </div>
        <div className='row mb-5'>
          <div className='col-md-12'>
          <div className='row'>
          <div className='col-md-4 d-flex'>
            <div className="bg-info text-white rounded w-100">
              <div className='d-flex align-items-center'>
                <div className='p-3'>
                <Users className="h-10 w-10" />
                </div>
                <div className='p-3'>
                  <h2 className="h6 ">Total Users</h2>
                  <p className="h4 mt-2 mb-2">{data.totalUsers}</p>
                  {/* <div className="chart-wrapper mt-3 mx-3" style="height: 70px;"><canvas data-testid="canvas" height="70" role="img" width="298" style="height: 70px; display: block; box-sizing: border-box; width: 298px;"></canvas><div className="chartjs-tooltip" style="opacity: 0; left: 213px; top: 133.712px;"><table style="margin: 0px;"><thead className="chartjs-tooltip-header"><tr className="chartjs-tooltip-header-item" style="border-width: 0px;"><th style="border-width: 0px;">May</th></tr></thead><tbody className="chartjs-tooltip-body"><tr className="chartjs-tooltip-body-item"><td style="border-width: 0px;"><span style="background: rgb(88, 86, 214); border-color: rgba(255, 255, 255, 0.55); border-width: 2px; margin-right: 10px; height: 10px; width: 10px; display: inline-block;"></span>My First dataset: 51</td></tr></tbody></table></div></div> */}
                  <button className="btn btn-light btn-sm n-btn-set" onClick={() => { navigate('/manage-service-provider') }}>View <i className="fa fa-long-arrow-right ml-1" aria-hidden="true"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 d-flex'>
            <div className="n-bg-success text-white rounded w-100">
              <div className='d-flex align-items-center'>
                <div className='p-3'>
                <UserCheck className="h-10 w-10" />
                </div>
                <div className='p-3'>
                  <h2 className="h6 ">Active Users</h2>
                  <p className="h4 mt-2 mb-2">{data.activeUsers}</p>
                  {/* <div className="chart-wrapper mt-3 mx-3" style="height: 70px;"><canvas data-testid="canvas" height="70" role="img" width="298" style="height: 70px; display: block; box-sizing: border-box; width: 298px;"></canvas><div className="chartjs-tooltip" style="opacity: 0; left: 213px; top: 133.712px;"><table style="margin: 0px;"><thead className="chartjs-tooltip-header"><tr className="chartjs-tooltip-header-item" style="border-width: 0px;"><th style="border-width: 0px;">May</th></tr></thead><tbody className="chartjs-tooltip-body"><tr className="chartjs-tooltip-body-item"><td style="border-width: 0px;"><span style="background: rgb(88, 86, 214); border-color: rgba(255, 255, 255, 0.55); border-width: 2px; margin-right: 10px; height: 10px; width: 10px; display: inline-block;"></span>My First dataset: 51</td></tr></tbody></table></div></div> */}
                  <button className="btn btn-light btn-sm n-btn-set"  onClick={() => { navigate('/manage-service-provider/active') }}>View <i className="fa fa-long-arrow-right ml-1" aria-hidden="true"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 d-flex'>
            <div className="n-bg-danger text-white rounded w-100">
              <div className='d-flex align-items-center'>
                <div className='p-3'>
                <UserMinus className="h-10 w-10" />
                </div>
                <div className='p-3'>
                  <h2 className="h6 ">Inactive Users</h2>
                  <p className="h4 mt-2 mb-2">{data.inactiveUsers}</p>
                  {/* <div className="chart-wrapper mt-3 mx-3" style="height: 70px;"><canvas data-testid="canvas" height="70" role="img" width="298" style="height: 70px; display: block; box-sizing: border-box; width: 298px;"></canvas><div className="chartjs-tooltip" style="opacity: 0; left: 213px; top: 133.712px;"><table style="margin: 0px;"><thead className="chartjs-tooltip-header"><tr className="chartjs-tooltip-header-item" style="border-width: 0px;"><th style="border-width: 0px;">May</th></tr></thead><tbody className="chartjs-tooltip-body"><tr className="chartjs-tooltip-body-item"><td style="border-width: 0px;"><span style="background: rgb(88, 86, 214); border-color: rgba(255, 255, 255, 0.55); border-width: 2px; margin-right: 10px; height: 10px; width: 10px; display: inline-block;"></span>My First dataset: 51</td></tr></tbody></table></div></div> */}
                  <button className="btn btn-light btn-sm n-btn-set"  onClick={() => { navigate('/manage-service-provider/inactive') }}>View <i className="fa fa-long-arrow-right ml-1" aria-hidden="true"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4 d-flex'>
            <div className="card n-card round w-100">
              <div className="card-header">
                <div className='d-flex align-items-center justify-content-between'>
                  <h4 className="card-title d-flex mb-0 align-items-center f-15">
                    <BellRing className="h-6 w-6 text-yellow-600 mr-3" />
                    Notifications
                  </h4>
                  <h2 className=""><span className="badge badge-warning f-11">{data.notifications.length}</span></h2>
                </div>
              </div>
              <div className="card-body">
                
                    {data.notifications.slice(0, 3).map(notification => (
                <div className="card-list">
                  <div className="item-list">
                    <div className="info-user">
                      <div key={notification._id} className="d-flex align-items-center justify-content-between">
                        <h3 className="f-12">{notification.fld_title}</h3>
                        <p className="text-gray-600 f-10">
                          {/* Format the date correctly */}
                          {new Date(notification.fld_addedon).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                  
                </div>
                    ))}
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button className="btn btn-warning btn-sm n-btn-set"  onClick={() => { navigate('/manage-notifications') }}>View Notifications <i className="fa fa-long-arrow-right ml-1" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <div className='col-md-4 d-flex'>
            <div className="card n-card round w-100">
              <div className="card-header">
                <div className='d-flex align-items-center justify-content-between'>
                  <h4 className="card-title d-flex mb-0 align-items-center f-15">
                    <Calendar1 className="h-6 w-6 text-info mr-3" />
                    Upcoming Holidays
                  </h4>
                  <h2 className=""><span className="badge badge-info f-11">{data.holidays.length}</span></h2>
                </div>
              </div>
              <div className="card-body">
                
              {data.holidays.slice(0, 3).map(holiday => (
                <div className="card-list">
                  <div className="item-list">
                    <div className="info-user">
                      <div key={holiday._id} className="d-flex align-items-center justify-content-between">
                        <h3 className="f-12">{holiday.fld_title}</h3>
                        <p className="text-gray-600 f-10">
                          {/* Format the date correctly */}
                          {new Date(holiday.fld_holiday_date).toLocaleDateString()} 
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>
                    ))}
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button className="btn btn-info btn-sm n-btn-set"  onClick={() => { navigate('/manage-holidays') }}>View Upcoming Holidays <i className="fa fa-long-arrow-right ml-1" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        </div>
            
        


        {/* <div className="col-span-2 bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold">Dashboard Chart</h2>
          <Bar data={chartData} options={{ responsive: true }} />
        </div> */}
      </div>

    </div></>
  );
};

export default AdminDashboard;
