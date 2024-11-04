import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CircleX, Save } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; // Import jQuery
import 'select2'; // Import Select2

const AddHolidayForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fld_title: '',
    fld_holiday_date: '',
    selectedUsers: [], // Keep track of selected user IDs
  });

  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const selectRef = useRef(null); // Reference for the select element

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://serviceprovidersback.onrender.com/api/users/activeserviceproviders');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    $(selectRef.current).select2({
      placeholder: "Select users",
      allowClear: true,
    }).on('change', (e) => {
      setFormData((prevData) => ({
        ...prevData,
        selectedUsers: Array.from(e.target.selectedOptions, option => option.value),
      }));
    });

    return () => {
      $(selectRef.current).select2('destroy');
    };
  }, [users]);

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
      const allUserIds = users.map(user => user._id.toString());
      setFormData((prevData) => ({
        ...prevData,
        selectedUsers: allUserIds,
      }));
      $(selectRef.current).val(allUserIds).trigger('change');
    } else {
      setFormData((prevData) => ({
        ...prevData,
        selectedUsers: [],
      }));
      $(selectRef.current).val([]).trigger('change');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminId = sessionStorage.getItem('admin_id').toString();

    // Ensure unique selected user IDs as strings
    const selectedUserIds = [...new Set(formData.selectedUsers.map(userId => userId.toString()))];

    const response = await fetch('https://serviceprovidersback.onrender.com/api/holidays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fld_adminid: adminId,
        fld_userid: selectedUserIds, // Pass selected user IDs as an array of strings
        fld_title: formData.fld_title,
        fld_holiday_date: formData.fld_holiday_date,
      }),
    });

    if (response.ok) {
      toast.success("Holiday added successfully!");
      onClose();
    } else {
      toast.error("Error adding holiday!");
    }
  };

  const removeUser = (userId) => {
    setFormData((prevData) => {
      const updatedUserIds = prevData.selectedUsers.filter(_id => _id !== userId);
      $(selectRef.current).val(updatedUserIds).trigger('change'); // Update Select2
      return {
        ...prevData,
        selectedUsers: updatedUserIds,
      };
    });
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-sky-50 w-full h-full p-6 fixed top-0 right-0 z-50 overflow-y-auto shadow-lg"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white py-2 px-2 rounded-full "
      >
        <CircleX className='colorr'/>
      </button>

      <div className='db'>
        <h2 className="text-2xl font-bold mb-3 text-center">Add Holiday</h2>
        <div className='wen1 mx-auto bg-white p-6 rounded-lg shadow-md'>
          <form onSubmit={handleSubmit} className='mx-auto mt-2'>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="holidayName">Holiday Name</label>
              <input
                type="text"
                id="holidayName"
                name="fld_title"
                value={formData.fld_title}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="holidayDate">Holiday Date</label>
              <input
                type="date"
                id="holidayDate"
                name="fld_holiday_date"
                value={formData.fld_holiday_date}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="serviceProvider">
                Select Users
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label htmlFor="selectAll" className="text-sm">Select All Service Providers</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="serviceProvider">
                Select Users
              </label>
              <select
                id="serviceProvider"
                name="selectedUsers"
                multiple
                ref={selectRef}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fld_name}
                  </option>
                ))}
              </select>
            </div>

            {formData.selectedUsers.length > 0 && (
              <div className="mb-4 max-w-5xl mx-auto">
                <label className="text-sm font-medium my-3">Selected Users</label>
                <div className="flex flex-wrap mb-2 p-2 bg-gray-50 rounded-xl shadow-md">
                  {formData.selectedUsers.map((userId) => {
                    const user = users.find(u => u._id === userId);
                    return (
                      user ? (
                        <div
                          key={user._id}
                          className="flex items-center mr-2 mb-2 border border-gray-300 rounded-full bg-white p-2 shadow-sm hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={user.fld_profile_image && user.fld_profile_image !== ""
                              ? 'https://serviceprovidersback.onrender.com/uploads/profileimg/' + user.fld_profile_image
                              : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"}
                            alt={user.fld_username || 'No Name'}
                            className="w-10 h-10 rounded-full border border-gray-200"
                          />
                          <span className="mx-2 text-gray-800 font-semibold">{user.fld_name}</span>
                          <button
                            type="button"
                            onClick={() => removeUser(user._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <CircleX />
                          </button>
                        </div>
                      ) : (
                        <span key={userId} className="mr-2 text-red-500">User with ID {userId} not found.</span>
                      )
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-red-500 transition duration-300 
 hover:bg-red-600 hover:shadow-lg text-white py-1 px-2 rounded flex"
              >
                <CircleX className='mr-2 ic' width="24" height="24" /> Cancel
              </button>
              <div className='but'>
                <button type="submit" className="bg-blue-600 text-white py-1 px-2 rounded flex">
                  <Save className='mr-2 ic' width="24" height="24" /> Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default AddHolidayForm;
