import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';

const WorkoffView = ({ isOpen, workoffData, serviceProviders, onClose }) => {
  if (!isOpen || !workoffData) return null;

  // Find the provider details
  const provider = serviceProviders.find(provider => provider._id.toString() === workoffData.fld_adminid.toString());

  // Default profile image URL
  const defaultProfileImage = 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg'; // Replace with the actual default image path
  const profileImage = provider && provider.fld_profile_image ?
    `https://elementk.in/spbackend/uploads/profileimg/${provider.fld_profile_image}` :
    defaultProfileImage;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-2xl p-8 z-10 wen1 mx-auto transition-transform transform duration-300 ease-in-out">
       
       <div className='flex justify-end'>
       <button className="absolute top-4 right-4 text-white py-2 px-2 rounded-full" onClick={onClose}><CircleX className='colorr'/> </button>
       </div>
       
        <div className='ml-2 db'>
          <h2 className="text-xl font-bold mb-2">Workoff Details</h2>
        </div>

        <div className='flex justify-between'>
          <div className="cent1 col-md-4">
            <img src={profileImage} alt={`${provider ? provider.fld_name : 'User'}'s profile`} className="w-16 h-16 rounded-full border-2 border-gray-300 shadow mr-2" />
            <p className="text-lg font-semibold">{provider ? provider.fld_name : 'Unknown User'}</p>
          </div>
          <div className="flex flex-col space-y-2 col-md-8 text-sm">
            <div className="flex p-2 bbwd">
              <span className="font-semibold text-gray-800">Start Date:&nbsp;</span>
              <span className="text-gray-600">{new Date(workoffData.fld_start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex p-2 bbwd">
              <span className="font-semibold text-gray-800">End Date:&nbsp;</span>
              <span className="text-gray-600">{new Date(workoffData.fld_end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex p-2 bbwd">
              <span className="font-semibold text-gray-800">Duration:&nbsp;</span>
              <span className="text-gray-600">{workoffData.fld_duration.$numberDecimal}</span>
            </div>
            <div className="flex p-2 bbwd">
              <span className="font-semibold text-gray-800">Added On:&nbsp;</span>
              <span className="text-gray-600">{new Date(workoffData.fld_addedon).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="p-3 border border-gray-300 rounded shadow-md mt-3 text-sm">
              <span className="font-semibold text-gray-800" style={{color: "#2d6a9d" }}>Reason: &nbsp;</span>
              <span className="text-gray-600 elips-text">{workoffData.fld_reason}</span>
            </div>


      </div>
    </div>
  );
};

export default WorkoffView;