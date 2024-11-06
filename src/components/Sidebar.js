// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Calendar, BarChart, Users, LogOut, FileText, Settings, LayoutDashboard, FolderClosed, UserCircle2, KeyRound, Plane, CalendarDays } from 'lucide-react';

const Sidebar = () => {
  // Retrieve username and profile image from local storage
  const username = sessionStorage.getItem('name') || 'Guest'; // Default to 'Guest' if not found
  const profileImage = sessionStorage.getItem('profileImage');
  const defaultProfileImage = "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg";
  const displayProfileImage = profileImage && profileImage !== "null"
    ? 'https://serviceprovidersback.onrender.com/uploads/profileimg/' + profileImage
    : defaultProfileImage;

  console.log("Full Profile Image URL:", displayProfileImage); // Log the full URL
  return (
    <aside className="bg-white w-64 min-h-screen p-4 shadow-md fixed sidealign">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={displayProfileImage}
          alt="Profile"
          className="w-20 h-20 rounded-full mr-2"
        />
        <span className="text-md font-semibold">{username}</span>
      </div>

      <nav className="mt-4">
        <ul className='overflow-y-scroll ul'>
          {sessionStorage.getItem("adminType") === "SUPERADMIN" ? (
            <>
              <li>
                <NavLink
                  to="/admindashboard"
                  className="flex items-center rounded transition duration-100 border-bottom border-gray-400"
                >
                  <LayoutDashboard className="mr-2" height="17" width="17"/>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-notifications"
                  className="flex items-center rounded transition duration-100 border-bottom border-gray-400"
                >
                  <Bell className="mr-2" height="17" width="17"/>
                  Notifications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-holidays"
                  className="flex items-center rounded transition duration-100 border-bottom border-gray-400"
                >
                  <Calendar className="mr-2" height="17" width="17"/>
                  Holidays
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-reports"
                  className="flex items-center rounded transition duration-100 border-bottom border-gray-400"
                >
                  <BarChart className="mr-2" height="17" width="17"/>
                  Reports
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-service-provider"
                  className="flex items-center rounded transition duration-100 border-bottom border-gray-400"
                >
                  <Users className="mr-2" height="17" width="17"/>
                  Service Provider
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/work-offs"
                  className="flex items-center rounded transition duration-100 border-bottom border-gray-400 "
                >
                  <LogOut className="mr-2" height="17" width="17"/>
                  Work Offs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-work-days"
                  className="flex items-center rounded transition duration-100  border-bottom border-gray-400"
                >
                  <FileText className="mr-2" height="17" width="17"/>
                  Work Days
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-service-charge"
                  className="flex items-center rounded transition duration-100 border-gray-400 "
                >
                  <Settings className="mr-2" height="17" width="17"/>
                  Service Charge
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className="flex items-center rounded transition duration-100 my-1 border-bottom border-gray-400"
                >
                  <LayoutDashboard className="mr-2"  height="17" width="17"/>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/work-summary"
                  className="flex items-center rounded transition duration-100 my-1 border-bottom border-gray-400"
                >
                  <BarChart className="mr-2" height="17" width="17"/>
                  Work Summary
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-projects"
                  className="flex items-center rounded transition duration-100 my-1 border-bottom border-gray-400 "
                >
                  <FolderClosed className="mr-2" height="17" width="17"/>
                  Manage Projects
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-profile"
                  className="flex items-center rounded transition duration-100 my-1 border-bottom border-gray-400 "
                >
                  <UserCircle2 className="mr-2" height="17" width="17"/>
                  Manage Profile
                </NavLink>
              </li>
              {/* <li>
        <NavLink
          to="/change-password"
          className="flex items-center p-2 hover:bg-sky-200 rounded transition duration-100 my-1 border border-gray-400 transform hover:scale-105 hover:shadow-md "
        >
          <KeyRound className="mr-2 text-gray-600" />
          Change Password
        </NavLink>
      </li> */}
              <li>
                <NavLink
                  to="/manage-work-offs"
                  className="flex items-center p-2 hover:bg-sky-200 rounded transition duration-100 my-1 border-bottom border-gray-400 "
                >
                  <Plane className="mr-2" height="17" width="17"/>
                  Manage Work-Off
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/work-days"
                  className="flex items-center p-2 hover:bg-sky-200 rounded transition duration-100 my-1 border-bottom border-gray-400 "
                >
                  <CalendarDays className="mr-2" height="17" width="17"/>
                  Manage Work Days
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
