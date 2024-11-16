import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';

const EditServiceProvider = ({ onClose, serviceProviderId }) => {
    const [formData, setFormData] = useState({
        fld_username: '',
        fld_name: '',
        fld_email: '',
        fld_phone: '',
        fld_password: '',
        fld_decrypt_password: '',
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
    });

    const [loading, setLoading] = useState(false);
    const [adminId, setAdminId] = useState(1);

    useEffect(() => {
        const storedAdminId = sessionStorage.getItem('admin_id');
        if (storedAdminId) {
            setAdminId(parseInt(storedAdminId, 10)); // Convert to number if necessary
        }

        // Fetch service provider data for editing
        const fetchServiceProvider = async () => {
            const response = await fetch(`https://serviceprovidersback.onrender.com/api/users/find/${serviceProviderId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.fld_start_date) {
                    data.fld_start_date = data.fld_start_date.substring(0, 10); // Get the date part
                }
                if (data.fld_end_date) {
                    data.fld_end_date = data.fld_end_date.substring(0, 10); // Get the date part
                }
                console.log(data)
                setFormData({ ...data });
            } else {
                toast.error("Error fetching service provider data!");
            }
        };

        if (serviceProviderId) {
            fetchServiceProvider();
        }
    }, [serviceProviderId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        const response = await fetch(`https://serviceprovidersback.onrender.com/api/users/${serviceProviderId}`, {
            method: 'PUT',
            body: formDataToSend,
        });

        if (response.ok) {
            toast.success("Service Provider updated successfully!");
            onClose();
        } else {
            toast.error("Error updating Service Provider!");
        }
        setLoading(false);
    };
    
    const LoadingModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 w-screen h-screen z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
                <RevolvingDot
                    height="80"
                    width="80"
                    radius="9"
                    color="#007bff"
                    secondaryColor="#007bff"
                    ariaLabel="revolving-dot-loading"
                />
                <p className="mt-4 text-lg">Updating user...</p>
            </div>
        </div>
    );
    

    return (
        <motion.div
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >
            <div className='went mx-auto bg-white p-6 rounded-lg shadow-md'>
            <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
            <h2 className="text-xl font-bold text-gray-800">Edit Service Provider</h2>
            {loading && <LoadingModal />} 
            <button
                onClick={onClose}
                className=""
            >
                <CircleX />
            </button>
            </div>
            <div className=' n-popup-body'>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-2">
                <input
                    type="hidden"
                    id="adminid"
                    name="fld_adminid"
                    value={adminId}
                    onChange={handleChange}
                    className="border border-gray-300 rounded w-full text-sm form-control-sm"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {/* Username */}
                    <div className="mb-4">
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

                    {/* Name */}
                    <div className="mb-4">
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

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
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

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="fld_phone"
                            value={formData.fld_phone}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="decrypt_password">Password</label>
                        <input
                            type="text"
                            id="decrypt_password"
                            name="fld_decrypt_password"
                            value={formData.fld_decrypt_password}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Decrypt Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="decrypt_password">Confirm Password</label>
                        <input
                            type="text"
                            id="decrypt_password"
                            name="fld_decrypt_password"
                            value={formData.fld_decrypt_password}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="fld_address"
                            value={formData.fld_address}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="fld_gender"
                            value={formData.fld_gender}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Designation */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="designation">Designation</label>
                        <input
                            type="text"
                            id="designation"
                            name="fld_designation"
                            value={formData.fld_designation}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Aadhar */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="aadhar">Aadhar</label>
                        <input
                            type="text"
                            id="aadhar"
                            name="fld_aadhar"
                            value={formData.fld_aadhar}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div className="mb-4">
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

                    {/* End Date */}
                    <div className="mb-4">
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

                    {/* Bank Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="bankname">Bank Name</label>
                        <input
                            type="text"
                            id="bankname"
                            name="fld_bankname"
                            value={formData.fld_bankname}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Account Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="accountno">Account Number</label>
                        <input
                            type="text"
                            id="accountno"
                            name="fld_accountno"
                            value={formData.fld_accountno}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* Branch */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="branch">Branch</label>
                        <input
                            type="text"
                            id="branch"
                            name="fld_branch"
                            value={formData.fld_branch}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>

                    {/* IFSC */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="ifsc">IFSC Code</label>
                        <input
                            type="text"
                            id="ifsc"
                            name="fld_ifsc"
                            value={formData.fld_ifsc}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                            required
                        />
                    </div>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-6 edit-i-s">

                        {/* Profile Image */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="profile_image">Profile Image</label>
                            {formData.fld_profile_image ? (
                                <div className="relative">
                                    <img
                                        src={`https://serviceprovidersback.onrender.com/uploads/profileimg/${formData.fld_profile_image}`}
                                        alt="Profile"
                                        className="border rounded p-2 w-2/3"
                                    />
                                    <button
                                        className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded"
                                        onClick={() => setFormData({ ...formData, fld_profile_image: null })}
                                    >
                                        <CircleX />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    id="profile_image"
                                    name="fld_profile_image"
                                    onChange={handleFileChange}
                                    className="border border-gray-300 rounded w-full"
                                />
                            )}
                        </div>

                        {/* Aadhar Card */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="aadharcard">Upload Aadhar Card</label>
                            {formData.fld_aadharcard ? (
                                <div className="relative">
                                    <img
                                        src={`https://serviceprovidersback.onrender.com/uploads/aadharcard/${formData.fld_aadharcard}`}
                                        alt="Aadhar Card"
                                        className="border rounded p-2 w-2/3"
                                    />
                                    <button
                                        className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded"
                                        onClick={() => setFormData({ ...formData, fld_aadharcard: null })}
                                    >
                                        <CircleX />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    id="aadharcard"
                                    name="fld_aadharcard"
                                    onChange={handleFileChange}
                                    className="border border-gray-300 rounded w-full"
                                />
                            )}
                        </div>

                        {/* PAN Card */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="pancard">Upload PAN Card</label>
                            {formData.fld_pancard ? (
                                <div className="relative">
                                    <img
                                        src={`https://serviceprovidersback.onrender.com/uploads/pancard/${formData.fld_pancard}`}
                                        alt="PAN Card"
                                        className="border rounded p-2 w-2/3"
                                    />
                                    <button
                                        className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded"
                                        onClick={() => setFormData({ ...formData, fld_pancard: null })}
                                    >
                                        <CircleX />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    id="pancard"
                                    name="fld_pancard"
                                    onChange={handleFileChange}
                                    className="border border-gray-300 rounded w-full"
                                />
                            )}
                        </div>

                        {/* Cancelled Cheque Image */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="cancelledchequeimage">Upload Cancelled Cheque</label>
                            {formData.fld_cancelledchequeimage ? (
                                <div className="relative">
                                    <img
                                        src={`https://serviceprovidersback.onrender.com/uploads/cancelledchequeimage/${formData.fld_cancelledchequeimage}`}
                                        alt="Cancelled Cheque"
                                        className="border rounded p-2 w-2/3"
                                    />
                                    <button
                                        className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded"
                                        onClick={() => setFormData({ ...formData, fld_cancelledchequeimage: null })}
                                    >
                                        <CircleX />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    id="cancelledchequeimage"
                                    name="fld_cancelledchequeimage"
                                    onChange={handleFileChange}
                                    className="border border-gray-300 rounded  w-full"
                                />
                            )}
                        </div>


                    </div>

                        {/* Submit Button */}
                        <div className='flex justify-end but mt-3'>
                            <button
                                type="submit"
                                className="text-white py-1 px-1 rounded col-span-2 flex items-center"
                            >
                                Update Service Provider
                            </button>
                        </div>
                    
                    </form>

            
            </div>
            </div>
                    <ToastContainer />
                </motion.div>
                );
};

                export default EditServiceProvider;
