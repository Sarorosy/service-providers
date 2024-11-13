import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX, Save } from 'lucide-react';

const AddServiceProvider = ({ onClose }) => {
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
    }, []);

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

        const response = await fetch('https://serviceprovidersback.onrender.com//api/users/', {
            method: 'POST',
            body: formDataToSend,
        });

        if (response.ok) {
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
                            <CircleX  className='colorr'/>
                        </button>
                    </div>
                    <div className='px-3 n-popup-body'>
                        <form onSubmit={handleSubmit} className=' mx-auto mt-2'>
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
                                        <input
                                            type="password"
                                            id="password"
                                            name="fld_password"
                                            value={formData.fld_password}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="confirm_password">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="confirm_password"
                                            name=""
                                            value={formData.fld_password}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded w-full text-sm form-control-sm"
                                            required
                                        />
                                    </div>
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
