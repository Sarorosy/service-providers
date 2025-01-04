import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; // Import jQuery
import 'select2'; // Import Select2
import { CircleX, Save } from 'lucide-react';
import ReactQuill from 'react-quill'; // Import react-quill
import 'react-quill/dist/quill.snow.css'; // Import styles

const AddNotificationForm = ({ onClose , after}) => {
  const [formData, setFormData] = useState({
    fld_title: '',
    fld_description: '',
    fld_due_date: '',
    location: [],
    fld_adminid: "1", // You can change this to a dynamic value if necessary
    isForAll: false,
  });

  const [locations, setLocations] = useState([]);
  const selectRef = useRef(null); // Reference for the select element
  const [selectAll, setSelectAll] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await fetch('https://elementk.in/spbackend/api/locations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //console.log('Fetched service providers:', data);
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching service providers:', error);
        setLocations([]); // Set to empty array on error
      }
    };

    fetchServiceProviders();
  }, []);

  // Initialize Select2 when the component mounts
  useEffect(() => {
    $(selectRef.current).select2({
      placeholder: "Select Locations",
      allowClear: true,
    }).on('change', (e) => {
      setFormData((prevData) => ({
        ...prevData,
        location: Array.from(e.target.selectedOptions, option => option.value),
      }));
    });

    // Cleanup Select2
    return () => {
      $(selectRef.current).select2('destroy');
    };
  }, [locations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://elementk.in/spbackend/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log('Notification created successfully');
      toast.success("Notification created successfully!");
      onClose();
      after()
    } else {
      console.error('Error creating notification');
      toast.error("Error creating notification!");
    }
  };
  const handleQuillChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      fld_description: value, // Update the WYSIWYG content
    }));
  };

  const removeProvider = (providerId) => {
    setFormData((prevData) => {
      const updatedUserIds = prevData.location.filter(_id => _id.toString() !== providerId.toString());
      $(selectRef.current).val(updatedUserIds).trigger('change'); // Update Select2
      return {
        ...prevData,
        location: updatedUserIds,
      };
    });
  };
  const handleSelectAll = () => {
    if (!selectAll) {
      const allProviderIds = locations.map(provider => provider._id.toString());
      setFormData((prevData) => ({
        ...prevData,
        location: allProviderIds,
      }));
      $(selectRef.current).val(allProviderIds).trigger('change'); // Select all in Select2
    } else {
      setFormData((prevData) => ({
        ...prevData,
        location: [],
      }));
      $(selectRef.current).val([]).trigger('change'); // Deselect all in Select2
    }
    setSelectAll(!selectAll);
  };
  const handleRadioChange = (e) => {
    const isSelectAllChosen = e.target.value === "selectAll";
    console.log(FormData.isForAll);
    setIsSelectAll(isSelectAllChosen);
    if (e.target.value === "selectAll") {
      // If 'Select All' is chosen, select all providers
      setFormData((prevData) => ({
        ...prevData,
        location: locations.map(provider => provider._id.toString()),
        isForAll: isSelectAllChosen,
      }));
      $(selectRef.current).val(locations.map(provider => provider._id.toString())).trigger('change');
    } else {
      // If 'Select Specific' is chosen, reset the field
      setFormData((prevData) => ({
        ...prevData,
        location: [],
        isForAll: isSelectAllChosen,
      }));
      $(selectRef.current).val([]).trigger('change');
    }
  };

  return (
    <motion.div
      // initial={{ x: '100%' }}
      // animate={{ x: 0 }}
      // exit={{ x: '100%' }}
      // transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
    >
      <div className="wen mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
          <h2 className="text-2xl font-bold text-center">Add Notification</h2>
          <button
            onClick={onClose}
            className="text-white py-2 px-2 rounded-full"
          >
            <CircleX className='colorr'/>
          </button>
        </div>
        <div className='db'>
          <div className='n-popup-body ad-notf-h'>
          <div className=''>
            <form onSubmit={handleSubmit} className='mx-auto mt-2'>
              <div className='flex w-full justify-center'>
                <div className="mb-3 w-1/2 mx-1">
                  <input type='hidden' value="1" name="fld_adminid" />
                  <label className="block text-sm font-semibold mb-1" htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="fld_title"
                    value={formData.fld_title} // Updated
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full form-control-sm"
                    required
                  />
                </div>
                <div className="mb-3 w-1/2 mx-1">
                  <label className="block text-sm font-semibold mb-1" htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="fld_due_date"
                    value={formData.fld_due_date} // Updated
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full form-control-sm"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1" htmlFor="description">Description</label>
                <ReactQuill
                  id="description"
                  value={formData.fld_description} // Use the WYSIWYG editor value
                  onChange={handleQuillChange} // Handle change in the editor
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-3 flex items-center">
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="selectProvider"
                value="selectAll"
                checked={isSelectAll}
                onChange={handleRadioChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-sm">Select All Locations</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="selectProvider"
                value="selectSpecific"
                checked={!isSelectAll}
                onChange={handleRadioChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-sm">Select Specific</span>
            </label>
            
          </div>
          
              
              <div className="mb-3" style={{ display: isSelectAll ? 'none' : 'block' }}>
                <label className="block text-sm font-semibold mb-1" htmlFor="location">
                  Select Location
                </label>
                <select
                  id="location"
                  name="location" // Updated
                  multiple
                  ref={selectRef}
                  className="border border-gray-300 rounded p-2 w-full form-control-sm"
                  required
                >
                  {locations.map((provider) => (
                    <option key={provider.id} value={provider._id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
           
              {/* Display selected service providers */}
              {formData.location.length > 0 && (
                <div className="mb-3 max-w-5xl mx-auto fthirteen">
                  <label className="text-sm font-semibold my-3">Selected Locations</label>
                  <div className="flex flex-wrap mb-2 p-2 bg-gray-50 rounded-xl shadow-md">
                    {formData.location.map((providerId) => {
                      const provider = locations.find(p => p._id.toString() === providerId);
                      return (
                        provider ? (
                          <motion.div
                            key={provider._id}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center mr-2 mb-2 border border-gray-300 rounded-full bg-white px-1 py-1 shadow-sm hover:shadow-lg transition-shadow"
                          >
                            
                            <span className="font-semibold">{provider.name || 'No Name'}</span>
                            <button
                              type="button"
                              onClick={() => removeProvider(provider._id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <CircleX className='icx'/>
                            </button>
                          </motion.div>
                        ) : (
                          <span key={providerId} className="mr-2 text-red-500">Provider with ID {providerId} not found.</span>
                        )
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                {/* <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 ded bg-red-500 transition duration-300 
  hover:bg-red-600 hover:shadow-lg text-white py-1 px-1 rounded flex items-center"
                >
                  <CircleX className='mr-1 ic'/>Cancel
                </button> */}
                <div className='but'>
                  <button type="submit" className="bg-blue-600 text-white py-1 px-1 rounded flex items-center">
                    <Save className='mr-1 ic' /> Save
                  </button></div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default AddNotificationForm;