import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';

const WorkoffView = ({ isOpen, workoffData, serviceProviders, onClose }) => {
    if (!isOpen || !workoffData) return null;

    // Find the provider details
    const provider = serviceProviders.find(provider => provider._id.toString() === workoffData.fld_service_provider_id.toString());

    // Default profile image URL
    const defaultProfileImage = 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'; // Replace with the actual default image path
    const profileImage = provider && provider.fld_profile_image ? 
      `https://serviceprovidersback.onrender.com/uploads/profileimg/${provider.fld_profile_image}` : 
      defaultProfileImage;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-2xl p-8 z-10 max-w-4xl mx-auto transition-transform transform duration-300 ease-in-out">
        <div className="flex justify-between mt-6 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Workoff Details</h2>
            <button className="bg-red-500 text-white p-1 rounded-full h-10 w-10 flex justify-center items-center hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" onClick={onClose}><CircleX /> </button>
          </div>
          
          <div className="flex items-center mb-4">
            <img src={profileImage} alt={`${provider ? provider.fld_name : 'User'}'s profile`} className="w-16 h-16 rounded-full border-2 border-gray-300 mr-4 shadow" />
            <p className="text-lg font-semibold text-gray-700">{provider ? provider.fld_name : 'Unknown User'}</p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className='flex'>
            <div className="flex flex-col w-1/2 justify-between p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-800">Start Date:</span>
              <span className="text-gray-600">{new Date(workoffData.fld_start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col w-1/2 justify-between p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-800">End Date:</span>
              <span className="text-gray-600">{new Date(workoffData.fld_end_date).toLocaleDateString()}</span>
            </div>
            </div>
            <div className='flex'>
            <div className="flex  flex-col w-1/2 justify-between p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-800">Duration:</span>
              <span className="text-gray-600">{workoffData.fld_duration}</span>
            </div>
            <div className="flex flex-col w-1/2  justify-between p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-800">Added On:</span>
              <span className="text-gray-600">{new Date(workoffData.fld_addedon).toLocaleDateString()}</span>
            </div>
            </div>
            <div className="flex justify-between p-4 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-800">Reason:</span>
              <span className="text-gray-600">{workoffData.fld_reason}</span>
            </div>
            
          </div>
          
        </div>
      </div>
    );
};

export default WorkoffView;