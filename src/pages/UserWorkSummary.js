import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt'; // Import DataTables
import $ from 'jquery'; // Import jQuery
import { RevolvingDot } from 'react-loader-spinner';
import { ArrowLeftCircle, RefreshCw, ArrowUpCircle } from 'lucide-react';
import 'select2/dist/css/select2.css';  // Import select2 CSS
import 'select2';

const UserWorkSummary = () => {
    DataTable.use(DT); // Initialize DataTables

    const { id } = useParams(); // Get the user ID from the URL
    const navigate = useNavigate(); // Initialize navigate for routing
    const [workSummaries, setWorkSummaries] = useState([]);
    const [projects, setProjects] = useState([]); // Store all projects
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Store user data
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (sessionStorage.getItem("adminType") != "SUPERADMIN" && sessionStorage.getItem("adminType") !== "SUBADMIN") {
            navigate("/dashboard"); // Redirect to homepage if not SUPERADMIN
        }
    }, [navigate]);
    useEffect(() => {
        // Initialize select2 on the dropdown after the users have loaded
        $('#user-select').select2({
            placeholder: 'Select service provider', // Optional placeholder
            width: '100%', // Ensures it takes full width
        });

        // Listen for the change event triggered by select2
        $('#user-select').on('change', function () {
            // Trigger your handleUserChange function manually
            handleUserChange({ target: { value: $(this).val() } });
        });

        // Clean up select2 on component unmount
        return () => {
            $('#user-select').select2('destroy');
        };
    }, [users]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://elementk.in/spbackend/api/users/serviceproviders');
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

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://elementk.in/spbackend/api/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const projectData = await response.json();
            setProjects(projectData); // Store all projects
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setProjectsLoading(false); // Stop loading projects
        }
    };
    // Fetch all projects
    useEffect(() => {


        fetchProjects();
    }, []);

    // Fetch user by ID
    const fetchUser = async () => {
        try {
            const response = await fetch(`https://elementk.in/spbackend/api/users/find/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const userData = await response.json();
            setUser(userData); // Set the user data
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null); // Set user to null on error
        }
    };
    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleUserChange = (event) => {
        const selectedUserId = event.target.value;
        if (selectedUserId) {
            navigate(`/report/${selectedUserId}`);
        }
    };

    // Fetch the work summaries by user ID
    const fetchWorkSummaries = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`https://elementk.in/spbackend/api/worksummaries/user/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();
            setWorkSummaries(Array.isArray(data) ? data : []); // Set the work summaries
        } catch (error) {
            console.error('Error fetching work summaries:', error);
            setWorkSummaries([]); // Set to empty array on error
        } finally {
            setLoading(false); // Stop loading
        }
    };
    useEffect(() => {

        fetchWorkSummaries();
    }, [id]);


    const handleScroll = () => {
        const scrollPosition = window.scrollY; // Get current scroll position
        const windowHeight = window.innerHeight; // Get window height
        setShowScrollTop(scrollPosition > windowHeight); // Show button if scrolled down past window height
    };

    // Attach scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup the event listener
        };
    }, []);


    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    // Define columns for the DataTable
    const columns = [
        {
            title: 'Project Title',
            data: 'fld_projectid',
            width: '250px',
            render: (data) => {
                const project = projects.find((proj) => proj._id == data);
                const title = project ? project.fld_title : 'Unknown Project';
                return title ? `<span class="text-break f-12"> ${title}</span>` : 'No Title';
            },
            orderable: false
        },
        {
            title: 'Description',
            data: 'fld_description',
            render: (data) => {
                return data ? data : 'No Description'; // Display 'No Description' if description is not present
            },
            orderable: false
        },
        {
            title: 'Date Added',
            data: 'fld_addedon',
            width: "110px",
             orderable: false,
            render: (data, type) => {
              if (type === 'display') {
                return data
                  ? new Date(data).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'No Date'; // Format date for display or show 'No Date'
              }
              return data ? new Date(data).getTime() : 0; // Use timestamp for sorting or return 0 if no date
            },
          }
          
    ];


    // Function to handle refresh
    const handleRefresh = () => {
        // Re-fetch user and work summaries
        fetchUser();
        fetchProjects()
        fetchWorkSummaries();
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-20 mrf">
            <div className='flex justify-content-between mb-6'>
                <div className="flex items-center justify-around space-x-4 max-w-5xl">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                        Manage Reports 
                        
                    </h1>

                    
                </div>

                <div className="flex justify-end items-center" style={{width:"400px", }}>
               
                    
                    <div className='but ml-3'>
                        <button
                            onClick={handleRefresh}
                            className="text-white text-sm py-1 px-1 rounded transition duration-200 flex items-center"
                        >
                            Refresh <RefreshCw className='ml-2 ic' />
                        </button></div>
                </div>
            </div>
            <div className='flex justify-content-between mb-6'>
                <div className="flex items-center justify-around space-x-4 max-w-5xl">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                        
                        {user ? (
                            <>
                                <img
                                    src={user.fld_profile_image && user.fld_profile_image !== ""
                                        ? 'https://elementk.in/spbackend/uploads/profileimg/' + user.fld_profile_image
                                        : "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"}
                                    alt={user.fld_username || 'No Name'}
                                    className="w-10 h-10 rounded-full border border-gray-200"
                                />
                                <span>{user.fld_name}</span>
                            </>
                        ) : (
                            'Loading...'
                        )}
                    </h1>
                </div>

                <div className="flex justify-end items-center" style={{width:"260px", }}>
                    <select
                            onChange={handleUserChange}
                            className="border border-gray-300 rounded ml-20 form-control-sm"
                            id="user-select"
                            style={{marginRight:"8px"}}
                        >
                            <option value="">Select service provider</option>
                            {users.map((provider) => (
                                <option key={provider._id} value={provider._id}>
                                    {provider.fld_name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            {showScrollTop && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={scrollToTop}
                        className="arak text-white p-2 rounded-full shadow-lg transition duration-200"
                    >
                        <ArrowUpCircle className="w-6 h-6" />
                    </button>
                </div>
            )}



            {loading || projectsLoading ? (
                <div className="flex justify-center mt-10">
                    <RevolvingDot
                        visible={true}
                        height="50"
                        width="50"
                        color="#3b82f6" // Tailwind blue-600
                        ariaLabel="revolving-dot-loading"
                    />
                </div>
            ) : (
                <DataTable
                    data={workSummaries}
                    columns={columns}
                    options={{
                        searching: true,
                        paging: true,
                        ordering: true,
                        order: [[2, 'desc']], // Sort by the 4th column (fld_addedon) in descending order
                        responsive: true,
                        className: 'display bg-white rounded-lg shadow-sm',
                    }}
                    className="display"
                />
            )}
        </div>
    );
};

export default UserWorkSummary;
