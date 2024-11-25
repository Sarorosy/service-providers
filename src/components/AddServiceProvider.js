import React, { useState, useEffect,useRef } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save, Eye, EyeOff } from 'lucide-react';
import $ from 'jquery';
import 'select2/dist/css/select2.css';
import 'select2';


const AddServiceProvider = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fld_username: '',
        fld_name: '',
        fld_email: '',
        fld_phone: '',
        fld_password: '',
        fld_decrypt_password: '',
        location: '',
        fld_address: '',
        fld_gender: '',
        fld_designation: '',
        fld_aadhar: '',
        fld_start_date: '',
        fld_end_date: '',
        fld_bankname: '',
        fld_accountno: '',
        fld_branch: '',
        fld_ifsc: '',
        fld_aadharcard: null, // For file upload
        fld_pancard: null, // For file upload
        fld_cancelledchequeimage: null, // For file upload
        fld_profile_image: null, // For file upload
        fld_admin_type: '', // New admin type field
        notification_add_access: false,
        notification_edit_access: false,
        notification_delete_access: false,
        holiday_add_access: false,
        holiday_edit_access: false,
        holiday_delete_access: false,
        location_add_access: false,
        location_edit_access: false,
        location_delete_access: false,
        user_add_access: false,
        user_edit_access: false,
        user_delete_access: false,
    });

    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [adminId, setAdminId] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const selectRef = useRef(null);
    useEffect(() => {
        const storedAdminId = sessionStorage.getItem('admin_id');
        if (storedAdminId) {
            setAdminId(parseInt(storedAdminId, 10)); // Convert to number if necessary
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    };
    const fetchLocations = async () => {
        setLoading(true);

        try {
            const response = await fetch('https://serviceprovidersback.onrender.com/api/locations/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);

            setLocations([]);  // Clear previous data on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (locations.length > 0 && selectRef.current) {
            $(selectRef.current).select2({
                placeholder: "Select a Location", // Placeholder text
                allowClear: true,                // Allow clearing selection
            }).on('change', (e) => {
                setFormData((prevData) => ({
                    ...prevData,
                    location: e.target.value,    // Update formData with selected location
                }));
            });
        }
    
        // Cleanup function to destroy select2 when the component unmounts or locations change
        return () => {
            console.log(selectRef.current); // Log to check if it's defined

            if (selectRef.current) {
                //$(selectRef.current).select2('destroy');
            }
        };
    }, [locations]);
    

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            location: selectedLocation,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        const response = await fetch('https://serviceprovidersback.onrender.com/api/users/new/', {
            method: 'POST',
            body: formDataToSend,
        });

        if (response.ok) {
            console.log(response)
            toast.success("Service Provider added successfully!");
            onClose();
        } else {
            toast.error("Error adding Service Provider!");
        }
        setLoading(false);
    };

    return (
        <motion.div
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >

            <div className='db'>
                <div className='wen mx-auto bg-white p-6 rounded-lg shadow-md'>
                    <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                        <h2 className="f-20 mb-0">Add Service Provider</h2>
                        <button
                            onClick={onClose}
                            className="text-white mr-2"
                        >
                            <CircleX className='colorr' />
                        </button>
                    </div>
                    <div className='px-3 n-popup-body'>
                        <form onSubmit={handleSubmit} className=' mx-auto mt-2' >
                            <input
                                type="hidden"
                                id="adminid"
                                name="fld_adminid"
                                value={adminId}
                                onChange={handleChange}
                                className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="fld_username"
                                        value={formData.fld_username}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="fld_name"
                                        value={formData.fld_name}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email ID</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="fld_email"
                                        value={formData.fld_email}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    />
                                </div>

                                
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="contact_no">Contact No.</label>
                                    <input
                                        type="tel"
                                        id="contact_no"
                                        name="fld_phone"
                                        value={formData.fld_phone}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'} // Toggle between password and text input
                                            id="password"
                                            name="fld_password"
                                            value={formData.fld_password}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded w-full text-sm form-control-sm pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 pt-1"
                                            onClick={() => setPasswordVisible(!passwordVisible)} // Toggle the password visibility
                                        >
                                            {passwordVisible ? <EyeOff width={18} /> : <Eye width={18} />} {/* Show eye icon based on visibility */}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="confirm_password">Confirm Password</label>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="confirm_password"
                                        name=""
                                        value={formData.fld_password}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="location">Location</label>
                                    <select
                                        id="location-select"
                                        value={formData.location}
                                        ref={selectRef}
                                        name='location'
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    >
                                        <option value="">Select a Location</option>
                                        {locations.map((location) => (
                                            <option key={location._id} value={location._id}>
                                                {location.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="admin_type">Admin Type</label>
                                    <select
                                        id="admin_type"
                                        name="fld_admin_type"
                                        value={formData.fld_admin_type}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    >
                                        <option value="">Select Admin Type</option>
                                        <option value="SERVICE_PROVIDER">Service Provider</option>
                                        <option value="SUBADMIN">Sub Admin</option>
                                    </select>
                                </div>
                                {formData.fld_admin_type === "SUBADMIN" && (
                                    <div className="col-span-2 bg-light p-3">
                                        <h3 className="text-lg font-semibold mb-3">Sub Admin Permissions</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {['notification', 'holiday', 'location', 'user'].map((section) => (
                                                <div key={section} className="space-y-2">
                                                    <h4 className="font-medium">{section.charAt(0).toUpperCase() + section.slice(1)} Access</h4>
                                                    {['add', 'edit', 'delete'].map((action) => (
                                                        <div key={`${section}_${action}`} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`${section}_${action}_access`}
                                                                name={`${section}_${action}_access`}
                                                                checked={formData[`${section}_${action}_access`]}
                                                                onChange={handleChange}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`${section}_${action}_access`} className="text-sm mb-0">
                                                                {`${action.charAt(0).toUpperCase() + action.slice(1)} Access`}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="fld_address"
                                        value={formData.fld_address}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="fld_gender"
                                        value={formData.fld_gender}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="work_profile">Work Profile</label>
                                    <input
                                        type="text"
                                        id="work_profile"
                                        name="fld_designation"
                                        value={formData.fld_designation}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        placeholder="Max. 4 words"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="aadhar_no">Aadhar No.</label>
                                    <input
                                        type="text"
                                        id="aadhar_no"
                                        name="fld_aadhar"
                                        value={formData.fld_aadhar}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="start_date">Start Date</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="fld_start_date"
                                        value={formData.fld_start_date}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="end_date">End Date</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="fld_end_date"
                                        value={formData.fld_end_date}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="bank_name">Bank Name</label>
                                    <input
                                        type="text"
                                        id="bank_name"
                                        name="fld_bankname"
                                        value={formData.fld_bankname}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="account_no">Account No.</label>
                                    <input
                                        type="text"
                                        id="account_no"
                                        name="fld_accountno"
                                        value={formData.fld_accountno}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="branch">Branch</label>
                                    <input
                                        type="text"
                                        id="branch"
                                        name="fld_branch"
                                        value={formData.fld_branch}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="ifsc_code">IFSC Code</label>
                                    <input
                                        type="text"
                                        id="ifsc_code"
                                        name="fld_ifsc"
                                        value={formData.fld_ifsc}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full text-sm form-control-sm"

                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="aadhar_card">Upload Aadhar Card</label>
                                    <input
                                        type="file"
                                        id="aadhar_card"
                                        name="fld_aadharcard"
                                        onChange={handleFileChange}
                                        className="border border-gray-300 rounded w-full text-sm "
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="pan_card">Upload PAN Card</label>
                                    <input
                                        type="file"
                                        id="pan_card"
                                        name="fld_pancard"
                                        onChange={handleFileChange}
                                        className="border border-gray-300 rounded w-full text-sm "
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="cheque_image">Upload Cancelled Cheque Image</label>
                                    <input
                                        type="file"
                                        id="cheque_image"
                                        name="fld_cancelledchequeimage"
                                        onChange={handleFileChange}
                                        className="border border-gray-300 rounded w-full text-sm "
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="photo">Upload Passport Size Photo</label>
                                    <input
                                        type="file"
                                        id="photo"
                                        name="fld_profile_image"
                                        onChange={handleFileChange}
                                        className="border border-gray-300 rounded w-full text-sm "
                                    />
                                </div>
                            </div>
                            <div className="mt-4 but flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white rounded px-2 py-1">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </motion.div>
    );
};

export default AddServiceProvider;
