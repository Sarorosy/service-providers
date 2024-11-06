// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust the path as necessary
import ConfirmationModal from './ConfirmationModal'; // Import the ConfirmationModal component


const Header = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout confirmation modal

  const handleLogout = () => {
    setIsLogoutModalOpen(true); // Open the logout confirmation modal
  };

  const handleConfirmLogout = () => {
    sessionStorage.clear(); // Clear all user data on logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="bg-white px-4 py-2 flex justify-between items-center w-full fixed top-0 left-0 z-50 border border-b border-blue-600">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Company Logo"
          className="h-12 w-auto mr-4 ml-2"
        />
        {/* <h1 className="text-3xl font-bold text-black transition-colors duration-300">
          Service Providers
        </h1> */}
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="browny text-white py-1 px-2 text-sm rounded 
                     hover:bg-red-600 hover:shadow-lg focus:outline-none 
                     focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 
                     flex items-center space-x-2 mt-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} // Close modal on cancel
        onConfirm={handleConfirmLogout} // Call handleConfirmLogout on confirmation
        content="want to logout?"
        isReversible={false}
      />
    </header>
  );
};

export default Header;
