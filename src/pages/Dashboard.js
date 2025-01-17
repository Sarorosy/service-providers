import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-sky-50 animate-fade-in bg-light">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-3 ml-64 overflow-y-auto"> {/* Adjust margin-left to the width of your Sidebar */}
          <nav className="mt-5">
            
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
