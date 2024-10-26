import React from 'react';
import Header from './Header'; // Ensure you have this component
import Sidebar from './Sidebar'; // Ensure you have this component
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet /> {/* Renders the child routes here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
