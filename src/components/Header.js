// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-elk.png'; // Adjust the path as necessary
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
    <header className=" px-2 py-2 flex justify-between items-center w-full fixed top-0 left-0 z-50 n-nav-bg">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Company Logo"
          className="nav-logo"
        />
        {/* <h1 className="text-3xl font-bold text-black transition-colors duration-300">
          Service Providers
        </h1> */}
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="n-log-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out mr-1">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} // Close modal on cancel
        onConfirm={handleConfirmLogout} // Call handleConfirmLogout on confirmation
        content="Are you sure you want to logout?"
        isReversible={false}
      />
    </header>
  );
};

export default Header;
