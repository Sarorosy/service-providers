import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleX, Pen, Settings2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Briefcase, Landmark, Image } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import EditServiceProvider from '../components/EditServiceProvider';
import { AnimatePresence } from 'framer-motion';
import ManageUserWorkoff from '../pages/ManageUserWorkoff';
import ManageUserServiceCharge from '../pages/ManageUserServiceCharge';
import axios from 'axios';

const ViewServiceProvider = ({ serviceProviderId, onClose }) => {
    const { id } = useParams(); // Get the service provider ID from URL params
    const [serviceProvider, setServiceProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isManageWorkOffOpen, setIsManageWorkOffOpen] = useState(false);
    const [selectedServiceProviderId, setSelectedServiceProviderId] = useState(null);
    const [workoffs, setWorkoffs] = useState([]);
    const [serviceCharges, setServiceCharges] = useState([]);
    const [isServiceChargeOpen, setIsServiceChargeOpen] = useState(false);
    const [location, setLocation] = useState(null);

    const fetchServiceProvider = async () => {
        try {
            const response = await fetch(`https://elementk.in/spbackend/api/users/find/${serviceProviderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch User');
            }
            const data = await response.json();
            setServiceProvider(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching service provider:', error);
            setError('Failed to load service provider details.');
            setLoading(false);
        }
    };
    useEffect(() => {
       

        fetchServiceProvider();
    }, [id, serviceProviderId]);
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                if (serviceProvider && serviceProvider.location) {
                    const response = await fetch(`https://elementk.in/spbackend/api/locations/${serviceProvider.location}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch location');
                    }
                    const locationData = await response.json();
                    setLocation(locationData); // Store the location name in the state
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchLocation();
    }, [serviceProvider]);

    useEffect(() => {
        setLoading(true);
        fetch(`https://elementk.in/spbackend/api/manageworkoffs/first/${serviceProviderId}`)
            .then(response => response.json())
            .then(data => {
                setWorkoffs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching manage workoffs:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchServiceCharges = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://elementk.in/spbackend/api/servicecharge/user/${serviceProviderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch service charges');
                }
                const data = await response.json();
                setServiceCharges(data); // Set the fetched service charges array in state
            } catch (error) {
                setError(error.message); // Handle error
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (serviceProviderId) {
            fetchServiceCharges(); // Fetch data if serviceProviderId is provided
        }
    }, [serviceProviderId]);


    const approveFile = async (serviceProviderId, fileType) => {
        try {
            const response = await axios.post("https://elementk.in/spbackend/api/users/approvefiles", {
                serviceProviderId,
                fileType
            });
            if (response.status) {
                toast.success(response.data.message); // Display success toast
                console.log("File approved:", response.data);
                fetchServiceProvider();
            }
        } catch (error) {
            toast.error("Error approving file");
            console.error("Error approving file:", error);
        }
    };
    const approveEditRequest = async (serviceProviderId, fileType, code) => {
        try {
            const response = await axios.post("https://elementk.in/spbackend/api/users/filerequest", {
                serviceProviderId,
                fileType,
                code
            });
            if (response.status) {
                toast.success(response.data.message); 
                console.log("File approved:", response.data);
                fetchServiceProvider();
            }
        } catch (error) {
            toast.error("Error approving file");
            console.error("Error approving file:", error);
        }
    };


    if (error) {
        return <div>{error}</div>;
    }

    const imageUrl = (type, fileName) => {
        return fileName && fileName !== ''
            ? `https://elementk.in/spbackend/uploads/${type}/${fileName}`
            : null;
    };
    const handleEditClick = (id) => {
        setSelectedServiceProviderId(id); // Set the selected service provider ID
        setIsEditOpen(true); // Open the edit form
    };
    const handleManageWorkOff = (id) => {

        setSelectedServiceProviderId(id); // Set the selected service provider ID
        setIsManageWorkOffOpen(true); // Open the edit form
        window.scrollTo(0, 0);
    };


    const handleManageCharge = (userId) => {
        console.log(`Manage service charge with ID: ${userId}`);
        setSelectedServiceProviderId(userId); // Set the selected service provider ID
        setIsServiceChargeOpen(true);
    };

    return (
        <motion.div
            // initial={{ x: '100%' }}
            // animate={{ x: 0 }}
            // exit={{ x: '100%' }}
            // transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full p-6 fixed top-0 right-0 z-50 shadow-lg n-pop-up"
        >


            <AnimatePresence>
                {isEditOpen && (
                    <EditServiceProvider
                        serviceProviderId={selectedServiceProviderId}
                        onClose={() => setIsEditOpen(false)} // Close the edit form
                        after={fetchServiceProvider}
                    />
                )}
                {isManageWorkOffOpen && (

                    <ManageUserWorkoff
                        serviceProviderId={selectedServiceProviderId}
                        onClose={() => setIsManageWorkOffOpen(false)} // Close the edit form
                    />
                )}
                {isServiceChargeOpen && (

                    <ManageUserServiceCharge
                        serviceProviderId={selectedServiceProviderId}
                        onClose={() => setIsServiceChargeOpen(false)} // Close the edit form
                    />
                )}
            </AnimatePresence>

            <div className='db'>
                <div className="n-wenn mx-auto bg-white p-6 rounded-lg shadow-md">
                    {loading ? (<div className='d-flex justify-content-center '><RevolvingDot
                        visible={true}
                        height="50"
                        width="50"
                        color="#3b82f6" // Tailwind blue-600
                        ariaLabel="revolving-dot-loading"
                    /></div>) : (
                        <>
                            <div className='n-pop-up-head d-flex justify-content-between align-items-center mb-4 border-bottom pb-3'>
                                <h2 className="f-20">Service Provider Details</h2>
                                <div>
                                    {(sessionStorage.getItem("adminType") === "SUPERADMIN" || sessionStorage.getItem("user_edit_access") == 'true') && (

                                        <button
                                            onClick={() => handleEditClick(serviceProviderId)} // Pass the service provider ID
                                            data-id={serviceProviderId}
                                            className="mr-2 px-2 py-1 CircleX-edit rounded"
                                        >
                                            <Pen className='edit-hover' />
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="text-white mr-2 "
                                    >
                                        <CircleX className='colorr' />
                                    </button>
                                </div>
                            </div>
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                            {serviceProvider ? (
                                <div className='n-popup-body'>

                                    <div className='row'>
                                        <div className='col-md-9'>
                                            {/* Personal Information Section */}
                                            <div className="pb-3 pl-3 viewinfo ">
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                    <User className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Personal Info */}
                                                    Personal Information
                                                </h3>
                                                <div className="flex flex-col space-y-2">
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Username</strong>
                                                        </p>
                                                        <p>: {serviceProvider.fld_username}
                                                        </p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Name</strong></p>
                                                        <p className="text-left">: {serviceProvider.fld_name}</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Email</strong></p>
                                                        <p className="text-left">: {serviceProvider.fld_email}</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Contact No</strong></p>
                                                        <p className="text-left">: {serviceProvider.fld_phone}</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Password</strong></p>
                                                        <p className="text-left">: {serviceProvider.fld_decrypt_password}</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Address</strong></p>
                                                        <p className="text-left">: {serviceProvider.fld_address}</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="ww">
                                                            <strong>Gender</strong></p>
                                                        <p className="text-left">: {serviceProvider.fld_gender}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        {/* Profile Image Section */}
                                        <div className="col-md-3 border-bottom">
                                            {/* <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <Image className="w-5 h-5 mr-2 text-blue-500" />
                                    Profile Image
                                </h3> */}
                                            <div className='pt-4'>
                                                <img
                                                    src={
                                                        serviceProvider.fld_profile_image && serviceProvider.fld_profile_image.trim() !== ""
                                                            ? `https://elementk.in/spbackend/uploads/profileimg/${serviceProvider.fld_profile_image}`
                                                            : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
                                                    }
                                                    alt="Profile"
                                                    className=" h-auto object-cover rounded-lg shadow-md"
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-0'>
                                        {/* Work Profile Section */}
                                        <div className="p-3 viewinfo ">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Work Profile */}
                                                Work Profile
                                            </h3>
                                            <div className="flex flex-col space-y-2">
                                                <div className='flex'>
                                                    <p className="ww"><strong>Work Profile</strong></p><p>: {serviceProvider.fld_designation}</p></div>
                                                <div className='flex'> <p className="ww"><strong>Aadhar No</strong></p><p>: {serviceProvider.fld_aadhar}</p></div>
                                                <div className='flex'> <p className="ww"><strong>Start Date</strong></p><p>: {new Date(serviceProvider.fld_start_date).toLocaleDateString()}</p></div>
                                                <div className='flex'><p className="ww"><strong>End Date</strong></p><p>: {new Date(serviceProvider.fld_end_date).toLocaleDateString()}</p></div>
                                                <div className='flex'>
                                                    <p className="ww"><strong>Location</strong></p>
                                                    <p>: {location ? location.name : 'Not Defined'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bank Details Section */}
                                        <div className="p-3 viewinfo blviewinfo">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                <Landmark className="w-5 h-5 mr-2 text-blue-500" /> {/* Icon for Bank Details */}
                                                Bank Details
                                            </h3>
                                            <div className="flex flex-col space-y-2">
                                                <div className='flex'>
                                                    <p className="ww"><strong>Bank Name</strong></p><p className='n-ww'>: {serviceProvider.fld_bankname}</p></div>
                                                <div className='flex'><p className="ww"><strong>Account No</strong></p><p className='n-ww'>: {serviceProvider.fld_accountno}</p></div>
                                                <div className='flex'><p className="ww"><strong>Branch</strong></p><p className='n-ww'>: {serviceProvider.fld_branch}</p></div>
                                                <div className='flex'><p className="ww"><strong>IFSC Code</strong></p><p className='n-ww'>: {serviceProvider.fld_ifsc}</p></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="bg-white bxs rounded-lg p-3">
                                            <h2 className="text-lg font-semibold mb-1">Manage Workoffs</h2>
                                            {workoffs.length > 0 ? ( // Check if workoffs array is not empty
                                                <ul className="space-y-4">
                                                    {workoffs.map((workoff) => ( // Iterate through the workoffs
                                                        <li key={workoff._id} className="text-gray-800 border-b pb-2">
                                                            <div className="flex justify-between">
                                                                <div className="flex flex-col items-center w-1/3 bg-blue-100 text-blue-800 rounded-lg">
                                                                    <div className="p-4 w-full text-center">Total</div>
                                                                    <span className="font-semibold text-2xl">{workoff.fld_total_no_of_work_offs}</span>
                                                                </div>
                                                                <div className="flex flex-col items-center w-1/3 bg-green-100 text-green-800 rounded-lg">
                                                                    <div className="p-4 w-full text-center">Availed</div>
                                                                    <span className="font-semibold text-2xl">{workoff.fld_work_offs_availed}</span>
                                                                </div>
                                                                <div className="flex flex-col items-center w-1/3 bg-yellow-100 text-yellow-800 rounded-lg">
                                                                    <div className="p-4 w-full text-center">Balance</div>
                                                                    <span className="font-semibold text-2xl">{workoff.fld_work_offs_balance}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-left text-gray-500 mb-2 f-13">No workoffs found.</p> // Message when no workoffs
                                            )}
                                            <div className='but'>
                                                <button
                                                    onClick={() => handleManageWorkOff(serviceProviderId)} // Pass the service provider ID
                                                    data-id={serviceProviderId}
                                                    className="text-white text-sm py-1 px-2 rounded flex items-center mr-2"
                                                >
                                                    <Settings2 className='ic mr-1' /> Manage
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white bxs rounded-lg p-3">
                                            <h2 className="text-lg font-semibold mb-1">Service Charge Details</h2>
                                            {serviceCharges.length > 0 ? (
                                                <ul className="mb-0">
                                                    {serviceCharges.map((charge) => (
                                                        <li key={charge._id} className="pb-4">
                                                            <div className="text-gray-700 f-13 d-flex"><strong className='ww'>Service Charge:</strong><p> INR {charge.fld_service_charge}</p></div>
                                                            <div className="text-gray-700 f-13 d-flex"><strong className='ww'>From Date:</strong><p> {new Date(charge.fld_from_date).toLocaleDateString()}</p></div>
                                                            <div className="text-gray-700 f-13 d-flex"><strong className='ww'>To Date:</strong><p> {new Date(charge.fld_to_date).toLocaleDateString()}</p></div>
                                                            <div className="text-gray-700 f-13 d-flex"><strong className='ww'>Added On:</strong><p> {new Date(charge.fld_added_on).toLocaleDateString()}</p></div>

                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-left text-gray-500 mb-2 f-13">No service charges found.</p>
                                            )}
                                            <div className='but'>
                                                <button
                                                    className="text-white text-sm py-1 px-2 rounded flex items-center mr-2"
                                                    onClick={() => handleManageCharge(serviceProviderId)}
                                                >
                                                    <Settings2 className='ic mr-1' /> Manage Service Charge
                                                </button></div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 detailimgs">
                                        {serviceProvider.fld_aadharcard && (
                                            <div className="p-3">
                                                <h3 className="text-md font-semibold mb-2 text-gray-700">Aadhar Card</h3>
                                                <img
                                                    src={`https://elementk.in/spbackend/uploads/aadharcard/${serviceProvider.fld_aadharcard}`}
                                                    alt="Aadhar Card"
                                                    className="object-cover rounded-lg shadow-md"
                                                />
                                                {!serviceProvider.aadharapproved ? (
                                                    <button
                                                        onClick={() => approveFile(serviceProvider._id, "aadhar")}
                                                        className="mt-2 p-1 bg-green-600 text-white rounded-lg"
                                                    >
                                                        Approve Aadhar Card
                                                    </button>
                                                ) : (
                                                    <p className='bg-green-100 px-2 py-1 rounded-xl'>Approved</p>
                                                )}
                                                {serviceProvider.aadharaccess == 1 && (
                                                    <button
                                                    onClick={() => approveEditRequest(serviceProvider._id, "aadhar", 2)}
                                                    className="mt-2 p-1 bg-green-600 text-white rounded-lg"
                                                    style={{fontSize:"12px"}}
                                                >
                                                    Approve Aadhar Edit Request
                                                </button>
                                                )}
                                            </div>
                                        )}
                                        {serviceProvider.fld_pancard && (
                                            <div className="p-3">
                                                <h3 className="text-md font-semibold mb-2 text-gray-700">PAN Card</h3>
                                                <img
                                                    src={`https://elementk.in/spbackend/uploads/pancard/${serviceProvider.fld_pancard}`}
                                                    alt="PAN Card"
                                                    className="object-cover rounded-lg shadow-md"
                                                />
                                                {!serviceProvider.pancardapproved ? (
                                                    <button
                                                        onClick={() => approveFile(serviceProvider._id, "pancard")}
                                                        className="mt-2 p-1 bg-green-600 text-white rounded-lg"
                                                    >
                                                        Approve PAN Card
                                                    </button>
                                                ) : (
                                                    <p className='bg-green-100 px-2 py-1 rounded-xl'>Approved</p>
                                                )}
                                                {serviceProvider.pancardaccess == 1 && (
                                                    <button
                                                    onClick={() => approveEditRequest(serviceProvider._id, "pancard", 2)}
                                                    className="mt-2 p-1 bg-green-600 text-white rounded-lg"
                                                    style={{fontSize:"12px"}}
                                                >
                                                    Approve Pancard Edit Request
                                                </button>
                                                )}
                                            </div>
                                        )}
                                        {serviceProvider.fld_cancelledchequeimage && (
                                            <div className="p-3">
                                                <h3 className="text-md font-semibold mb-2 text-gray-700">Cancelled Cheque</h3>
                                                <img
                                                    src={`https://elementk.in/spbackend/uploads/cancelledchequeimage/${serviceProvider.fld_cancelledchequeimage}`}
                                                    alt="Cancelled Cheque"
                                                    className="object-cover rounded-lg shadow-md"
                                                />
                                                {!serviceProvider.cancelledchequeapproved ? (
                                                    <button
                                                        onClick={() => approveFile(serviceProvider._id, "cancelledcheque")}
                                                        className="mt-2 p-1 bg-green-600 text-white rounded-lg"
                                                    >
                                                        Approve Cheque
                                                    </button>
                                                ) : (
                                                    <p className='bg-green-100 px-2 py-1 rounded-xl'>Approved</p>
                                                )}
                                                {serviceProvider.chequeaccess == 1 && (
                                                    <button
                                                    onClick={() => approveEditRequest(serviceProvider._id, "cancelledcheque", 2)}
                                                    className="mt-2 p-1 bg-green-600 text-white rounded-lg"
                                                    style={{fontSize:"12px"}}
                                                >
                                                    Approve Cheque Edit Request
                                                </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                </div>) : ""}

                        </>
                    )}
                </div>
            </div>


            <ToastContainer />

        </motion.div>
    );
};

export default ViewServiceProvider;
