// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import the new layout
import ManageNotifications from './pages/ManageNotification';
import './output.css';
import './styles.css';
import 'select2/dist/css/select2.min.css';
import ManageHolidays from './pages/ManageHolidays';
import ManageReports from './pages/ManageReports';
import UserWorkSummary from './pages/UserWorkSummary';
import ManageServiceProvider from './pages/ManageServiceProvider';
import ManageWorkoffs from './pages/ManageWorkOffs';
import ManageWorkDays from './pages/ManageWorkDays';
import UserWorkDays from './components/UserWorkDays';
import ManageServiceCharge from './pages/ManageServiceCharge';
import ManageUserWorkoff from './pages/ManageUserWorkoff';
import NoAccessPage from './pages/NoAccessPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/users/UserDashboard';
import ManageWorkSummary from './pages/users/ManageWorkSummary';
import ManageProjects from './pages/users/ManageProjects';
import ManageProfile from './pages/users/ManageProfile';
import ChangePassword from './pages/users/ChangePassword';
import ManageUserWorkOffs from './pages/users/ManageUserWorkOffs';
import UserWorkDayss from './pages/users/ManageWorkDays'


function App() {

  const adminType = sessionStorage.getItem("adminType");
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" > 
          
            <Route path="manage-notifications" element={<ManageNotifications />} />
            <Route path="manage-holidays" element={<ManageHolidays />} />
            <Route path="manage-reports" element={<ManageReports />} />
            <Route path="report/:id" element={<UserWorkSummary />} />
            <Route path="/manage-service-provider" element={< ManageServiceProvider />} />
            <Route path="/manage-service-provider/active" element={<ManageServiceProvider />} />
              <Route path="/manage-service-provider/inactive" element={<ManageServiceProvider />} />
            <Route path="/work-offs" element={< ManageWorkoffs />} />
            <Route path="/manage-work-off/:id" element={< ManageUserWorkoff />} />
            <Route path="/manage-work-days" element={<ManageWorkDays />} />
            <Route path="/userworkdays/:id" element={<UserWorkDays />} />
            <Route path="/manage-service-charge" element={<ManageServiceCharge />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />

            {/* user routes below */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/work-summary" element={<ManageWorkSummary />} />
            <Route path="/manage-projects" element={<ManageProjects />} />
            <Route path="/manage-profile" element={<ManageProfile />} />
            {/* <Route path="/change-password" element={<ChangePassword />} /> */}
            <Route path="/manage-work-offs" element={<ManageUserWorkOffs />} />
            <Route path="/work-days" element={<UserWorkDayss />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

// Create a private route component to handle authentication https://serviceprovidersback.onrender.com//
const PrivateRoute = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const adminId = sessionStorage.getItem('userId');
    const adminEmail = sessionStorage.getItem('email');
    const adminType = sessionStorage.getItem('adminType');

    if (!adminId || !adminEmail) {
      navigate('/login');
    }

    if (adminType === "SERVICE_PROVIDER") {
      const requiredFields = [
        'username', 'name', 'email', 'phone', 'gender',
        'address', 'designation', 'aadhar', 'bankName',
        'accountNo', 'branch', 'ifsc'
      ];

      // Check for any empty or null fields
      const isIncomplete = requiredFields.some(field => {
        const value = sessionStorage.getItem(field);
        return !value || value === "null";
      });

      if (isIncomplete) {
        navigate('/manage-profile', { state: { message: "Please fill all the details to access other pages" } });
      }
    }

  }, [navigate]);

  return <Dashboard/>; 
};

export default App;
