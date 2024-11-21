import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CircleX, Save } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; // Import jQuery
import 'select2'; // Import Select2

const AddHolidayForm = ({ onClose, after }) => {
  const [formData, setFormData] = useState({
    fld_title: '',
    fld_holiday_date: '',
    selectedLocations: [], // Keep track of selected location IDs
  });

  const [locations, setLocations] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const selectRef = useRef(null); // Reference for the select element
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://serviceprovidersback.onrender.com/api/locations/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    $(selectRef.current).select2({
      placeholder: "Select locations",
      allowClear: true,
    }).on('change', (e) => {
      setFormData((prevData) => ({
        ...prevData,
        selectedLocations: Array.from(e.target.selectedOptions, option => option.value),
      }));
    });

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

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allUserIds = locations.map(location => location._id.toString());
      setFormData((prevData) => ({
        ...prevData,
        selectedLocations: allUserIds,
      }));
      $(selectRef.current).val(allUserIds).trigger('change');
    } else {
      setFormData((prevData) => ({
        ...prevData,
        selectedLocations: [],
      }));
      $(selectRef.current).val([]).trigger('change');
    }
  };
  const handleRadioChange = (e) => {
    setIsSelectAll(e.target.value === "selectAll");
    if (e.target.value === "selectAll") {
      // If 'Select All' is chosen, select all providers
      setFormData((prevData) => ({
        ...prevData,
        selectedLocations: locations.map(provider => provider._id.toString()),
      }));
      $(selectRef.current).val(locations.map(provider => provider._id.toString())).trigger('change');
    } else {
      // If 'Select Specific' is chosen, reset the field
      setFormData((prevData) => ({
        ...prevData,
        selectedLocations: [],
      }));
      $(selectRef.current).val([]).trigger('change');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminId = sessionStorage.getItem('admin_id').toString();

    // Ensure unique selected location IDs as strings
    const selectedUserIds = [...new Set(formData.selectedLocations.map(locationId => locationId.toString()))];

    const response = await fetch('https://serviceprovidersback.onrender.com/api/holidays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fld_adminid: adminId,
        location: selectedUserIds, // Pass selected location IDs as an array of strings
        fld_title: formData.fld_title,
        fld_holiday_date: formData.fld_holiday_date,
      }),
    });

    if (response.ok) {
      toast.success("Holiday added successfully!");
      onClose();
      after();
    } else {
      toast.error("Error adding holiday!");
    }
  };

  const removeUser = (locationId) => {
    setFormData((prevData) => {
      const updatedUserIds = prevData.selectedLocations.filter(_id => _id !== locationId);
      $(selectRef.current).val(updatedUserIds).trigger('change'); // Update Select2
      return {
        ...prevData,
        selectedLocations: updatedUserIds,
      };
    });
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
          <h2 className="text-2xl font-bold text-center">Add Holiday</h2>
          <button
            onClick={onClose}
            className="text-white py-2 px-2 rounded-full "
          >
            <CircleX className='colorr'/>
          </button>
        </div>
      <div className='db'>
        
        <div className='n-popup-body ad-holdy-h'>
          <form onSubmit={handleSubmit} className='mx-auto mt-2 row'>
            <div className="mb-3 col-md-6">
              <label className="block text-sm font-semibold mb-1" htmlFor="holidayName">Holiday Name</label>
              <input
                type="text"
                id="holidayName"
                name="fld_title"
                value={formData.fld_title}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full form-control-sm"
                required
              />
            </div>
            <div className="mb-4 col-md-6">
              <label className="block text-sm font-semibold mb-1" htmlFor="holidayDate">Holiday Date</label>
              <input
                type="date"
                id="holidayDate"
                name="fld_holiday_date"
                value={formData.fld_holiday_date}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full form-control-sm"
                required
              />
            </div>
            <div className="mb-3 flex items-center justify-around col-md-12">
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

            <div className="mb-3 col-md-12" style={{ display: isSelectAll ? 'none' : 'block' }}>
              <label className="block text-sm font-semibold mb-1" htmlFor="serviceProvider">
                Select Locations
              </label>
              <select
                id="serviceProvider"
                name="selectedLocations"
                multiple
                ref={selectRef}
                className="border border-gray-300 rounded p-2 w-full form-control-sm w-100"
                required
              >
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.selectedLocations.length > 0 && (
              <div className="mb-3 max-w-5xl mx-auto fthirteen">
                <label className="text-sm font-semibold mb-3">Selected Locations</label>
                <div className="flex flex-wrap mb-2 p-2 bg-gray-50 rounded-xl shadow-md">
                  {formData.selectedLocations.map((locationId) => {
                    const location = locations.find(u => u._id === locationId);
                    return (
                      location ? (
                        <div
                          key={location._id}
                          className="flex items-center mr-2 mb-2 border border-gray-300 rounded-full bg-white px-1 py-1 shadow-sm hover:shadow-lg transition-shadow"
                        >
                          
                          <span className="mx-2 text-gray-800 font-semibold">{location.name}</span>
                          <button
                            type="button"
                            onClick={() => removeUser(location._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <CircleX size={15}/>
                          </button>
                        </div>
                      ) : (
                        <span key={locationId} className="mr-2 text-red-500">User with ID {locationId} not found.</span>
                      )
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <div className='but'>
                <button type="submit" className="bg-blue-600 text-white py-1 px-1 rounded flex items-center">
                  <Save className='mr-1 ic' /> Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default AddHolidayForm;
