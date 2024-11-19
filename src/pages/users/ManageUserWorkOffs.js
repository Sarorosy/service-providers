import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { RevolvingDot } from 'react-loader-spinner';
import AddWorkOff from '../../components/AddWorkOffs';

const ManageUserWorkOffs = () => {
  DataTable.use(DT);

  const [workOffs, setWorkOffs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem('userId'); // Assuming userId is stored in session storage

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://serviceprovidersback.onrender.com/api/workoffs/user/${userId}`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setWorkOffs(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setWorkOffs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch work offs on component mount
  }, []);

  const handleAddButtonClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleWorkOffAdded = (newWorkOff) => {
    setWorkOffs((prev) => [...prev, newWorkOff]);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };
  
  const columns = [
    {
      title: 'Work Offs Date',
      data: null,
      render: (row) => {
        const startDate = formatDate(row.fld_start_date);
        const endDate = formatDate(row.fld_end_date);
        return `${startDate} - ${endDate}`;
      },
    },
    {
      title: 'Duration',
      data: 'fld_duration',
      render: (data) => `${data} Day${data > 1 ? 's' : ''}`,
    },
    {
      title: 'Leave Type',
      data: 'fld_leave_type',
    },
    {
      title: 'Reason',
      data: 'fld_reason',
     
    },
    {
      title: 'Added On',
      data: 'fld_addedon',
      render: (data) => (data ? formatDate(data) : 'No Date'),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-20 ">
      <div className="flex justify-content-between mb-6 but">
        <h1 className="text-xl font-bold text-gray-800">Manage Work Offs</h1>
        <div className='flex float-right'>
          <button
            onClick={fetchData}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center mr-2"
          >
            <RefreshCw className="mr-2 ic" />
            Refresh
          </button>
          <button
            onClick={handleAddButtonClick}
            className="text-white text-sm py-0 px-1 rounded transition duration-200 flex items-center"
          >
            <PlusCircle className="mr-2 ic" />
            Add Work Off
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isFormOpen && <AddWorkOff onClose={handleCloseForm} fetchData={fetchData} onWorkOffAdded={handleWorkOffAdded} />}
      </AnimatePresence>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RevolvingDot height="100" width="100" color="#3b82f6" />
        </div>
      ) : (
        <DataTable
          data={workOffs}
          columns={columns}
          options={{
            searching: false,
            paging: true,
            ordering: true,
            order: [[1, 'Desc']],
          }}
        />
      )}
    </div>
  );
};

export default ManageUserWorkOffs;
